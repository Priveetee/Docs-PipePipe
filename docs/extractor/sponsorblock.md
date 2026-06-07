# SponsorBlock

SponsorBlock segments (sponsor, intro, outro, ...) are extracted alongside the stream so the player can skip or mark them. It is a capability a service opts into, not part of core stream extraction.

![SponsorBlock fetch](/diagrams/sponsorblock.png)

## The model

A `SponsorBlockSegment` is a time range with a category and an action:

```java
class SponsorBlockSegment {
    String uuid;  double startTime;  double endTime;   // milliseconds
    SponsorBlockCategory category;  SponsorBlockAction action;  int serviceId;
}
enum SponsorBlockCategory {
    SPONSOR, INTRO, OUTRO, INTERACTION, HIGHLIGHT, SELF_PROMO, NON_MUSIC, PREVIEW, FILLER, PENDING
}   // each maps to an API name, e.g. NON_MUSIC = "music_offtopic", HIGHLIGHT = "poi_highlight"
enum SponsorBlockAction { SKIP, POI }
```

A `HIGHLIGHT` is a point of interest (a single moment), so the extractor gives it a one-second span to make it visible on the seekbar.

## Opting in

A service enables SponsorBlock by setting a `SponsorBlockApiSettings` and declaring the `SPONSORBLOCK` capability:

```java
service.setSponsorBlockApiSettings(settings);   // apiUrl + per-category include flags
service.getSponsorBlockApiSettings();
```

The settings carry which categories the user wants (`includeSponsorCategory`, `includeIntroCategory`, ...). Only YouTube and BiliBili have an API: `sponsor.ajay.app` for YouTube, `bsbsb.top` for BiliBili.

## How segments are fetched

SponsorBlock uses **k-anonymity**: the client never sends the full video id. `SponsorBlockExtractorHelper.getSegments`:

1. hashes the video id with SHA-256 (`Utils.toSha256`),
2. sends only the first 4 hex characters as a prefix: `GET {apiUrl}/skipSegments/{prefix}?categories=[...]&actionTypes=[skip,poi]`,
3. gets back segments for *every* video sharing that prefix, and keeps the ones whose full hash matches.

Times come back in seconds and are converted to milliseconds.

## When it runs

`StreamInfo.getInfo` kicks the fetch off on a side thread the moment extraction starts, then waits up to about three seconds for it before returning, so a slow SponsorBlock server never blocks the whole extraction. The result lands on the `StreamInfo`:

```java
SponsorBlockSegment[] getSponsorBlockSegments();
void setSponsorBlockSegments(SponsorBlockSegment[] segments);
```

So segments are best-effort: if the API is slow or down, the video still plays, just without skips.
