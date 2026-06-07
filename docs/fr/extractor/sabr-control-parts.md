# Référence des control parts

Partie de [SABR dans l'extracteur](./sabr). Chaque part UMP non-média que le serveur peut envoyer, avec son id de part-type, ses champs proto, et ce qu'elle fait. Les numéros de champs viennent du `decode()` de chaque classe ; les noms au-delà des évidents sont du reverse.

## Rythme

### `SabrNextRequestPolicy` — id 35
Comment et quand envoyer le prochain follow-up.

| # | Champ |
| --- | --- |
| 1 / 2 | target readahead audio / vidéo (ms) |
| 3 | max time since last request (ms) |
| 4 | **backoff** avant la prochaine requête (ms) — le backoff faisant autorité |
| 5 / 6 | min readahead audio / vidéo (ms) |
| 7 | playback cookie (aussi décodé en `SabrPlaybackCookie`) |
| 8 | videoId |

Pas de champ numéro-de-requête ; le `rn` de l'URL est géré par la session. Le cookie thread l'état de session dans la requête suivante.

### `SabrPlaybackStartPolicy` — id 47
Readahead minimum avant démarrage / reprise, conditionné par la bande passante. Champ 1 = politiques de start, champ 2 = politiques de resume ; chaque `ReadaheadPolicy` est `{1 minBandwidthBytesPerSecond, 2 minReadaheadMs}` ("sous cette bande passante, bufferise au moins autant d'abord").

### `SabrRequestCancellationPolicy` — id 53
Quand les requêtes en vol doivent être annulées. Porte une liste d'items ; le seul sous-champ nommé est `minReadaheadMs`.

### `SabrPrewarmConnection` — id 65
Hints de préchauffage de connexion. Décodé structurellement, pour le diagnostic seulement.

## Protection

### `SabrStreamProtectionStatus` — id 58
| # | Champ |
| --- | --- |
| 1 | `status` (int brut) |
| 2 | `maxRetries` |

L'enum status n'est **pas** nommé dans le code, juste un int brut. D'après la recherche du projet : `1` = OK/attesté (vrai média), `3` = protection requise (pas de média, mint un jeton PO) ; `2` est intermédiaire. `status >= 3` sans média est la frontière jeton PO sur laquelle agit la [session](./sabr-session).

## Navigation

### `SabrRedirect` — id 43
Champ 1 = la nouvelle URL de streaming. La session swappe `serverAbrStreamingUrl` et compte le hop (plafonné à 3/session).

### `SabrSeek` — id 45
Seek initié serveur : `{1 seekMediaTime, 2 seekMediaTimescale, 3 seekSource}`. Temps réel = `seekMediaTime / seekMediaTimescale`.

### `SabrReloadPlayerResponse` — id 46
La réponse du lecteur a expiré. Trois niveaux imbriqués, chacun champ 1, jusqu'à une string `reloadPlaybackParamsToken`. La session re-fetche un `YoutubeSabrInfo` frais et reprend sur place (voir [le driver de session](./sabr-session)).

## Contexte

### `SabrContextUpdate` — id 57
Un blob keyé que le client doit **renvoyer** dans le streamer context des requêtes suivantes.

| # | Champ |
| --- | --- |
| 1 | `type` (id de clé) |
| 2 | `scope` |
| 3 | `value` (bytes ; décodé en `SabrContextValue`) |
| 4 | `sendByDefault` |
| 5 | `writePolicy` (`1 = overwrite`, `2 = keep existing`) |

Au renvoi, seuls `{1 type, 2 value}` sont ré-encodés. `SabrContextValue` décode plus loin la value en une timing info (`timestampMs`, `durationMs`) et une content info (`contentId`, `contentType`), plus une longueur de signature.

### `SabrContextSendingPolicy` — id 59
Quels types de contexte commencer / arrêter / jeter : champ 1 start, champ 2 stop, champ 3 discard (chacun un seul ou une liste packed d'ids `SabrContextUpdate.type`).

## Live

### `SabrLiveMetadata` — id 31
| # | Champ |
| --- | --- |
| 1 | broadcastId |
| 3 | `headSequenceNumber` (live edge ; -1 si inconnu) |
| 4 | `headTimeMs` |
| 5 | wallTimeMs |
| 6 | videoId |
| 8 | `postLiveDvr` (live terminé, encore DVR-seekable) |
| 12 / 13 | min seekable time ticks / timescale |
| 14 / 15 | max seekable time ticks / timescale |

## Formats

- **`SabrFormatInitializationMetadata`** — id 42 : init par-format (endSegmentNumber, mimeType, init/index ranges, duration units/timescale). Pilote [l'index de segments](./sabr-media).
- **`SabrSelectableFormats`** — id 51 : les `FormatId` vidéo/audio que le serveur servira.
- **`SabrFormatSelectionConfig`** — id 37 : itags + une résolution que le serveur veut voir demandés.

## Divers

- **`SabrError`** — id 44 : `{1 type (string), 2 code}`. Fatal au round.
- **`SabrSnackbarMessage`** — id 67 : `{1 id}`, un identifiant de message visible par l'utilisateur.
- **`SabrRequestIdentifier`** — id 52 : un jeton émis serveur (champ 1) taguant le round ; résumé par longueur seulement, jamais imprimé.

---

Retour à [l'overview](./sabr).
