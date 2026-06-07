# Flux et delivery

`extractStreams` produit les formats que le lecteur consomme. Le résultat n'est pas une seule liste mais trois, et chaque entrée décrit à la fois *ce qu'est* le média et *comment* on l'obtient.

![Flux et delivery](/diagrams/streams-and-delivery.png)

## Trois listes, pas une

`StreamInfo` porte le média lisible dans trois listes distinctes, plus les sous-titres :

```java
List<VideoStream>     videoStreams;      // muxed: video + audio together
List<AudioStream>     audioStreams;      // audio only
List<VideoStream>     videoOnlyStreams;  // video with no audio track
List<SubtitlesStream> subtitles;
```

La séparation est tout l'enjeu. Les formats progressifs livrent une seule piste muxée, c'est `videoStreams`. La lecture adaptative associe au contraire un `videoOnlyStream` à un `audioStream` séparé et laisse le lecteur choisir chacun indépendamment selon la bande passante. L'extracteur fait remonter les trois afin que le lecteur puisse choisir sa propre combinaison, plutôt que de laisser l'extracteur décider à sa place.

## Ce qu'est un `Stream`

Les trois étendent `Stream` (qui est `Serializable`). Un `Stream` répond à deux questions.

**Ce qu'est le média :**

- `getFormat()` renvoie un `MediaFormat` (conteneur et codec, avec un type MIME et un suffixe de fichier) ; `getFormatId()` pour l'identifiant brut.
- `AudioStream` ajoute `averageBitrate`, l'identifiant / le nom / la locale de la piste audio, et l'itag sous-jacent (`ItagItem`).
- `VideoStream` ajoute `resolution`, `fps`, largeur et hauteur, et `isVideoOnly`.

**Comment l'obtenir :**

- `getDeliveryMethod()` renvoie une `DeliveryMethod`.
- `getContent()` plus `isUrl()` : le contenu est soit une URL directe (`isUrl == true`), soit un blob de manifeste en ligne (`isUrl == false`), selon la méthode de delivery ; `getManifestUrl()` couvre le cas du manifeste par URL.

Les flux sont comparés par méthode de delivery et identifiant, pas par URL (`equalStats` / `equals`). Les URLs de média sont éphémères et signées, elles font donc une identité inutile.

## `DeliveryMethod`

```java
enum DeliveryMethod { PROGRESSIVE_HTTP, DASH, HLS, SS, TORRENT, SABR }
```

- **`PROGRESSIVE_HTTP`** : une simple URL de média servie par des GET sur plages d'octets. Le cas simple.
- **`DASH` / `HLS` / `SS`** : un manifeste adaptatif (une URL ou un blob en ligne) ; le lecteur pilote la sélection des segments à partir de lui.
- **`SABR`** : le protocole de session de YouTube. Il n'y a ni URL simple ni manifeste statique : le client ouvre une session et continue de dialoguer avec le serveur pendant toute la lecture.
- **`TORRENT`** existe par souci d'exhaustivité et n'est pas utilisé sur le chemin YouTube.

## Là où cela rejoint SABR

Pour toutes les méthodes de delivery sauf SABR, le lecteur se retrouve avec une URL ou un manifeste, et ExoPlayer prend le relais à partir de là. SABR est l'exception. Un flux SABR n'est pas quelque chose que l'on télécharge une fois ; c'est une conversation que l'on entretient, requête, réponse UMP, segments, requête de suivi, avec l'attestation qui garde le média protégé.

Le travail de l'extracteur s'arrête au fait de marquer le flux `SABR` et de transmettre les pièces dont une session a besoin. Piloter cette session est un sujet à part entière : tout le [Guide SABR](/fr/developer-guide/introduction).
