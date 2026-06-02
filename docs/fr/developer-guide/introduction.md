# SABR

Cette partie du wiki traite de SABR, le protocole que YouTube utilise désormais pour livrer le média, et de l'attestation qui garde les flux protégés.

SABR, pour Server Adaptive BitRate, est le protocole de diffusion que YouTube utilise de plus en plus à la place des simples URLs de média. Si vous développez ou maintenez un extracteur YouTube, cela vous concerne, parce que cela change le fonctionnement de bout en bout.

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
