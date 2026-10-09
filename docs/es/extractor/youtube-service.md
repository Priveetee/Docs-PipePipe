# Dentro del servicio de YouTube

YouTube es el servicio más grande y volátil, y el que con más probabilidad te llevará al código. Este es el mapa.

![Dentro del servicio de YouTube](/diagrams/youtube-service.png)

## Clientes InnerTube

Aquí no hay una API pública de YouTube. El extractor habla **InnerTube**, el
RPC interno propio de YouTube, enviando el contexto que espera un cliente
oficial. Ese contexto contiene nombre/versión, plataforma o dispositivo, idioma,
país y endpoint.

Las rutas actuales del reproductor se seleccionan en `YoutubeStreamExtractor`:

```java
fetchVisionOsJsonPlayer(...)       // ruta VisionOS anónima
fetchMwebJsonPlayer(...)           // respuesta MWEB; SABR para VOD normal
fetchWebJsonPlayer(...)            // respuesta WEB usada internamente
fetchConfiguredJsonPlayer(...)     // fallbacks TVHTML5 internos
```

La aplicación Android muestra actualmente **VisionOS** y **MWEB (SABR)** sin
sesión, y mantiene las sesiones iniciadas en **MWEB (SABR)**. La antigua opción
Android VR ya no forma parte del cliente actual. `web`, `tv_simply` y
`tv_downgraded` siguen siendo nombres de implementación o fallback, no opciones
visibles; la ruta TV downgraded también tiene un tratamiento especial para
directos/HLS.

### La retirada de VisionOS

**VisionOS** es el endpoint por defecto en modo anónimo. El cliente Android lo
elige cuando no hay cookies guardadas, y **MWEB (SABR)** en cuanto existe una
sesión (`App.reconcileYoutubePlayerClient` en PipePipeClient). Durante mucho
tiempo fue la ruta que funcionaba sin cuenta; YouTube está retirándola.

Lo que falla son las peticiones de medios, no la extracción. La respuesta del
player se sigue leyendo y sigue listando formatos; es un chunk de medios más
tarde en la reproducción el que vuelve con HTTP 403. En los informes de
usuarios aparece como **Source error**, `ERROR_CODE_IO_BAD_HTTP_STATUS` y, casi
siempre, una parada hacia 0:59.

Las respuestas de los mantenedores desde septiembre de 2026 dan la misma
indicación: cambiar **Ajustes → Avanzado → Endpoint de extracción de YouTube** a
**MWEB (SABR)**
([#2931](https://github.com/InfinityLoop1308/PipePipe/issues/2931),
[#2935](https://github.com/InfinityLoop1308/PipePipe/issues/2935),
[#2992](https://github.com/InfinityLoop1308/PipePipe/issues/2992)). MWEB es
además la única ruta que construye flujos SABR, así que es la que sigue
recibiendo trabajo. No es gratis: MWEB necesita que `googleapis.com` y
`google.com` sean accesibles para el token proof-of-origin, así que un filtrado
DNS lo rompe de otra forma.

Un detalle útil al leer el código: `NewPipe.setYoutubePlayerClient()` solo acepta
`mweb`, `visionos` y el valor interno `tv_downgraded`. Cualquier otro valor,
incluida una preferencia que dejó una versión antigua, recae en `visionos`.

Los ids y versiones de cliente viven en `ClientsConstants` y los helpers de
peticiones. Las peticiones hacen POST a `youtubei/v1/<endpoint>` (`player`,
`next`, `browse`, `search`) a través de los helpers JSON correspondientes.
Distintos clientes exponen distintos conjuntos de flujos y chocan con distintos
muros, así que una obtención suele consultar varias respuestas y fusionarlas,
mediante el reparto paralelo `CancellableCall` del [Flujo de extracción](./extraction-flow).

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

La ruta de delivery más reciente es **SABR**, el protocolo de sesión de YouTube,
y tiene su propio paquete (`services/youtube/sabr`, incluidos
`YoutubeSabrSession`, `YoutubeSabrRequest`, `YoutubeSabrRequestHelper`,
`YoutubeSabrResponse`, `SabrResponseDecoder` y `UmpReader`). En el extractor
actual, MWEB usa el constructor de flujos SABR para vídeos normales no emitidos
en directo cuando la respuesta del reproductor contiene datos SABR; los directos
y post-directos pueden usar HLS u otros formatos directos. El extractor de flujo
expone los formatos SABR y el driver de sesión devuelve segmentos de medios
completados. La [Guía SABR](/es/developer-guide/introduction) dedicada cubre ese
protocolo de principio a fin.
