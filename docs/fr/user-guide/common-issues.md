# Problèmes Courants


## Réseau et Restrictions YouTube

### YouTube bloque ou échoue à charger les streams
Ceci couvre deux erreurs liées qui ont toutes les deux pour origine YouTube qui restreint ou échoue à servir les données de stream à des clients anonymes :

- `AntiBotException : Connectez-vous pour prouver que vous n'êtes pas un robot`
- `ExtractionException : Error occurs when fetching the page. Try increase the loading timeout in Settings.`

Bien que les messages d'erreur diffèrent, ils partagent des causes communes : votre IP signalée par YouTube, la limitation des requêtes anonymes (rate-limiting), un timeout réseau, ou une défaillance temporaire côté serveur YouTube.

**Solutions :**

1.  **Réessayez la vidéo :** L'`ExtractionException` est souvent temporaire. Appuyer sur réessayer ou rouvrir la vidéo suffit à la résoudre.
2.  **Augmentez le délai de chargement :** Allez dans `Paramètres > Avancé > Délai d'attente pour le chargement de la vidéo` et augmentez la valeur. Cela laisse plus de temps à PipePipe pour récupérer les métadonnées du stream avant d'abandonner.
3.  **Changez d'IP :** Passez du Wi-Fi aux données mobiles, ou redémarrez votre box pour obtenir une nouvelle IP dynamique. Une IP signalée est la cause la plus fréquente de l'`AntiBotException`.
4.  **Utilisez un VPN :** Nous recommandons un service de qualité comme [Proton VPN](https://protonvpn.com/fr/).
    *   *Note : Nous ne sommes pas affiliés à ce service ; cette recommandation est basée sur des tests de la communauté montrant sa grande fiabilité.*
5.  **Changez de région VPN :** Si vous utilisez déjà un VPN et que l'erreur persiste, changez de serveur pour un autre pays afin d'obtenir une IP fraîche et non signalée.
6.  **Orbot (Tor) :** Utiliser [Orbot](https://orbot.app/fr/) vous permet de basculer entre différents nœuds de sortie à travers le monde jusqu'à ce que le blocage soit levé.
7.  **Connexion :** Se connecter à son compte YouTube dans PipePipe reste une méthode stable pour éviter ces deux exceptions si vous ne souhaitez pas utiliser de VPN. Voir [Problèmes de Connexion YouTube](#problèmes-de-connexion-youtube) pour plus d'informations.

::: tip Anonyme vs. connecté
YouTube limite et bloque les clients anonymes (non authentifiés) bien plus agressivement que les clients connectés. Si vous rencontrez régulièrement l'une ou l'autre de ces erreurs, se connecter est la solution la plus fiable sur le long terme. Voir [Problèmes de Connexion YouTube](#problèmes-de-connexion-youtube) pour plus d'informations.
:::

## Problèmes de Connexion YouTube

### Pourquoi la connexion peut être indisponible

YouTube implémente fréquemment de nouveaux mécanismes de chiffrement dans son API pour prévenir l'accès non autorisé. À la fin 2025, YouTube a introduit un **chiffrement complexe dans son extracteur d'état connecté**, rendant impossible pour PipePipe d'extraire les flux vidéo lorsque les utilisateurs étaient connectés.

**Contexte :** PipePipe n'utilise pas l'API officielle de YouTube (qui n'existe pas pour les applications tierces). Au lieu de cela, il extrait les données de l'API InnerTube de YouTube en effectuant une ingénierie inverse des interfaces web et mobiles de YouTube. Cette approche nécessite d'analyser les requêtes et les réponses que YouTube envoie aux clients légitimes.

**Le Problème :** Ce n'est pas un problème graduel. Lorsque cela se produit, c'est un changement cassant qui affecte tous les utilisateurs connectés simultanément, rendant la lecture vidéo impossible pour tous ceux qui essaient d'utiliser la fonctionnalité de connexion.

**Pourquoi la désactivation temporaire ?** Les développeurs avaient deux options :
1. Garder la connexion activée et laisser les utilisateurs faire face à des lectures vidéo cassées (mauvaise expérience utilisateur)
2. Désactiver temporairement la connexion le temps de trouver une solution de contournement

Il a choisi l'option 2 pour éviter une cascade de rapports de crash et de frustration utilisateur.

**Si vous lisez ceci, il est probable que la connexion soit actuellement désactivée.** Cela fait partie d'un cycle récurrent : une solution de contournement a déjà été trouvée et la connexion a été réactivée par le passé. Elle le sera de nouveau dès qu'une nouvelle solution sera trouvée.

**En résumé :** Ce n'est pas une fonctionnalité en train d'être progressivement supprimée, c'est un jeu du chat et de la souris entre l'équipe de sécurité de YouTube (qui essaie de bloquer l'accès non autorisé) et les développeurs open source (qui essaient de maintenir la compatibilité). Quand YouTube change son chiffrement, PipePipe se casse temporairement jusqu'à ce qu'une nouvelle solution de contournement soit trouvée. Ce cycle se répète car YouTube continue d'évoluer ses protections.

### Si la connexion est indisponible

::: warning ⚠️ Connexion Temporairement Indisponible
Si vous ne pouvez pas vous connecter, utilisez les méthodes alternatives de la section [Réseau et Restrictions YouTube](#réseau-et-restrictions-youtube) ci-dessus.
:::

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

### L'application refuse de s'installer
Assurez-vous que votre appareil respecte la [Configuration Requise](/fr/user-guide/installation#configuration-requise).

## Android Auto

### PipePipe n'apparaît pas dans Android Auto
Comme PipePipe n'est pas disponible sur le Google Play Store, Android Auto le masque par défaut pour des raisons de sécurité.

**Solution :**
1.  Ouvrez les paramètres d'**Android Auto** sur votre téléphone.
2.  Faites défiler jusqu'en bas et appuyez 10 fois sur la section **Version** jusqu'à ce qu'un message affiche "Mode développeur activé".
3.  Appuyez sur les trois points (menu) en haut à droite et sélectionnez **Paramètres développeur**.
4.  Faites défiler vers le bas et cochez la case **Sources inconnues**.
5.  Redémarrez Android Auto (ou déconnectez et reconnectez votre téléphone à votre voiture).

## Interface et Lecteur

### La barre de lecture ou l'option "Ajouter à la file d'attente" est absente
Parfois, lors du lancement d'une vidéo directement en arrière-plan ou en mode popup, la barre de lecture en bas de l'écran n'apparaît pas, rendant impossible la gestion de la file d'attente.

**Solution :**
*   C'était un bug majeur corrigé dans la **version 4.7.2**.
*   Si vous voyez encore ce problème, cela confirme que vous utilisez une version obsolète. Veuillez mettre à jour vers au moins la version **4.7.8** en utilisant les méthodes décrites dans le [Guide d'Installation](/fr/user-guide/installation).

### Chargement infini (buffering) suivi d'un crash
Si votre vidéo s'arrête soudainement pour charger et que l'application finit par planter (courant sur les appareils Xiaomi/MIUI), il s'agit probablement d'un problème de synchronisation matérielle.

**Solution :**
1.  Allez dans **Paramètres > Avancé > Paramètres ExoPlayer**.
2.  Activez l'option **Always use ExoPlayer video output surface setting workaround**.
3.  Redémarrez l'application.
4.  Si le problème persiste, un redémarrage complet de l'appareil est recommandé.

### Crash lors de la lecture d'une vidéo téléchargée
Si PipePipe plante lorsque vous essayez d'ouvrir un fichier téléchargé, il s'agit généralement d'un conflit de permission avec votre lecteur vidéo externe.

**Solution :**
*   **Permissions :** Assurez-vous que votre application de lecture vidéo dispose de la permission "Fichiers et contenus multimédias" dans les paramètres Android.
*   **Lecteur recommandé :** Utilisez un lecteur robuste comme **VLC** ou **Just (Video) Player**. Ils gèrent mieux le système de stockage d'Android que la plupart des applications de galerie natives.
*   **Alternative :** Au lieu de lancer la lecture depuis PipePipe, essayez d'ouvrir la vidéo directement depuis le Gestionnaire de fichiers de votre téléphone.
