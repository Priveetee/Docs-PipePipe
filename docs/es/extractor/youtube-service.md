# Dentro del servicio de YouTube

YouTube es el servicio más grande y volátil, y el que con más probabilidad te llevará al código. Este es el mapa.

![Dentro del servicio de YouTube](/diagrams/youtube-service.png)

## Clientes InnerTube

Aquí no hay una API pública de YouTube. El extractor habla **InnerTube**, el RPC interno propio de YouTube, haciéndose pasar por clientes oficiales. Cada cliente es un bloque de contexto (nombre, versión, plataforma, dispositivo) más un endpoint. `YoutubeParsingHelper` los construye:

```java
prepareDesktopJsonBuilder(...)       // WEB
prepareAndroidVRJsonBuilder(...)     // ANDROID_VR (Oculus Quest)
prepareIosMobileJsonBuilder(...)     // IOS
prepareTvHtml5EmbedJsonBuilder(...)  // TVHTML5 embedded
prepareSafariJsonBuilder(...)        // WEB with a Safari user agent
```

Los ids y versiones de cliente viven en `ClientsConstants`. Las peticiones hacen POST a `youtubei/v1/<endpoint>` (`player`, `next`, `browse`, `search`) a través de `getJsonPostResponse` y sus variantes android/ios. Distintos clientes exponen distintos conjuntos de flujos y chocan con distintos muros, así que una sola obtención a menudo consulta varios y los fusiona, el reparto paralelo `CancellableCall` del [Flujo de extracción](./extraction-flow).

## Firmas y el parámetro `n`

YouTube protege las URLs de flujo de dos formas: una **firma** revuelta, y un **parámetro `n`** de throttling que lastra la velocidad de reproducción si no se transforma. La forma habitual de resolver ambos es descargar el `base.js` del player y ejecutar su JavaScript.

Este fork lo hace de otra manera, y es la mayor divergencia respecto a upstream. En lugar de ejecutar `base.js` en Rhino en el dispositivo, `YoutubeApiDecoder` delega la transformación a un servicio alojado por PipePipe:

```java
YoutubeApiDecoder.decodeSignature(playerId, sig);            // POST api.pipepipe.dev/decoder/decode
YoutubeApiDecoder.decodeThrottlingParameter(playerId, nParam);
```

`YoutubeJavaScriptPlayerManager` es la puerta de entrada (`getSignatureTimestamp`, `deobfuscateSignature`, `getUrlWithThrottlingParameterDeobfuscated`), con los resultados en caché. Rhino sigue siendo una dependencia, pero la ruta caliente es el decodificador remoto. Tenlo presente para escenarios sin conexión o de auto-alojamiento: el descifrado de las URLs de flujo depende de que ese servicio sea accesible.

## `ItagItem`: de itag a formato

YouTube identifica cada formato con un **itag** entero. `ItagItem` es la tabla de búsqueda: una lista estática que asigna a cada itag su `ItagType` (`AUDIO`, `VIDEO`, `VIDEO_ONLY`), `MediaFormat` y resolución/fps o bitrate. `getItag(id)` resuelve uno; el extractor de flujo lo usa para rellenar el códec, la resolución y los rangos de bytes init/index que necesita un manifiesto DASH.

## Creadores de manifiestos DASH

Algunos formatos de YouTube no llegan como un manifiesto listo, así que el paquete `dashmanifestcreators` sintetiza uno:

- **`YoutubeProgressiveDashManifestCreator`**: envuelve una URL progresiva como DASH usando rangos de bytes.
- **`YoutubeOtfDashManifestCreator`**: flujos de secuencia OTF ("on the fly"), obtenidos como `sq=0`, `sq=1`, ...
- **`YoutubePostLiveStreamDvrDashManifestCreator`**: directos finalizados (DVR).

`DeliveryType` (`PROGRESSIVE`, `OTF`, `LIVE`) selecciona cuál aplica.

## SABR

La ruta de delivery más reciente es **SABR**, el protocolo de sesión de YouTube, y tiene su propio paquete (`services/youtube/sabr`, decenas de clases: `YoutubeSabrSession`, `YoutubeSabrStreamState`, `YoutubeSabrRequestBuilder`, `SabrResponseDecoder`, `UmpReader`, ...). El extractor de flujo expone los formatos SABR; conducir la sesión es un tema en sí mismo. La [Guía SABR](/es/developer-guide/introduction) dedicada cubre ese protocolo de principio a fin.
