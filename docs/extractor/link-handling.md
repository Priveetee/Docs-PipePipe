# Link handling

Every extractor is built from a `LinkHandler`, and every `LinkHandler` comes from a factory. This is the layer that turns an arbitrary URL into a validated, normalised `(id, url)` pair before any network call happens.

## The handlers

`LinkHandler` is immutable, `Serializable`, three strings:

```java
String getOriginalUrl();  String getUrl();  String getId();  String getBaseUrl();
```

`ListLinkHandler` extends it for anything that returns a list, adding the selected filters:

```java
List<FilterItem> getContentFilters();
List<FilterItem> getSortFilter();
```

`SearchQueryHandler` extends `ListLinkHandler` and stores the query in the id slot:

```java
String getSearchString();   // == getId()
```

## The factories

`LinkHandlerFactory` is abstract on three methods:

```java
abstract String  getId(String url);
abstract String  getUrl(String id);
abstract boolean onAcceptUrl(String url);
```

`fromUrl(url)` is the entry point: it calls `acceptUrl(url)` (which delegates to `onAcceptUrl`), then builds a `LinkHandler` from the extracted id and a canonical `getUrl(id)`. `fromId(id)` goes the other way. So one factory both recognises a URL and emits a canonical one.

`ListLinkHandlerFactory` adds filters:

```java
abstract String getUrl(String id, List<FilterItem> contentFilter, List<FilterItem> sortFilter);
Filter getAvailableContentFilter();
Filter getAvailableSortFilter();
```

`SearchQueryHandlerFactory` builds search URLs from a query, and its `onAcceptUrl` always returns `false`: a search is produced from a query, not recognised from a pasted URL.

## A concrete factory

`YoutubeStreamLinkHandlerFactory` shows the pattern. The id is an 11-character token:

```java
Pattern.compile("^([a-zA-Z0-9_-]{11})")
```

`getId` handles the whole zoo of YouTube URL shapes, `watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`, `/live/`, the `vnd.youtube:` scheme, invidious and piped mirrors, `attribution_link` redirects, and throws `FoundAdException` for doubleclick ad links. `onAcceptUrl` is simply "does `getId` succeed":

```java
public boolean onAcceptUrl(String url) throws FoundAdException {
    try { getId(url); return true; }
    catch (FoundAdException fe) { throw fe; }
    catch (ParsingException e)  { return false; }
}
```

`getUrl` rebuilds the canonical form: `"https://www.youtube.com/watch?v=" + id`.

For lists, `YoutubeChannelTabLinkHandlerFactory` maps content filters (Videos, Playlists, Shorts, Livestreams, ...) to URL suffixes (`/videos`, `/playlists`, `/shorts`, `/streams`) and a sort filter (`latest` / `popular` / `oldest`) to a `?sort=` query.

Because `getId` is what gets persisted in subscriptions and history, it must be stable: the same content must always yield the same id.
