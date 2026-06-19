# UMP et décodage

Partie de [SABR dans l'extracteur](./sabr). Ici : l'enveloppe UMP au niveau octet, chaque type de part que le décodeur connaît, et la réponse décodée.

## Le cadrage UMP

Le corps de la réponse est de l'**UMP** (Ultra-Minimal Playback), le conteneur propre à YouTube, *pas* du protobuf au niveau de l'enveloppe (les payloads à l'intérieur des parts sont du protobuf). `UmpReader` le parcourt comme une suite de parts, dans l'un de deux modes :

- `readStreaming(InputStream, PartConsumer)` : lit une part (type, size, payload) à la fois directement depuis le flux réseau et la passe à un consumer, pour ne jamais tenir tout le body en mémoire d'un coup. Le pic transitoire est le payload d'une seule part au lieu de la réponse entière (50-150 Mo en 4K). C'est le chemin utilisé par la session pour le décodage live (voir "Streamer le décodage" plus bas).
- `readAll(byte[])` : parcourt un seul tableau en mémoire et renvoie toutes les parts en liste. Pratique pour les petites réponses et les tests, mais il faut bufferiser tout le body d'abord.

![Layout d'une part UMP](/diagrams/sabr-ump-layout.png)

Chaque part est `[type : varint-UMP][size : varint-UMP][payload : size octets]`, répété jusqu'à EOF (un EOF propre sur une frontière de part termine simplement la boucle). Aucun des deux modes ne fait de réassemblage cross-buffer *d'une seule part* : les `size` octets d'une part sont lus en entier avant la suivante, et un body tronqué throw `SabrProtocolException`.

### Le varint UMP

Le varint d'UMP n'est *pas* celui de protobuf. Le nombre total d'octets est décidé par les **bits de poids fort du premier octet** :

| Premier octet | Total octets | Valeur |
| --- | --- | --- |
| `0x00–0x7F` (< 128) | 1 | l'octet lui-même |
| `0x80–0xBF` | 2 | `(b0 & 0x3f) + 64·b1` |
| `0xC0–0xDF` | 3 | `(b0 & 0x1f) + 32·(b1 + 256·b2)` |
| `0xE0–0xEF` | 4 | `(b0 & 0x0f) + 16·(b1 + 256·(b2 + 256·b3))` |
| `0xF0–0xFF` | 5 | les 4 octets suivants, little-endian (les bits de valeur du premier octet sont jetés) |

Le résultat est un int signé 32-bit ; le cas 5 octets peut overflow en négatif, ce que le garde `type < 0 || size < 0` rejette, c'est le plafond pratique de taille de part.

`UmpPart` tient `type`, `size`, et `data`. `getData()` renvoie un clone défensif ; un `getRawData()` interne renvoie le tableau backing (utilisé sur les hot paths décodage/stitch pour éviter de copier des segments de plusieurs Mo).

## Les types de part

`SabrResponseDecoder` dispatch sur l'id de type de part. L'ensemble complet qu'il reconnaît :

| ID | Constante | Décodé en |
| --- | --- | --- |
| 10 | ONESIE_HEADER | `SabrOnesieHeader` (porté aux parts onesie suivantes) |
| 11 | ONESIE_DATA | `SabrOnesieData` |
| 12 | ONESIE_ENCRYPTED_MEDIA | `SabrOnesieData` (chiffré) |
| 20 | MEDIA_HEADER | `SabrMediaHeader` |
| 21 | MEDIA | octets média (1er octet du payload = header id) |
| 22 | MEDIA_END | ferme un header id |
| 31 | LIVE_METADATA | `SabrLiveMetadata` |
| 35 | NEXT_REQUEST_POLICY | `SabrNextRequestPolicy` (pose le backoff) |
| 37 | FORMAT_SELECTION_CONFIG | `SabrFormatSelectionConfig` |
| 42 | FORMAT_INITIALIZATION_METADATA | `SabrFormatInitializationMetadata` |
| 43 | SABR_REDIRECT | `SabrRedirect` |
| 44 | SABR_ERROR | `SabrError` |
| 45 | SABR_SEEK | `SabrSeek` |
| 46 | RELOAD_PLAYER_RESPONSE | `SabrReloadPlayerResponse` (pose reloadRequested) |
| 47 | PLAYBACK_START_POLICY | `SabrPlaybackStartPolicy` |
| 51 | SELECTABLE_FORMATS | `SabrSelectableFormats` |
| 52 | REQUEST_IDENTIFIER | `SabrRequestIdentifier` |
| 53 | REQUEST_CANCELLATION_POLICY | `SabrRequestCancellationPolicy` |
| 57 | SABR_CONTEXT_UPDATE | `SabrContextUpdate` |
| 58 | STREAM_PROTECTION_STATUS | `SabrStreamProtectionStatus` (pose status + maxRetries) |
| 59 | SABR_CONTEXT_SENDING_POLICY | `SabrContextSendingPolicy` |
| 65 | PREWARM_CONNECTION | `SabrPrewarmConnection` |
| 67 | SNACKBAR_MESSAGE | `SabrSnackbarMessage` |

Plus des ids connus-mais-non-parsés (30 CONFIG, 32–34 hints live-metadata, 36/38 metadata ustreamer, 48–50 hints cache/bande passante, 54–56, 60–64, 66) seulement résumés, et tout id inconnu enregistré via `addUnknownPartType`. Voir la [référence des control parts](./sabr-control-parts) pour ce que font les riches.

## La boucle de décodage

![Pipeline de décodage](/diagrams/sabr-extractor-decode.png)

`SabrResponseDecoder.decode` lit toutes les parts d'abord, puis itère. Le seul état porté entre parts est le **header onesie courant** (un `ONESIE_HEADER` s'applique aux parts de données onesie qui le suivent). Chaque part est enregistrée dans l'ordre, puis dispatchée :

- **MEDIA_HEADER (20)** → décode et enregistre le header.
- **MEDIA (21)** → le 1er octet du payload est le **header id** ; la longueur restante est accumulée comme compte d'octets média de cet id.
- **MEDIA_END (22)** → 1er octet = header id, marque l'id complet.
- control parts riches → décode dans le champ typé de `SabrDecodedResponse` + un résumé humain.
- `NEXT_REQUEST_POLICY` a un traitement spécial : après décodage, le backoff est relu directement du **champ 4** proto (varint) comme `backoffTimeMs` faisant autorité.

## Streamer le décodage

`SabrResponseDecoder.decode(byte[])` lit toutes les parts d'abord, donc tout le body reste en mémoire. Ça va pour les petits rounds, mais un body de réponse en 4K fait 50-150 Mo, donc le bufferiser en entier est un gros transitoire.

`SabrStreamingResponseReader.read(InputStream)` est la contrepartie streaming, pour quand le body ne doit pas être tenu en entier. Il pilote `UmpReader.readStreaming` et assemble les segments MEDIA à la volée (via `SabrMediaSegmentCollector.Incremental`), en ne gardant que les petites control parts. Les gros payloads `MEDIA` deviennent des segments au fur et à mesure et ne sont jamais tous retenus, donc le pic mémoire est un seul segment en vol plutôt que le body entier. Il tient quand même le compte d'octets média par header-id, donc le résultat passe les mêmes contrôles `getIntegrityIssues()` que le chemin bufferisé sans tenir les octets, et renvoie un `Result` portant les segments assemblés plus un `SabrDecodedResponse` construit depuis les control parts.

## La réponse décodée

`SabrDecodedResponse` tient chaque part dans l'ordre plus des accesseurs typés : headers média, comptes d'octets média par header-id (`LinkedHashMap`, sommés), ids media-end, metadata format-init, live metadata, données onesie, et les control parts uniques (redirect, seek, error, reload, next-request policy, status de protection + max retries, backoff ms, …).

Les helpers d'analyse sont ce sur quoi la session branche :

- `hasMedia()` — des headers ou octets média.
- `isNoMediaResponse()` — l'inverse.
- `isPolicyOnlyResponse()` — pas de média mais une next-request policy (un round de pur rythme).
- `isProtectedNoMediaResponse()` — pas de média **et** `streamProtectionStatus >= 3` : la **frontière jeton PO** (status 3 + pas de média = mint un jeton).
- `getIntegrityIssues()` — contrôles croisés : `duplicate-media-header`, `missing-media`, `length-mismatch:expected=…:actual=…`, `missing-media-end`, `media-without-header`, `media-end-without-header`. La session traite tout résultat non-vide comme fatal.

---

Suite : [Média, segments et l'index](./sabr-media).
