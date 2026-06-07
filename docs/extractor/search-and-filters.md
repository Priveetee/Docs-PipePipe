# Search and filters

Search is a `ListExtractor` whose handler is a `SearchQueryHandler`. Filters, the content types and sort orders a service offers, are a small declarative model in `search/filter`.

## The model

- **`FilterItem`**: one selectable option, `(int identifier, String name)`. The identifier is assigned by the builder and is what the rest of the code passes around, not the display name.
- **`FilterGroup`**: a named set of `FilterItem`s, with `onlyOneCheckable` (radio vs checkbox) and its own identifier.
- **`Filter`**: a set of `FilterGroup`s, assembled with `Filter.Builder`.
- **`SearchFiltersBase`**: the per-service base. A service subclasses it, creates its items and groups in `init()`, and implements `evaluateSelectedFilters(query)` to turn the user's selection into the service's actual request parameters.

## A concrete set

`YoutubeFilters` declares content filters, `all`, `videos`, `channels`, `playlists`, `movies`, `Lives`, plus the YouTube Music ones (`music_songs`, `music_videos`, `music_albums`, `music_playlists`, `music_artists`). Its sort and feature groups: sort by (relevance / rating / views), upload date (hour / day / week / month / year), duration (short / long), and feature toggles (HD, subtitles, Creative Commons, 3D, live, 4K, 360, HDR, ...).

`evaluateSelectedFilters` encodes the selection into YouTube's base64 protobuf `sp` parameter, which it appends to the search request. Each filter family knows how to serialise itself, so adding one is local.

## How a handler exposes them

A `ListLinkHandlerFactory` advertises `getAvailableContentFilter()` and `getAvailableSortFilter()`. The app reads those to build its filter UI, then passes the chosen `FilterItem`s back through `fromQuery(query, contentFilters, sortFilters)`. The selected filters land on the `SearchQueryHandler` that the `SearchExtractor` receives, and from there on the request.
