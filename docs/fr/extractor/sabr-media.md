# Média, segments et l'index

Partie de [SABR dans l'extracteur](./sabr). Ici : comment des octets média éparpillés deviennent un segment jouable, et comment un temps de lecture se mappe à un numéro de segment.

## Les parts média

Le média arrive en trois types de part qui travaillent ensemble, corrélés par un **header id** d'un octet :

- **MEDIA_HEADER (20)** porte un `SabrMediaHeader` et un `headerId`. Il ouvre un buffer.
- **MEDIA (21)** : les payloads commencent par cet octet `headerId` ; le reste est ajouté au buffer correspondant.
- **MEDIA_END (22)** : le premier octet du payload est le `headerId` ; il finalise le buffer en un segment.

Comme le routage se fait par id, **audio et vidéo s'entrelacent librement** dans une même réponse, chaque id accumule indépendamment.

### `SabrMediaHeader`

Décodé depuis le payload MEDIA_HEADER (numéros de champs proto) :

| # | Champ |
| --- | --- |
| 1 | `headerId` (corrèle MEDIA/MEDIA_END) |
| 3 | `itag` |
| 4 | `lastModified` |
| 6 | `startRange` (offset octet) |
| 7 | `compressionAlgorithm` (0 aucun, 1 gzip, 2 brotli) |
| 8 | `isInitSegment` |
| 9 | `sequenceNumber` |
| 11 / 12 | `startMs` / `durationMs` |
| 13 | `FormatId` imbriqué (fallback pour itag/lastModified/xtags) |
| 14 | `contentLength` (longueur d'octets attendue sur le fil) |
| 15 | `TimeRange` imbriqué (`startTicks`, `durationTicks`, `timescale`) |

Si `startMs`/`durationMs` sont absents mais qu'un `TimeRange` est présent, ils sont dérivés : `ms = ticks · 1000 / timescale`.

## Le collector

`SabrMediaSegmentCollector.collect(response)` rejoue les parts dans l'ordre, en gardant une `Map<headerId, OpenSegment>` :

- MEDIA_HEADER → `openSegments.put(id, new OpenSegment(header))`.
- MEDIA → ajoute les octets (offset 1..fin) au segment ouvert pour cet id ; **les octets d'un id inconnu/fermé sont silencieusement jetés**.
- MEDIA_END → retire l'id, finalise, et émet, dans l'ordre de fermeture.

Cas limites : un header qui n'obtient jamais de MEDIA_END **reste ouvert et n'est jamais émis** (il ressort en `missing-media-end` dans le contrôle d'intégrité, pas en segment partiel). Le média orphelin (sans header) est jeté.

**Length check, puis décompression.** À la finalisation, si `contentLength >= 0` et que le compte d'octets accumulé diffère, ça throw `SabrProtocolException` (length mismatch). Ce contrôle tourne sur les octets **compressés**, `contentLength` est la longueur sur le fil. Ensuite `maybeDecompress` applique gzip (`GZIPInputStream`) ou brotli (`BrotliInputStream`) selon `compressionAlgorithm` ; tout autre que 0/1/2 throw.

`SabrMediaSegment` tient le header et les octets (décompressés). Délibérément, le tableau d'octets **n'est pas** cloné défensivement à la construction ni dans `getData()`, cloner des segments 4K de plusieurs Mo doublait le pic mémoire et causait des OOM lors de changements rapides de format, donc le tableau est immuable par contrat.

`find(response, request)` lance `collect` puis renvoie le premier segment dont le header matche la requête. `SabrSegmentRequest.matches` se base sur **(itag, flag init, numéro de séquence)**, ce qui est distinct du header-id interne utilisé pour le stitching d'octets.

## L'index de segments

Pour seeker, l'extracteur doit mapper un temps à un numéro de séquence. L'index du conteneur du segment init donne le timing exact par-segment. `SabrFormatInitializationMetadata` (part type 42) fournit le nécessaire : `endSegmentNumber` (total segments), `mimeType` (sélectionne le parser), `initRange`, `indexRange`, et `durationUnits`/`durationTimescale`.

### MP4 : `SabrMp4SegmentIndexParser`

Parse la box ISO-BMFF **`sidx`** dans l'index range :

1. Cherche la box `"sidx"` dans `[indexRangeStart, indexRangeEnd]`.
2. Lit la version FullBox (0 ou 1), saute les flags, saute le reference id.
3. Lit `timescale` (doit être > 0).
4. Lit `earliest_presentation_time` (32-bit en v0, 64-bit en v1).
5. Boucle `referenceCount` fois, chaque référence de 12 octets : prend `subsegment_duration` ; accumule le start courant ; émet `Entry(seq=i+1, startMs, durationMs)` avec `ms = ticks · 1000 / timescale` (arrondi). Les références sidx imbriquées throw (non supporté).

Note : seul le **temps** est dérivé. La taille référencée 31-bit est lue mais jetée, aucun offset d'octet par-segment n'est produit ici.

### WebM : `SabrWebmSegmentIndexParser`

Parse Matroska/EBML : trouve `Segment`, lit `TimecodeScale` (ns/tick, défaut 1 000 000) depuis `Info`, puis parcourt `Cues` → `CuePoint` → `CueTime` dans l'index range. Chaque cue time devient un start de segment (scalé en ms) ; chaque durée est l'écart au cue suivant (ou la durée totale / une extrapolation pour le dernier). `CueTrackPositions` (offsets d'octets) est ignoré, là encore, temps uniquement.

### Lookup

`SabrSegmentIndex` est une liste 1-based d'`Entry(sequenceNumber, startMs, durationMs)` avec `getEndMs()`. Le lookup temps→séquence vit dans le `FormatProgress` par-track de `YoutubeSabrStreamState` :

- `getSegmentStartMs(seq)` / `getSegmentEndMs(seq)` — entrée d'index si présente, sinon arithmétique sur `averageDurationMs`.
- `getSegmentNumberAtOrAfterTimeMs(timeMs)` — scan linéaire de la première entrée dont `endMs >= timeMs` ; sans index, `ceil(timeMs / averageDurationMs)`.

Ce fallback (`averageDurationMs`, dérivé de durée totale / nombre de segments) est pourquoi le seek marche encore approximativement même avant qu'un segment init ait été parsé.

---

Suite : [Le modèle buffered et le seek](./sabr-buffered).
