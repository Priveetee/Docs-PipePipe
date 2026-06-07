# Localización y fechas

Dos tipos de valor viajan con casi cada petición, y un parser convierte fechas legibles para humanos en timestamps.

## `Localization` y `ContentCountry`

`Localization` es `(languageCode, countryCode)`; `DEFAULT` es `en-GB`.

```java
Localization.fromLocalizationCode("en-GB");  // parsea "en" o "en-GB"
loc.getLocalizationCode();                   // "en" o "en-GB"
loc.asLocale();
```

`ContentCountry` es simplemente un código de país (su `DEFAULT` proviene de la localización por defecto). Ambos alimentan el `context.client` de InnerTube (el `hl` / `gl` de YouTube) y la cabecera `Accept-Language`, así que cambian lo que devuelve el servicio, no solo cómo se muestra.

Un servicio declara lo que realmente soporta:

```java
List<Localization>   getSupportedLocalizations();  // por defecto: [DEFAULT]
List<ContentCountry> getSupportedCountries();       // por defecto: [DEFAULT]
```

`NewPipe` mantiene los valores preferidos de forma global (definidos mediante `init(...)` o `setPreferredLocalization`), y un extractor concreto puede sobrescribirlos con `forcedLocalization` / `forcedContentCountry`.

## Fechas relativas

Los servicios muestran "hace 3 días", no timestamps. `TimeAgoParser` convierte eso en un `DateWrapper`, un `OffsetDateTime` más un flag `isApproximation` (true para día y granularidades mayores, false para segundos / minutos / horas). Obtienes un parser para una localización con:

```java
TimeAgoParser parser = TimeAgoPatternsManager.getTimeAgoParserFor(localization); // null si no hay patrones
DateWrapper when = parser.parse("3 days ago");
```

Los patrones de idioma en sí viven en el módulo Gradle separado `timeago-parser`, no en el extractor propiamente dicho.
