# Plages bufferisées et seeks

Partie de [SABR dans l'extracteur](./sabr). Le PipePipeExtractor actuel ne
possède ni buffer de lecture ni `YoutubeSabrStreamState` ; ces politiques vivent
dans la couche applicative qui construit les `YoutubeSabrRequest`.

## Ce que fournit l'extracteur

`YoutubeSabrRequest.Track` peut porter deux éléments d'état gérés par l'appelant :

- une `YoutubeSabrFormatTimeline`, parsée depuis les données d'initialisation ;
- `bufferedThrough`, le dernier numéro de séquence contigu que l'appelant veut
  déclarer.

Quand les deux sont présents et que `bufferedThrough > 0`,
`YoutubeSabrRequestHelper` écrit une `bufferedRange` qui commence au temps zéro
et se termine à la fin de la timeline de cette séquence. Les index de segments
commencent à un et la timescale vaut `1000`. Sans timeline, aucune plage
bufferisée n'est émise pour cette piste.

C'est volontairement conservateur : l'appelant ne doit jamais déclarer une plage
au-delà d'un trou. Annoncer une séquence plus loin alors qu'un segment précédent
manque peut faire sauter ce média par le serveur et bloquer le lecteur.

## Seeks

Pour un seek, la couche applicative peut obtenir la séquence avec
`YoutubeSabrFormatTimeline.getSequenceAt(timeMs)`, gérer son cache puis créer une
nouvelle `YoutubeSabrRequest.playback` avec le temps cible et des plages
contiguës honnêtes. SABR ne fournit pas d'API de cache client dans l'extracteur.

La recherche renvoie la séquence `1` pour les temps non positifs, la première
entrée dont la fin dépasse le temps demandé, ou une séquence après la dernière si
le temps dépasse l'index. Les index MP4 et WebM sont parsés depuis les octets
d'initialisation ; il faut attendre une timeline valide avant d'annoncer une
couverture de seek précise.

Suite : [Le driver de session](./sabr-session).
