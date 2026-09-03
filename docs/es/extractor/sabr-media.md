# Medios, segmentos e índice

Parte de [SABR en el extractor](./sabr). Una respuesta SABR transporta medios en
partes UMP separadas. El extractor las correlaciona con un identificador de
header de un byte, comprueba las longitudes, descomprime cuando corresponde y
expone objetos `SabrMediaSegment` completados.

## Partes de medios

- **`MEDIA_HEADER` (20)** lleva un `SabrMediaHeader` y abre un segmento;
- **`MEDIA` (21)** empieza con el byte del header id y añade el resto al segmento;
- **`MEDIA_END` (22)** empieza con el header id y cierra el segmento.

Audio y vídeo pueden entrelazarse libremente porque cada header abierto tiene su
propio acumulador.

### `SabrMediaHeader`

El decodificador actual lee estos campos:

| # | Campo |
| ---: | --- |
| 1 | header id |
| 2 | id del vídeo |
| 3–5 | itag, last-modified, xtags |
| 6 | offset inicial |
| 7 | compresión (`0` ninguna, `1` gzip, `2` brotli) |
| 8 | indicador de segmento de inicialización |
| 9 | número de secuencia |
| 10 | bitrate en bits por segundo |
| 11–12 | inicio y duración en milisegundos |
| 13 | `FormatId` anidado de respaldo |
| 14 | longitud esperada en el wire |
| 15 | time range anidado (ticks y timescale) |
| 16 | last-modified de la secuencia |

Si faltan los valores en milisegundos pero el time range tiene timescale
positiva, el decodificador los calcula como `ticks * 1000 / timescale`.

## Ensamblaje y descompresión

`SabrMediaSegmentCollector.collect(response)` reproduce una respuesta ya
almacenada. La ruta streaming usa `Incremental`, recibe las partes a medida que
llegan y emite un segmento en `onMediaEnd`. Los medios de un header desconocido o
ya cerrado se descartan; un header sin `MEDIA_END` no se emite.

Antes de descomprimir, el collector compara `contentLength` con los bytes
recibidos en el wire. Después aplica gzip o brotli según el header. Algoritmos no
compatibles, desbordamientos, payloads truncados y fallos de descompresión se
notifican como errores de protocolo o recuperables.

`SabrMediaSegment` puede guardar bytes descomprimidos en memoria o usar un
archivo de spool. Para segmentos grandes sin compresión, el collector
incremental puede proporcionar un segmento progresivo respaldado por archivo;
usa `openStream()` en vez de copiarlo de nuevo con `getData()`.

## Inicialización y líneas temporales

`FORMAT_INITIALIZATION_METADATA` (parte 42) describe los rangos de inicialización
e índice de un formato. El cliente obtiene el rango de inicialización con
`YoutubeSabrRequestHelper.fetchInitializationData(...)` y analiza los bytes con
`YoutubeSabrFormatTimeline.parse(...)`:

- `SabrMp4SegmentIndexParser` lee una caja ISO-BMFF `sidx` y convierte cada
  duración de subsegmento a milisegundos;
- `SabrWebmSegmentIndexParser` lee `Cues` Matroska/EBML y obtiene la duración de
  cada segmento desde el cue siguiente o la duración del formato.

`SabrSegmentIndex` es una lista 1-based de entradas con número de secuencia,
inicio, duración y fin calculado. `YoutubeSabrFormatTimeline` asigna secuencias
a rangos de tiempo y un tiempo solicitado al primer segmento cuyo final queda
después de ese tiempo.

El extractor actual ya no contiene las antiguas clases `SabrSegmentRequest` ni
`YoutubeSabrStreamState`. La selección de segmentos y la política de rangos
almacenados corresponden al llamador que construye `YoutubeSabrRequest`.

Siguiente: [El driver de sesión](./sabr-session).
