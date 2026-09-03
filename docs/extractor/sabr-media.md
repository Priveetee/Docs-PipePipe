# Media, segments, and the index

Part of [SABR in the extractor](./sabr). A SABR response carries media as
separate UMP parts. The extractor correlates them by a one-byte header id,
validates their length, decompresses them when needed, and exposes completed
`SabrMediaSegment` objects.

## Media parts

- **`MEDIA_HEADER` (20)** carries a `SabrMediaHeader` and opens a segment.
- **`MEDIA` (21)** starts with the header id byte; the remaining bytes are
  appended to that segment.
- **`MEDIA_END` (22)** starts with the header id byte and closes the segment.

Audio and video can be interleaved freely because each open header has its own
accumulator.

### `SabrMediaHeader`

The current decoder reads these fields:

| # | Field |
| ---: | --- |
| 1 | header id |
| 2 | video id |
| 3–5 | itag, last-modified value, xtags |
| 6 | start byte range |
| 7 | compression (`0` none, `1` gzip, `2` brotli) |
| 8 | initialization-segment flag |
| 9 | sequence number |
| 10 | bitrate in bits per second |
| 11–12 | start and duration in milliseconds |
| 13 | nested fallback `FormatId` |
| 14 | expected on-wire content length |
| 15 | nested time range (ticks and timescale) |
| 16 | sequence last-modified value |

When millisecond values are absent but the nested time range has a positive
timescale, the decoder derives them as `ticks * 1000 / timescale`.

## Assembly and decompression

`SabrMediaSegmentCollector.collect(response)` replays a buffered response. The
streaming path uses `Incremental`, which receives parts as they arrive and emits
a segment at `onMediaEnd`. Media for an unknown or already closed header is
discarded; a header without `MEDIA_END` is not emitted.

Before decompression, the collector checks `contentLength` against the number of
bytes received on the wire. It then applies gzip or brotli according to the
header. Unsupported algorithms, overflows, truncated payloads and decompression
failures are reported as protocol or recoverable errors.

`SabrMediaSegment` can hold decompressed bytes in memory or use a spool file.
For large uncompressed segments the incremental collector can expose a
progressive file-backed segment; callers should use `openStream()` instead of
copying it back with `getData()`.

## Initialization and segment timelines

`FORMAT_INITIALIZATION_METADATA` (part 42) describes the initialization and
index ranges for a format. The client fetches the initialization range with
`YoutubeSabrRequestHelper.fetchInitializationData(...)`, then parses those bytes
with `YoutubeSabrFormatTimeline.parse(...)`:

- `SabrMp4SegmentIndexParser` reads an ISO-BMFF `sidx` box and converts each
  subsegment duration to milliseconds;
- `SabrWebmSegmentIndexParser` reads Matroska/EBML `Cues` and derives each
  segment's duration from the next cue or the format duration.

`SabrSegmentIndex` is a 1-based list of entries containing sequence number, start
time, duration and computed end time. `YoutubeSabrFormatTimeline` maps a sequence
to its time range and maps a requested time to the first segment ending after
that time.

The current extractor does not contain the former `SabrSegmentRequest` or
`YoutubeSabrStreamState` classes. Segment selection and buffered-range policy
are responsibilities of the caller that builds `YoutubeSabrRequest`.

Next: [The session driver](./sabr-session).
