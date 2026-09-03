# Control parts reference

Part of [SABR in the extractor](./sabr). The server may place control parts
between media parts. `SabrResponseDecoder` recognizes their numeric ids and
stores either the fields needed by `YoutubeSabrSession` or a bounded structural
summary. The current source does not define one Java class for every control
part.

## Pacing and protection

### `NEXT_REQUEST_POLICY` — id 35

The decoder keeps the raw policy and reads its field `4` as the requested backoff
in milliseconds. `YoutubeSabrSession` also reads field `7` as the playback
cookie. A backoff above 30,000 ms is rejected; a valid delay defers the next
`requestOnce` call without sending HTTP.

### `STREAM_PROTECTION_STATUS` — id 58

| # | Field |
| --- | --- |
| 1 | raw protection status |
| 2 | server-provided maximum retries |

The status is deliberately kept as a raw integer. Status `2` is exposed as
attestation pending; status `3` is exposed as attestation required. The caller
may set a content-bound PO token with `YoutubeSabrSession.setPoToken(...)`.

## Navigation and player state

### `SABR_REDIRECT` — id 43

Field `1` is the replacement streaming URL. The session accepts only HTTPS URLs
on `googlevideo.com` or its subdomains and caps redirects at three per session.

### `SABR_SEEK` — id 45

The part is retained as a structural summary. The current extractor does not
apply a server-initiated seek itself; the application decides how to rebuild a
`YoutubeSabrRequest`.

### `RELOAD_PLAYER_RESPONSE` — id 46

The decoder sets `reloadRequested`. `YoutubeSabrSession` surfaces this as a
protocol error; fetching a new player response and creating a new
`YoutubeSabrInfo` is an application-level recovery step.

### `PLAYBACK_START_POLICY` — id 47

Retained as a structural summary. It does not change the extractor's
`requestOnce` result directly.

## Context and live metadata

### `SABR_CONTEXT_UPDATE` — id 57

The session parses the fields it needs:

| # | Field |
| --- | --- |
| 1 | context type |
| 3 | opaque value bytes |
| 4 | send by default |
| 5 | write policy |

Values are stored by type. `SABR_CONTEXT_SENDING_POLICY` (id 59) adds, removes
or discards types through fields `1`, `2` and `3`; active values are echoed in
later `streamerContext` messages.

### `LIVE_METADATA` — id 31

The session currently consumes:

| # | Meaning |
| --- | --- |
| 3 | live-head sequence number |
| 4 | live-head time in milliseconds |
| 8 | post-live DVR flag |

Receiving the part marks the session live. The values are available through
`isLive()`, `getLiveHeadSequenceNumber()`, `getLiveHeadTimeMs()` and
`isPostLiveDvr()`.

## Format and media controls

- `FORMAT_INITIALIZATION_METADATA` (id 42) is decoded into
  `SabrFormatInitializationMetadata` and supplies initialization/index ranges;
- `MEDIA_HEADER`, `MEDIA`, and `MEDIA_END` (ids 20–22) are assembled by
  `SabrMediaSegmentCollector`, as described in [Media, segments, and the
  index](./sabr-media);
- `FORMAT_SELECTION_CONFIG` (37), `SELECTABLE_FORMATS` (51), onesie parts
  (10–12), request controls (52–56), cache/bandwidth hints (48–50, 60–66), and
  `SNACKBAR_MESSAGE` (67) are currently summarized for diagnostics.

### `SABR_ERROR` — id 44

Fields `1` (string type) and `2` (numeric code) are rendered in the response
summary and cause the session to throw a protocol error.

Unknown or malformed parts are retained as bounded diagnostics. This lets valid
media from the same response continue to the integrity checks.

Back to [the overview](./sabr).
