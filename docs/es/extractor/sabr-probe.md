# Iniciar una sesión

Parte de [SABR en el extractor](./sabr). El PipePipeExtractor actual mantiene
separados el análisis de la respuesta del player y el driver de la sesión de
medios. En el código actual ya no existe un `YoutubeSabrProbe` independiente ni
un enum de perfiles de cliente.

## De la respuesta del player a `YoutubeSabrInfo`

`YoutubeStreamExtractor.buildSabrInfoFromPlayerResponse(...)` es el punto de
entrada después de descargar la respuesta del player **MWEB** seleccionada.
Construye el objeto inmutable `YoutubeSabrInfo` que consume
`YoutubeSabrSession`:

1. Lee `streamingData`. Una respuesta sin ese objeto se rechaza como error de
   protocolo SABR.
2. Lee `serverAbrStreamingUrl`, `videoPlaybackUstreamerConfig`, los datos de
   visitante y `adaptiveFormats`.
3. Recoge las firmas y los parámetros `n` de las URLs de formatos adaptativos y
   del endpoint SABR. Si hay alguno, `YoutubeJavaScriptPlayerManager` hace una
   sola desofuscación por lotes y los valores resueltos vuelven a las URLs.
4. Convierte los formatos adaptativos en `YoutubeSabrInfo.Format` y conserva el
   PO token opcional del player si el llamador lo proporcionó.

`YoutubeSabrInfo` contiene el id del vídeo, CPN, versión del cliente, datos de
visitante, endpoint SABR resuelto, configuración ustreamer, PO token opcional y
la lista de formatos. Cada formato conserva su `ItagItem` analizado, tipo MIME,
metadatos relacionados con el códec, identidad de la pista de audio, indicador
DRC, URL/rango de inicialización y duración aproximada. La clase no expone
estado HTTP ni del decodificador.

## Crear peticiones

La sesión se crea así:

```java
YoutubeSabrSession session = new YoutubeSabrSession(info);
```

Un directorio de spool opcional permite ensamblar en disco los segmentos grandes
sin compresión. El llamador crea peticiones inmutables con
`YoutubeSabrRequest`:

```java
YoutubeSabrRequest preparation = YoutubeSabrRequest.preparation(
    playerTimeMs, preferredFormats);
YoutubeSabrRequest playback = YoutubeSabrRequest.playback(
    playerTimeMs, playbackRate, tracks);
```

`preparation` solicita las líneas temporales de los formatos sin declarar pistas
seleccionadas. `playback` declara una pista de audio, una de vídeo o solo una de
ellas, y puede llevar un `YoutubeSabrFormatTimeline` y el último número de
segmento almacenado para cada pista. Una petición no puede contener dos pistas
de audio, dos de vídeo ni el mismo itag como audio y vídeo.

## Enviar una petición

`YoutubeSabrSession.requestOnce(request, consumer)` realiza como máximo una
transacción HTTP. Devuelve el número de segmentos de medios completados, el
backoff del servidor y si la llamada se pospuso porque todavía estaba activo un
backoff anterior. La sesión incrementa el número de petición solo después de
leer una respuesta. `YoutubeSabrRequestHelper`:

- añade `alr=yes`, el `cpn` y el número de petición, empezando por cero, al
  endpoint SABR;
- codifica la petición como `VideoPlaybackAbrRequest`;
- envía el User-Agent y la localización MWEB;
- exige una respuesta `application/vnd.yt-ump`;
- lee las partes UMP en streaming con `SabrStreamingResponseReader`, para no
  guardar todo el cuerpo HTTP en memoria cuando el medio es grande;
- devuelve un `YoutubeSabrResponse` con los controles, estadísticas de medios y
  objetos `SabrMediaSegment` completados.

El consumer recibe un segmento en cuanto una parte `MEDIA_END` lo completa. Con
un directorio de spool, los segmentos grandes se pueden leer desde un archivo,
incluso progresivamente mientras se escribe, mediante
`SabrMediaSegment.openStream()`.

## Estado entre peticiones

`YoutubeSabrSession` conserva solo el estado del protocolo: número de petición,
URL SABR actual después de redirecciones, cookie de reproducción, contextos
SABR activos, PO token, estimación de ancho de banda, metadatos de directo y
contadores de diagnóstico limitados. Un `NEXT_REQUEST_POLICY` puede actualizar
la cookie y el backoff. Las actualizaciones de contexto y la política de envío
deciden qué valores opacos se repiten en las peticiones siguientes.

La sesión valida las redirecciones antes de aceptarlas: deben usar HTTPS y
seguir en `googlevideo.com` o uno de sus subdominios. Una respuesta con medios
reinicia el contador de redirecciones; los medios incompletos o malformados se
clasifican para una recuperación limitada.

Siguiente: [La petición](./sabr-request).
