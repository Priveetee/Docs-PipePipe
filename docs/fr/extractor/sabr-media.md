# Médias, segments et index

Partie de [SABR dans l'extracteur](./sabr). Une réponse SABR transporte les
médias dans des parts UMP séparées. L'extracteur les corrèle avec un identifiant
de header sur un octet, vérifie les longueurs, décompresse si nécessaire et
expose des objets `SabrMediaSegment` terminés.

## Parts média

- **`MEDIA_HEADER` (20)** porte un `SabrMediaHeader` et ouvre un segment ;
- **`MEDIA` (21)** commence par l'octet d'id du header, puis ses octets sont
  ajoutés au segment ;
- **`MEDIA_END` (22)** commence par l'id du header et ferme le segment.

Audio et vidéo peuvent être entrelacés librement : chaque header ouvert possède
son propre accumulateur.

### `SabrMediaHeader`

Le décodeur actuel lit ces champs :

| # | Champ |
| ---: | --- |
| 1 | id du header |
| 2 | id de la vidéo |
| 3–5 | itag, last-modified, xtags |
| 6 | offset de départ |
| 7 | compression (`0` aucune, `1` gzip, `2` brotli) |
| 8 | flag de segment d'initialisation |
| 9 | numéro de séquence |
| 10 | débit en bits par seconde |
| 11–12 | début et durée en millisecondes |
| 13 | `FormatId` imbriqué de secours |
| 14 | longueur attendue sur le wire |
| 15 | time range imbriquée (ticks et timescale) |
| 16 | last-modified de la séquence |

Si les valeurs en millisecondes manquent mais que la time range possède une
timescale positive, le décodeur les calcule avec `ticks * 1000 / timescale`.

## Assemblage et décompression

`SabrMediaSegmentCollector.collect(response)` rejoue une réponse déjà en
mémoire. Le chemin streaming utilise `Incremental`, qui reçoit les parts au fil
de l'eau et émet un segment dans `onMediaEnd`. Le média d'un header inconnu ou
déjà fermé est jeté ; un header sans `MEDIA_END` n'est pas émis.

Avant décompression, le collector compare `contentLength` au nombre d'octets
reçus sur le wire. Il applique ensuite gzip ou brotli selon le header. Les
algorithmes inconnus, dépassements, payloads tronqués et échecs de décompression
sont signalés comme erreurs de protocole ou récupérables.

`SabrMediaSegment` peut garder les octets décompressés en mémoire ou utiliser un
fichier de spool. Pour les gros segments non compressés, le collector incrémental
peut fournir un segment progressif adossé à un fichier ; il faut alors utiliser
`openStream()` plutôt que recopier le contenu avec `getData()`.

## Initialisation et timelines

`FORMAT_INITIALIZATION_METADATA` (part 42) décrit les plages d'initialisation et
d'index d'un format. Le client récupère la plage d'initialisation avec
`YoutubeSabrRequestHelper.fetchInitializationData(...)`, puis parse les octets
avec `YoutubeSabrFormatTimeline.parse(...)` :

- `SabrMp4SegmentIndexParser` lit une boîte ISO-BMFF `sidx` et convertit chaque
  durée de sous-segment en millisecondes ;
- `SabrWebmSegmentIndexParser` lit les `Cues` Matroska/EBML et déduit la durée
  de chaque segment depuis le cue suivant ou la durée du format.

`SabrSegmentIndex` est une liste 1-based d'entrées avec numéro de séquence,
début, durée et fin calculée. `YoutubeSabrFormatTimeline` associe une séquence à
sa plage temporelle et un temps demandé au premier segment dont la fin le
dépasse.

L'extracteur actuel ne contient plus les anciennes classes `SabrSegmentRequest`
ou `YoutubeSabrStreamState`. La sélection des segments et la politique de plage
bufferisée appartiennent à l'appelant qui construit `YoutubeSabrRequest`.

Suite : [Le driver de session](./sabr-session).
