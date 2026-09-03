# Référence des control parts

Partie de [SABR dans l'extracteur](./sabr). Le serveur peut placer des parts de
contrôle entre les parts média. `SabrResponseDecoder` reconnaît leurs identifiants
numériques et conserve soit les champs nécessaires à `YoutubeSabrSession`, soit
un résumé structurel borné. Le code actuel ne définit pas une classe Java par
control part.

## Rythme et protection

### `NEXT_REQUEST_POLICY` — id 35

Le décodeur conserve la policy brute et lit son champ `4` comme backoff demandé
en millisecondes. `YoutubeSabrSession` lit aussi le champ `7` comme cookie de
lecture. Un backoff supérieur à 30 000 ms est rejeté ; un délai valide diffère
le prochain `requestOnce` sans envoyer de HTTP.

### `STREAM_PROTECTION_STATUS` — id 58

| # | Champ |
| --- | --- |
| 1 | statut de protection brut |
| 2 | nombre maximal de retries fourni par le serveur |

Le statut reste volontairement un entier brut. Le statut `2` est exposé comme
attestation en attente ; le statut `3` comme attestation requise. L'appelant peut
définir un jeton PO lié au contenu avec `YoutubeSabrSession.setPoToken(...)`.

## Navigation et état du player

### `SABR_REDIRECT` — id 43

Le champ `1` est la nouvelle URL de streaming. La session n'accepte que les URL
HTTPS sur `googlevideo.com` ou ses sous-domaines et limite les redirections à
trois par session.

### `SABR_SEEK` — id 45

La part est conservée comme résumé structurel. L'extracteur actuel n'applique
pas lui-même un seek initié par le serveur ; l'application décide comment
reconstruire une `YoutubeSabrRequest`.

### `RELOAD_PLAYER_RESPONSE` — id 46

Le décodeur positionne `reloadRequested`. `YoutubeSabrSession` remonte alors une
erreur de protocole ; récupérer une nouvelle réponse player et créer un nouveau
`YoutubeSabrInfo` est une étape de récupération applicative.

### `PLAYBACK_START_POLICY` — id 47

Conservée comme résumé structurel. Elle ne modifie pas directement le résultat
de `requestOnce` dans l'extracteur.

## Contextes et métadonnées live

### `SABR_CONTEXT_UPDATE` — id 57

La session parse les champs dont elle a besoin :

| # | Champ |
| --- | --- |
| 1 | type de contexte |
| 3 | octets de valeur opaque |
| 4 | envoi par défaut |
| 5 | politique d'écriture |

Les valeurs sont stockées par type. `SABR_CONTEXT_SENDING_POLICY` (id 59)
ajoute, retire ou supprime des types via les champs `1`, `2` et `3` ; les valeurs
actives sont renvoyées dans les messages `streamerContext` suivants.

### `LIVE_METADATA` — id 31

La session consomme actuellement :

| # | Signification |
| --- | --- |
| 3 | séquence du live edge |
| 4 | temps du live edge en millisecondes |
| 8 | flag DVR post-live |

La réception de la part marque la session comme live. Les valeurs sont
disponibles avec `isLive()`, `getLiveHeadSequenceNumber()`,
`getLiveHeadTimeMs()` et `isPostLiveDvr()`.

## Contrôles de formats et de média

- `FORMAT_INITIALIZATION_METADATA` (id 42) est décodée en
  `SabrFormatInitializationMetadata` et fournit les plages d'initialisation et
  d'index ;
- `MEDIA_HEADER`, `MEDIA` et `MEDIA_END` (ids 20–22) sont assemblées par
  `SabrMediaSegmentCollector`, comme décrit dans [Médias, segments et
  index](./sabr-media) ;
- `FORMAT_SELECTION_CONFIG` (37), `SELECTABLE_FORMATS` (51), les parts onesie
  (10–12), contrôles de requête (52–56), hints cache/bande passante (48–50,
  60–66) et `SNACKBAR_MESSAGE` (67) sont actuellement résumés pour le
  diagnostic.

### `SABR_ERROR` — id 44

Les champs `1` (type texte) et `2` (code numérique) sont rendus dans le résumé
de réponse et font lever une erreur de protocole à la session.

Les parts inconnues ou malformées sont conservées dans des diagnostics bornés,
afin que les médias valides de la même réponse passent tout de même les contrôles
d'intégrité.

Retour à [la vue d'ensemble](./sabr).
