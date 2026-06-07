# Control parts reference

Part of [SABR in the extractor](./sabr). Every non-media UMP part the server can send, with its part-type id, proto fields, and what it does. Field numbers are from each class's `decode()`; names past the obvious ones are reverse-engineered.

## Pacing

### `SabrNextRequestPolicy` — id 35
How and when to send the next follow-up.

| # | Field |
| --- | --- |
| 1 / 2 | target audio / video readahead (ms) |
| 3 | max time since last request (ms) |
| 4 | **backoff** before next request (ms) — the authoritative backoff |
| 5 / 6 | min audio / video readahead (ms) |
| 7 | playback cookie (also decoded into `SabrPlaybackCookie`) |
| 8 | videoId |

No request-number field; the URL `rn` is managed by the session. The cookie threads session state into the next request.

### `SabrPlaybackStartPolicy` — id 47
Minimum readahead before starting / resuming, conditioned on bandwidth. Field 1 = start policies, field 2 = resume policies; each `ReadaheadPolicy` is `{1 minBandwidthBytesPerSecond, 2 minReadaheadMs}` ("below this bandwidth, buffer at least this much first").

### `SabrRequestCancellationPolicy` — id 53
When in-flight requests should be cancelled. Carries a list of items, the only named sub-field is `minReadaheadMs`.

### `SabrPrewarmConnection` — id 65
Connection prewarm hints. Decoded structurally for diagnostics only.

## Protection

### `SabrStreamProtectionStatus` — id 58
| # | Field |
| --- | --- |
| 1 | `status` (raw int) |
| 2 | `maxRetries` |

The status enum is **not** named in code, only a raw int. Per the project research: `1` = OK/attested (real media), `3` = protection required (no media, mint a PO token); `2` is intermediate. `status >= 3` with no media is the [PO-token boundary](./sabr-session#protection-and-tokens) the session acts on.

## Navigation

### `SabrRedirect` — id 43
Field 1 = the new streaming URL. The session swaps `serverAbrStreamingUrl` and counts the hop (capped at 3/session).

### `SabrSeek` — id 45
Server-initiated seek: `{1 seekMediaTime, 2 seekMediaTimescale, 3 seekSource}`. Real time = `seekMediaTime / seekMediaTimescale`.

### `SabrReloadPlayerResponse` — id 46
The player response expired. Three nested levels, each field 1, down to a `reloadPlaybackParamsToken` string. The session re-fetches a fresh `YoutubeSabrInfo` and resumes in place (see [the session driver](./sabr-session#resilience)).

## Context

### `SabrContextUpdate` — id 57
A keyed blob the client must **echo back** in the streamer context on later requests.

| # | Field |
| --- | --- |
| 1 | `type` (key id) |
| 2 | `scope` |
| 3 | `value` (bytes; decoded into `SabrContextValue`) |
| 4 | `sendByDefault` |
| 5 | `writePolicy` (`1 = overwrite`, `2 = keep existing`) |

When echoed, only `{1 type, 2 value}` are re-encoded. `SabrContextValue` further decodes the value into a timing info (`timestampMs`, `durationMs`) and a content info (`contentId`, `contentType`), plus a signature length.

### `SabrContextSendingPolicy` — id 59
Which context types to start / stop / discard sending: field 1 start, field 2 stop, field 3 discard (each a single or packed list of `SabrContextUpdate.type` ids).

## Live

### `SabrLiveMetadata` — id 31
| # | Field |
| --- | --- |
| 1 | broadcastId |
| 3 | `headSequenceNumber` (live edge; -1 if unknown) |
| 4 | `headTimeMs` |
| 5 | wallTimeMs |
| 6 | videoId |
| 8 | `postLiveDvr` (ended live, still DVR-seekable) |
| 12 / 13 | min seekable time ticks / timescale |
| 14 / 15 | max seekable time ticks / timescale |

## Formats

- **`SabrFormatInitializationMetadata`** — id 42: per-format init (endSegmentNumber, mimeType, init/index ranges, duration units/timescale). Drives [the segment index](./sabr-media#the-segment-index).
- **`SabrSelectableFormats`** — id 51: the video/audio `FormatId`s the server will serve.
- **`SabrFormatSelectionConfig`** — id 37: itags + a resolution the server wants requested.

## Misc

- **`SabrError`** — id 44: `{1 type (string), 2 code}`. Fatal to the round.
- **`SabrSnackbarMessage`** — id 67: `{1 id}`, a user-facing message identifier.
- **`SabrRequestIdentifier`** — id 52: a server-issued token (field 1) tagging the round; summarized by length only, never printed.

---

Back to [the overview](./sabr).
