# Referencia de control parts

Parte de [SABR en el extractor](./sabr). Cada part UMP no-medio que el servidor puede enviar, con su id de part-type, sus campos proto, y lo que hace. Los números de campo vienen del `decode()` de cada clase; los nombres más allá de los obvios son reverse.

## Ritmo

### `SabrNextRequestPolicy` — id 35
Cómo y cuándo enviar el siguiente follow-up.

| # | Campo |
| --- | --- |
| 1 / 2 | target readahead audio / vídeo (ms) |
| 3 | max time since last request (ms) |
| 4 | **backoff** antes de la siguiente petición (ms) — el backoff autoritativo |
| 5 / 6 | min readahead audio / vídeo (ms) |
| 7 | playback cookie (también decodificado en `SabrPlaybackCookie`) |
| 8 | videoId |

Sin campo número-de-petición; el `rn` de la URL lo gestiona la sesión. El cookie hila el estado de sesión en la siguiente petición.

### `SabrPlaybackStartPolicy` — id 47
Readahead mínimo antes de arrancar / reanudar, condicionado por el ancho de banda. Campo 1 = políticas de start, campo 2 = políticas de resume; cada `ReadaheadPolicy` es `{1 minBandwidthBytesPerSecond, 2 minReadaheadMs}` ("bajo este ancho de banda, bufferiza al menos esto primero").

### `SabrRequestCancellationPolicy` — id 53
Cuándo deben cancelarse las peticiones en vuelo. Lleva una lista de items; el único sub-campo nombrado es `minReadaheadMs`.

### `SabrPrewarmConnection` — id 65
Pistas de precalentamiento de conexión. Decodificado estructuralmente, solo para diagnóstico.

## Protección

### `SabrStreamProtectionStatus` — id 58
| # | Campo |
| --- | --- |
| 1 | `status` (int bruto) |
| 2 | `maxRetries` |

El enum status **no** está nombrado en el código, solo un int bruto. Según la investigación del proyecto: `1` = OK/atestado (medio real), `3` = protección requerida (sin medio, mint un PO token); `2` es intermedio. `status >= 3` sin medio es la frontera de PO token sobre la que actúa la [sesión](./sabr-session).

## Navegación

### `SabrRedirect` — id 43
Campo 1 = la nueva URL de streaming. La sesión cambia `serverAbrStreamingUrl` y cuenta el hop (limitado a 3/sesión).

### `SabrSeek` — id 45
Seek iniciado por el servidor: `{1 seekMediaTime, 2 seekMediaTimescale, 3 seekSource}`. Tiempo real = `seekMediaTime / seekMediaTimescale`.

### `SabrReloadPlayerResponse` — id 46
La respuesta del player caducó. Tres niveles anidados, cada uno campo 1, hasta un string `reloadPlaybackParamsToken`. La sesión re-obtiene un `YoutubeSabrInfo` fresco y reanuda en el sitio (ver [el driver de sesión](./sabr-session)).

## Contexto

### `SabrContextUpdate` — id 57
Un blob con clave que el cliente debe **devolver** en el streamer context de peticiones posteriores.

| # | Campo |
| --- | --- |
| 1 | `type` (id de clave) |
| 2 | `scope` |
| 3 | `value` (bytes; decodificado en `SabrContextValue`) |
| 4 | `sendByDefault` |
| 5 | `writePolicy` (`1 = overwrite`, `2 = keep existing`) |

Al devolverlo, solo `{1 type, 2 value}` se re-codifican. `SabrContextValue` decodifica más la value en una timing info (`timestampMs`, `durationMs`) y una content info (`contentId`, `contentType`), más una longitud de firma.

### `SabrContextSendingPolicy` — id 59
Qué tipos de contexto empezar / parar / descartar de enviar: campo 1 start, campo 2 stop, campo 3 discard (cada uno un solo o una lista packed de ids `SabrContextUpdate.type`).

## Live

### `SabrLiveMetadata` — id 31
| # | Campo |
| --- | --- |
| 1 | broadcastId |
| 3 | `headSequenceNumber` (live edge; -1 si desconocido) |
| 4 | `headTimeMs` |
| 5 | wallTimeMs |
| 6 | videoId |
| 8 | `postLiveDvr` (live terminado, aún DVR-seekable) |
| 12 / 13 | min seekable time ticks / timescale |
| 14 / 15 | max seekable time ticks / timescale |

## Formatos

- **`SabrFormatInitializationMetadata`** — id 42: init por-formato (endSegmentNumber, mimeType, init/index ranges, duration units/timescale). Impulsa [el índice de segmentos](./sabr-media).
- **`SabrSelectableFormats`** — id 51: los `FormatId` de vídeo/audio que el servidor servirá.
- **`SabrFormatSelectionConfig`** — id 37: itags + una resolución que el servidor quiere que se pidan.

## Varios

- **`SabrError`** — id 44: `{1 type (string), 2 code}`. Fatal al round.
- **`SabrSnackbarMessage`** — id 67: `{1 id}`, un identificador de mensaje visible para el usuario.
- **`SabrRequestIdentifier`** — id 52: un token emitido por el servidor (campo 1) etiquetando el round; resumido solo por longitud, nunca impreso.

---

Volver al [overview](./sabr).
