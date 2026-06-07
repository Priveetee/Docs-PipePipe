# Les services en un coup d'oeil

YouTube a [sa propre page](./youtube-service). Les six autres services sont plus petits, mais chacun a une particularité qui vaut le coup d'être connue avant d'ouvrir son code. Tous implémentent le même contrat `StreamingService` ; ce qui change, c'est leur façon de récupérer les données et ce qu'ils supportent.

## SoundCloud (id 1)

Audio et commentaires. Il dialogue avec l'API REST `api-v2.soundcloud.com`. Le piège : il n'y a pas de clé d'API fixe, le `client_id` est récupéré à l'exécution depuis le JavaScript du frontend de SoundCloud (un motif `,client_id:"..."` dans un script `sndcdn.com`) puis ajouté à chaque appel. Les charts sont un kiosque ; il propose aussi des suggestions et l'import des abonnements. Pas de vidéo.

## BiliBili (id 5)

Vidéo, commentaires, bullet comments et SponsorBlock, le service le plus complexe. Les URL de flux viennent du JSON `api.bilibili.com`, mais la plupart des appels doivent être **signés WBI** : il récupère une table de permutation tournante depuis `/x/web-interface/nav`, construit une clé mixin, et estampille les requêtes avec `w_rid` + `wts`. Il fabrique aussi un jeu de cookies/tickets (`buvid3/4`, `b_lsid`, `bili_ticket`, ...). Les bullet comments (danmaku) arrivent de deux façons : un dump binaire compressé en zlib pour la VOD, et un flux WebSocket `DANMU_MSG` pour le direct. Le contenu premium passe par un endpoint PGC distinct. Attendez-vous à ce que la signature et les histoires de table demandent de la maintenance.

## NicoNico (id 6)

Vidéo et bullet comments (les commentaires ordinaires sont désactivés). Hybride : il scrape la page de visionnage pour un blob JSON `script#embedded-data`, puis appelle `nvapi.nicovideo.jp` avec des en-têtes `X-Frontend-Id`. La lecture est une négociation : POST vers `.../access-rights/hls` avec les résolutions et l'audio voulus, on récupère une URL HLS chiffrée (réponses gzip). Plusieurs classes de contenu sont protégées par une connexion.

## PeerTube (id 3)

Vidéo et commentaires, et le seul à être fédéré. Il n'y a pas de backend unique : le service est lié à une **instance** (par défaut `framatube.org`, configurable par l'utilisateur), et l'URL de l'instance *est* la base de l'API (`/api/v1/...`). Du JSON simple, sans signature. Trending / Most-liked / Recent / Local sont des kiosques ; les channels exposent des onglets `CHANNELS` et `PLAYLISTS`.

## Bandcamp (id 4)

Audio et commentaires. Surtout du scraping HTML : les données d'album et de piste viennent d'un attribut JSON `data-tralbum` sur la page. Deux kiosques : Featured, et l'émission radio hebdomadaire, cette dernière via une API `bcweekly` dédiée et son propre extracteur de flux radio (sélectionné selon l'URL).

## media.ccc.de (id 2)

Audio et vidéo, pas de commentaires. Une API JSON publique et propre (`api.media.ccc.de/public/events/{id}`). Le contenu est organisé autour des **conférences** : une conférence est un channel, et les kiosques sont conferences / recent / live. Récupération en deux étapes : les métadonnées de l'événement d'abord, puis la conférence parente via une URL contenue dans l'événement.

## Référence rapide

| Service | id | Média | Récupération | À surveiller |
|---|---|---|---|---|
| SoundCloud | 1 | audio, commentaires | REST api-v2 | `client_id` dynamique depuis le JS |
| media.ccc.de | 2 | audio, vidéo | API JSON publique | centré conférence, pas de commentaires |
| PeerTube | 3 | vidéo, commentaires | JSON par instance | fédéré, instance = base de l'API |
| Bandcamp | 4 | audio, commentaires | scrape HTML + JSON | blob `data-tralbum`, émission radio |
| BiliBili | 5 | vidéo, commentaires, danmaku, SponsorBlock | JSON api.bilibili.com | signature WBI + cookie/ticket |
| NicoNico | 6 | vidéo, danmaku | HTML + nvapi | connexion requise, POST access-rights HLS |
