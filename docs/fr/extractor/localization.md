# Localisation et dates

Deux types de valeurs accompagnent presque chaque requête, et un parser transforme les dates humaines en timestamps.

## `Localization` et `ContentCountry`

`Localization` est `(languageCode, countryCode)` ; `DEFAULT` vaut `en-GB`.

```java
Localization.fromLocalizationCode("en-GB");  // parse "en" ou "en-GB"
loc.getLocalizationCode();                   // "en" ou "en-GB"
loc.asLocale();
```

`ContentCountry` n'est qu'un code pays (son `DEFAULT` provient de la localisation par défaut). Les deux alimentent le `context.client` d'InnerTube (les `hl` / `gl` de YouTube) et l'en-tête `Accept-Language`, donc ils changent ce que le service retourne, pas seulement la façon dont c'est affiché.

Un service déclare ce qu'il prend réellement en charge :

```java
List<Localization>   getSupportedLocalizations();  // défaut : [DEFAULT]
List<ContentCountry> getSupportedCountries();       // défaut : [DEFAULT]
```

`NewPipe` conserve les valeurs préférées globalement (définies via `init(...)` ou `setPreferredLocalization`), et un extracteur isolé peut les surcharger avec `forcedLocalization` / `forcedContentCountry`.

## Dates relatives

Les services affichent « il y a 3 jours », pas des timestamps. `TimeAgoParser` transforme cela en un `DateWrapper`, un `OffsetDateTime` accompagné d'un drapeau `isApproximation` (vrai pour le jour et plus grossier, faux pour les secondes / minutes / heures). On obtient un parser pour une localisation via :

```java
TimeAgoParser parser = TimeAgoPatternsManager.getTimeAgoParserFor(localization); // null si aucun pattern
DateWrapper when = parser.parse("3 days ago");
```

Les patterns de langue eux-mêmes vivent dans le module Gradle séparé `timeago-parser`, pas dans l'extracteur à proprement parler.
