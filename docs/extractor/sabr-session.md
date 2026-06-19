# The session driver

Part of [SABR in the extractor](./sabr). `YoutubeSabrSession` is the state machine that turns the protocol into a stream of playable segments. It owns the chosen audio + video formats, the `YoutubeSabrStreamState`, the segment cache, the counters, and an optional `SabrPoTokenProvider`.

## A round

![A SABR round](/diagrams/sabr-extractor-round.png)

The raw POST is `fetchNextResponse`: request 0 is the cold start (`YoutubeSabrProbe.probeFirstMediaResponse`), later ones are follow-ups carrying state. Each result is checked for a redirect (counted, capped, then the streaming URL is swapped) and `requestNumber` is incremented.

## Two driving loops

- **`pumpOnce(localization)`** is the lenient, server-driven advance: one request, ingest, collect, cache, apply policy, return whatever segments arrived (possibly none). The client calls it in a loop to stay buffered ahead. A single `status=3` or policy-only round is *not* fatal here, the client's stall watchdog is the real give-up.
- **`fetchSegment(request, localization)`** is the strict path for "I need exactly this segment": cache hit returns immediately, otherwise it loops up to `MAX_REQUESTS_PER_SEGMENT`, tolerating a bounded number of policy-only rounds, handling reload/protection/redirect, until the target is cached or it throws.

### `pumpOnce`, step by step

1. `fetchNextResponse` (POST, redirect handling, `requestNumber++`).
2. If `getIntegrityIssues()` is non-empty → throw.
3. `streamState.ingest(decoded)` (cookie, ranges, policy, live, contexts).
4. `SabrMediaSegmentCollector.collect(decoded)`.
5. For each segment: ingest into state, put in cache; if new and not an init segment, append to `cacheOrder` and add to `cachedBytes`.
6. `evictCacheIfNeeded()`.
7. If a `SabrError` is present → throw.
8. If reload requested → `maybeReload`; on success return empty (the pump will call again), else throw.
9. If `isProtectedNoMediaResponse()` (status 3) → best-effort PO token, no throw.
10. If segments arrived → reset the redirect and PO-token-refresh counters (a media-bearing response proves the token works and the CDN hops are normal, so long sessions aren't capped).
11. If a backoff was requested → sleep.

## Constants (the bounds)

Every failure mode is bounded:

| Constant | Value | Purpose |
| --- | --- | --- |
| `MAX_REQUESTS_PER_SEGMENT` | 16 | attempts to obtain one specific segment |
| `MAX_POLICY_ONLY_RESPONSES_PER_SEGMENT` | 3 | consecutive no-media rounds tolerated per segment |
| `MAX_REDIRECTS_PER_SESSION` | 3 | CDN redirect hops (reset on a media response and on reload) |
| `MAX_RELOADS_PER_SESSION` | 2 | server-requested player-response reloads |
| `MAX_PO_TOKEN_REFRESHES` | 2 | forced token re-mints before giving up |
| `MAX_BACKOFF_MS` | 30 000 | clamp on honoured server backoff |
| `MAX_CACHE_BYTES` | 32 MiB | media-byte cache budget (~50 s of 4K) |
| `MIN_CACHED_SEGMENTS` | 6 | eviction never drops below this many |
| `EVICT_BEHIND_MS` | 10 000 | back-buffer kept behind the play head |
| `SEEK_KEEP_WINDOW_MS` | 30 000 | cache window kept either side of a seek target |

## The cache

A `ConcurrentHashMap<String, SabrMediaSegment>` keyed `itag + ":" + ("init" | sequenceNumber)`, plus an `ArrayDeque` of media-segment keys in insertion order and a running `cachedBytes`. **Init segments are cached but never counted and never evicted** (they're tiny and always needed). `getCachedSegment(request)` is a side-effect-free lookup the client's reader hits first. Byte accounting is maintained by `pumpOnce` (the `fetchSegment` path caches without touching the accounting).

### Eviction

`evictCacheIfNeeded()` runs every round (even when byte-throttled, otherwise the throttle never releases and playback freezes). While `cachedBytes > MAX_CACHE_BYTES` **and** `cacheOrder.size() > MIN_CACHED_SEGMENTS`, it looks at the oldest segment and:

- if its end time is `> playHeadMs - EVICT_BEHIND_MS`, it's within the back-buffer or ahead of the play head → **stop** (the cache is allowed to ride over budget rather than evict something still needed);
- otherwise drop it and subtract its bytes.

`playHeadMs` is fed in by the client via `setPlayHeadMs`, this is what makes eviction play-head-aware rather than blindly FIFO. (Seeking, which also lives partly here via `prepareForRewind`, is covered in [the buffered-range model](./sabr-buffered).)

On a seek, byte-budget eviction alone is not enough: a large jump leaves the old span *and* the freshly fetched target span in the cache, two disjoint regions that together can blow far past `MAX_CACHE_BYTES`, untenable at 4K segment sizes. `evictOutsideSeekWindow(targetMs)` collapses the cache to a single window: it drops every media segment whose time falls outside `[targetMs - SEEK_KEEP_WINDOW_MS, targetMs + SEEK_KEEP_WINDOW_MS]` (init segments excepted) and re-subtracts their bytes, so right after a jump the cache holds only the ±30 s around where playback resumes. It runs on the seek-prep path, next to `prepareForRewind` / `prepareForForwardJump`.

## Resilience

Within a session the driver contains every way a server can misbehave: bounded redirects, bounded reloads, bounded policy-only rounds, a 30 s backoff clamp, and bounded token re-mints. Redirect and token-refresh budgets **reset on any media-bearing round**, so a long, healthy session is never killed by accumulated hops. Malformed input throws `SabrProtocolException`.

**Reload** (`maybeReload`) handles `SabrReloadPlayerResponse`: it re-fetches a fresh `YoutubeSabrInfo` (new `serverAbrStreamingUrl`), resets the redirect count, but **keeps `requestNumber > 0`** so the next request is a follow-up carrying the current player time and buffered ranges, it resumes in place rather than restarting.

## Protection and tokens

A `status=3` no-media response means the server wants a content-bound PO token before releasing media. `applyPoTokenForProtectedResponse` first tries the cached token (`maybeApplyPoToken(false)`); if that's already in place and still rejected, and the refresh budget allows, it counts a refresh and forces a fresh mint (`maybeApplyPoToken(true)`) — a force-refresh triggers a ~45 s WebView mint. The token itself comes from the client via `SabrPoTokenProvider.getPoToken(info, streamState, forceRefresh)`; the extractor only requests, caches (in `StreamState`), and retries. Minting is the [attestation story](/developer-guide/sabr-attestation).

## Live

The session exposes `isLive()`, `getLiveHeadSequenceNumber()`, and `isAtLiveEdge()` off the `SabrLiveMetadata` the state ingests (live-edge sequence within a 2-segment margin, plus DVR state). That's the foundation live playback is built on, client-side.

---

Next: [Control parts reference](./sabr-control-parts).
