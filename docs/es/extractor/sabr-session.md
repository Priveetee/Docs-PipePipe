# El driver de sesión

Parte de [SABR en el extractor](./sabr). `YoutubeSabrSession` es la máquina de estados que convierte el protocolo en un flujo de segmentos reproducibles. Posee los formatos de audio + vídeo elegidos, el `YoutubeSabrStreamState`, la caché de segmentos, los contadores, y un `SabrPoTokenProvider` opcional.

## Una ronda

![Una ronda SABR](/diagrams/sabr-extractor-round.png)

El POST crudo es `fetchNextResponse`: la petición 0 es el cold start (`YoutubeSabrProbe.probeFirstMediaResponse`), las siguientes son follow-ups que llevan el estado. Cada resultado se chequea por un redirect (contado, limitado, luego la URL de streaming se cambia) y `requestNumber` se incrementa.

## Dos bucles de conducción

- **`pumpOnce(localization)`** es el avance lenient conducido por el servidor: una petición, ingest, collect, cache, aplica la policy, devuelve los segmentos que llegaron (posiblemente ninguno). El cliente lo llama en bucle para mantenerse bufferizado por delante. Una sola ronda `status=3` o policy-only *no* es fatal aquí, el watchdog de stall del cliente es el verdadero give-up.
- **`fetchSegment(request, localization)`** es el camino estricto para "necesito exactamente este segmento": cache hit devuelve de inmediato, si no hace bucle hasta `MAX_REQUESTS_PER_SEGMENT`, tolera un número acotado de rondas policy-only, maneja reload/protección/redirect, hasta que el objetivo esté en caché o throw.

### `pumpOnce`, paso a paso

1. `fetchNextResponse` (POST, manejo de redirect, `requestNumber++`).
2. Si `getIntegrityIssues()` no vacío → throw.
3. `streamState.ingest(decoded)` (cookie, ranges, policy, live, contextos).
4. `SabrMediaSegmentCollector.collect(decoded)`.
5. Por cada segmento: ingest en el estado, mete en caché; si es nuevo y no init, append a `cacheOrder` y suma a `cachedBytes`.
6. `evictCacheIfNeeded()`.
7. Si hay un `SabrError` presente → throw.
8. Si reload solicitado → `maybeReload`; éxito → devuelve vacío (el pump volverá a llamar), si no throw.
9. Si `isProtectedNoMediaResponse()` (status 3) → PO token best-effort, sin throw.
10. Si llegaron segmentos → reset de los contadores de redirect y token-refresh (una respuesta con medio prueba que el token funciona y que los hops CDN son normales, así que las sesiones largas no se limitan).
11. Si se solicitó un backoff → sleep.

## Constantes (los límites)

Cada modo de fallo está acotado:

| Constante | Valor | Propósito |
| --- | --- | --- |
| `MAX_REQUESTS_PER_SEGMENT` | 16 | intentos para obtener un segmento concreto |
| `MAX_POLICY_ONLY_RESPONSES_PER_SEGMENT` | 3 | rondas sin medio consecutivas toleradas por segmento |
| `MAX_REDIRECTS_PER_SESSION` | 3 | hops de redirect CDN (reset en respuesta con medio y en reload) |
| `MAX_RELOADS_PER_SESSION` | 2 | reloads de respuesta-player solicitados por el servidor |
| `MAX_PO_TOKEN_REFRESHES` | 2 | re-mints forzados de token antes de rendirse |
| `MAX_BACKOFF_MS` | 30 000 | clamp sobre el backoff del servidor honrado |
| `MAX_CACHE_BYTES` | 32 MiB | presupuesto de caché de bytes de medio (~50 s de 4K) |
| `MIN_CACHED_SEGMENTS` | 6 | la evicción nunca baja de esto |
| `EVICT_BEHIND_MS` | 10 000 | back-buffer mantenido detrás del play head |
| `SEEK_KEEP_WINDOW_MS` | 30 000 | ventana de caché mantenida a cada lado de un objetivo de seek |

## La caché

Un `ConcurrentHashMap<String, SabrMediaSegment>` con clave `itag + ":" + ("init" | sequenceNumber)`, más un `ArrayDeque` de claves de segmentos de medio en orden de inserción y un `cachedBytes` corriente. **Los segmentos init se cachean pero nunca se cuentan ni se evictan** (son diminutos y siempre necesarios). `getCachedSegment(request)` es un lookup sin efectos secundarios que el reader del cliente toca primero. El conteo de bytes lo mantiene `pumpOnce` (el camino `fetchSegment` cachea sin tocar el conteo).

### Evicción

`evictCacheIfNeeded()` corre en cada ronda (incluso cuando está byte-throttled, si no el throttle nunca libera y la reproducción se congela). Mientras `cachedBytes > MAX_CACHE_BYTES` **y** `cacheOrder.size() > MIN_CACHED_SEGMENTS`, mira el segmento más viejo y:

- si su tiempo de fin es `> playHeadMs - EVICT_BEHIND_MS`, está en el back-buffer o por delante del play head → **stop** (la caché puede pasarse del presupuesto en vez de evictar algo aún necesario);
- si no, lo descarta y resta sus bytes.

`playHeadMs` lo provee el cliente vía `setPlayHeadMs`, eso es lo que hace la evicción consciente del play head en vez de ciegamente FIFO. (El seek, que también vive en parte aquí vía `prepareForRewind`, se cubre en [el modelo buffered](./sabr-buffered).)

En un seek, la evicción por presupuesto de bytes no basta: un salto grande deja el span viejo *y* el span objetivo recién traído en la caché, dos regiones disjuntas que juntas pueden dispararse muy por encima de `MAX_CACHE_BYTES`, insostenible con segmentos 4K. `evictOutsideSeekWindow(targetMs)` colapsa la caché a una sola ventana: descarta todo segmento de medio cuyo tiempo cae fuera de `[targetMs - SEEK_KEEP_WINDOW_MS, targetMs + SEEK_KEEP_WINDOW_MS]` (segmentos init exceptuados) y resta sus bytes, así que justo tras un salto la caché solo guarda los ±30 s alrededor de donde se reanuda. Corre en el camino de preparación del seek, junto a `prepareForRewind` / `prepareForForwardJump`.

## Resiliencia

Dentro de una sesión, el driver contiene cada forma en que un servidor puede portarse mal: redirects acotados, reloads acotados, rondas policy-only acotadas, un clamp de backoff de 30 s, y re-mints de token acotados. Los presupuestos de redirect y token-refresh **se resetean en cualquier ronda con medio**, así que una sesión larga y sana nunca se mata por hops acumulados. Cualquier input malformado throw `SabrProtocolException`.

**Reload** (`maybeReload`) maneja `SabrReloadPlayerResponse`: re-obtiene un `YoutubeSabrInfo` fresco (nuevo `serverAbrStreamingUrl`), resetea el contador de redirect, pero **mantiene `requestNumber > 0`** para que la siguiente petición sea un follow-up que lleve el player time y los buffered ranges actuales, reanuda en el sitio en vez de empezar de cero.

## Protección y tokens

Una respuesta `status=3` sin medio significa que el servidor quiere un PO token ligado al contenido antes de soltar medio. `applyPoTokenForProtectedResponse` prueba primero el token cacheado (`maybeApplyPoToken(false)`); si ya está en su sitio y aún se rechaza, y el presupuesto de refresh lo permite, cuenta un refresh y fuerza un mint fresco (`maybeApplyPoToken(true)`) — un force-refresh dispara un mint WebView de ~45 s. El token viene del cliente vía `SabrPoTokenProvider.getPoToken(info, streamState, forceRefresh)`; el extractor solo pide, cachea (en `StreamState`), y reintenta. El mint es [la historia de la atestación](/es/developer-guide/sabr-attestation).

## Live

La sesión expone `isLive()`, `getLiveHeadSequenceNumber()`, e `isAtLiveEdge()` a partir del `SabrLiveMetadata` que el estado ingiere (secuencia del live edge dentro de un margen de 2 segmentos, más el estado DVR). Esa es la base sobre la que se construye la reproducción en vivo, del lado del cliente.

---

Siguiente: [Referencia de control parts](./sabr-control-parts).
