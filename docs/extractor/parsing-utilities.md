# Parsing and utilities

Writing an extractor is mostly turning a response into model fields. The `utils` package is the toolbox, and two libraries do the heavy lifting.

## JSON: nanojson

JSON parsing uses **nanojson** (`com.grack.nanojson`): `JsonObject`, `JsonArray`, `JsonParser`, `JsonWriter`. A typical parse:

```java
JsonObject root = JsonParser.object().from(downloader.get(url).responseBody());
JsonArray items = root.getArray("results");
for (int i = 0; i < items.size(); i++) {
    JsonObject item = items.getObject(i);
}
```

`JsonUtils` adds dotted-path access so you do not chain `getObject` by hand, and throws `ParsingException` (rather than returning null) when a path is missing:

```java
JsonUtils.getString(root, "data.items.0.title");
JsonUtils.getArray(root, "contents.section.items");
JsonUtils.toJsonObject(responseBody);   // parse and wrap errors
```

## HTML: jsoup

HTML scraping uses **jsoup** (`org.jsoup`): `Jsoup.parse`, `Document`, `Element`, `Elements`.

```java
Document doc = Jsoup.parse(downloader.get(url).responseBody());
for (Element e : doc.getElementsByClass("writing")) {
    collector.commit(new MyCommentItemExtractor(e));
}
```

## Regex: `Parser`

`Parser` wraps `java.util.regex` with extractor-friendly helpers that throw `Parser.RegexException` (a `ParsingException`) on no match, so a failed match is an extraction error, not a silent null:

```java
Parser.matchGroup1("v=([\\w-]+)", url);
Parser.matchGroup(pattern, input, 2);
Parser.matchGroup1MultiplePatterns(patterns, input);   // try several, first that hits
Parser.isMatch(pattern, input);
```

## Everyday helpers: `Utils`

`Utils` is the grab-bag you reach for constantly:

```java
Utils.isNullOrEmpty(str | collection | map);
Utils.removeNonDigitCharacters("1,234 views");   // -> "1234"
Utils.mixedNumberWordToLong("1.2M");             // suffixed counts -> long
Utils.getBaseUrl(url);  Utils.getQueryValue(url, "v");
Utils.replaceHttpWithHttps(url);  Utils.encodeUrlUtf8(s);  Utils.decodeUrlUtf8(s);
Utils.EMPTY_STRING;
```

## Running JavaScript

When a service needs to run player JS (YouTube's case, see [Inside YouTube](./youtube-service)), `JavaScript` wraps Rhino:

```java
JavaScript.compileOrThrow(fn);
JavaScript.run(fn, "functionName", args...);
```

and the `jsextractor` package (`Lexer`, `JavaScriptExtractor.matchToClosingBrace`) pulls a balanced function body out of minified code. Note that in this fork the YouTube signature path mostly defers to a remote decoder API rather than running this JS locally.

## Caching manifests

`ManifestCreatorCache` is a small bounded, serializable cache the DASH manifest creators use so a repeated request does not rebuild the same manifest from scratch.
