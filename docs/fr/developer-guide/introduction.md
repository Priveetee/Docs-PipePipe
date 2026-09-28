# SABR

Cette partie du wiki traite de SABR, le protocole que YouTube utilise désormais pour livrer le média, et de l'attestation qui garde les flux protégés.

SABR, pour Server Adaptive BitRate, est le protocole de diffusion que YouTube utilise de plus en plus à la place des simples URLs de média. Si vous développez ou maintenez un extracteur YouTube, cela vous concerne, parce que cela change le fonctionnement de bout en bout.

L'implémentation est répartie entre deux dépôts. L'
[extracteur](https://github.com/InfinityLoop1308/PipePipeExtractor) construit
les requêtes propres aux services et interprète leurs réponses, notamment les
données SABR/UMP. Le [client Android](https://github.com/InfinityLoop1308/PipePipeClient)
coordonne la lecture, pilote la session SABR et relie les formats décodés au
lecteur multimédia. Le dépôt de l'application choisit les révisions combinées
dans chaque build publié. Pour un comportement ou une limite précise, consultez
le code et l'historique des issues concernés : une modification de l'extracteur
ne suffit pas toujours à changer la lecture. Par exemple, l'
[issue #2973](https://github.com/InfinityLoop1308/PipePipe/issues/2973) et la
[PR #99 du client](https://github.com/InfinityLoop1308/PipePipeClient/pull/99)
documentent un cas de comptage de segments sur une vidéo très longue ; leurs
pages indiquent leur état actuel. YouTube fait évoluer ce flux : cette page
explique l'architecture et renvoie au code vivant pour les détails.

Pour entrer dans le code, regardez [`SabrResponseDecoder.java`](https://github.com/InfinityLoop1308/PipePipeExtractor/blob/main/extractor/src/main/java/org/schabi/newpipe/extractor/services/youtube/sabr/protocol/SabrResponseDecoder.java)
et [`YoutubeSabrSession.java`](https://github.com/InfinityLoop1308/PipePipeExtractor/blob/main/extractor/src/main/java/org/schabi/newpipe/extractor/services/youtube/sabr/YoutubeSabrSession.java)
côté extracteur, puis [`SabrDashMediaSource.java`](https://github.com/InfinityLoop1308/PipePipeClient/blob/dev/app/src/main/java/org/schabi/newpipe/player/datasource/SabrDashMediaSource.java)
côté client.

L'ancienne approche était surtout sans état. On résolvait une URL ou un manifeste, puis on téléchargeait les octets. SABR fonctionne plutôt comme une conversation. Le client ouvre une session et continue de dialoguer avec le serveur, en envoyant son état de lecture courant et en recevant le média par petits morceaux, jusqu'à la fin de la lecture.

![Pipeline SABR](/diagrams/sabr-pipeline.png)

Le schéma ci-dessus résume toute l'histoire en une image. Le client lit la configuration de streaming depuis la réponse du player, construit une requête et l'envoie. Le serveur répond avec un corps UMP qui transporte des parties typées, dont certaines sont du média et d'autres des instructions pour la requête suivante. Tant que le média continue d'arriver, le client assemble l'audio et la vidéo. Quand le serveur décide que le flux est protégé, il arrête d'envoyer du média jusqu'à ce que le client présente un Proof of Origin token valide.

## Ce que couvre cette section

C'est une description de niveau développeur du fonctionnement de SABR, écrite à partir de ce que nous avons observé en l'étudiant. Elle est découpée en quelques pages.

Pour le contexte, pourquoi YouTube est passé à SABR et où s'arrête l'analyse, voir [Les origines de SABR](./sabr-origins).

Le protocole lui-même, c'est la requête, la réponse UMP et l'état de session que le client conserve entre les appels. C'est sur [Le protocole SABR](./sabr-protocol).

Le volet protection est la partie la plus difficile. Le média protégé est verrouillé par un système d'attestation appelé BotGuard. Comment il est construit et pourquoi il est si difficile à analyser, c'est sur [Dans BotGuard](./sabr-botguard). Comment l'attestation circule réellement, et ce qu'est le Proof of Origin token, c'est sur [Attestation](./sabr-attestation).

## Une note sur le périmètre

Tout reste à un niveau logique : concepts, structure et flux, pas de constantes exactes, de noms internes ou de layouts bas niveau. Ces détails sont spécifiques à une version et fragiles, et ne sont pas nécessaires pour comprendre comment SABR fonctionne. L'objectif est d'expliquer le système assez clairement pour que la communauté puisse raisonner sur une intégration légitime.
