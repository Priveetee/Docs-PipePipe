# The request

Part of [SABR in the extractor](./sabr). `YoutubeSabrRequestHelper` encodes the
immutable `YoutubeSabrRequest` as the binary `VideoPlaybackAbrRequest` sent to
YouTube. The wire labels below are the fields emitted by the current encoder.

## Request lifecycle

There are two public request factories:

- `YoutubeSabrRequest.preparation(playerTimeMs, preferredFormats)` asks for
  initialization data and format timelines without declaring active tracks;
- `YoutubeSabrRequest.playback(playerTimeMs, playbackRate, tracks)` declares the
  active audio/video tracks and their buffered timeline positions.

Every request must contain at least one track. It cannot contain two audio tracks,
two video tracks, or the same itag as both audio and video. A track may carry a
`YoutubeSabrFormatTimeline` and the last buffered sequence number.

The HTTP URL is updated by `YoutubeSabrRequestHelper` with `alr=yes`, the session
CPN, and `rn=<requestNumber>`. `rn` starts at zero and is replaced on every
request. The body is sent as `application/x-protobuf`; the response must be
`application/vnd.yt-ump`.

## Top-level fields

| # | Wire | Carries | When emitted |
| --- | --- | --- | --- |
| 1 | message | `clientAbrState` | Every request |
| 2 | message | selected `formatId` | Playback state is included |
| 3 | message | `bufferedRange` | A track has a timeline and buffered sequence |
| 4 | varint | top-level `playerTimeMs` | Playback state is included |
| 5 | bytes | decoded `videoPlaybackUstreamerConfig` | Every request |
| 16 | message | preferred audio `formatId` | When an audio format is present |
| 17 | message | preferred video `formatId` | When a video format is present |
| 19 | message | `streamerContext` | Every request |

Playback state is included for a follow-up request, a non-zero player position,
or a request that carries buffered ranges. A preparation request at time zero is
therefore the minimal cold start; it still carries the ustreamer config and any
preferred formats.

`formatId` is the shared nested message used for selected and preferred formats:
field `1` is the itag, field `2` is `lastModified` when positive, and field `3`
is `xtags` when non-empty.

## `clientAbrState`

The current encoder writes the following fields:

| # | Meaning |
| --- | --- |
| 18 / 19 | video width/height, only when playback state is included |
| 21 | video resolution, at least 360 when a video format exists |
| 23 | bandwidth estimate on follow-ups, or an estimate from active bitrates |
| 28 | `playerTimeMs` |
| 34 | visibility (`1`) |
| 35 | playback rate, defaulting to `1.0` |
| 40 | enabled track mode (`1` audio-only, `2` video-only, `0` both and omitted) |
| 46 | DRC enabled when the selected audio format is DRC |
| 69 | selected audio track id, when present |

The nested client info in `streamerContext` identifies MWEB (client id `2`),
the client version, and the `en-US`/`US` localization used by the helper.

## Buffered ranges

For a track with a parsed timeline and `bufferedThrough > 0`, the helper writes a
range containing:

| Field | Value |
| --- | --- |
| `formatId` | itag, last-modified value and xtags |
| `startTimeMs` | `0` |
| `durationMs` | end time of the last buffered sequence |
| `startSegmentIndex` / `endSegmentIndex` | `1` / the bounded buffered sequence |
| time-range timescale | `1000` |

`YoutubeSabrFormatTimeline` is built from initialization bytes with the MP4 or
WebM segment-index parser. It maps sequence numbers to start/end times and maps
a requested time back to the first segment whose end is after that time.

## `streamerContext`

The context contains client info, and optionally:

- the current PO token (field `2`);
- the playback cookie from `NEXT_REQUEST_POLICY` (field `3`);
- active opaque SABR context values (field `5`);
- context types not currently sent (field `6`).

Token and cookie payloads are never printed by the diagnostic summaries.

## Wire format

`SabrProto` is the small protobuf reader/writer used by the request and response
paths. It supports varints, fixed32, fixed64 and length-delimited fields. A
nested message is a length-delimited byte array; field tags use
`(fieldNumber << 3) | wireType`. Invalid field numbers, unsupported wire types,
truncated input and oversized lengths raise `SabrProtocolException`.

Next: [UMP and decoding](./sabr-decoding).
