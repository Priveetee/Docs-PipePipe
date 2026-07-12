# Filtres, commentaires et sous-titres

## Filtres et chaînes bloquées

Pour un contenu bloqué encore visible, indiquez l'endroit : recherche, chaîne, feed, playlist ou suggestions. Ajoutez règle, URL et si l'élément était déjà chargé avant le changement.

Ne résumez pas cela par « le filtre ne marche pas ». Une règle peut être évaluée différemment sur une liste déjà chargée et sur une page récupérée de nouveau. Actualisez ou rouvrez une fois, puis indiquez précisément la surface et si l'élément est une chaîne, un titre, un mot-clé ou un résultat propre à un service.

## Commentaires et bullet comments

Pour des commentaires absents, périmés ou mal placés, joignez URL vidéo, onglet, mode de lecture et état de l'interface expérimentale. Pour les bullet comments, ajoutez le service et le réglage modifié. « Les commentaires manquent » exige le service : les API de commentaires et les bullet/danmaku comments ne sont pas interchangeables.

## Sous-titres

Ajoutez URL vidéo, langue, piste choisie, connexion et type : sous-titres normaux ou traduction automatique. Ces deux fonctions n'ont pas les mêmes prérequis amont : sur YouTube, la traduction automatique exige une connexion YouTube active. Un contrôle de traduction désactivé/grisé peut donc être normal hors connexion.

Employez l'un de ces diagnostics : « aucune piste originale listée », « piste originale listée mais non affichée », « traduction automatique indisponible hors connexion » ou « traduction automatique incorrecte connecté ». Le dernier nécessite langues source/cible ; aucun ne requiert identifiants ou cookies.

![Entrée Sous-titres du lecteur](/screenshots/pipepipe-player-captions-5.2.3-api36.png)

L'entrée Sous-titres règle l'affichage des captions du lecteur. Elle ne rend pas
à elle seule la traduction automatique disponible. L'issue résolue
[#2627](https://github.com/InfinityLoop1308/PipePipe/issues/2627) confirme qu'un
contrôle de traduction auto grisé signifiait que l'utilisateur n'était pas
connecté à YouTube.
