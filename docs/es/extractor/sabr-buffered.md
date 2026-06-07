# El modelo buffered y el seek

Parte de [SABR en el extractor](./sabr). Es la pieza más sutil del extractor, y la que más a menudo se hace mal. Vive en `YoutubeSabrStreamState`, un `FormatProgress` por track.

## Por qué dos valores "max"

El servidor solo envía lo que el cliente dice que le falta, así que los buffered ranges de cada petición deben ser *honestos*. La trampa son los huecos. Supongamos que los segmentos 1, 2, 3, 5, 6 han llegado pero el 4 se perdió:

![Modelo de cabeza de buffer](/diagrams/sabr-buffered-model.png)

Si el cliente reportara `maxSegment = 6`, el servidor asumiría que tiene 1–6 y enviaría el segmento 7, y el segmento 4 nunca se rellenaría, el reader secuencial se queda atascado en el hueco para siempre.

Así que `FormatProgress` sigue dos cabezas:

- **`contiguousMaxSegment`** — el segmento más alto **sin hueco desde el inicio**. Es lo que se reporta al servidor, para que siempre envíe el segmento secuencial exacto que un reader necesita.
- **`maxSegment`** — el segmento más alto visto en absoluto (puede estar más allá de un hueco).
- **`aheadOfContiguous`** — un set de segmentos fuera de orden recibidos más allá del borde contiguo, esperando ser integrados.

`observeHeader(seq)` los mantiene: si `seq == contiguousMaxSegment + 1`, avanza el borde contiguo y drena `aheadOfContiguous` tan lejos como alcance; si `seq` está más allá, lo guarda en `aheadOfContiguous`. Este split contiguo-vs-max es el mecanismo anti-starvation central.

## La ventana observed-timing

Junto a los números de segmento, `FormatProgress` registra una ventana temporal a partir de los headers realmente vistos: `firstObservedSegment`, `lastObservedSegment`, `observedStartMs`, `observedEndMs`, `observedMaxSegment`, `lastObservedDurationMs`. Más `endSegment` y `averageDurationMs` (de la metadata de init) y el `segmentIndex` parseado.

## Construir los ranges

`getBufferedRanges()` emite un `SabrBufferedRange` por track (o `SabrBufferedRange.full(...)` si un track está marcado como totalmente bufferizado, o un override manual). La decisión interesante en `addBufferedRange` es si confiar en el timing observado:

```
canUseObservedTiming =
       observedStartMs >= 0
    && observedEndMs > observedStartMs
    && observedMaxSegment >= maxSegment
    && firstObservedSegment > 0
    && contiguousMaxSegment >= maxSegment   // el guardia no-hole
```

Esa última cláusula es la clave: el timing observado solo se cree cuando **no hay hueco** (contiguo alcanzó a max). Si no, el final observado sobreestimaría la cobertura más allá del hueco. Cuando se confía, el range usa `observedStartMs` / `observedEndMs - observedStartMs` y `firstObservedSegment`; si no, cae a `startTime = 0`, `duration = getBufferedEndMs()`, `startIndex = 1`. **En ambos casos `endSegmentIndex = contiguousMaxSegment`**, nunca `maxSegment`. Y `getBufferedEndMs()` se calcula desde `contiguousMaxSegment` también (un hueco significa que realmente no estamos bufferizados más allá).

## El seek

![Cabeza de buffer y seek](/diagrams/sabr-extractor-seek.png)

Los seeks **hacia adelante** son fáciles porque el modelo tiene un sesgo hacia adelante. `assumeBufferedUntil(format, seq)` solo *eleva* `maxSegment`; los `prepareForMediaSegment` / `maybePrepareForDistantMediaSegment` de la sesión lo usan para saltar el bookkeeping adelante y dejar que `SabrSeek` / el player time alineen. Nada que deshacer.

Los seeks **hacia atrás** son el caso difícil y el fix más reciente. Tras reproducir adelante, la cabeza de buffer está alta; un seek atrás sobre un segmento ya recibido dejaría a la petición anunciando ese range como bufferizado, el servidor no envía nada, el reader se atasca. `prepareForRewind` → `rewindBufferedTo(fromSegment)` repara el estado con precisión:

1. `last = max(0, fromSegment - 1)`.
2. Guardia: si `last >= contiguousMaxSegment`, no es un rewind para este track, return.
3. Si no **shrink**: `maxSegment = last`, `contiguousMaxSegment = last`, `observedMaxSegment = min(observedMaxSegment, last)`.
4. **Drop de la ventana observada**: `firstObservedSegment`, `lastObservedSegment`, `observedStartMs`, `observedEndMs` todos de vuelta a `-1`.

El paso 4 importa tanto como el 3: si la ventana observada sobreviviera, `canUseObservedTiming` podría aún reportar un final más allá del objetivo y la re-petición volvería vacía. Con ambas cabezas y la ventana observada retrocedidas, la siguiente petición pide honestamente el objetivo y el servidor lo reenvía. La sesión hace esto para el track seekeado y su compañero (audio/vídeo se mueven juntos), luego pone el player time.

---

Siguiente: [El driver de sesión](./sabr-session).
