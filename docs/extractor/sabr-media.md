# Media, segments, and the index

Part of [SABR in the extractor](./sabr). Here: how scattered media bytes become a playable segment, and how a playback time maps to a segment number.

## Media parts

Media arrives as three part types working together, correlated by a one-byte **header id**:

- **MEDIA_HEADER (20)** carries a `SabrMediaHeader` and a `headerId`. It opens a buffer.
- **MEDIA (21)** payloads start with that `headerId` byte; the rest is appended to the matching buffer.
- **MEDIA_END (22)** payload's first byte is the `headerId`; it finalizes the buffer into a segment.

Because the routing is by id, **audio and video interleave freely** in one response, each id accumulates independently.

### `SabrMediaHeader`

Decoded from the MEDIA_HEADER payload (proto field numbers):

| # | Field |
| --- | --- |
| 1 | `headerId` (correlates MEDIA/MEDIA_END) |
| 3 | `itag` |
| 4 | `lastModified` |
| 6 | `startRange` (byte offset) |
| 7 | `compressionAlgorithm` (0 none, 1 gzip, 2 brotli) |
| 8 | `isInitSegment` |
| 9 | `sequenceNumber` |
| 11 / 12 | `startMs` / `durationMs` |
| 13 | nested `FormatId` (fallback for itag/lastModified/xtags) |
| 14 | `contentLength` (expected on-wire byte length) |
| 15 | nested `TimeRange` (`startTicks`, `durationTicks`, `timescale`) |

If `startMs`/`durationMs` are absent but a `TimeRange` is present, they're derived: `ms = ticks · 1000 / timescale`.

## The collector

`SabrMediaSegmentCollector.collect(response)` replays the parts in order, keeping a `Map<headerId, OpenSegment>`:

- MEDIA_HEADER → `openSegments.put(id, new OpenSegment(header))`.
- MEDIA → append bytes (offset 1..end) to the open segment for the id; **bytes for an unknown/closed id are silently dropped**.
- MEDIA_END → remove the id, finalize, and emit, in close order.

Edge cases: a header that never gets a MEDIA_END **stays open and is never emitted** (it surfaces as `missing-media-end` in the integrity check, not as a partial segment). Orphan media (no header) is dropped.

**Length check, then decompress.** On finalize, if `contentLength >= 0` and the accumulated byte count differs, it throws `SabrProtocolException` (length mismatch). This check runs on the **compressed** bytes, `contentLength` is the on-wire length. Then `maybeDecompress` applies gzip (`GZIPInputStream`) or brotli (`BrotliInputStream`) per `compressionAlgorithm`; anything other than 0/1/2 throws.

`SabrMediaSegment` holds the header and the (decompressed) bytes. Deliberately, the byte array is **not** defensively copied on construction or in `getData()`, cloning multi-MB 4K segments doubled peak memory and caused OOM under rapid format switching, so the array is immutable by contract.

`find(response, request)` runs `collect` then returns the first segment whose header matches the request. `SabrSegmentRequest.matches` keys on **(itag, init-flag, sequence number)**, which is distinct from the internal header-id used for byte stitching.

## The segment index

To seek, the extractor must map a time to a sequence number. The init segment's container index gives exact per-segment timing. `SabrFormatInitializationMetadata` (part type 42) provides what's needed: `endSegmentNumber` (total segments), `mimeType` (selects the parser), `initRange`, `indexRange`, and `durationUnits`/`durationTimescale`.

### MP4: `SabrMp4SegmentIndexParser`

Parses the ISO-BMFF **`sidx`** box inside the index range:

1. Scan for the `"sidx"` box within `[indexRangeStart, indexRangeEnd]`.
2. Read the FullBox version (0 or 1), skip flags, skip reference id.
3. Read `timescale` (must be > 0).
4. Read `earliest_presentation_time` (32-bit for v0, 64-bit for v1).
5. Loop `referenceCount` times, each 12-byte reference: take `subsegment_duration`; accumulate the running start; emit `Entry(seq=i+1, startMs, durationMs)` with `ms = ticks · 1000 / timescale` (rounded). Nested sidx references throw (unsupported).

Note: only **time** is derived. The 31-bit referenced size is read but discarded, no per-segment byte offsets are produced here.

### WebM: `SabrWebmSegmentIndexParser`

Parses Matroska/EBML: find `Segment`, read `TimecodeScale` (ns/tick, default 1,000,000) from `Info`, then walk `Cues` → `CuePoint` → `CueTime` within the index range. Each cue time becomes a segment start (scaled to ms); each duration is the gap to the next cue (or the total duration / an extrapolation for the last). `CueTrackPositions` (byte offsets) are ignored, again, time only.

### Lookup

`SabrSegmentIndex` is a 1-based list of `Entry(sequenceNumber, startMs, durationMs)` with `getEndMs()`. The time→sequence lookup lives in `YoutubeSabrStreamState`'s per-track `FormatProgress`:

- `getSegmentStartMs(seq)` / `getSegmentEndMs(seq)` — index entry if present, else `averageDurationMs` arithmetic.
- `getSegmentNumberAtOrAfterTimeMs(timeMs)` — linear scan for the first entry whose `endMs >= timeMs`; without an index, `ceil(timeMs / averageDurationMs)`.

That fallback (`averageDurationMs`, derived from total duration / segment count) is why seeking still works approximately even before an init segment has been parsed.

---

Next: [The buffered-range model and seeking](./sabr-buffered).
