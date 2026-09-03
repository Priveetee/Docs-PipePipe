# La requête

Partie de [SABR dans l'extracteur](./sabr). `YoutubeSabrRequestHelper` encode la
`YoutubeSabrRequest` immuable en `VideoPlaybackAbrRequest` binaire envoyé à
YouTube. Les libellés ci-dessous sont les champs produits par l'encodeur actuel.

## Cycle de la requête

Deux fabriques publiques existent :

- `YoutubeSabrRequest.preparation(playerTimeMs, preferredFormats)` demande les
  données d'initialisation et les timelines sans déclarer de pistes actives ;
- `YoutubeSabrRequest.playback(playerTimeMs, playbackRate, tracks)` déclare les
  pistes audio/vidéo actives et leur position dans le buffer.

Chaque requête doit contenir au moins une piste. Elle ne peut pas contenir deux
pistes audio, deux pistes vidéo, ni le même itag à la fois en audio et en vidéo.
Une piste peut porter une `YoutubeSabrFormatTimeline` et le dernier numéro de
segment bufferisé.

`YoutubeSabrRequestHelper` ajoute à l'URL HTTP `alr=yes`, le CPN de session et
`rn=<requestNumber>`. `rn` commence à zéro et est remplacé à chaque requête. Le
body est envoyé en `application/x-protobuf` ; la réponse doit être en
`application/vnd.yt-ump`.

## Champs de premier niveau

| # | Wire | Transporte | Émis quand |
| --- | --- | --- | --- |
| 1 | message | `clientAbrState` | Toutes les requêtes |
| 2 | message | `formatId` sélectionnés | L'état de lecture est inclus |
| 3 | message | `bufferedRange` | Une piste a une timeline et un segment bufferisé |
| 4 | varint | `playerTimeMs` de premier niveau | L'état de lecture est inclus |
| 5 | bytes | `videoPlaybackUstreamerConfig` décodée | Toutes les requêtes |
| 16 | message | `formatId` audio préféré | Si un format audio existe |
| 17 | message | `formatId` vidéo préféré | Si un format vidéo existe |
| 19 | message | `streamerContext` | Toutes les requêtes |

L'état de lecture est inclus pour une requête de suivi, une position non nulle
ou une requête qui porte des plages bufferisées. Une préparation à la position
zéro est donc le cold start minimal ; elle contient tout de même la configuration
ustreamer et les formats préférés éventuels.

`formatId` est le message imbriqué partagé par les formats sélectionnés et
préférés : le champ `1` est l'itag, le champ `2` est `lastModified` s'il est
positif et le champ `3` est `xtags` s'il n'est pas vide.

## `clientAbrState`

L'encodeur actuel écrit ces champs :

| # | Signification |
| --- | --- |
| 18 / 19 | largeur/hauteur vidéo, uniquement avec l'état de lecture |
| 21 | résolution vidéo, au moins 360 si un format vidéo existe |
| 23 | estimation de bande passante sur les follow-ups, ou calculée depuis les débits actifs |
| 28 | `playerTimeMs` |
| 34 | visibilité (`1`) |
| 35 | vitesse de lecture, par défaut `1.0` |
| 40 | mode de piste (`1` audio seul, `2` vidéo seule, `0` les deux et omis) |
| 46 | DRC activé si le format audio sélectionné est DRC |
| 69 | id de piste audio sélectionnée, s'il existe |

Les informations client dans `streamerContext` identifient MWEB (client id `2`),
la version client et la localisation `en-US`/`US` utilisée par le helper.

## Plages bufferisées

Pour une piste dont la timeline est parsée et dont `bufferedThrough > 0`, le
helper écrit une plage contenant :

| Champ | Valeur |
| --- | --- |
| `formatId` | itag, last-modified et xtags |
| `startTimeMs` | `0` |
| `durationMs` | fin du dernier segment bufferisé |
| `startSegmentIndex` / `endSegmentIndex` | `1` / le segment bufferisé borné |
| timescale de la time-range | `1000` |

`YoutubeSabrFormatTimeline` est construite depuis les octets d'initialisation
par le parseur d'index MP4 ou WebM. Elle associe numéros de séquence et temps de
début/fin, puis associe un temps demandé au premier segment qui se termine après
ce temps.

## `streamerContext`

Le contexte contient les informations client et, éventuellement :

- le jeton PO courant (champ `2`) ;
- le cookie de lecture issu de `NEXT_REQUEST_POLICY` (champ `3`) ;
- les valeurs SABR opaques actives (champ `5`) ;
- les types de contexte non envoyés actuellement (champ `6`).

Les payloads de jeton et de cookie ne sont jamais imprimés dans les résumés de
diagnostic.

## Wire format

`SabrProto` est le petit lecteur/écrivain protobuf utilisé par les chemins de
requête et de réponse. Il prend en charge les varints, fixed32, fixed64 et les
champs délimités par longueur. Un message imbriqué est un tableau d'octets
délimité par longueur ; les tags utilisent `(fieldNumber << 3) | wireType`. Les
numéros de champ invalides, wire types non pris en charge, entrées tronquées et
longueurs trop grandes lèvent `SabrProtocolException`.

Suite : [UMP et décodage](./sabr-decoding).
