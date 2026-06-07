# Démarrer une session

Partie de [SABR dans l'extracteur](./sabr). Ici : comment une session est amorcée à partir d'une réponse du lecteur, les identités client qu'elle peut porter, et le modèle de formats.

## Deux points d'entrée

Il y a deux chemins de code SABR distincts, et ça vaut le coup de les séparer d'emblée :

- **Le listing de flux de l'extracteur.** `YoutubeStreamExtractor.buildSabrStreams()` lit `streamingData`, et pour chaque format adaptatif émet un `AudioStream` / `VideoStream` en `DeliveryMethod.SABR` (content = `serverAbrStreamingUrl`, `isUrl=false`). C'est ce que renvoie `getStreams()`. L'`ItagItem` de chaque flux porte l'init range et l'index range. Un flag temporaire `FORCE_SABR_FOR_TESTING` route toute vidéo non-live par SABR ; désactivé, SABR ne sert que pour les réponses SABR-only sans manifeste HLS.
- **Le driver de session.** `YoutubeSabrProbe` + `YoutubeSabrSession` + compagnie forment un driver autonome qui *joue* réellement un flux SABR. C'est le client qui le construit et le pompe ; le job de l'extracteur est juste d'exposer que les flux existent et de fournir un `SabrPoTokenProvider`.

Le reste de cette section concerne le second chemin.

## Le probe

`YoutubeSabrProbe` est une utility statique. `fetchSabrInfo(...)` construit un `YoutubeSabrInfo` :

1. Générer un `cpn` (content-playback nonce).
2. POST de la requête InnerTube `player` (`fetchPlayerResponse`) pour le `YoutubeSabrClientProfile` choisi.
3. Lire `streamingData` ; throw `SabrProtocolException` si absent.
4. Prendre `serverAbrStreamingUrl` et **déobfusquer son paramètre `n`** via le player JS (`maybeDeobfuscateNParameter`), en gérant les formes `?n=` et `/n/`.
5. Extraire la **ustreamer config** (`playerConfig.mediaCommonConfig.mediaUstreamerRequestConfig.videoPlaybackUstreamerConfig`), un blob opaque renvoyé dans chaque requête.
6. Extraire `visitorData` (override ou `responseContext.visitorData`).
7. Construire les `YoutubeSabrFormat` à partir de `streamingData.adaptiveFormats`.

Le body de la requête player (`createPlayerBody`) est un appel InnerTube normal avec quelques pièces SABR : `playbackContext.contentPlaybackContext.signatureTimestamp` (du player JS), `cpn`, `videoId`, `contentCheckOk`, et, si dispo, un jeton PO *player* dans `serviceIntegrityDimensions.poToken` (distinct du jeton PO *média* utilisé ensuite).

### `YoutubeSabrInfo`

Immuable, l'état racine de la session : `profile`, `videoId`, `cpn`, `clientVersion`, `visitorData`, `serverAbrStreamingUrl`, `videoPlaybackUstreamerConfig`, et la liste `formats`. Helpers de sélection : `findBestAudioFormat()` (débit max), `findBestVideoFormat()` (hauteur max), `findFormatByItag(itag)`. (Pas de champ durée, la durée est par-format via `approxDurationMs` ; pas de champ jeton PO, il vient du provider.)

## Les client profiles

`YoutubeSabrClientProfile` est l'identité InnerTube sous laquelle la requête part. Le serveur adapte formats, headers et comportement.

| Profile | clientName | id | clientVersion | web-like |
| --- | --- | --- | --- | --- |
| `WEB` | WEB | 1 | 2.20250122.04.00 (résolu live) | non |
| `WEB_EMBEDDED` | WEB_EMBEDDED_PLAYER | 56 | 1.20250121.00.00 | oui |
| `ANDROID` | ANDROID | 3 | 21.03.36 | non |
| `ANDROID_VR` | ANDROID_VR | 28 | 1.65.10 | non |
| `IOS` | IOS | 5 | 19.45.4 | non |
| `TVHTML5` | TVHTML5 | 7 | 7.20250923.13.00 | oui |
| `SAFARI_WEB` | WEB | 1 | 2.20260114.08.00 | non* |

Chaque profile porte aussi un nom/version d'OS et un User-Agent là où c'est pertinent. `WEB` résout sa version live (`YoutubeParsingHelper.getClientVersion()`), avec fallback sur la constante. `SAFARI_WEB` réutilise le nom/id `WEB` mais est traité comme web-like via des checks explicites `WEB || SAFARI_WEB`. Android/iOS passent par le host InnerTube gapis et ajoutent `X-Goog-Api-Format-Version: 2` ; les profils web-like ajoutent `Origin`/`Referer`/`X-YouTube-Client-*` et les cookies.

## Poster une requête média

`postMediaRequest` est le vrai POST SABR :

- URL = `withSabrSessionParameters(serverAbrStreamingUrl, cpn, requestNumber)`, qui garantit `alr=yes` et `cpn=...` et pose `rn=<requestNumber + 1>` (le `rn` de l'URL est 1-based).
- Headers (`buildSabrHeaders`) : `Accept: application/vnd.yt-ump`, User-Agent du profile ; non-web ajoute `X-Goog-Visitor-Id` ; web-like bascule sur `Accept: */*` + `Origin`/`Referer` navigateur.
- Le body est le protobuf `VideoPlaybackAbrRequest` (voir [La requête](./sabr-request)).
- La réponse **doit** avoir `Content-Type: application/vnd.yt-ump`, sinon `SabrProtocolException`. Elle est décodée par `SabrResponseDecoder` en un `SabrDecodedResponse`, wrappé dans un `YoutubeSabrProbeResult` (info + decoded + code HTTP + longueur body + content type).

## Les formats

`YoutubeSabrFormat` est un format adaptatif : `itag`, `lastModified`, `xtags`, `mimeType` (le codec est dedans), `audioTrackId`, `qualityLabel`, `audioQuality`, `drc`, `width`, `height`, `bitrate`, `contentLength`, `approxDurationMs`. `isAudio()`/`isVideo()` testent le mime type. `fromAdaptiveFormats` parse le tableau JSON (les champs longs comme `contentLength` sont sérialisés en strings, donc `parseLong` est tolérant).

Deux control parts envoyées par le serveur affinent la sélection au runtime : `SabrSelectableFormats` (les `FormatId` vidéo/audio que le serveur servira, y compris les variantes "wrapped") et `SabrFormatSelectionConfig` (les itags + une résolution que le serveur veut voir demandés).

## Onesie

Les parts "onesie" (`SabrOnesieHeader` / `SabrOnesieData` / `SabrOnesieInnertubeResponse`) permettent au serveur d'inliner une réponse player InnerTube entière (type `0 = ONESIE_PLAYER_RESPONSE`) ou du média/des clés dans le flux SABR, pour qu'un client puisse sauter un appel `player` séparé. Le décodeur ici les lit prudemment (clair, gzip-ou-brut, sans matériel de chiffrement) et surtout pour le diagnostic, mais c'est le mécanisme qui rend une réponse SABR auto-suffisante.

---

Suite : [La requête](./sabr-request).
