# Playlists, historique et abonnements

## Playlists et file

Pour une playlist en ligne vide, incomplète ou impossible à charger, joignez URL, service, connexion, endpoint et résultat après réouverture. Pour une playlist locale, ajoutez le tri et l'action ayant modifié la liste.

Une playlist en ligne est une donnée de service ; une playlist locale est une donnée PipePipe. Dites toujours laquelle. Pour la première, indiquez si chaque page/continuation échoue ou seulement les éléments plus loin dans la liste. Pour la seconde, donnez l'enchaînement précis d'édition/navigation et si un import ou un tri l'a précédé.

## Abonnements et feeds

Pour des éléments absents, un abonnement impossible ou un import interrompu, indiquez URL de chaîne, service, pays de contenu, connexion et si une ou toutes les chaînes sont touchées. Ne publiez pas un export complet d'abonnements privés.

Indiquez si la page de chaîne elle-même montre l'élément manquant. Si oui, mais pas le feed d'abonnements, donnez URL/date de l'élément et l'effet d'une actualisation/réouverture. Si la chaîne échoue aussi, il s'agit vraisemblablement d'un autre chemin service/extraction.

::: info Métadonnées incomplètes parfois attendues
L'issue résolue [#2521](https://github.com/InfinityLoop1308/PipePipe/issues/2521)
montre que l'absence de durée dans un feed peut être normale avec le chemin de
feed dédié/rapide : il revient plus vite mais peut omettre durée, statut live/à
venir ou filtrage des Shorts. Identifiez d'abord le mode de feed et actualisez
une fois avant de le signaler comme défaut visuel.
:::

## Historique et positions

Précisez si l'historique est actif, si les positions sont restaurées et si le problème survient après import. Positions de lecture et visibilité de l'historique sont des réglages distincts.

Pour un redémarrage inattendu, ajoutez s'il s'agit d'une position enregistrée, d'une transition de file ou du rechargement d'une playlist en ligne. Cela se ressemble côté lecteur, mais relève de sous-systèmes différents.
