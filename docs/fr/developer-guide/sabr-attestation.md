# Attestation

Pour renvoyer du média protégé, SABR a besoin d'un Proof of Origin token dans le contexte de la requête. Cette page explique d'où vient ce jeton et comment le côté serveur se comporte, à un niveau logique. Elle ne décrit pas comment en forger un, ce qui n'est de toute façon pas possible depuis le client, comme l'explique la dernière section.

## Le flux

Obtenir un jeton est une chaîne d'étapes. Le client récupère un challenge, l'exécute, envoie le résultat à Google, reçoit un integrity token en retour, et frappe un jeton lié à la vidéo précise.

![Flux d'attestation](/diagrams/attestation-flow.png)

Tout commence quand le client récupère un challenge d'attestation depuis YouTube. Ce challenge s'exécute dans BotGuard, la VM décrite dans [Dans BotGuard](./sabr-botguard), qui mesure l'environnement et produit un snapshot. Le snapshot part vers un point d'accès Google appelé GenerateIT, qui le vérifie et renvoie un integrity token. À partir de cet integrity token, le client frappe un Proof of Origin token pour la vidéo qu'il veut lire, et le place dans le contexte de la requête SABR.

## Ce que le serveur renvoie

Vu de l'extérieur, GenerateIT se comporte de quelques façons constantes qu'il est utile de connaître quand on construit dessus.

Un snapshot valide renvoie un jeton accompagné d'une durée de vie, autour de douze heures. Le même snapshot valide peut être réutilisé, l'appel n'est pas à usage unique. Quand le snapshot est invalide ou tronqué, le point d'accès ne renvoie pas une erreur HTTP. Il renvoie une réponse dégradée sans vrai jeton, donc une intégration doit vérifier qu'elle a bien reçu un jeton utilisable plutôt que de supposer que tout va bien à partir du code de statut.

Une conséquence utile de cette durée de vie, c'est qu'une seule attestation s'amortit sur de nombreuses vidéos. Vous n'avez pas besoin d'exécuter tout le challenge pour chaque vidéo. La partie coûteuse tourne une fois, et à partir d'elle le client peut frapper des jetons par vidéo tant que l'integrity token est valide.

![Cycle de vie du jeton](/diagrams/token-lifecycle.png)

## Pourquoi cela ne peut pas se faire hors ligne

C'est la partie à intégrer quand on est intégrateur.

L'integrity token est émis sur les serveurs de Google, à l'aide d'un secret qui ne les quitte jamais. Aucun reverse engineering côté client ne vous donne ce secret. Vous pouvez comprendre chaque couche de BotGuard et rester incapable de signer un jeton vous-même, parce que la racine de confiance est sur le serveur, par conception.

Une intégration correcte ne falsifie donc rien. Elle exécute le vrai challenge dans un véritable runtime JavaScript ou une WebView, envoie le snapshot à GenerateIT comme un client normal, et utilise le jeton qu'elle reçoit en retour. Comprendre le protocole rend l'intégration robuste. Cela ne retire pas le serveur de la boucle, et ce n'est pas le but.

## Ça va continuer de changer

SABR et BotGuard sont des cibles mouvantes. YouTube va presque certainement continuer de les faire évoluer avec le temps, et une partie de ce qui est décrit ici finira par être dépassée. Quand ça arrivera, cette documentation sera mise à jour pour suivre. Considérez-la comme une description vivante d'un système encore en évolution, pas comme le dernier mot.
