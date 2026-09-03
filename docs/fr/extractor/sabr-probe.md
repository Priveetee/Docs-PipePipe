# Démarrer une session

Partie de [SABR dans l'extracteur](./sabr). Dans le PipePipeExtractor actuel,
le parsing de la réponse player et le driver de session média sont séparés. Il
n'existe plus de `YoutubeSabrProbe` autonome ni d'enum de profils client dans le
code courant.

## De la réponse player à `YoutubeSabrInfo`

`YoutubeStreamExtractor.buildSabrInfoFromPlayerResponse(...)` est le point
d'entrée utilisé après le fetch de la réponse player **MWEB** sélectionnée. Il
construit l'objet immuable `YoutubeSabrInfo` consommé par
`YoutubeSabrSession` :

1. Lire `streamingData`. Une réponse qui ne le contient pas est rejetée comme
   une erreur de protocole SABR.
2. Lire `serverAbrStreamingUrl`, `videoPlaybackUstreamerConfig`, les données
   visiteur et `adaptiveFormats`.
3. Rassembler les signatures et paramètres `n` des URLs de formats adaptatifs
   et de l'endpoint SABR. S'il y en a, `YoutubeJavaScriptPlayerManager` effectue
   une seule déobfuscation par lot, puis les valeurs résolues sont réinjectées
   dans les URLs.
4. Convertir les formats adaptatifs en `YoutubeSabrInfo.Format` et conserver le
   jeton PO player optionnel si l'appelant en a fourni un.

`YoutubeSabrInfo` contient l'id de la vidéo, le CPN, la version client, les
données visiteur, l'endpoint SABR résolu, la configuration ustreamer, le jeton
PO optionnel et la liste de formats. Un format conserve son `ItagItem` parsé,
son type MIME, ses métadonnées de codec, l'identité de sa piste audio, le flag
DRC, l'URL/plage d'initialisation et la durée approximative. Cette classe
n'expose volontairement ni état HTTP ni état de décodeur.

## Créer les requêtes

La session se crée ainsi :

```java
YoutubeSabrSession session = new YoutubeSabrSession(info);
```

Un dossier de spool optionnel permet d'assembler sur disque les gros segments
média non compressés. L'appelant crée les requêtes immuables avec
`YoutubeSabrRequest` :

```java
YoutubeSabrRequest preparation = YoutubeSabrRequest.preparation(
    playerTimeMs, preferredFormats);
YoutubeSabrRequest playback = YoutubeSabrRequest.playback(
    playerTimeMs, playbackRate, tracks);
```

`preparation` demande les timelines de formats sans déclarer de pistes
sélectionnées. `playback` déclare une piste audio, une piste vidéo, ou une seule
des deux, et peut porter une `YoutubeSabrFormatTimeline` ainsi que le dernier
numéro de segment bufferisé pour chaque piste. Une requête ne peut pas contenir
deux pistes audio, deux pistes vidéo, ni le même itag à la fois en audio et en
vidéo.

## Envoyer une requête

`YoutubeSabrSession.requestOnce(request, consumer)` effectue au plus une
transaction HTTP. Il renvoie le nombre de segments média terminés, le backoff
du serveur et indique si l'appel a été différé parce qu'un backoff précédent est
encore actif. La session n'incrémente le numéro de requête qu'après avoir lu la
réponse. `YoutubeSabrRequestHelper` :

- ajoute `alr=yes`, le `cpn` et le numéro de requête (commençant à zéro) à
  l'endpoint SABR ;
- encode la requête en `VideoPlaybackAbrRequest` ;
- envoie le User-Agent et la localisation MWEB ;
- exige une réponse `application/vnd.yt-ump` ;
- lit les parts UMP en streaming via `SabrStreamingResponseReader`, afin de ne
  pas garder tout le corps HTTP en mémoire pour les gros médias ;
- renvoie un `YoutubeSabrResponse` avec les contrôles, les statistiques média et
  les objets `SabrMediaSegment` terminés.

Le consumer reçoit un segment dès qu'une part `MEDIA_END` le termine. Avec un
dossier de spool, les gros segments peuvent être lus depuis un fichier, y
compris progressivement pendant son écriture, via
`SabrMediaSegment.openStream()`.

## L'état conservé entre les requêtes

`YoutubeSabrSession` ne conserve que l'état du protocole : numéro de requête,
URL SABR courante après redirection, cookie de lecture, contextes SABR actifs,
jeton PO, estimation de bande passante, métadonnées live et compteurs de
diagnostic bornés. Une `NEXT_REQUEST_POLICY` peut mettre à jour le cookie et le
backoff. Les mises à jour de contexte et la politique d'envoi déterminent quels
contextes opaques seront renvoyés dans les requêtes suivantes.

La session valide les redirections avant de les accepter : elles doivent être en
HTTPS et rester sur `googlevideo.com` ou un de ses sous-domaines. Une réponse
contenant du média remet à zéro le compteur de redirections ; les médias
malformés ou incomplets sont classés pour une récupération bornée.

Suite : [La requête](./sabr-request).
