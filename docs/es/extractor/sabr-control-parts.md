# Referencia de control parts

Parte de [SABR en el extractor](./sabr). El servidor puede insertar partes de
control entre las partes de medios. `SabrResponseDecoder` reconoce sus ids
numéricos y conserva los campos que necesita `YoutubeSabrSession` o un resumen
estructural limitado. El código actual no define una clase Java para cada parte.

## Ritmo y protección

### `NEXT_REQUEST_POLICY` — id 35

El decodificador conserva la policy bruta y lee su campo `4` como backoff en
milisegundos. `YoutubeSabrSession` también lee el campo `7` como cookie de
reproducción. Un backoff mayor de 30 000 ms se rechaza; un retraso válido aplaza
la siguiente llamada `requestOnce` sin enviar HTTP.

### `STREAM_PROTECTION_STATUS` — id 58

| # | Campo |
| --- | --- |
| 1 | estado de protección bruto |
| 2 | máximo de reintentos indicado por el servidor |

El estado se conserva deliberadamente como entero. El estado `2` se expone como
atestación pendiente y el `3` como atestación requerida. El llamador puede fijar
un PO token ligado al contenido con `YoutubeSabrSession.setPoToken(...)`.

## Navegación y estado del player

### `SABR_REDIRECT` — id 43

El campo `1` es la URL de streaming sustituta. La sesión solo acepta URLs HTTPS
en `googlevideo.com` o sus subdominios y limita las redirecciones a tres por
sesión.

### `SABR_SEEK` — id 45

La parte se conserva como resumen estructural. El extractor actual no aplica por
sí mismo un seek iniciado por el servidor; la aplicación decide cómo reconstruir
un `YoutubeSabrRequest`.

### `RELOAD_PLAYER_RESPONSE` — id 46

El decodificador activa `reloadRequested`. `YoutubeSabrSession` lo entrega como
error de protocolo; obtener una nueva respuesta del player y crear un nuevo
`YoutubeSabrInfo` es una recuperación de la aplicación.

### `PLAYBACK_START_POLICY` — id 47

Se conserva como resumen estructural y no cambia directamente el resultado de
`requestOnce` en el extractor.

## Contextos y metadatos de directo

### `SABR_CONTEXT_UPDATE` — id 57

La sesión analiza los campos necesarios:

| # | Campo |
| --- | --- |
| 1 | tipo de contexto |
| 3 | bytes del valor opaco |
| 4 | enviar por defecto |
| 5 | política de escritura |

Los valores se guardan por tipo. `SABR_CONTEXT_SENDING_POLICY` (id 59) añade,
retira o descarta tipos mediante los campos `1`, `2` y `3`; los valores activos se
repiten en mensajes `streamerContext` posteriores.

### `LIVE_METADATA` — id 31

La sesión consume actualmente:

| # | Significado |
| --- | --- |
| 3 | secuencia del live edge |
| 4 | tiempo del live edge en milisegundos |
| 8 | indicador DVR post-live |

Recibir esta parte marca la sesión como directo. Los valores se consultan con
`isLive()`, `getLiveHeadSequenceNumber()`, `getLiveHeadTimeMs()` y
`isPostLiveDvr()`.

## Controles de formatos y medios

- `FORMAT_INITIALIZATION_METADATA` (id 42) se decodifica en
  `SabrFormatInitializationMetadata` y proporciona rangos de inicialización e
  índice;
- `MEDIA_HEADER`, `MEDIA` y `MEDIA_END` (ids 20–22) los ensambla
  `SabrMediaSegmentCollector`, como se explica en [Medios, segmentos e
  índice](./sabr-media);
- `FORMAT_SELECTION_CONFIG` (37), `SELECTABLE_FORMATS` (51), partes onesie
  (10–12), controles de petición (52–56), pistas de cache/ancho de banda
  (48–50, 60–66) y `SNACKBAR_MESSAGE` (67) se resumen para diagnóstico.

### `SABR_ERROR` — id 44

Los campos `1` (tipo de texto) y `2` (código numérico) aparecen en el resumen de
respuesta y hacen que la sesión lance un error de protocolo.

Las partes desconocidas o malformadas se conservan como diagnóstico limitado,
para que los medios válidos de la misma respuesta sigan las comprobaciones de
integridad.

Volver a [la vista general](./sabr).
