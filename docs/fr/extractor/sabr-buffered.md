# Le modèle buffered et le seek

Partie de [SABR dans l'extracteur](./sabr). C'est la pièce la plus subtile de l'extracteur, et celle qu'on rate le plus souvent. Elle vit dans `YoutubeSabrStreamState`, un `FormatProgress` par track.

## Pourquoi deux valeurs "max"

Le serveur n'envoie que ce que le client dit manquer, donc les buffered ranges de chaque requête doivent être *honnêtes*. Le piège, ce sont les trous. Supposons que les segments 1, 2, 3, 5, 6 soient arrivés mais que le 4 ait été perdu :

![Modèle de tête bufferisée](/diagrams/sabr-buffered-model.png)

Si le client rapportait `maxSegment = 6`, le serveur supposerait que 1–6 sont tous détenus et enverrait le segment 7, et le segment 4 ne serait jamais rempli, le reader séquentiel cale au trou pour toujours.

Donc `FormatProgress` suit deux têtes :

- **`contiguousMaxSegment`** — le plus haut segment **sans trou depuis le début**. C'est ce qui est rapporté au serveur, pour qu'il envoie toujours le segment séquentiel exact dont un reader a besoin.
- **`maxSegment`** — le plus haut segment vu tout court (peut être au-delà d'un trou).
- **`aheadOfContiguous`** — un set de segments hors-ordre reçus au-delà de l'edge contigu, en attente d'être intégrés.

`observeHeader(seq)` les maintient : si `seq == contiguousMaxSegment + 1`, avance l'edge contigu et draine `aheadOfContiguous` aussi loin qu'il s'étend ; si `seq` est plus loin, le range dans `aheadOfContiguous`. Ce split contigu-vs-max est le mécanisme anti-starvation central.

## La fenêtre observed-timing

À côté des numéros de segment, `FormatProgress` enregistre une fenêtre temporelle à partir des headers réellement vus : `firstObservedSegment`, `lastObservedSegment`, `observedStartMs`, `observedEndMs`, `observedMaxSegment`, `lastObservedDurationMs`. Plus `endSegment` et `averageDurationMs` (de la metadata d'init) et le `segmentIndex` parsé.

## Construire les ranges

`getBufferedRanges()` émet une `SabrBufferedRange` par track (ou `SabrBufferedRange.full(...)` si un track est flaggé entièrement bufferisé, ou un override manuel). La décision intéressante dans `addBufferedRange` est de savoir s'il faut faire confiance au timing observé :

```
canUseObservedTiming =
       observedStartMs >= 0
    && observedEndMs > observedStartMs
    && observedMaxSegment >= maxSegment
    && firstObservedSegment > 0
    && contiguousMaxSegment >= maxSegment   // le garde no-hole
```

Cette dernière clause est la clé : le timing observé n'est cru que s'il n'y a **pas de trou** (contigu a rattrapé max). Sinon la fin observée surévaluerait la couverture au-delà du trou. Quand on lui fait confiance, la range utilise `observedStartMs` / `observedEndMs - observedStartMs` et `firstObservedSegment` ; sinon elle retombe sur `startTime = 0`, `duration = getBufferedEndMs()`, `startIndex = 1`. **Dans les deux cas `endSegmentIndex = contiguousMaxSegment`**, jamais `maxSegment`. Et `getBufferedEndMs()` est calculé depuis `contiguousMaxSegment` aussi (un trou signifie qu'on n'est pas vraiment bufferisé au-delà).

## Le seek

![Tête bufferisée et seek](/diagrams/sabr-extractor-seek.png)

Les seeks **avant** sont faciles parce que le modèle a un biais avant. `assumeBufferedUntil(format, seq)` ne fait jamais que *relever* `maxSegment` ; les `prepareForMediaSegment` / `maybePrepareForDistantMediaSegment` de la session l'utilisent pour faire sauter le bookkeeping en avant et laisser `SabrSeek` / le player time aligner. Rien à défaire.

Les seeks **arrière** sont le cas dur et le fix le plus récent. Après lecture en avant, la tête bufferisée est haute ; un seek arrière sur un segment déjà reçu laisserait la requête annoncer cette range comme bufferisée, le serveur n'envoie rien, le reader cale. `prepareForRewind` → `rewindBufferedTo(fromSegment)` répare l'état précisément :

1. `last = max(0, fromSegment - 1)`.
2. Garde : si `last >= contiguousMaxSegment`, ce n'est pas un rewind pour ce track, return.
3. Sinon **shrink** : `maxSegment = last`, `contiguousMaxSegment = last`, `observedMaxSegment = min(observedMaxSegment, last)`.
4. **Drop de la fenêtre observée** : `firstObservedSegment`, `lastObservedSegment`, `observedStartMs`, `observedEndMs` tous remis à `-1`.

L'étape 4 compte autant que l'étape 3 : si la fenêtre observée survivait, `canUseObservedTiming` pourrait encore rapporter une fin au-delà de la cible et la re-requête reviendrait vide. Les deux têtes et la fenêtre observée ramenées en arrière, la requête suivante demande honnêtement la cible et le serveur la renvoie. La session fait ça pour le track seeké et son compagnon (audio/vidéo bougent ensemble), puis pose le player time.

---

Suite : [Le driver de session](./sabr-session).
