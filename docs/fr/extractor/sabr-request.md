# La requête

Partie de [SABR dans l'extracteur](./sabr). Ici : le `VideoPlaybackAbrRequest` binaire qu'encode `YoutubeSabrRequestBuilder`, champ par champ, plus le wire format en dessous.

> Les *noms* de champs ci-dessous sont les libellés reverse-engineered du projet (surtout via la field map de `SabrRequestDumper`). Les *numéros* de champs et les wire types sont pris tels quels dans l'encodeur.

## Le message top-level

`buildFirstMediaRequest` (cold start) et `buildFollowUpMediaRequest` écrivent ces champs top-level :

| # | Wire | Porte | 1re req | Follow-up |
| --- | --- | --- | --- | --- |
| 1 | message | `clientAbrState` (voir plus bas) | oui (playerTime=0) | oui |
| 2 | message | `formatId` sélectionné (un par track) | non | oui |
| 3 | message | `bufferedRange` (répété) | non | oui |
| 4 | varint | `playerTimeMs` top-level | non | oui (gated) |
| 5 | bytes | ustreamer config (base64-décodé) | oui | oui |
| 16 | message | `formatId` **audio** préférés (répété) | oui | oui |
| 17 | message | `formatId` **vidéo** préférés (répété) | oui | oui |
| 19 | message | `streamerContext` (voir plus bas) | oui | oui |

`formatId` est un petit sous-message utilisé partout où un format est nommé : `#1 itag` (int32), `#2 lastModified` (uint64, seulement si > 0), `#3 xtags` (string, seulement si non-vide).

Donc **cold start vs follow-up** diffère par : un cold start n'a pas de formats sélectionnés, pas de buffered ranges, pas de player time top-level, et `playerTimeMs = 0` ; il ne porte pas encore de cookie de session ni de jeton PO. Le flag follow-up débloque aussi les champs `clientAbrState` conditionnels ci-dessous. Toute la progression de session, player time, buffered ranges, formats sélectionnés, cookie, jeton PO, contextes actifs, est lue depuis `YoutubeSabrStreamState`.

## `clientAbrState` (champ 1)

Le sous-message le plus riche. Le cœur toujours écrit :

| # | Wire | Sens |
| --- | --- | --- |
| 28 | uint64 | `playerTimeMs` |
| 21 | int32 | sticky resolution (`max(videoHeight, 360)` ou un override) |
| 34 | int32 | visibility |
| 35 | fixed32 | playback rate (défaut `1.0`) |
| 40 | int32 | enabled track types bitfield (écrit seulement si ≠ 0 ; `0 = VIDEO_AND_AUDIO`, `1 = AUDIO_ONLY`, `2 = VIDEO_ONLY`) |
| 46 | bool | DRC enabled (seulement si le format audio est DRC) |
| 69 | string | audio track id (si présent) |

Les ajouts follow-up / "official web" incluent `#16` dernière résolution manuelle, `#18`/`#19` largeur/hauteur viewport, `#23` estimation de bande passante (valeur d'état, sinon `(audioBitrate + videoBitrate) * 2`, sinon -1). Quand le profile mime le client web officiel, un bloc supplémentaire (`#29` time-since-last-seek, `#36` elapsed wall time, `#39` time-since-last-action, `#58` preferVp9=false, `#59` AV1 quality threshold, `#72` quality constraints, `#79` playback authorization, …) est rempli avec les constantes caractéristiques du client web pour que la requête soit indistinguable d'un vrai navigateur.

## Buffered ranges (champ 3)

Chaque `SabrBufferedRange.toProto()` :

| # | Wire | Champ |
| --- | --- | --- |
| 1 | message | `formatId` |
| 2 | uint64 | `startTimeMs` |
| 3 | uint64 | `durationMs` |
| 4 | int32 | `startSegmentIndex` |
| 5 | int32 | `endSegmentIndex` |
| 6 | message | time range (seulement si activé) : `#1 startTimeMs`, `#2 durationMs`, `#3 timescale` |

`SabrBufferedRange.full(format)` est la range "j'ai tout" (`startTimeMs=0`, tout le reste à `Integer.MAX_VALUE`), pour déclarer un track entièrement bufferisé. Comment les vraies ranges sont calculées, c'est l'objet du [modèle buffered](./sabr-buffered).

## Streamer context (champ 19)

| # | Wire | Porte |
| --- | --- | --- |
| 1 | message | `clientInfo` |
| 2 | bytes | **jeton PO** (seulement si présent) |
| 3 | bytes | **playback cookie** (seulement si présent) |
| 5 | message | `SabrContextUpdate` actifs (répété) |
| 6 | int32 | types de contexte SABR non envoyés (répété) |

`clientInfo` porte le client id (`#16`), la version (`#17`), nom/version d'OS (`#18`/`#19`), et `Accept-Language`/région (`#21`/`#22`) ; en mode official-web la forme change un peu (champ 1 = `"en_US"`, champ 18 = `"X11"`).

## Le wire format (`SabrProto`)

Un writer/reader protobuf fait main. Wire types : `VARINT=0`, `FIXED64=1`, `LENGTH_DELIMITED=2`, `FIXED32=5`. Un tag de champ est `varint((fieldNumber << 3) | wireType)`. Les varints sont du LEB128 standard (7 bits/octet, bit de poids fort = continuer). `writeMessage` est juste un `writeBytes` length-delimited (un sous-message est des bytes). `writeInt32` passe par `writeUInt64` avec extension de signe, donc un int négatif devient un varint de 10 octets. Le côté lecture (`readFields`, `Cursor`) est ce sur quoi chaque `Sabr*.decode()` est bâti.

`SabrRequestDumper` re-décode un body de requête fini en un résumé une-ligne sanitisé pour le diagnostic, jeton PO, cookie, ustreamer config et audio-track id sont réduits à des compteurs d'octets, jamais imprimés.

## Cold-start PO token

`SabrColdStartPoToken` synthétise un jeton placeholder pour le tout premier contact : un header de 8 octets (2 octets de clé aléatoire, un octet d'état client, un timestamp epoch-secondes big-endian) plus l'identifiant, length-préfixé en champ protobuf 4, puis obfusqué par un XOR roulant à clé de 2 octets. `MAX_IDENTIFIER_BYTES = 118`. C'est une obfuscation déterministe, pas un jeton attesté ; un vrai jeton lié au contenu vient toujours du [provider de jeton PO](./sabr-session#protection-et-jetons).

---

Suite : [UMP et décodage](./sabr-decoding).
