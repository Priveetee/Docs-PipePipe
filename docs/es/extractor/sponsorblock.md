# SponsorBlock

Los segmentos de SponsorBlock (patrocinio, intro, outro, ...) se extraen junto con el flujo para que el reproductor pueda saltarlos o marcarlos. Es una capacidad a la que un servicio se suma, no parte de la extracción de flujo del núcleo.

![Obtención de SponsorBlock](/diagrams/sponsorblock.png)

## El modelo

Un `SponsorBlockSegment` es un rango de tiempo con una categoría y una acción:

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

Un `HIGHLIGHT` es un punto de interés (un solo momento), así que el extractor le da un tramo de un segundo para que sea visible en la barra de reproducción.

## Sumarse

Un servicio activa SponsorBlock estableciendo un `SponsorBlockApiSettings` y declarando la capacidad `SPONSORBLOCK`:

```java
service.setSponsorBlockApiSettings(settings);   // apiUrl + per-category include flags
service.getSponsorBlockApiSettings();
```

Los ajustes llevan qué categorías quiere el usuario (`includeSponsorCategory`, `includeIntroCategory`, ...). Solo YouTube y BiliBili tienen una API: `sponsor.ajay.app` para YouTube, `bsbsb.top` para BiliBili.

## Cómo se obtienen los segmentos

SponsorBlock usa **k-anonimato**: el cliente nunca envía el id completo del vídeo. `SponsorBlockExtractorHelper.getSegments`:

1. calcula el hash del id del vídeo con SHA-256 (`Utils.toSha256`),
2. envía solo los primeros 4 caracteres hexadecimales como prefijo: `GET {apiUrl}/skipSegments/{prefix}?categories=[...]&actionTypes=[skip,poi]`,
3. recibe de vuelta segmentos de *todos* los vídeos que comparten ese prefijo, y conserva aquellos cuyo hash completo coincide.

Los tiempos vuelven en segundos y se convierten a milisegundos.

## Cuándo se ejecuta

`StreamInfo.getInfo` lanza la obtención en un hilo aparte en el momento en que empieza la extracción, y luego espera hasta unos tres segundos antes de devolver, para que un servidor lento de SponsorBlock nunca bloquee toda la extracción. El resultado aterriza en el `StreamInfo`:

```java
SponsorBlockSegment[] getSponsorBlockSegments();
void setSponsorBlockSegments(SponsorBlockSegment[] segments);
```

Así que los segmentos son de mejor esfuerzo: si la API está lenta o caída, el vídeo igualmente se reproduce, solo que sin saltos.
