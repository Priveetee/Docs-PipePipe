# Localization and dates

Two value types travel with almost every request, and one parser turns human dates into timestamps.

## `Localization` and `ContentCountry`

`Localization` is `(languageCode, countryCode)`; `DEFAULT` is `en-GB`.

```java
Localization.fromLocalizationCode("en-GB");  // parse "en" or "en-GB"
loc.getLocalizationCode();                   // "en" or "en-GB"
loc.asLocale();
```

`ContentCountry` is just a country code (its `DEFAULT` comes from the default localization). The two feed InnerTube's `context.client` (YouTube's `hl` / `gl`) and the `Accept-Language` header, so they change what the service returns, not just how it is displayed.

A service declares what it actually supports:

```java
List<Localization>   getSupportedLocalizations();  // default: [DEFAULT]
List<ContentCountry> getSupportedCountries();       // default: [DEFAULT]
```

`NewPipe` holds the preferred values globally (set via `init(...)` or `setPreferredLocalization`), and a single extractor can override them with `forcedLocalization` / `forcedContentCountry`.

## Relative dates

Services print "3 days ago", not timestamps. `TimeAgoParser` turns that into a `DateWrapper`, an `OffsetDateTime` plus an `isApproximation` flag (true for day-and-coarser, false for seconds / minutes / hours). You get a parser for a localization from:

```java
TimeAgoParser parser = TimeAgoPatternsManager.getTimeAgoParserFor(localization); // null if no patterns
DateWrapper when = parser.parse("3 days ago");
```

The language patterns themselves live in the separate `timeago-parser` Gradle module, not in the extractor proper.
