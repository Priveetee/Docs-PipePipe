# L'extracteur

L'application Android et l'**extracteur** ont des rôles distincts. L'extracteur
est une bibliothèque Java autonome qui gère les requêtes propres aux services,
leur parsing et les résultats structurés : une vidéo avec ses flux, une chaîne
et ses onglets, une playlist, une page de résultats ou un fil de commentaires.
L'application lui fournit le téléchargeur réseau et transforme ces résultats
en écrans, lectures et téléchargements.

![Vue d'ensemble de l'extracteur](/diagrams/extractor-overview.png)

Il a commencé comme un fork de l'extracteur de NewPipe, et le chemin de package (`org.schabi.newpipe.extractor`) en porte encore la trace. Cela mérite d'être dit une fois, puis mis de côté : les deux bases de code ont fortement divergé. Les services, les abstractions, le parsing et le comportement diffèrent suffisamment pour que la documentation, les issues et les patchs de NewPipe se transposent rarement proprement sur PipePipe. Considérez-la comme une base de code à part entière, pas comme un miroir de NewPipe.

Le dépôt de l'application PipePipe intègre des révisions précises des deux
composants pour chaque build publié. Consultez le
[dépôt de l'application PipePipe](https://github.com/InfinityLoop1308/PipePipe)
pour savoir quelles révisions sont incluses dans un build donné, et le
[code de PipePipeExtractor](https://github.com/InfinityLoop1308/PipePipeExtractor)
pour la bibliothèque elle-même. Le chemin d'extraction YouTube est décrit dans
[YouTube](./youtube-service) ; SABR traverse l'extracteur et le lecteur Android,
comme l'explique le [guide SABR](/fr/developer-guide/introduction).

Le module est autonome. Il se compile et se teste seul, sans l'application Android autour de lui, face à une petite abstraction `Downloader` fournie par l'hôte.

Services couverts aujourd'hui : YouTube, BiliBili, NicoNico, SoundCloud, Bandcamp, PeerTube et media.ccc.de. Chacun est une implémentation distincte d'un même ensemble d'interfaces partagées. C'est le principe de conception : le reste du code est écrit face aux abstractions, jamais face à un site précis. « Récupérer les flux de cette vidéo » est le même appel que le backend soit YouTube ou SoundCloud ; le désordre propre à chaque service reste derrière l'interface.

Cette uniformité est aussi la raison pour laquelle l'extracteur est la couche fragile. Les interfaces sont stables ; les sites derrière elles ne le sont pas. Un service peut changer sa mise en page ou son API du jour au lendemain et casser l'extraction pour lui seul pendant que les autres continuent de fonctionner. L'essentiel du travail ici consiste à maintenir chaque service au pas avec un site qui n'a jamais accepté d'être parsé, et YouTube en est l'exemple le plus bruyant.

## Ce que couvre cette section

Une visite de niveau développeur de la façon dont l'extracteur est construit, destinée aux contributeurs qui lisent le code.

- [Architecture](./architecture) : le point d'entrée `StreamingService` et la famille d'extracteurs qui en découle.
- [Flux d'extraction](./extraction-flow) : ce qui se passe d'une URL jusqu'à un `StreamInfo` terminé.
- [Flux et delivery](./streams-and-delivery) : comment le média est décrit une fois l'extraction terminée, les flux, formats et `DeliveryMethod` que le player consomme. C'est aussi là que cela rejoint SABR.
