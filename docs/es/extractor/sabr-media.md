# Medio, segmentos e índice

Parte de [SABR en el extractor](./sabr). Aquí: cómo bytes de medio dispersos se convierten en un segmento reproducible, y cómo un tiempo de reproducción se mapea a un número de segmento.

## Las parts de medio

El medio llega en tres tipos de part que trabajan juntos, correlacionados por un **header id** de un byte:

- **MEDIA_HEADER (20)** lleva un `SabrMediaHeader` y un `headerId`. Abre un buffer.
- **MEDIA (21)**: los payloads empiezan con ese byte `headerId`; el resto se añade al buffer correspondiente.
- **MEDIA_END (22)**: el primer byte del payload es el `headerId`; finaliza el buffer en un segmento.

Como el enrutado es por id, **audio y vídeo se entrelazan libremente** en una misma respuesta, cada id acumula independientemente.

### `SabrMediaHeader`

Decodificado del payload MEDIA_HEADER (números de campo proto):

| # | Campo |
| --- | --- |
| 1 | `headerId` (correlaciona MEDIA/MEDIA_END) |
| 3 | `itag` |
| 4 | `lastModified` |
| 6 | `startRange` (offset de byte) |
| 7 | `compressionAlgorithm` (0 ninguno, 1 gzip, 2 brotli) |
| 8 | `isInitSegment` |
| 9 | `sequenceNumber` |
| 11 / 12 | `startMs` / `durationMs` |
| 13 | `FormatId` anidado (fallback para itag/lastModified/xtags) |
| 14 | `contentLength` (longitud de bytes esperada en el cable) |
| 15 | `TimeRange` anidado (`startTicks`, `durationTicks`, `timescale`) |

Si `startMs`/`durationMs` faltan pero hay un `TimeRange`, se derivan: `ms = ticks · 1000 / timescale`.

## El collector

`SabrMediaSegmentCollector.collect(response)` reproduce las parts en orden, manteniendo un `Map<headerId, OpenSegment>`:

- MEDIA_HEADER → `openSegments.put(id, new OpenSegment(header))`.
- MEDIA → añade los bytes (offset 1..fin) al segmento abierto para ese id; **los bytes de un id desconocido/cerrado se descartan en silencio**.
- MEDIA_END → quita el id, finaliza, y emite, en orden de cierre.

Casos límite: un header que nunca recibe un MEDIA_END **queda abierto y nunca se emite** (sale como `missing-media-end` en el control de integridad, no como segmento parcial). El medio huérfano (sin header) se descarta.

**Length check, luego descompresión.** Al finalizar, si `contentLength >= 0` y el conteo de bytes acumulado difiere, throw `SabrProtocolException` (length mismatch). Este control corre sobre los bytes **comprimidos**, `contentLength` es la longitud en el cable. Luego `maybeDecompress` aplica gzip (`GZIPInputStream`) o brotli (`BrotliInputStream`) según `compressionAlgorithm`; cualquier otro que 0/1/2 throw.

`SabrMediaSegment` sostiene el header y los bytes (descomprimidos). Deliberadamente, el array de bytes **no** se copia defensivamente ni en la construcción ni en `getData()`, clonar segmentos 4K de varios MB duplicaba el pico de memoria y causaba OOM en cambios rápidos de formato, así que el array es inmutable por contrato.

`find(response, request)` lanza `collect` y luego devuelve el primer segmento cuyo header matchea la petición. `SabrSegmentRequest.matches` se basa en **(itag, flag init, número de secuencia)**, distinto del header-id interno usado para el stitching de bytes.

## El índice de segmentos

Para hacer seek, el extractor debe mapear un tiempo a un número de secuencia. El índice del contenedor del segmento init da el timing exacto por-segmento. `SabrFormatInitializationMetadata` (part type 42) provee lo necesario: `endSegmentNumber` (total segmentos), `mimeType` (selecciona el parser), `initRange`, `indexRange`, y `durationUnits`/`durationTimescale`.

### MP4: `SabrMp4SegmentIndexParser`

Parsea la box ISO-BMFF **`sidx`** dentro del index range:

1. Busca la box `"sidx"` en `[indexRangeStart, indexRangeEnd]`.
2. Lee la versión FullBox (0 o 1), salta los flags, salta el reference id.
3. Lee `timescale` (debe ser > 0).
4. Lee `earliest_presentation_time` (32-bit en v0, 64-bit en v1).
5. Itera `referenceCount` veces, cada referencia de 12 bytes: toma `subsegment_duration`; acumula el start actual; emite `Entry(seq=i+1, startMs, durationMs)` con `ms = ticks · 1000 / timescale` (redondeado). Las referencias sidx anidadas throw (no soportado).

Nota: solo se deriva el **tiempo**. El tamaño referenciado de 31-bit se lee pero se descarta, aquí no se producen offsets de byte por-segmento.

### WebM: `SabrWebmSegmentIndexParser`

Parsea Matroska/EBML: encuentra `Segment`, lee `TimecodeScale` (ns/tick, defecto 1 000 000) de `Info`, luego recorre `Cues` → `CuePoint` → `CueTime` dentro del index range. Cada cue time se vuelve un start de segmento (escalado a ms); cada duración es el hueco al siguiente cue (o la duración total / una extrapolación para el último). `CueTrackPositions` (offsets de byte) se ignora, de nuevo, solo tiempo.

### Lookup

`SabrSegmentIndex` es una lista 1-based de `Entry(sequenceNumber, startMs, durationMs)` con `getEndMs()`. El lookup tiempo→secuencia vive en el `FormatProgress` por-track de `YoutubeSabrStreamState`:

- `getSegmentStartMs(seq)` / `getSegmentEndMs(seq)` — entrada de índice si está presente, si no aritmética sobre `averageDurationMs`.
- `getSegmentNumberAtOrAfterTimeMs(timeMs)` — escaneo lineal de la primera entrada cuyo `endMs >= timeMs`; sin índice, `ceil(timeMs / averageDurationMs)`.

Ese fallback (`averageDurationMs`, derivado de duración total / número de segmentos) es por qué el seek funciona aún aproximadamente incluso antes de que se haya parseado un segmento init.

---

Siguiente: [El modelo buffered y el seek](./sabr-buffered).
