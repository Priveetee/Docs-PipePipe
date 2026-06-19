# UMP and decoding

Part of [SABR in the extractor](./sabr). Here: the UMP envelope at the byte level, every part type the decoder knows, and the decoded response.

## UMP framing

The response body is **UMP** (Ultra-Minimal Playback), YouTube's own container, *not* protobuf at the envelope level (the payloads inside parts are protobuf). `UmpReader` walks it as a sequence of parts in either of two modes:

- `readStreaming(InputStream, PartConsumer)`: read one part (type, size, payload) at a time straight off the network stream and hand it to a consumer, so the whole body is never held at once. Peak transient is a single part's payload instead of the entire response (50-150 MB at 4K). This is the path the session uses for live decoding (see "Streaming the decode" below).
- `readAll(byte[])`: walk a single in-memory array and return every part as a list. Handy for small responses and tests, but it needs the whole body buffered first.

![UMP part layout](/diagrams/sabr-ump-layout.png)

Each part is `[type: UMP-varint][size: UMP-varint][payload: size bytes]`, repeated until EOF (a clean EOF on a part boundary just ends the loop). Neither mode does cross-buffer reassembly *of a single part*: a part's `size` bytes are read in full before the next one, and a truncated body throws `SabrProtocolException`.

### The UMP varint

UMP's varint is *not* protobuf's. The total byte count is decided by the **high bits of the first byte**:

| First byte | Total bytes | Value |
| --- | --- | --- |
| `0x00–0x7F` (< 128) | 1 | the byte itself |
| `0x80–0xBF` | 2 | `(b0 & 0x3f) + 64·b1` |
| `0xC0–0xDF` | 3 | `(b0 & 0x1f) + 32·(b1 + 256·b2)` |
| `0xE0–0xEF` | 4 | `(b0 & 0x0f) + 16·(b1 + 256·(b2 + 256·b3))` |
| `0xF0–0xFF` | 5 | the next 4 bytes, little-endian (the first byte's value bits are discarded) |

The result is a 32-bit signed int; the 5-byte case can overflow negative, which the `type < 0 || size < 0` guard rejects, that's the practical cap on part size.

`UmpPart` holds `type`, `size`, and `data`. `getData()` returns a defensive clone; an internal `getRawData()` returns the backing array (used on the hot decode/stitch paths to avoid copying multi-MB segments).

## Part types

`SabrResponseDecoder` dispatches on the part type id. The complete set it recognizes:

| ID | Constant | Decoded into |
| --- | --- | --- |
| 10 | ONESIE_HEADER | `SabrOnesieHeader` (carried to following onesie parts) |
| 11 | ONESIE_DATA | `SabrOnesieData` |
| 12 | ONESIE_ENCRYPTED_MEDIA | `SabrOnesieData` (encrypted) |
| 20 | MEDIA_HEADER | `SabrMediaHeader` |
| 21 | MEDIA | media bytes (first payload byte = header id) |
| 22 | MEDIA_END | closes a header id |
| 31 | LIVE_METADATA | `SabrLiveMetadata` |
| 35 | NEXT_REQUEST_POLICY | `SabrNextRequestPolicy` (sets backoff) |
| 37 | FORMAT_SELECTION_CONFIG | `SabrFormatSelectionConfig` |
| 42 | FORMAT_INITIALIZATION_METADATA | `SabrFormatInitializationMetadata` |
| 43 | SABR_REDIRECT | `SabrRedirect` |
| 44 | SABR_ERROR | `SabrError` |
| 45 | SABR_SEEK | `SabrSeek` |
| 46 | RELOAD_PLAYER_RESPONSE | `SabrReloadPlayerResponse` (sets reloadRequested) |
| 47 | PLAYBACK_START_POLICY | `SabrPlaybackStartPolicy` |
| 51 | SELECTABLE_FORMATS | `SabrSelectableFormats` |
| 52 | REQUEST_IDENTIFIER | `SabrRequestIdentifier` |
| 53 | REQUEST_CANCELLATION_POLICY | `SabrRequestCancellationPolicy` |
| 57 | SABR_CONTEXT_UPDATE | `SabrContextUpdate` |
| 58 | STREAM_PROTECTION_STATUS | `SabrStreamProtectionStatus` (sets status + maxRetries) |
| 59 | SABR_CONTEXT_SENDING_POLICY | `SabrContextSendingPolicy` |
| 65 | PREWARM_CONNECTION | `SabrPrewarmConnection` |
| 67 | SNACKBAR_MESSAGE | `SabrSnackbarMessage` |

Plus generic/known-but-unparsed ids (30 CONFIG, 32–34 live-metadata hints, 36/38 ustreamer metadata, 48–50 cache/bandwidth hints, 54–56, 60–64, 66) which are only summarized, and any unknown id which is recorded via `addUnknownPartType`. See the [control parts reference](./sabr-control-parts) for what the rich ones do.

## The decode loop

![Decode pipeline](/diagrams/sabr-extractor-decode.png)

`SabrResponseDecoder.decode` reads all parts up front, then iterates. The only state carried across parts is the **current onesie header** (a `ONESIE_HEADER` applies to the onesie data parts after it). Each part is recorded in order, then dispatched:

- **MEDIA_HEADER (20)** → decode and register the header.
- **MEDIA (21)** → the first payload byte is the **header id**; the remaining length is accumulated as that id's media byte count.
- **MEDIA_END (22)** → first byte = header id, marks it complete.
- rich control parts → decode into the typed field on `SabrDecodedResponse` + a human summary.
- `NEXT_REQUEST_POLICY` gets special handling: after decoding, the backoff is re-read directly from proto **field 4** (varint) as the authoritative `backoffTimeMs`.

## Streaming the decode (the 4K fix)

`SabrResponseDecoder.decode(byte[])` reads every part up front, so the whole body sits in memory; fine for small rounds, but it peaks at the full 50-150 MB at 4K and was the source of the 4K OOM.

`SabrStreamingResponseReader.read(InputStream)` is the streaming counterpart. It drives `UmpReader.readStreaming` and assembles MEDIA segments on the fly (via `SabrMediaSegmentCollector.Incremental`), keeping only the small control parts. The big `MEDIA` payloads become segments as they arrive and are never all retained, so the peak transient drops from the whole body to a single in-flight segment. It still tallies per-header-id media byte counts, so the result passes the same `getIntegrityIssues()` checks as the buffered path without holding the bytes, and returns a `Result` carrying the assembled segments plus a `SabrDecodedResponse` built from the control parts.

## The decoded response

`SabrDecodedResponse` holds every part in order plus typed accessors: media headers, per-header-id media byte counts (`LinkedHashMap`, summed), media-end ids, format-init metadata, live metadata, onesie data, and the single control parts (redirect, seek, error, reload, next-request policy, protection status + max retries, backoff ms, …).

The analysis helpers are what the session branches on:

- `hasMedia()` — any media headers or bytes.
- `isNoMediaResponse()` — the inverse.
- `isPolicyOnlyResponse()` — no media but a next-request policy (a pure pacing round).
- `isProtectedNoMediaResponse()` — no media **and** `streamProtectionStatus >= 3`: the **PO-token boundary** (status 3 + no media = mint a token).
- `getIntegrityIssues()` — cross-checks: `duplicate-media-header`, `missing-media`, `length-mismatch:expected=…:actual=…`, `missing-media-end`, `media-without-header`, `media-end-without-header`. The session treats any non-empty result as fatal.

---

Next: [Media, segments, and the index](./sabr-media).
