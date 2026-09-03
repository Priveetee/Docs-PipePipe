# La petición

Parte de [SABR en el extractor](./sabr). `YoutubeSabrRequestHelper` codifica la
`YoutubeSabrRequest` inmutable como `VideoPlaybackAbrRequest` binario para
YouTube. Las etiquetas de abajo son los campos que emite el codificador actual.

## Ciclo de la petición

Hay dos fábricas públicas:

- `YoutubeSabrRequest.preparation(playerTimeMs, preferredFormats)` solicita datos
  de inicialización y líneas temporales sin declarar pistas activas;
- `YoutubeSabrRequest.playback(playerTimeMs, playbackRate, tracks)` declara las
  pistas de audio/vídeo activas y su posición almacenada.

Cada petición debe contener al menos una pista. No puede contener dos pistas de
audio, dos de vídeo ni el mismo itag como audio y vídeo. Una pista puede llevar
un `YoutubeSabrFormatTimeline` y el último número de segmento almacenado.

`YoutubeSabrRequestHelper` añade a la URL HTTP `alr=yes`, el CPN de sesión y
`rn=<requestNumber>`. `rn` empieza en cero y se sustituye en cada petición. El
body se envía como `application/x-protobuf`; la respuesta debe ser
`application/vnd.yt-ump`.

## Campos de nivel superior

| # | Wire | Contiene | Cuándo se emite |
| --- | --- | --- | --- |
| 1 | message | `clientAbrState` | Todas las peticiones |
| 2 | message | `formatId` seleccionado | Se incluye el estado de reproducción |
| 3 | message | `bufferedRange` | Una pista tiene timeline y segmento almacenado |
| 4 | varint | `playerTimeMs` de nivel superior | Se incluye el estado de reproducción |
| 5 | bytes | `videoPlaybackUstreamerConfig` decodificada | Todas las peticiones |
| 16 | message | `formatId` de audio preferido | Si existe formato de audio |
| 17 | message | `formatId` de vídeo preferido | Si existe formato de vídeo |
| 19 | message | `streamerContext` | Todas las peticiones |

El estado de reproducción se incluye en un seguimiento, con una posición no
nula o cuando hay rangos almacenados. Una preparación en la posición cero es el
cold start mínimo; aun así lleva la configuración ustreamer y los formatos
preferidos disponibles.

`formatId` es el mensaje anidado compartido por formatos seleccionados y
preferidos: el campo `1` es el itag, el campo `2` es `lastModified` cuando es
positivo y el campo `3` es `xtags` cuando no está vacío.

## `clientAbrState`

El codificador actual escribe estos campos:

| # | Significado |
| --- | --- |
| 18 / 19 | ancho/alto de vídeo, solo con estado de reproducción |
| 21 | resolución de vídeo, al menos 360 si existe vídeo |
| 23 | estimación de ancho de banda en seguimientos, o calculada con los bitrates activos |
| 28 | `playerTimeMs` |
| 34 | visibilidad (`1`) |
| 35 | velocidad de reproducción, por defecto `1.0` |
| 40 | modo de pistas (`1` solo audio, `2` solo vídeo, `0` ambas y omitido) |
| 46 | DRC activado si el formato de audio seleccionado es DRC |
| 69 | id de pista de audio seleccionada, si existe |

La información del cliente en `streamerContext` identifica MWEB (client id `2`),
la versión y la localización `en-US`/`US` que usa el helper.

## Rangos almacenados

Para una pista con timeline analizado y `bufferedThrough > 0`, el helper escribe
un rango con:

| Campo | Valor |
| --- | --- |
| `formatId` | itag, last-modified y xtags |
| `startTimeMs` | `0` |
| `durationMs` | final del último segmento almacenado |
| `startSegmentIndex` / `endSegmentIndex` | `1` / el segmento almacenado acotado |
| timescale de time-range | `1000` |

`YoutubeSabrFormatTimeline` se construye desde bytes de inicialización con el
parser de índices MP4 o WebM. Asocia secuencias con tiempos de inicio/fin y
asocia un tiempo solicitado con el primer segmento cuyo final queda después de
ese tiempo.

## `streamerContext`

El contexto contiene información del cliente y, opcionalmente:

- el PO token actual (campo `2`);
- la cookie de reproducción de `NEXT_REQUEST_POLICY` (campo `3`);
- valores SABR opacos activos (campo `5`);
- tipos de contexto que no se envían todavía (campo `6`).

Los payloads de tokens y cookies nunca se imprimen en los resúmenes de
diagnóstico.

## Wire format

`SabrProto` es el pequeño lector/escritor protobuf de los caminos de petición y
respuesta. Admite varints, fixed32, fixed64 y campos delimitados por longitud.
Un mensaje anidado es un array de bytes delimitado por longitud; los tags usan
`(fieldNumber << 3) | wireType`. Números de campo inválidos, wire types no
compatibles, entradas truncadas o longitudes demasiado grandes producen
`SabrProtocolException`.

Siguiente: [UMP y decodificación](./sabr-decoding).
