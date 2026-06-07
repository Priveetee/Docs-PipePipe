# The buffered-range model and seeking

Part of [SABR in the extractor](./sabr). This is the subtlest piece of the extractor, and the one most often gotten wrong. It lives in `YoutubeSabrStreamState`, one `FormatProgress` per track.

## Why two "max" values

The server only sends what the client says it's missing, so the buffered ranges in each request must be *honest*. The trap is gaps. Suppose segments 1, 2, 3, 5, 6 have arrived but 4 was dropped or lost:

![Buffered head model](/diagrams/sabr-buffered-model.png)

If the client reported `maxSegment = 6`, the server would assume 1–6 are all held and send segment 7, and segment 4 would never be filled, the sequential reader starves at the hole forever.

So `FormatProgress` tracks two heads:

- **`contiguousMaxSegment`** — the highest segment with **no gap from the start**. This is what's reported to the server, so it always sends the exact next sequential segment a reader needs.
- **`maxSegment`** — the highest segment seen at all (may sit past a hole).
- **`aheadOfContiguous`** — a set of out-of-order segments received past the contiguous edge, waiting to be folded in.

`observeHeader(seq)` maintains them: if `seq == contiguousMaxSegment + 1`, advance the contiguous edge and drain `aheadOfContiguous` as far as it reaches; if `seq` is further ahead, stash it in `aheadOfContiguous`. This contiguous-vs-max split is the central anti-starvation mechanism.

## The observed-timing window

Alongside the segment numbers, `FormatProgress` records a timing window from the headers it has actually seen: `firstObservedSegment`, `lastObservedSegment`, `observedStartMs`, `observedEndMs`, `observedMaxSegment`, `lastObservedDurationMs`. Plus `endSegment` and `averageDurationMs` (from the format-init metadata) and the parsed `segmentIndex`.

## Building the ranges

`getBufferedRanges()` emits one `SabrBufferedRange` per track (or `SabrBufferedRange.full(...)` if a track is flagged fully buffered, or a manual override). The interesting decision in `addBufferedRange` is whether to trust the observed timing:

```
canUseObservedTiming =
       observedStartMs >= 0
    && observedEndMs > observedStartMs
    && observedMaxSegment >= maxSegment
    && firstObservedSegment > 0
    && contiguousMaxSegment >= maxSegment   // the no-hole guard
```

That last clause is the key: observed timing is only trusted when there is **no hole** (contiguous has caught up to max). Otherwise the observed end would overstate coverage past the gap. When trusted, the range uses `observedStartMs` / `observedEndMs - observedStartMs` and `firstObservedSegment`; otherwise it falls back to `startTime = 0`, `duration = getBufferedEndMs()`, `startIndex = 1`. **Either way `endSegmentIndex = contiguousMaxSegment`**, never `maxSegment`. And `getBufferedEndMs()` is computed from `contiguousMaxSegment` too (a hole means we're not really buffered past it).

## Seeking

![Buffered head and seek](/diagrams/sabr-extractor-seek.png)

**Forward** seeks are easy because the model has a forward bias. `assumeBufferedUntil(format, seq)` only ever *raises* `maxSegment`; the session's `prepareForMediaSegment` / `maybePrepareForDistantMediaSegment` use it to jump the bookkeeping ahead and let `SabrSeek` / player time align. Nothing needs to be undone.

**Backward** seeks are the hard case and the most recent fix. After playing forward, the buffered head sits high; a seek back onto an already-received segment would leave the request still advertising that range as buffered, the server sends nothing, the reader stalls. `prepareForRewind` → `rewindBufferedTo(fromSegment)` repairs the state precisely:

1. `last = max(0, fromSegment - 1)`.
2. Guard: if `last >= contiguousMaxSegment`, it isn't a rewind for this track, return.
3. Otherwise **shrink**: `maxSegment = last`, `contiguousMaxSegment = last`, `observedMaxSegment = min(observedMaxSegment, last)`.
4. **Drop the observed window**: `firstObservedSegment`, `lastObservedSegment`, `observedStartMs`, `observedEndMs` all back to `-1`.

Step 4 matters as much as step 3: if the observed window survived, `canUseObservedTiming` could still report an end past the seek target and the re-request would again come back empty. With both heads and the observed window walked back, the next request honestly asks for the target and the server re-sends it. The session does this for both the rewound track and its companion (audio/video move together), then sets player time.

---

Next: [The session driver](./sabr-session).
