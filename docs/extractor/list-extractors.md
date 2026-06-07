# Channels, playlists and kiosks

Most extractors return a list, and they all share one base, `ListExtractor`, and one result shape, `ListInfo`. This page covers the list types beyond search and comments.

![List extractor family](/diagrams/list-extractors.png)

## `ListInfo`: the list result

Every list `*Info` extends `ListInfo<T extends InfoItem>` (which extends `Info`). On top of `Info`'s identity and error list it adds:

```java
List<T> getRelatedItems();        // the items of the first page
boolean hasNextPage();  Page getNextPage();
List<FilterItem> getContentFilters();  List<FilterItem> getSortFilter();
```

Building one is always the same dance: `getInfo(extractor)` calls `fetchPage()`, reads `getInitialPage()`, copies items + `nextPage` onto the `ListInfo`, then fills the type-specific fields. So `ChannelInfo`, `PlaylistInfo`, `KioskInfo`, `ChannelTabInfo`, `FeedInfo`, and `CommentsInfo` are identical at this level.

## Channels and tabs

A `ChannelExtractor` is a `ListExtractor<StreamInfoItem>`. Its required fields are `getAvatarUrl`, `getSubscriberCount` (or `UNKNOWN_SUBSCRIBER_COUNT`), and `getDescription`; the rest (banner, parent channel, verified, tags) default to empty.

A channel is not one flat list. `getTabs()` returns a `List<ListLinkHandler>`, one per tab, and each tab is its own `ChannelTabExtractor` (a `ListExtractor<InfoItem>`). The tab name is the handler's first content filter, drawn from the `ChannelTabs` constants:

```java
VIDEOS, TRACKS, SHORTS, LIVESTREAMS, CHANNELS, PLAYLISTS, PODCASTS, ALBUMS, SEARCH
```

So "the videos of this channel" and "the playlists of this channel" are two `ChannelTabExtractor`s built from two handlers and fetched independently.

## Playlists

A `PlaylistExtractor` is a `ListExtractor<StreamInfoItem>` with `getUploaderUrl` / `getUploaderName` / `getUploaderAvatarUrl`, `isUploaderVerified`, and `getStreamCount`. Its `getPlaylistType()` tags what kind of list it is:

```java
enum PlaylistType { NORMAL, MIX_STREAM, MIX_MUSIC, MIX_CHANNEL, MIX_GENRE }
```

A `MIX_*` is an endless auto-generated playlist (a radio/mix) the app treats differently from a `NORMAL` one: it keeps appending as you play. `PlaylistInfo.getInfoWithFullItems` walks every page when you genuinely need them all.

## Kiosks

A kiosk is a named, id-less list: trending, charts, conferences, a service's front-page feeds. A `KioskExtractor<T>` extends `ListExtractor<T>` and carries a kiosk id.

A service registers its kiosks on a `KioskList` in `getKioskList()`:

```java
kioskList.addKioskEntry(extractorFactory, listLinkHandlerFactory, id);
kioskList.setDefaultKiosk(id);
```

Each entry pairs a `KioskExtractorFactory` (builds the extractor for a url + kiosk id) with a link-handler factory. That is how YouTube exposes Trending, BiliBili its Recommended / Top-100, PeerTube its Trending / Recent / Local, and media.ccc.de its conferences, all behind one uniform `getKioskList()`.
