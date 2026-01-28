# Problèmes Courants

## Lecture Vidéo : "La page doit être rechargée"

Il s'agit actuellement du problème le plus signalé. Les utilisateurs voient un message d'erreur indiquant : `org.schabi.newpipe.extractor.exceptions.ContentNotAvailableException: The page needs to be reloaded.`

### Pourquoi cela arrive-t-il ?
YouTube effectue fréquemment des "tests A/B" sur la logique de son lecteur. Cela signifie qu'ils modifient la façon dont les données vidéo sont envoyées. Comme PipePipe extrait ces données directement, tout changement côté YouTube peut casser le processus d'extraction.

### Le Correctif (Version 4.7.8+)
Le développeur a déjà publié un correctif dans la **version 4.7.8**. Cependant, de nombreux utilisateurs rencontrent encore le bug à cause de leur méthode de mise à jour.

### Résolution étape par étape

1. **Vérifiez votre version actuelle**
   Allez dans `Paramètres > À propos` dans PipePipe. Si vous voyez la version **4.7.7** ou inférieure, vous êtes concerné par ce bug.

2. **Le délai F-Droid**
   Si vous avez installé PipePipe via F-Droid, vous remarquerez peut-être que la version 4.7.8 n'est pas encore disponible. F-Droid met environ **7 jours** pour réviser et publier les nouvelles versions.

   ::: tip Solution
   Consultez notre [Guide d'installation](/fr/user-guide/installation) pour apprendre à installer les mises à jour immédiatement via Obtainium ou GitHub.
   :::

3. **Mettre à jour immédiatement**
   Pour corriger l'erreur dès maintenant, n'attendez pas F-Droid. Téléchargez l'APK directement depuis les [Releases officielles sur GitHub](https://github.com/InfinityLoop1308/PipePipe/releases).

### Comment éviter cela à l'avenir
Pour éviter d'être bloqué pendant une semaine à chaque fois que YouTube change quelque chose, la communauté recommande d'utiliser **Obtainium**. Cet outil surveille directement le dépôt GitHub et propose les mises à jour à la seconde où elles sont publiées, contournant ainsi totalement le délai de F-Droid.
