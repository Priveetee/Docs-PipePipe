# The session driver

Part of [SABR in the extractor](./sabr). `YoutubeSabrSession` owns the state of
one SABR transaction sequence. It does not implement a client-side buffer or a
decoder; it sends requests, processes the protocol controls, and hands completed
`SabrMediaSegment` objects to its caller.

## One transaction

`requestOnce(request, consumer)` performs one request, unless the previous
response asked the caller to wait. In that case it returns a deferred
`RequestResult` and sends no HTTP request. Otherwise it:

1. Logs a bounded diagnostic event and posts the encoded request through
   `YoutubeSabrRequestHelper`.
2. Streams the UMP body through `SabrStreamingResponseReader`; completed
   segments are delivered to `consumer` at `MEDIA_END`.
3. Requires `application/vnd.yt-ump`, records response timing and byte counters,
   and increments the request number after the response has been read.
4. Processes policies, context updates, live metadata and redirects.
5. Returns the completed segment count and the server-requested backoff.

The request number starts at zero. A redirect is accepted only when it is HTTPS
and stays on `googlevideo.com` or one of its subdomains. A media-bearing response
resets the redirect counter.

## Bounded recovery

The current implementation deliberately keeps the limits in the session:

| Limit | Value | Effect |
| --- | ---: | --- |
| Redirects in one session | 3 | A fourth accepted redirect is rejected. |
| Consecutive incomplete media responses | 3 | Length mismatches or missing media end parts are retried, then fail. |
| Consecutive attestation-pending/no-media responses | 3 | A permanently pending attestation fails with `SabrAttestationException`. |
| Server backoff | 30,000 ms | A larger `NEXT_REQUEST_POLICY` backoff is rejected. |

`SabrRecoverableException` is used for incomplete streamed media and spool I/O
that can be retried. Protocol errors, invalid redirects, explicit SABR errors,
and attestation requirements are not silently swallowed. A
`RELOAD_PLAYER_RESPONSE` control part is surfaced as a protocol error to the
caller; refreshing the player response is an application-level decision.

## Cookies, contexts and protection

`NEXT_REQUEST_POLICY` can carry a playback cookie and a delay. The session keeps
that cookie and includes it in subsequent `streamerContext` messages. SABR
context updates are stored by type; the context-sending policy starts, stops or
discards types, so only active values are echoed.

When the server reports stream protection status `2` (attestation pending), the
session records it and tolerates a bounded number of no-media responses. Status
`3` is exposed as an attestation-required error. The caller may provide a
content-bound PO token with `setPoToken`; the session stores a defensive copy and
the request helper includes it in the streamer context. Token minting remains
outside the extractor.

## Live metadata and diagnostics

`LIVE_METADATA` updates `isLive`, the live-head sequence and timestamp, and the
post-live DVR flag. These values are available through `isLive()`,
`getLiveHeadSequenceNumber()`, `getLiveHeadTimeMs()`, and `isPostLiveDvr()`.

Diagnostics are bounded and opt-in for detailed traces. `getDiagnosticTrace()`
returns the recent event string; `getMemoryDiagnosticSummary()` and
`getTraceSnapshot()` expose response, UMP-part, media and segment counters
without dumping token or cookie bytes.

Next: [Control parts reference](./sabr-control-parts).
