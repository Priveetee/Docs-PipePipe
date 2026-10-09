# À l'intérieur du service YouTube

YouTube est le service le plus gros et le plus volatil, et celui qui a le plus de chances de vous envoyer dans le code. Voici la carte.

![À l'intérieur du service YouTube](/diagrams/youtube-service.png)

## Les clients InnerTube

Il n'y a pas d'API YouTube publique ici. L'extracteur parle **InnerTube**, le
RPC interne de YouTube, en envoyant le contexte attendu par un client officiel.
Ce contexte contient un nom/version de client, des détails de plateforme ou
d'appareil, la langue, le pays et l'endpoint appelé.

Les chemins de lecture actuels sont sélectionnés dans `YoutubeStreamExtractor` :

```java
fetchVisionOsJsonPlayer(...)       // chemin VisionOS anonyme
fetchMwebJsonPlayer(...)           // réponse MWEB ; SABR pour une VOD ordinaire
fetchWebJsonPlayer(...)            // réponse WEB utilisée en interne
fetchConfiguredJsonPlayer(...)     // fallbacks TVHTML5 internes
```

L'application Android expose actuellement **VisionOS** et **MWEB (SABR)** quand
elle est déconnectée, et maintient les sessions connectées sur **MWEB (SABR)**.
L'ancien choix Android VR ne fait plus partie du client actuel. `web`,
`tv_simply` et `tv_downgraded` restent des noms d'implémentation ou de fallback,
pas des choix visibles ; le chemin TV downgraded possède aussi un traitement
spécifique des directs/HLS.

### L'extinction de VisionOS

**VisionOS** est l'endpoint par défaut en mode anonyme. Le client Android le
choisit quand aucun cookie n'est stocké, et **MWEB (SABR)** dès qu'une session
existe (`App.reconcileYoutubePlayerClient` dans PipePipeClient). Pendant
longtemps, c'était le chemin qui fonctionnait sans compte ; YouTube est en train
de le retirer.

Ce sont les requêtes média qui échouent, pas l'extraction. La réponse player est
toujours lue et liste toujours des formats ; c'est un chunk média plus tard dans
la lecture qui revient en HTTP 403. Dans les rapports utilisateurs, cela donne un
**Source error**, `ERROR_CODE_IO_BAD_HTTP_STATUS`, et le plus souvent un arrêt
vers 0:59.

Les réponses des mainteneurs depuis septembre 2026 donnent toutes la même marche
à suivre : passer **Paramètres → Avancé → Point de terminaison d'extraction
YouTube** sur **MWEB (SABR)**
([#2931](https://github.com/InfinityLoop1308/PipePipe/issues/2931),
[#2935](https://github.com/InfinityLoop1308/PipePipe/issues/2935),
[#2992](https://github.com/InfinityLoop1308/PipePipe/issues/2992)). MWEB est
aussi le seul chemin qui construit des flux SABR, donc celui qui continue de
recevoir du travail. Ce n'est pas une solution gratuite : MWEB a besoin que
`googleapis.com` et `google.com` soient joignables pour le jeton proof-of-origin,
donc un filtrage DNS le casse autrement.

Un détail utile à la lecture du code : `NewPipe.setYoutubePlayerClient()`
n'accepte que `mweb`, `visionos` et la valeur interne `tv_downgraded`. Toute
autre valeur, y compris une préférence laissée par une ancienne version,
retombe sur `visionos`.

Les ids et versions de client vivent dans `ClientsConstants` et les helpers de
requêtes. Les requêtes POST vers `youtubei/v1/<endpoint>` (`player`, `next`,
`browse`, `search`) passent par les helpers JSON correspondants. Des clients
différents exposent des jeux de flux différents et déclenchent des murs
différents, donc une récupération interroge souvent plusieurs réponses et
fusionne les résultats, avec le fan-out parallèle `CancellableCall` du [Flux
d'extraction](./extraction-flow).

## Signatures et le paramètre `n`

YouTube protège les URL de flux de deux façons : une **signature** brouillée, et un **paramètre `n`** de throttling qui plombe la vitesse de lecture s'il n'est pas transformé. La méthode habituelle pour résoudre les deux est de télécharger le `base.js` du lecteur et d'exécuter son JavaScript.

Ce fork procède différemment, et c'est la plus grosse divergence avec l'amont. Au lieu d'exécuter `base.js` dans Rhino sur l'appareil, `YoutubeApiDecoder` délègue la transformation à un service hébergé par PipePipe :

```java
YoutubeApiDecoder.decodeSignature(playerId, sig);            // POST api.pipepipe.dev/decoder/decode
YoutubeApiDecoder.decodeThrottlingParameter(playerId, nParam);
```

`YoutubeJavaScriptPlayerManager` est la porte d'entrée (`getSignatureTimestamp`, `deobfuscateSignature`, `getUrlWithThrottlingParameterDeobfuscated`), avec mise en cache des résultats. Rhino reste une dépendance, mais le chemin chaud est le décodeur distant. Gardez ça en tête pour les scénarios hors-ligne ou d'auto-hébergement : le déchiffrement des URL de flux dépend de la joignabilité de ce service.

## `ItagItem` : de l'itag au format

YouTube identifie chaque format par un **itag** entier. `ItagItem` est la table de correspondance : une liste statique qui associe un itag à son `ItagType` (`AUDIO`, `VIDEO`, `VIDEO_ONLY`), son `MediaFormat`, et sa résolution/fps ou son débit. `getItag(id)` en résout un ; l'extracteur de flux s'en sert pour remplir le codec, la résolution, et les plages d'octets init/index dont un manifeste DASH a besoin.

## Créateurs de manifeste DASH

Certains formats YouTube n'arrivent pas sous forme de manifeste prêt à l'emploi, donc le package `dashmanifestcreators` en synthétise un :

- **`YoutubeProgressiveDashManifestCreator`** : enveloppe une URL progressive en DASH à l'aide de plages d'octets.
- **`YoutubeOtfDashManifestCreator`** : flux par séquences OTF ("on the fly"), récupérés en `sq=0`, `sq=1`, ...
- **`YoutubePostLiveStreamDvrDashManifestCreator`** : directs terminés (DVR).

`DeliveryType` (`PROGRESSIVE`, `OTF`, `LIVE`) sélectionne celui qui s'applique.

## SABR

Le chemin de delivery le plus récent est **SABR**, le protocole de session de
YouTube, et il a son propre package (`services/youtube/sabr`, notamment
`YoutubeSabrSession`, `YoutubeSabrRequest`, `YoutubeSabrRequestHelper`,
`YoutubeSabrResponse`, `SabrResponseDecoder` et `UmpReader`). Dans l'extracteur
actuel, MWEB utilise le constructeur de flux SABR pour les vidéos ordinaires qui
ne sont pas des directs lorsque la réponse du lecteur contient les données SABR ;
les directs et post-directs peuvent passer par HLS ou d'autres formats directs.
L'extracteur de flux expose les formats SABR et le driver de session renvoie des
segments média terminés. Le [Guide SABR](/fr/developer-guide/introduction) dédié
couvre ce protocole de bout en bout.
