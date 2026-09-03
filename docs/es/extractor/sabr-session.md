# El driver de sesión

Parte de [SABR en el extractor](./sabr). `YoutubeSabrSession` conserva el estado
de una secuencia de transacciones SABR. No implementa el buffer del cliente ni
el decodificador de medios: envía peticiones, procesa los controles del
protocolo y entrega a su llamador los objetos `SabrMediaSegment` completados.

## Una transacción

`requestOnce(request, consumer)` realiza una petición, salvo que la respuesta
anterior haya pedido esperar. En ese caso devuelve un `RequestResult` aplazado y
no envía HTTP. En los demás casos:

1. Añade un evento de diagnóstico limitado y publica la petición codificada con
   `YoutubeSabrRequestHelper`.
2. Lee el cuerpo UMP en streaming mediante `SabrStreamingResponseReader`; los
   segmentos completados llegan al `consumer` en `MEDIA_END`.
3. Exige `application/vnd.yt-ump`, registra tiempos y contadores de bytes, e
   incrementa el número de petición después de leer la respuesta.
4. Procesa políticas, actualizaciones de contexto, metadatos de directo y
   redirecciones.
5. Devuelve el número de segmentos completados y el backoff pedido por el
   servidor.

El número de petición empieza en cero. Una redirección solo se acepta por HTTPS
y si permanece en `googlevideo.com` o uno de sus subdominios. Una respuesta con
medios reinicia el contador de redirecciones.

## Recuperación limitada

La implementación actual mantiene estos límites en la sesión:

| Límite | Valor | Efecto |
| --- | ---: | --- |
| Redirecciones en una sesión | 3 | Se rechaza una cuarta redirección. |
| Respuestas consecutivas con medios incompletos | 3 | Las longitudes incoherentes o partes `MEDIA_END` ausentes se reintentan y después fallan. |
| Respuestas consecutivas pendientes de atestación y sin medios | 3 | Una atestación que no avanza falla con `SabrAttestationException`. |
| Backoff del servidor | 30 000 ms | Se rechaza un backoff `NEXT_REQUEST_POLICY` mayor. |

`SabrRecoverableException` se usa para medios incompletos en streaming y E/S de
spool que se pueden reintentar. Los errores de protocolo, redirecciones
inválidas, errores SABR explícitos y requisitos de atestación no se silencian.
Una parte `RELOAD_PLAYER_RESPONSE` se entrega al llamador como error de
protocolo; renovar la respuesta del player es una decisión de la capa de
aplicación.

## Cookies, contextos y protección

`NEXT_REQUEST_POLICY` puede llevar una cookie de reproducción y un retraso. La
sesión conserva la cookie y la incluye en mensajes `streamerContext` posteriores.
Las actualizaciones SABR se guardan por tipo; la política de envío inicia,
detiene o descarta tipos para repetir solo valores activos.

Cuando el servidor informa del estado de protección `2` (atestación pendiente),
la sesión lo registra y tolera un número limitado de respuestas sin medios. El
estado `3` se expone como error de atestación requerida. El llamador puede
proporcionar un PO token ligado al contenido con `setPoToken`; la sesión guarda
una copia defensiva y el request helper lo incluye en el contexto streamer. El
mint del token queda fuera del extractor.

## Metadatos de directo y diagnósticos

`LIVE_METADATA` actualiza `isLive`, la secuencia y la marca temporal del live
edge, y el indicador DVR post-live. Se pueden consultar con `isLive()`,
`getLiveHeadSequenceNumber()`, `getLiveHeadTimeMs()` y `isPostLiveDvr()`.

Los diagnósticos están limitados y las trazas detalladas son opt-in.
`getDiagnosticTrace()` devuelve la cadena de eventos recientes;
`getMemoryDiagnosticSummary()` y `getTraceSnapshot()` exponen contadores de
respuestas, partes UMP, medios y segmentos sin volcar bytes de tokens o cookies.

Siguiente: [Referencia de control parts](./sabr-control-parts).
