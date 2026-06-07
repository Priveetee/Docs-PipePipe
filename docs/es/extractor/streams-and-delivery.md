# Flujos y delivery

`extractStreams` produce los formatos que consume el reproductor. El resultado no es una sola lista sino tres, y cada entrada describe tanto *qué* es el medio como *cómo* lo obtienes.

![Flujos y delivery](/diagrams/streams-and-delivery.png)

## Tres listas, no una

`StreamInfo` lleva el medio reproducible en tres listas separadas, más los subtítulos:

```java
List<VideoStream>     videoStreams;      // muxed: video + audio together
List<AudioStream>     audioStreams;      // audio only
List<VideoStream>     videoOnlyStreams;  // video with no audio track
List<SubtitlesStream> subtitles;
```

La separación es justo el objetivo. Los formatos progresivos envían una sola pista mezclada (muxed), eso es `videoStreams`. La reproducción adaptativa, en cambio, empareja un `videoOnlyStream` con un `audioStream` separado y deja que el reproductor elija cada uno de forma independiente según el ancho de banda. El extractor expone las tres para que el reproductor pueda escoger su propia combinación, en lugar de que el extractor decida por él.

## Qué es un `Stream`

Las tres extienden `Stream` (que es `Serializable`). Un `Stream` responde a dos preguntas.

**Qué es el medio:**

- `getFormat()` devuelve un `MediaFormat` (contenedor y códec, con un tipo MIME y un sufijo de archivo); `getFormatId()` para el id en bruto.
- `AudioStream` añade `averageBitrate`, el id / nombre / locale de la pista de audio, y el itag subyacente (`ItagItem`).
- `VideoStream` añade `resolution`, `fps`, ancho y alto, e `isVideoOnly`.

**Cómo obtenerlo:**

- `getDeliveryMethod()` devuelve un `DeliveryMethod`.
- `getContent()` junto con `isUrl()`: el contenido es o bien una URL directa (`isUrl == true`) o bien un blob de manifest en línea (`isUrl == false`), según el método de delivery; `getManifestUrl()` cubre el caso del manifest por URL.

Los flujos se comparan por método de delivery e id, no por URL (`equalStats` / `equals`). Las URLs de medio son efímeras y firmadas, así que sirven de poco como identidad.

## `DeliveryMethod`

```java
enum DeliveryMethod { PROGRESSIVE_HTTP, DASH, HLS, SS, TORRENT, SABR }
```

- **`PROGRESSIVE_HTTP`**: una URL de medio simple servida con GETs por rango de bytes. El caso sencillo.
- **`DASH` / `HLS` / `SS`**: un manifest adaptativo (una URL o un blob en línea); el reproductor conduce la selección de segmentos a partir de él.
- **`SABR`**: el protocolo de sesión de YouTube. No hay URL simple ni manifest estático: el cliente abre una sesión y sigue hablando con el servidor durante toda la reproducción.
- **`TORRENT`** existe por completitud y no se usa en la ruta de YouTube.

## Dónde se cruza esto con SABR

Para todos los métodos de delivery excepto SABR, el reproductor acaba con una URL o un manifest, y ExoPlayer se encarga del resto. SABR es la excepción. Un flujo SABR no es algo que descargas una vez; es una conversación que mantienes: petición, respuesta UMP, segmentos, petición de seguimiento, con la atestación regulando el acceso al medio protegido.

El trabajo del extractor termina al marcar el flujo como `SABR` y entregar las piezas que una sesión necesita. Conducir esa sesión es un tema aparte: la [Guía SABR](/es/developer-guide/introduction) completa.
