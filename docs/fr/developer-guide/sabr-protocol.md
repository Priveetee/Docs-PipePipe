# Le protocole SABR

Une session SABR est un aller-retour. Le client décrit qui il est et où en est la lecture, le serveur répond avec du média et des instructions, et le client se sert de ces instructions pour demander le morceau suivant. Cette page parcourt la requête, la réponse, et l'état qui relie les deux.

## La requête

Chaque appel envoie un objet de requête qui indique trois choses au serveur. Qui demande, quels formats le client veut, et où en est la lecture en ce moment.

En pratique, cela veut dire que la requête transporte les formats audio et vidéo sélectionnés, les plages déjà mises en mémoire tampon pour chacun, le temps de lecture courant, et un jeton de continuité que la réponse précédente a renvoyé. Quand la protection entre en jeu, elle transporte aussi les données d'attestation dans le contexte client.

La première requête d'une session est un démarrage à froid. Elle ne revendique encore aucune plage tampon, donc le serveur répond avec les métadonnées d'initialisation des formats et le premier média, y compris les segments d'init qui mettent en place chaque piste. Les requêtes suivantes sont des relances : elles transportent l'état grandissant, les plages tampon et le jeton de continuité, pour que le serveur n'envoie que la suite. Se tromper sur cette distinction, par exemple envoyer un état façon relance dès le tout premier appel, fait sauter l'initialisation au serveur et la session ne démarre jamais proprement.

![Démarrage à froid contre relance](/diagrams/coldstart-vs-followup.png)

## La réponse est en UMP

Le serveur ne répond pas avec un fichier plat. Il répond avec un corps UMP, qui est un flux de parties typées préfixées par leur longueur. Chaque partie a un type, et le client les lit dans l'ordre, en traitant les types qu'il comprend et en ignorant le reste.

![Anatomie d'une réponse UMP](/diagrams/ump-anatomy.png)

Les parties se regroupent en gros en trois familles. Les descripteurs plantent le décor : les métadonnées d'initialisation par format et la liste des formats sélectionnables. Le média est la charge utile elle-même, et il arrive comme une petite séquence : un en-tête qui décrit un segment à venir, les octets du segment, puis un marqueur de fin. Les instructions pilotent le tour suivant : la politique de requête suivante indique au client jusqu'où lire en avance et lui rend le jeton de continuité à renvoyer, et le statut de protection du flux dit si le flux est encore ouvert ou s'il a été verrouillé.

Une même réponse mélange en général les trois. Le client parcourt les parties, en collectant le média au passage et en enregistrant les instructions pour que la requête suivante ait la bonne forme.

## Assembler le média

Les parties média n'arrivent pas comme un fichier fini. Chaque format sélectionné, un pour l'audio et un pour la vidéo, arrive comme un segment d'init suivi d'une série de segments média. Le segment d'init met en place la piste, les segments média portent l'audio ou la vidéo réels, et ensemble ils reconstruisent une piste continue pour ce format.

![Assemblage des segments en pistes](/diagrams/media-assembly.png)

Le client le fait pour les deux formats en parallèle et fournit les deux pistes reconstruites au lecteur. Comme les octets viennent de parties média plutôt que d'un fichier plat, c'est le conteneur de chaque segment qui dit au client et au décodeur comment l'interpréter, et c'est pour ça que le segment d'init compte autant. Perdez-le, ou assemblez les segments dans le désordre, et la piste ne peut pas être décodée même si chaque octet est bien arrivé.

## L'état de session

La raison pour laquelle SABR donne une impression différente d'un extracteur classique, c'est cet état. Le client garde un petit modèle en mémoire à travers les requêtes. Un numéro de requête, le jeton de continuité, les plages mises en mémoire tampon par format, et le temps de lecture courant.

![Une session SABR](/diagrams/sabr-session.png)

Renvoyer le jeton et rapporter des plages tampon exactes, c'est ce qui permet aux requêtes suivantes d'avancer proprement. Si vous vous trompez là-dessus, la session se bloque ou tourne en boucle.

## La frontière de protection

Pour certaines vidéos et certains formats, au-delà d'un certain point, le serveur cesse d'envoyer du média. À la place, il renvoie des réponses qui ne contiennent que de la politique. Le statut de protection du flux bascule vers un état protégé, une valeur de backoff est incluse, et il n'y a plus aucune partie média du tout.

Le statut passe par trois valeurs. Le statut 1 est ouvert, le média circule normalement. Le statut 2 est la frontière, le point où l'attestation est sur le point d'être exigée. Le statut 3 est protégé, le serveur ne renvoie que de la politique et aucun média. Réessayer en statut 3 ne change rien en soi. Présenter un Proof of Origin token valide dans le contexte de la requête, c'est ce qui ramène la session au statut 1, et le média recommence à circuler.

![Le flux des statuts de protection](/diagrams/protection-states.png)

Ce n'est pas un bug de votre parseur ou de votre requête. C'est un véritable état de protection. Ce volet est traité dans [Dans BotGuard](./sabr-botguard) et [Attestation](./sabr-attestation).
