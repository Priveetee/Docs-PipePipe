# UMP y decodificación

Parte de [SABR en el extractor](./sabr). YouTube envuelve las respuestas SABR
en UMP (Ultra-Minimal Playback). Las tramas UMP no son protobuf; el payload de
la mayoría de las partes de control sí lo es y `SabrResponseDecoder` lo resume o
decodifica.

## Framing UMP

`UmpReader` lee una secuencia de partes:

```text
[type: UMP-varint][size: UMP-varint][payload: size bytes] ...
```

`readPayloadsUntil(InputStream, consumer)` lee una parte cada vez desde la red.
`readAll(byte[])` analiza un body ya almacenado, útil para respuestas pequeñas y
tests. Un EOF limpio en el límite de una parte termina el flujo; headers o
payloads truncados producen `SabrProtocolException`.

Los varints UMP eligen su longitud con los bits altos del primer byte:

| Primer byte | Bytes totales | Valor |
| --- | ---: | --- |
| `0x00–0x7F` | 1 | valor del byte |
| `0x80–0xBF` | 2 | `(b0 & 0x3f) + 64·b1` |
| `0xC0–0xDF` | 3 | `(b0 & 0x1f) + 32·(b1 + 256·b2)` |
| `0xE0–0xEF` | 4 | `(b0 & 0x0f) + 16·(b1 + 256·(b2 + 256·b3))` |
| `0xF0–0xFF` | 5 | siguientes cuatro bytes, little-endian |

`UmpReader.UmpPart` expone tipo, tamaño y payload. El acceso público a los datos
es defensivo; el decodificador streaming usa el array bruto internamente para
evitar copiar partes de medios grandes.

## Identificadores de partes

`SabrResponseDecoder` reconoce estos identificadores. Los controles complejos se
guardan como resúmenes o bytes brutos en `YoutubeSabrResponse`; no hay una clase
Java para cada parte.

| ID | Constante | Tratamiento actual |
| ---: | --- | --- |
| 10–12 | `ONESIE_*` | resumen genérico |
| 20 | `MEDIA_HEADER` | decodifica `SabrMediaHeader` |
| 21 | `MEDIA` | cuenta bytes por header id |
| 22 | `MEDIA_END` | cierra un header id |
| 30–34 | config/pistas de directo | resumen genérico |
| 35 | `NEXT_REQUEST_POLICY` | conserva policy y lee backoff del campo 4 |
| 36–38 | metadatos ustreamer | resumen genérico |
| 42 | `FORMAT_INITIALIZATION_METADATA` | decodifica metadatos generados |
| 43 | `SABR_REDIRECT` | conserva la URL de redirección |
| 44 | `SABR_ERROR` | resumen de tipo/código |
| 45 | `SABR_SEEK` | resumen genérico |
| 46 | `RELOAD_PLAYER_RESPONSE` | activa `reloadRequested` |
| 47–51 | controles de reproducción/formato | resumen genérico |
| 52–56 | controles de petición | resumen genérico |
| 57 | `SABR_CONTEXT_UPDATE` | conserva la actualización bruta |
| 58 | `STREAM_PROTECTION_STATUS` | decodifica estado y máximo de reintentos |
| 59–65 | controles de contexto/cache/conexión | resumen; 65 es prewarm |
| 66–67 | debug/snackbar | resumen genérico |

Los identificadores desconocidos se registran en el resumen de diagnóstico
limitado. Las partes de control malformadas se conservan como diagnóstico para
no descartar medios válidos de la misma respuesta.

## Rutas de decodificación

`SabrResponseDecoder.decode(byte[])` analiza primero todas las partes y luego las
despacha. La ruta normal de la aplicación usa
`SabrStreamingResponseReader.read(InputStream, consumer, startConsumer, spool)`:
mantiene en memoria las partes de control y entrega `MEDIA_HEADER`, `MEDIA` y
`MEDIA_END` a `SabrMediaSegmentCollector.Incremental`. Los segmentos se entregan
al completar `MEDIA_END`, sin mantener un body 4K entero en el heap.

Ambas rutas cuentan los bytes de medios por header id. Después,
`YoutubeSabrResponse.getIntegrityIssues()` detecta headers duplicados, medios
ausentes, longitudes diferentes, finales ausentes, medios sin header y finales
sin header. La sesión solo reintenta los casos clasificados como medios
incompletos dentro de su límite.

## La respuesta decodificada

`YoutubeSabrResponse` expone código HTTP y content type, partes UMP, segmentos
completados, metadatos de inicialización y directo, actualizaciones de contexto,
indicadores de redirección/error/reload, estado de protección, backoff, contadores
de bytes y resúmenes limitados. `summarizeForDiagnostics()` muestra estructura y
tamaños, no el contenido de PO tokens o cookies.

Siguiente: [Medios, segmentos e índice](./sabr-media).
