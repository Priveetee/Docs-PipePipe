# UMP and decoding

Part of [SABR in the extractor](./sabr). YouTube wraps SABR responses in UMP
(Ultra-Minimal Playback). UMP frames are not protobuf; the payload of most
control parts is protobuf and is summarized or decoded by
`SabrResponseDecoder`.

## UMP framing

`UmpReader` reads a sequence of parts:

```text
[type: UMP-varint][size: UMP-varint][payload: size bytes] ...
```

`readPayloadsUntil(InputStream, consumer)` reads one part at a time from the
network. `readAll(byte[])` parses an already-buffered body, which is useful for
small responses and tests. A clean EOF at a part boundary ends the stream;
truncated headers or payloads raise `SabrProtocolException`.

UMP varints choose their length from the high bits of the first byte:

| First byte | Total bytes | Value |
| --- | ---: | --- |
| `0x00–0x7F` | 1 | byte value |
| `0x80–0xBF` | 2 | `(b0 & 0x3f) + 64·b1` |
| `0xC0–0xDF` | 3 | `(b0 & 0x1f) + 32·(b1 + 256·b2)` |
| `0xE0–0xEF` | 4 | `(b0 & 0x0f) + 16·(b1 + 256·(b2 + 256·b3))` |
| `0xF0–0xFF` | 5 | next four bytes, little-endian |

`UmpReader.UmpPart` exposes the type, size and payload. Public data access is
defensive; the streaming decoder uses the raw array internally to avoid copying
large media parts.

## Part identifiers

`SabrResponseDecoder` recognizes these identifiers. Rich control messages are
kept as summaries or raw bytes in `YoutubeSabrResponse`; they are not modeled as
one Java class per part.

| ID | Constant | Current handling |
| ---: | --- | --- |
| 10–12 | `ONESIE_*` | generic summary |
| 20 | `MEDIA_HEADER` | decode `SabrMediaHeader` |
| 21 | `MEDIA` | count bytes by header id |
| 22 | `MEDIA_END` | close a header id |
| 30–34 | config/live hints | generic summary |
| 35 | `NEXT_REQUEST_POLICY` | keep raw policy and read backoff field 4 |
| 36–38 | ustreamer metadata | generic summary |
| 42 | `FORMAT_INITIALIZATION_METADATA` | decode generated metadata |
| 43 | `SABR_REDIRECT` | keep the redirect URL |
| 44 | `SABR_ERROR` | decode type/code summary |
| 45 | `SABR_SEEK` | generic summary |
| 46 | `RELOAD_PLAYER_RESPONSE` | set `reloadRequested` |
| 47–51 | playback/format controls | generic summary |
| 52–56 | request controls | generic summary |
| 57 | `SABR_CONTEXT_UPDATE` | keep raw context update |
| 58 | `STREAM_PROTECTION_STATUS` | decode status and max retries |
| 59–65 | context/cache/connection controls | keep summary; 65 is prewarm |
| 66–67 | debug/snackbar | generic summary |

Unknown identifiers are recorded in the bounded diagnostic summary. Malformed control
parts are retained as bounded diagnostics so valid media in the same response is
not discarded.

## The decode paths

`SabrResponseDecoder.decode(byte[])` parses all parts first and then dispatches
them. The normal application path uses
`SabrStreamingResponseReader.read(InputStream, consumer, startConsumer, spool)`:
it keeps control parts in memory and feeds `MEDIA_HEADER`, `MEDIA`, and
`MEDIA_END` directly to `SabrMediaSegmentCollector.Incremental`. Completed
segments are delivered as soon as their `MEDIA_END` arrives, so a large 4K body
does not have to remain in the heap.

Both paths count media bytes by header id. `YoutubeSabrResponse.getIntegrityIssues()`
then detects duplicate headers, missing media, length mismatches, missing ends,
media without a header, and ends without a header. The session retries only the
classified incomplete-media cases within its bounded limit.

## The decoded response

`YoutubeSabrResponse` exposes the HTTP response code and content type, UMP parts,
completed segments, initialization metadata, live metadata, context updates,
redirect/error/reload flags, protection status, backoff, byte counters and
bounded summaries. `summarizeForDiagnostics()` reports structure and sizes, not
PO-token or cookie contents.

Next: [Media, segments, and the index](./sabr-media).
