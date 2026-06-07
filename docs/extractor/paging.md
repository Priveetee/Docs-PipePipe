# Paging and continuations

Lists do not arrive all at once. A `ListExtractor` returns a first page plus a token for the next one.

## `InfoItemsPage` and `Page`

`getInitialPage()` and `getPage(Page)` both return an `InfoItemsPage<R>`: the items, a `nextPage` (a `Page`, null when there is no more), and a list of per-item errors. `hasNextPage()` is just `nextPage != null`.

A `Page` is the continuation token, deliberately generic so each service stores whatever it needs:

```java
String url;  String id;  List<String> ids;  Map<String, String> cookies;  byte[] body;
```

A service that paginates by URL puts the next URL in `url`. One that posts a continuation token (YouTube) puts the token in `id`, or the whole POST body in `body`. `cookies` ride along for stateful services. Nothing forces a shape; the same service reads back what it wrote.

## Walking pages

```java
InfoItemsPage<R> page = extractor.getInitialPage();
while (page.hasNextPage()) {
    page = extractor.getPage(page.getNextPage());
    // consume page.getItems()
}
```

`ListExtractor.getFullPage()` does exactly this for the cases that need everything up front. Sizes that cannot be known in advance use sentinels on `ListExtractor`:

```java
ITEM_COUNT_UNKNOWN       = -1;
ITEM_COUNT_INFINITE      = -2;
ITEM_COUNT_MORE_THAN_100 = -3;
```

So a getter like a playlist's stream count returns a real number when the service gives one, and a sentinel when it does not, rather than lying with a zero.
