# UMP y decodificación

Parte de [SABR en el extractor](./sabr). Aquí: el sobre UMP a nivel de byte, cada tipo de part que el decodificador conoce, y la respuesta decodificada.

## El framing UMP

El cuerpo de la respuesta es **UMP** (Ultra-Minimal Playback), el contenedor propio de YouTube, *no* protobuf a nivel del sobre (los payloads dentro de las parts son protobuf). `UmpReader` lo recorre como una secuencia de parts, en uno de dos modos:

- `readStreaming(InputStream, PartConsumer)`: lee una part (type, size, payload) a la vez directamente desde el flujo de red y la pasa a un consumer, para no tener nunca todo el body en memoria a la vez. El pico transitorio es el payload de una sola part en lugar de la respuesta entera (50-150 MB en 4K). Es el camino que usa la sesión para el decodificado en vivo (ver "Streamear el decodificado" más abajo).
- `readAll(byte[])`: recorre un único array en memoria y devuelve todas las parts como lista. Práctico para respuestas pequeñas y tests, pero necesita bufferizar todo el body primero.

![Layout de una part UMP](/diagrams/sabr-ump-layout.png)

Cada part es `[type: varint-UMP][size: varint-UMP][payload: size bytes]`, repetido hasta EOF (un EOF limpio en una frontera de part simplemente termina el bucle). Ninguno de los dos modos hace reensamblado cross-buffer *de una sola part*: los `size` bytes de una part se leen por completo antes de la siguiente, y un body truncado throw `SabrProtocolException`.

### El varint UMP

El varint de UMP *no* es el de protobuf. El número total de bytes lo decide los **bits altos del primer byte**:

| Primer byte | Total bytes | Valor |
| --- | --- | --- |
| `0x00–0x7F` (< 128) | 1 | el byte mismo |
| `0x80–0xBF` | 2 | `(b0 & 0x3f) + 64·b1` |
| `0xC0–0xDF` | 3 | `(b0 & 0x1f) + 32·(b1 + 256·b2)` |
| `0xE0–0xEF` | 4 | `(b0 & 0x0f) + 16·(b1 + 256·(b2 + 256·b3))` |
| `0xF0–0xFF` | 5 | los siguientes 4 bytes, little-endian (los bits de valor del primer byte se descartan) |

El resultado es un int con signo de 32-bit; el caso de 5 bytes puede overflow a negativo, lo que el guardia `type < 0 || size < 0` rechaza, ese es el tope práctico del tamaño de part.

`UmpPart` sostiene `type`, `size`, y `data`. `getData()` devuelve un clon defensivo; un `getRawData()` interno devuelve el array backing (usado en los hot paths de decodificación/stitch para evitar copiar segmentos de varios MB).

## Los tipos de part

`SabrResponseDecoder` despacha según el id de tipo de part. El conjunto completo que reconoce:

| ID | Constante | Decodificado en |
| --- | --- | --- |
| 10 | ONESIE_HEADER | `SabrOnesieHeader` (llevado a las parts onesie siguientes) |
| 11 | ONESIE_DATA | `SabrOnesieData` |
| 12 | ONESIE_ENCRYPTED_MEDIA | `SabrOnesieData` (cifrado) |
| 20 | MEDIA_HEADER | `SabrMediaHeader` |
| 21 | MEDIA | bytes de medio (1er byte del payload = header id) |
| 22 | MEDIA_END | cierra un header id |
| 31 | LIVE_METADATA | `SabrLiveMetadata` |
| 35 | NEXT_REQUEST_POLICY | `SabrNextRequestPolicy` (pone el backoff) |
| 37 | FORMAT_SELECTION_CONFIG | `SabrFormatSelectionConfig` |
| 42 | FORMAT_INITIALIZATION_METADATA | `SabrFormatInitializationMetadata` |
| 43 | SABR_REDIRECT | `SabrRedirect` |
| 44 | SABR_ERROR | `SabrError` |
| 45 | SABR_SEEK | `SabrSeek` |
| 46 | RELOAD_PLAYER_RESPONSE | `SabrReloadPlayerResponse` (pone reloadRequested) |
| 47 | PLAYBACK_START_POLICY | `SabrPlaybackStartPolicy` |
| 51 | SELECTABLE_FORMATS | `SabrSelectableFormats` |
| 52 | REQUEST_IDENTIFIER | `SabrRequestIdentifier` |
| 53 | REQUEST_CANCELLATION_POLICY | `SabrRequestCancellationPolicy` |
| 57 | SABR_CONTEXT_UPDATE | `SabrContextUpdate` |
| 58 | STREAM_PROTECTION_STATUS | `SabrStreamProtectionStatus` (pone status + maxRetries) |
| 59 | SABR_CONTEXT_SENDING_POLICY | `SabrContextSendingPolicy` |
| 65 | PREWARM_CONNECTION | `SabrPrewarmConnection` |
| 67 | SNACKBAR_MESSAGE | `SabrSnackbarMessage` |

Más ids conocidos-pero-no-parseados (30 CONFIG, 32–34 hints de live-metadata, 36/38 metadata ustreamer, 48–50 hints de caché/ancho de banda, 54–56, 60–64, 66) solo resumidos, y cualquier id desconocido registrado vía `addUnknownPartType`. Ver la [referencia de control parts](./sabr-control-parts) para qué hacen los ricos.

## El bucle de decodificación

![Pipeline de decodificación](/diagrams/sabr-extractor-decode.png)

`SabrResponseDecoder.decode` lee todas las parts primero, luego itera. El único estado llevado entre parts es el **header onesie actual** (un `ONESIE_HEADER` aplica a las parts de datos onesie que le siguen). Cada part se registra en orden, luego se despacha:

- **MEDIA_HEADER (20)** → decodifica y registra el header.
- **MEDIA (21)** → el 1er byte del payload es el **header id**; la longitud restante se acumula como conteo de bytes de medio de ese id.
- **MEDIA_END (22)** → 1er byte = header id, marca el id completo.
- control parts ricas → decodifica en el campo tipado de `SabrDecodedResponse` + un resumen humano.
- `NEXT_REQUEST_POLICY` tiene un trato especial: tras decodificar, el backoff se relee directamente del **campo 4** proto (varint) como `backoffTimeMs` autoritativo.

## Streamear el decodificado (el fix 4K)

`SabrResponseDecoder.decode(byte[])` lee todas las parts primero, así que todo el body queda en memoria; bien para rounds pequeños, pero pica a 50-150 MB en 4K y era la fuente del OOM 4K.

`SabrStreamingResponseReader.read(InputStream)` es la contraparte en streaming. Maneja `UmpReader.readStreaming` y ensambla los segmentos MEDIA al vuelo (vía `SabrMediaSegmentCollector.Incremental`), guardando solo las pequeñas control parts. Los grandes payloads `MEDIA` se vuelven segmentos a medida que llegan y nunca se retienen todos, así que el pico transitorio baja del body entero a un solo segmento en vuelo. Sigue contando los bytes de medio por header-id, así que el resultado pasa los mismos chequeos `getIntegrityIssues()` que el camino bufferizado sin retener los bytes, y devuelve un `Result` con los segmentos ensamblados más un `SabrDecodedResponse` construido desde las control parts.

## La respuesta decodificada

`SabrDecodedResponse` sostiene cada part en orden más accesores tipados: headers de medio, conteos de bytes de medio por header-id (`LinkedHashMap`, sumados), ids media-end, metadata format-init, live metadata, datos onesie, y las control parts únicas (redirect, seek, error, reload, next-request policy, status de protección + max retries, backoff ms, …).

Los helpers de análisis son sobre lo que la sesión ramifica:

- `hasMedia()` — algún header o byte de medio.
- `isNoMediaResponse()` — el inverso.
- `isPolicyOnlyResponse()` — sin medio pero con una next-request policy (un round de puro ritmo).
- `isProtectedNoMediaResponse()` — sin medio **y** `streamProtectionStatus >= 3`: la **frontera de PO token** (status 3 + sin medio = mint un token).
- `getIntegrityIssues()` — chequeos cruzados: `duplicate-media-header`, `missing-media`, `length-mismatch:expected=…:actual=…`, `missing-media-end`, `media-without-header`, `media-end-without-header`. La sesión trata cualquier resultado no vacío como fatal.

---

Siguiente: [Medio, segmentos e índice](./sabr-media).
