# UMP and decoding

Part of [SABR in the extractor](./sabr). Here: the UMP envelope at the byte level, every part type the decoder knows, and the decoded response.

## UMP framing

The response body is **UMP** (Ultra-Minimal Playback), YouTube's own container, *not* protobuf at the envelope level (the payloads inside parts are protobuf). `UmpReader.readAll(byte[])` walks a single in-memory array as a sequence of parts:

![UMP part layout](/diagrams/sabr-ump-layout.png)

Each part is `[type: UMP-varint][size: UMP-varint][payload: size bytes]`, repeated until EOF. There is **no cross-buffer reassembly** at this layer, the whole body must already be one array; a truncated buffer just throws `SabrProtocolException`.

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
