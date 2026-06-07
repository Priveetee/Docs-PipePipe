# À l'intérieur du service YouTube

YouTube est le service le plus gros et le plus volatil, et celui qui a le plus de chances de vous envoyer dans le code. Voici la carte.

![À l'intérieur du service YouTube](/diagrams/youtube-service.png)

## Les clients InnerTube

Il n'y a pas d'API YouTube publique ici. L'extracteur parle **InnerTube**, le RPC interne de YouTube, en se faisant passer pour des clients officiels. Chaque client est un bloc de contexte (nom, version, plateforme, appareil) plus un endpoint. `YoutubeParsingHelper` les construit :

```java
prepareDesktopJsonBuilder(...)       // WEB
prepareAndroidVRJsonBuilder(...)     // ANDROID_VR (Oculus Quest)
prepareIosMobileJsonBuilder(...)     // IOS
prepareTvHtml5EmbedJsonBuilder(...)  // TVHTML5 embedded
prepareSafariJsonBuilder(...)        // WEB with a Safari user agent
```

Les ids et versions de client vivent dans `ClientsConstants`. Les requêtes POST vers `youtubei/v1/<endpoint>` (`player`, `next`, `browse`, `search`) passent par `getJsonPostResponse` et ses variantes android/ios. Des clients différents exposent des jeux de flux différents et déclenchent des murs différents, donc une seule récupération interroge souvent plusieurs clients et fusionne les résultats, le fan-out parallèle `CancellableCall` du [Flux d'extraction](./extraction-flow).

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

Le chemin de delivery le plus récent est **SABR**, le protocole de session de YouTube, et il a son propre package (`services/youtube/sabr`, des dizaines de classes : `YoutubeSabrSession`, `YoutubeSabrStreamState`, `YoutubeSabrRequestBuilder`, `SabrResponseDecoder`, `UmpReader`, ...). L'extracteur de flux fait remonter les formats SABR ; piloter la session est un sujet à part entière. Le [Guide SABR](/fr/developer-guide/introduction) dédié couvre ce protocole de bout en bout.
