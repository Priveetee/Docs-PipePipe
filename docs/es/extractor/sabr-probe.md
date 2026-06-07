# Iniciar una sesión

Parte de [SABR en el extractor](./sabr). Aquí: cómo se arranca una sesión a partir de una respuesta del player, las identidades de cliente que puede vestir, y el modelo de formatos.

## Dos puntos de entrada

Hay dos caminos de código SABR distintos, y vale la pena separarlos de entrada:

- **El listado de flujos del extractor.** `YoutubeStreamExtractor.buildSabrStreams()` lee `streamingData`, y por cada formato adaptativo emite un `AudioStream` / `VideoStream` con `DeliveryMethod.SABR` (content = `serverAbrStreamingUrl`, `isUrl=false`). Es lo que devuelve `getStreams()`. El `ItagItem` de cada flujo lleva el init range y el index range. Un flag temporal `FORCE_SABR_FOR_TESTING` enruta todo vídeo no-live por SABR; desactivado, SABR solo se usa para respuestas SABR-only sin manifiesto HLS.
- **El driver de sesión.** `YoutubeSabrProbe` + `YoutubeSabrSession` y compañía forman un driver autónomo que de verdad *reproduce* un flujo SABR. El cliente lo construye y lo bombea; el trabajo del extractor es solo exponer que los flujos existen y proveer un `SabrPoTokenProvider`.

El resto de esta sección trata del segundo camino.

## El probe

`YoutubeSabrProbe` es una utility estática. `fetchSabrInfo(...)` construye un `YoutubeSabrInfo`:

1. Generar un `cpn` (content-playback nonce).
2. POST de la petición InnerTube `player` (`fetchPlayerResponse`) para el `YoutubeSabrClientProfile` elegido.
3. Leer `streamingData`; throw `SabrProtocolException` si falta.
4. Tomar `serverAbrStreamingUrl` y **desofuscar su parámetro `n`** vía el player JS (`maybeDeobfuscateNParameter`), manejando las formas `?n=` y `/n/`.
5. Extraer la **ustreamer config** (`playerConfig.mediaCommonConfig.mediaUstreamerRequestConfig.videoPlaybackUstreamerConfig`), un blob opaco devuelto en cada petición.
6. Extraer `visitorData` (override o `responseContext.visitorData`).
7. Construir los `YoutubeSabrFormat` a partir de `streamingData.adaptiveFormats`.

El body de la petición player (`createPlayerBody`) es una llamada InnerTube normal con algunas piezas SABR: `playbackContext.contentPlaybackContext.signatureTimestamp` (del player JS), `cpn`, `videoId`, `contentCheckOk`, y, si está disponible, un PO token de *player* en `serviceIntegrityDimensions.poToken` (distinto del PO token de *medio* usado después).

### `YoutubeSabrInfo`

Inmutable, el estado raíz de la sesión: `profile`, `videoId`, `cpn`, `clientVersion`, `visitorData`, `serverAbrStreamingUrl`, `videoPlaybackUstreamerConfig`, y la lista `formats`. Helpers de selección: `findBestAudioFormat()` (máx bitrate), `findBestVideoFormat()` (máx altura), `findFormatByItag(itag)`. (Sin campo de duración, la duración es por-formato vía `approxDurationMs`; sin campo de PO token, viene del provider.)

## Los client profiles

`YoutubeSabrClientProfile` es la identidad InnerTube con la que sale la petición. El servidor adapta formatos, headers y comportamiento.

| Profile | clientName | id | clientVersion | web-like |
| --- | --- | --- | --- | --- |
| `WEB` | WEB | 1 | 2.20250122.04.00 (resuelto live) | no |
| `WEB_EMBEDDED` | WEB_EMBEDDED_PLAYER | 56 | 1.20250121.00.00 | sí |
| `ANDROID` | ANDROID | 3 | 21.03.36 | no |
| `ANDROID_VR` | ANDROID_VR | 28 | 1.65.10 | no |
| `IOS` | IOS | 5 | 19.45.4 | no |
| `TVHTML5` | TVHTML5 | 7 | 7.20250923.13.00 | sí |
| `SAFARI_WEB` | WEB | 1 | 2.20260114.08.00 | no* |

Cada profile lleva también un nombre/versión de OS y un User-Agent donde es relevante. `WEB` resuelve su versión live (`YoutubeParsingHelper.getClientVersion()`), con fallback a la constante. `SAFARI_WEB` reutiliza el nombre/id `WEB` pero se trata como web-like vía checks explícitos `WEB || SAFARI_WEB`. Android/iOS van al host InnerTube gapis y añaden `X-Goog-Api-Format-Version: 2`; los profiles web-like añaden `Origin`/`Referer`/`X-YouTube-Client-*` y las cookies.

## Postear una petición de medio

`postMediaRequest` es el POST SABR real:

- URL = `withSabrSessionParameters(serverAbrStreamingUrl, cpn, requestNumber)`, que garantiza `alr=yes` y `cpn=...` y pone `rn=<requestNumber + 1>` (el `rn` de la URL es 1-based).
- Headers (`buildSabrHeaders`): `Accept: application/vnd.yt-ump`, User-Agent del profile; no-web añade `X-Goog-Visitor-Id`; web-like cambia a `Accept: */*` + `Origin`/`Referer` de navegador.
- El body es el protobuf `VideoPlaybackAbrRequest` (ver [La petición](./sabr-request)).
- La respuesta **debe** tener `Content-Type: application/vnd.yt-ump`, si no `SabrProtocolException`. Se decodifica con `SabrResponseDecoder` en un `SabrDecodedResponse`, envuelto en un `YoutubeSabrProbeResult` (info + decoded + código HTTP + longitud del body + content type).

## Los formatos

`YoutubeSabrFormat` es un formato adaptativo: `itag`, `lastModified`, `xtags`, `mimeType` (el codec está dentro), `audioTrackId`, `qualityLabel`, `audioQuality`, `drc`, `width`, `height`, `bitrate`, `contentLength`, `approxDurationMs`. `isAudio()`/`isVideo()` testean el mime type. `fromAdaptiveFormats` parsea el array JSON (los campos largos como `contentLength` se serializan como strings, así que `parseLong` es tolerante).

Dos control parts enviadas por el servidor refinan la selección en runtime: `SabrSelectableFormats` (los `FormatId` de vídeo/audio que el servidor servirá, incluyendo variantes "wrapped") y `SabrFormatSelectionConfig` (los itags + una resolución que el servidor quiere que se pidan).

## Onesie

Las parts "onesie" (`SabrOnesieHeader` / `SabrOnesieData` / `SabrOnesieInnertubeResponse`) permiten al servidor incluir en línea una respuesta player InnerTube entera (tipo `0 = ONESIE_PLAYER_RESPONSE`) o medio/claves dentro del flujo SABR, para que un cliente pueda saltarse una llamada `player` aparte. El decodificador aquí las lee con prudencia (claro, gzip-o-bruto, sin material de cifrado) y sobre todo para diagnóstico, pero es el mecanismo que hace que una respuesta SABR sea autosuficiente.

---

Siguiente: [La petición](./sabr-request).
