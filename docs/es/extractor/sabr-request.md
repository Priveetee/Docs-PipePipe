# La petición

Parte de [SABR en el extractor](./sabr). Aquí: el `VideoPlaybackAbrRequest` binario que codifica `YoutubeSabrRequestBuilder`, campo por campo, más el wire format debajo.

> Los *nombres* de campos abajo son las etiquetas reverse-engineered del proyecto (sobre todo vía el field map de `SabrRequestDumper`). Los *números* de campos y wire types se toman tal cual del codificador.

## El mensaje top-level

`buildFirstMediaRequest` (cold start) y `buildFollowUpMediaRequest` escriben estos campos top-level:

| # | Wire | Lleva | 1ª pet | Follow-up |
| --- | --- | --- | --- | --- |
| 1 | message | `clientAbrState` (ver abajo) | sí (playerTime=0) | sí |
| 2 | message | `formatId` seleccionado (uno por track) | no | sí |
| 3 | message | `bufferedRange` (repetido) | no | sí |
| 4 | varint | `playerTimeMs` top-level | no | sí (gated) |
| 5 | bytes | ustreamer config (base64-decodificado) | sí | sí |
| 16 | message | `formatId` **audio** preferidos (repetido) | sí | sí |
| 17 | message | `formatId` **vídeo** preferidos (repetido) | sí | sí |
| 19 | message | `streamerContext` (ver abajo) | sí | sí |

`formatId` es un pequeño sub-mensaje usado dondequiera que se nombre un formato: `#1 itag` (int32), `#2 lastModified` (uint64, solo si > 0), `#3 xtags` (string, solo si no vacío).

Así que **cold start vs follow-up** difiere en: un cold start no tiene formatos seleccionados, ni buffered ranges, ni player time top-level, y `playerTimeMs = 0`; no lleva todavía cookie de sesión ni PO token. El flag follow-up también desbloquea los campos `clientAbrState` condicionales de abajo. Toda la progresión de sesión, player time, buffered ranges, formatos seleccionados, cookie, PO token, contextos activos, se lee de `YoutubeSabrStreamState`.

## `clientAbrState` (campo 1)

El sub-mensaje más rico. El núcleo siempre escrito:

| # | Wire | Significado |
| --- | --- | --- |
| 28 | uint64 | `playerTimeMs` |
| 21 | int32 | sticky resolution (`max(videoHeight, 360)` o un override) |
| 34 | int32 | visibility |
| 35 | fixed32 | playback rate (defecto `1.0`) |
| 40 | int32 | enabled track types bitfield (escrito solo si ≠ 0; `0 = VIDEO_AND_AUDIO`, `1 = AUDIO_ONLY`, `2 = VIDEO_ONLY`) |
| 46 | bool | DRC enabled (solo si el formato de audio es DRC) |
| 69 | string | audio track id (si lo hay) |

Las adiciones follow-up / "official web" incluyen `#16` última resolución manual, `#18`/`#19` ancho/alto del viewport, `#23` estimación de ancho de banda (valor de estado, si no `(audioBitrate + videoBitrate) * 2`, si no -1). Cuando el profile imita al cliente web oficial, un bloque extra (`#29` time-since-last-seek, `#36` elapsed wall time, `#39` time-since-last-action, `#58` preferVp9=false, `#59` AV1 quality threshold, `#72` quality constraints, `#79` playback authorization, …) se rellena con las constantes características del cliente web para que la petición sea indistinguible de un navegador real.

## Buffered ranges (campo 3)

Cada `SabrBufferedRange.toProto()`:

| # | Wire | Campo |
| --- | --- | --- |
| 1 | message | `formatId` |
| 2 | uint64 | `startTimeMs` |
| 3 | uint64 | `durationMs` |
| 4 | int32 | `startSegmentIndex` |
| 5 | int32 | `endSegmentIndex` |
| 6 | message | time range (solo si activado): `#1 startTimeMs`, `#2 durationMs`, `#3 timescale` |

`SabrBufferedRange.full(format)` es el range "lo tengo todo" (`startTimeMs=0`, todo lo demás a `Integer.MAX_VALUE`), para declarar un track totalmente bufferizado. Cómo se calculan los ranges reales es el tema del [modelo buffered](./sabr-buffered).

## Streamer context (campo 19)

| # | Wire | Lleva |
| --- | --- | --- |
| 1 | message | `clientInfo` |
| 2 | bytes | **PO token** (solo si está presente) |
| 3 | bytes | **playback cookie** (solo si está presente) |
| 5 | message | `SabrContextUpdate` activos (repetido) |
| 6 | int32 | tipos de contexto SABR no enviados (repetido) |

`clientInfo` lleva el client id (`#16`), la versión (`#17`), nombre/versión de OS (`#18`/`#19`), y `Accept-Language`/región (`#21`/`#22`); en modo official-web la forma cambia un poco (campo 1 = `"en_US"`, campo 18 = `"X11"`).

## El wire format (`SabrProto`)

Un writer/reader protobuf hecho a mano. Wire types: `VARINT=0`, `FIXED64=1`, `LENGTH_DELIMITED=2`, `FIXED32=5`. Un tag de campo es `varint((fieldNumber << 3) | wireType)`. Los varints son LEB128 estándar (7 bits/byte, bit alto = continuar). `writeMessage` es solo un `writeBytes` length-delimited (un sub-mensaje son bytes). `writeInt32` pasa por `writeUInt64` con extensión de signo, así que un int negativo se vuelve un varint de 10 bytes. El lado de lectura (`readFields`, `Cursor`) es sobre lo que se construye cada `Sabr*.decode()`.

`SabrRequestDumper` re-decodifica un body de petición terminado en un resumen de una línea sanitizado para diagnóstico, PO token, cookie, ustreamer config y audio-track id se reducen a contadores de bytes, nunca se imprimen.

## Cold-start PO token

`SabrColdStartPoToken` sintetiza un token placeholder para el primer contacto: un header de 8 bytes (2 bytes de clave aleatoria, un byte de estado de cliente, un timestamp epoch-segundos big-endian) más el identificador, length-prefijado como campo protobuf 4, luego ofuscado con un XOR rodante de clave de 2 bytes. `MAX_IDENTIFIER_BYTES = 118`. Es una ofuscación determinista, no un token atestado; un token real ligado al contenido sigue viniendo del [provider de PO token](./sabr-session).

---

Siguiente: [UMP y decodificación](./sabr-decoding).
