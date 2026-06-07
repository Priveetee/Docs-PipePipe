# The request

Part of [SABR in the extractor](./sabr). Here: the binary `VideoPlaybackAbrRequest` that `YoutubeSabrRequestBuilder` encodes, field by field, plus the wire format underneath it.

> Field *names* below are the project's reverse-engineered labels (mostly from `SabrRequestDumper`'s field map). Field *numbers* and wire types are taken verbatim from the encoder.

## Top-level message

`buildFirstMediaRequest` (cold start) and `buildFollowUpMediaRequest` write these top-level fields:

| # | Wire | Carries | First req | Follow-up |
| --- | --- | --- | --- | --- |
| 1 | message | `clientAbrState` (see below) | yes (playerTime=0) | yes |
| 2 | message | selected `formatId` (one per selected track) | no | yes |
| 3 | message | `bufferedRange` (repeated) | no | yes |
| 4 | varint | top-level `playerTimeMs` | no | yes (gated) |
| 5 | bytes | ustreamer config (base64-decoded) | yes | yes |
| 16 | message | preferred **audio** `formatId` (repeated) | yes | yes |
| 17 | message | preferred **video** `formatId` (repeated) | yes | yes |
| 19 | message | `streamerContext` (see below) | yes | yes |

`formatId` is a small sub-message used everywhere a format is named: `#1 itag` (int32), `#2 lastModified` (uint64, only if > 0), `#3 xtags` (string, only if non-empty).

So **cold start vs follow-up** differs by: a cold start has no selected formats, no buffered ranges, no top-level player time, and `playerTimeMs = 0`; it carries no session cookie/PO token yet. The follow-up flag also unlocks the conditional `clientAbrState` fields below. All session progression, player time, buffered ranges, selected formats, cookie, PO token, active contexts, is read from `YoutubeSabrStreamState`.

## `clientAbrState` (field 1)

The richest sub-message. The always-written core:

| # | Wire | Meaning |
| --- | --- | --- |
| 28 | uint64 | `playerTimeMs` |
| 21 | int32 | sticky resolution (`max(videoHeight, 360)` or an override) |
| 34 | int32 | visibility |
| 35 | fixed32 | playback rate (default `1.0`) |
| 40 | int32 | enabled track types bitfield (written only if ≠ 0; `0 = VIDEO_AND_AUDIO`, `1 = AUDIO_ONLY`, `2 = VIDEO_ONLY`) |
| 46 | bool | DRC enabled (only if the audio format is DRC) |
| 69 | string | audio track id (if any) |

Follow-up / "official web" additions include `#16` last manual resolution, `#18`/`#19` viewport width/height, `#23` bandwidth estimate (state value, else `(audioBitrate + videoBitrate) * 2`, else -1). When the profile mimics the official web client, an extra block (`#29` time-since-last-seek, `#36` elapsed wall time, `#39` time-since-last-action, `#58` preferVp9=false, `#59` AV1 quality threshold, `#72` quality constraints, `#79` playback authorization, …) is filled with the web client's characteristic constants so the request is indistinguishable from a real browser.

## Buffered ranges (field 3)

Each `SabrBufferedRange.toProto()`:

| # | Wire | Field |
| --- | --- | --- |
| 1 | message | `formatId` |
| 2 | uint64 | `startTimeMs` |
| 3 | uint64 | `durationMs` |
| 4 | int32 | `startSegmentIndex` |
| 5 | int32 | `endSegmentIndex` |
| 6 | message | time range (only if enabled): `#1 startTimeMs`, `#2 durationMs`, `#3 timescale` |

`SabrBufferedRange.full(format)` is the "I have the whole thing" range (`startTimeMs=0`, everything else `Integer.MAX_VALUE`), used to claim a track is fully buffered. How real ranges are computed is the subject of [the buffered-range model](./sabr-buffered).

## Streamer context (field 19)

| # | Wire | Carries |
| --- | --- | --- |
| 1 | message | `clientInfo` |
| 2 | bytes | **PO token** (only if present) |
| 3 | bytes | **playback cookie** (only if present) |
| 5 | message | active `SabrContextUpdate`s (repeated) |
| 6 | int32 | unsent SABR context types (repeated) |

`clientInfo` carries the client id (`#16`), version (`#17`), OS name/version (`#18`/`#19`), and `Accept-Language`/region (`#21`/`#22`); in official-web mode the shape changes slightly (field 1 = `"en_US"`, field 18 = `"X11"`).

## The wire format (`SabrProto`)

A hand-rolled protobuf writer/reader. Wire types: `VARINT=0`, `FIXED64=1`, `LENGTH_DELIMITED=2`, `FIXED32=5`. A field tag is `varint((fieldNumber << 3) | wireType)`. Varints are standard LEB128 (7 bits/byte, high bit = continue). `writeMessage` is just a length-delimited `writeBytes` (a nested message is bytes). `writeInt32` sign-extends through `writeUInt64`, so a negative int becomes a 10-byte varint. The reader side (`readFields`, `Cursor`) is what every `Sabr*.decode()` is built on.

`SabrRequestDumper` re-decodes a finished request body into a sanitized one-line summary for diagnostics, PO token, cookie, ustreamer config and audio-track id are reduced to byte counts, never printed.

## Cold-start PO token

`SabrColdStartPoToken` synthesizes a placeholder token for the very first contact: an 8-byte header (2 random key bytes, a client-state byte, a big-endian epoch-seconds timestamp) plus the identifier, length-prefixed as protobuf field 4, then obfuscated with a rolling 2-byte XOR. `MAX_IDENTIFIER_BYTES = 118`. It's a deterministic obfuscation, not an attested token; a real content-bound token still comes from the [PO-token provider](./sabr-session#protection-and-tokens).

---

Next: [UMP and decoding](./sabr-decoding).
