# Adding a service

A service is one `StreamingService` subclass plus a folder of extractors and link handlers. Here is the full checklist, with the exact methods you are forced to implement.

## 1. Register it

Add it to `ServiceList` with the next free id, at the end of the list. Ids are persisted in subscriptions, history, and bookmarks, so never reuse or reorder them:

```java
YouTube   = new YoutubeService(0),
SoundCloud = new SoundcloudService(1),
...
NicoNico  = new NiconicoService(6)
// MyService = new MyService(7)   <- next free id, appended
```

## 2. The `StreamingService`

Subclass `StreamingService(id, name, capabilities)` and implement `getBaseUrl()` plus the two factory families.

LinkHandler factories:

```java
getStreamLHFactory(); getChannelLHFactory(); getChannelTabLHFactory();
getPlaylistLHFactory(); getSearchQHFactory(); getCommentsLHFactory();
```

Extractor factories:

```java
getStreamExtractor(LinkHandler);      getChannelExtractor(ListLinkHandler);
getChannelTabExtractor(ListLinkHandler); getPlaylistExtractor(ListLinkHandler);
getSearchExtractor(SearchQueryHandler);  getCommentsExtractor(ListLinkHandler);
getSuggestionExtractor(); getSubscriptionExtractor(); getKioskList();
```

Declare your `MediaCapability` set (`AUDIO`, `VIDEO`, `LIVE`, `COMMENTS`, ...) so the app only offers what you support. Override `getSupportedLocalizations()` / `getSupportedCountries()` if you do more than `en-GB`.

## 3. Link handlers

For each content type, a factory implementing `getId`, `getUrl`, `onAcceptUrl` (and the filtered `getUrl` for lists). Remember `getId` must be stable: it is the persisted identity.

## 4. Extractors

Each extends the matching base and does its I/O in `onFetchPage(Downloader)`. The abstract methods you must fill, per base:

- **`StreamExtractor`**: `getName`, `getThumbnailUrl`, `getUploaderUrl`, `getUploaderName`, `getAudioStreams`, `getVideoStreams`, `getVideoOnlyStreams`, `getStreamType`. Most of the rest (description, length, counts, subtitles) has a safe default you override as the data is available.
- **`ChannelExtractor`**: `getAvatarUrl`, `getSubscriberCount`, `getDescription` (plus `getInitialPage` / `getPage` from `ListExtractor`).
- **`PlaylistExtractor`**: `getUploaderUrl`, `getUploaderName`, `getUploaderAvatarUrl`, `isUploaderVerified`, `getStreamCount`.
- **`SearchExtractor`**: `getInitialPageInternal`, `getPageInternal`.
- **`SuggestionExtractor`**: `suggestionList(query)`. **`SubscriptionExtractor`**: `getRelatedUrl`. **`KioskExtractor`**: `getName`.

`getFeedExtractor`, bullet comments, and subscription import are optional: the base returns null or throws `UnsupportedOperationException` until you override.

## 5. Mirror an existing layout

Use a current service as a template:

```
services/<name>/
  <Name>Service.java
  extractors/    <Name>StreamExtractor, ChannelExtractor, PlaylistExtractor, SearchExtractor, ...
  linkHandler/   <Name>StreamLinkHandlerFactory, ChannelLinkHandlerFactory, ...
  search/filter/ (only if you expose filters)
```

Build through the composite build (see [Building the extractor](./building)); the client picks up your service immediately, no publish step.
