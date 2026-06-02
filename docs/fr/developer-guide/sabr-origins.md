# Les origines de SABR

Un peu de contexte : pourquoi SABR existe, ce qui a changé à son arrivée, et où s'arrête son étude.

## Le problème qu'il a créé

Pendant longtemps, la lecture YouTube était simple à extraire. On résolvait une URL média ou un manifeste et on téléchargeait les octets. Puis ça a commencé à casser, par vagues qui semblaient aléatoires sans l'être. Des vidéos qui marchaient avant se mettaient soudain à échouer avec « contenu non supporté », parfois tout un lot d'un coup, parfois seulement pour certains comptes ou certaines régions.

Quelques signalements représentatifs :

- [#2330 — Content Not Yet Supported (SABR) after 5.1.0](https://github.com/InfinityLoop1308/PipePipe/issues/2330)
- [#2272 — « This content is not yet supported » quand un lien YouTube est envoyé](https://github.com/InfinityLoop1308/PipePipe/issues/2272)
- [#2318 — la plupart des vidéos ne se lancent plus, au hasard](https://github.com/InfinityLoop1308/PipePipe/issues/2318)

La cause n'était pas un parseur capricieux. C'était YouTube qui basculait la livraison du média vers SABR et qui, pour de plus en plus de vidéos, ne fournissait plus du tout d'URLs média classiques utilisables. Quand il n'y a rien à résoudre, l'ancien modèle d'extraction n'a rien à télécharger, et la seule chose honnête qu'il puisse signaler, c'est « non supporté ». Le correctif n'est pas un patch, c'est la compréhension d'un nouveau protocole.

## Ce que SABR a changé

SABR n'est pas un téléchargement, c'est une conversation. Le client ouvre une session et continue de dialoguer avec le serveur : il envoie son état de lecture courant, le serveur répond avec du média par petits morceaux plus des instructions pour la requête suivante, et ça se répète jusqu'à la fin de la lecture. [Le protocole SABR](./sabr-protocol) en couvre les détails.

Le volet protocole est, aujourd'hui, assez bien compris et implémenté ouvertement. La partie la plus dure est la couche de protection : sur certaines vidéos, le serveur arrête d'envoyer du média jusqu'à ce que le client prouve son identité avec un Proof of Origin token valide. C'est là que se concentre l'essentiel de la difficulté, et c'est traité dans [Dans BotGuard](./sabr-botguard) et [Attestation](./sabr-attestation).

## Où s'arrête l'analyse

La question évidente, une fois l'attestation comprise, est de savoir si le jeton peut être frappé entièrement hors ligne, sans navigateur dans la boucle. Ce n'est pas possible. Le secret qui signe le jeton vit sur le serveur, par conception. Vous pouvez comprendre parfaitement chaque couche côté client, ce secret n'est toujours pas à vous.

Cette documentation s'arrête donc là, volontairement. Ce n'est pas une impasse ni un chapitre manquant. Une intégration légitime exécute le vrai challenge, l'envoie comme un client normal, et utilise le jeton qu'elle reçoit en retour. Comprendre le protocole, c'est ce qui rend l'intégration solide ; cela ne retire pas, et ne doit pas retirer, le serveur de la boucle.

## Crédits et travaux antérieurs

Rien de tout ça n'est sorti de nulle part. SABR et l'attestation autour avaient déjà été cartographiés, au grand jour, par d'autres projets. Cette documentation s'appuie sur leur travail, et ils méritent un coup d'œil et une étoile :

- [LuanRT/googlevideo](https://github.com/LuanRT/googlevideo) — implémentation de référence du streaming SABR et du parsing UMP.
- [LuanRT/BgUtils](https://github.com/LuanRT/BgUtils) — le flux BotGuard et Proof of Origin token.
- [FreeTube](https://github.com/FreeTubeApp/FreeTube) — formes de requêtes d'un vrai client et gestion du jeton.
- [Piped](https://github.com/TeamPiped/Piped) — formes de requêtes, gestion des redirections et logique d'index de segments.
- [NewPipe / NewPipeExtractor](https://github.com/TeamNewPipe/NewPipeExtractor) — la base d'extracteur sur laquelle une grande partie de ceci repose.
- [Shaka Player](https://github.com/shaka-project/shaka-player) — concepts d'index de segments derrière les plages tampon.
