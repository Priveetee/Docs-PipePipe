# Comptes et services

## Comptes et cookies

Connectez-vous seulement pour une fonction qui le demande. Pour connexion, déconnexion, reCAPTCHA ou changement de compte, indiquez service, Android, endpoint, écran/résultat et effet éventuel du nettoyage des cookies WebView. Ne publiez jamais identifiants, cookies, jetons ou export de compte.

Les commandes ne suppriment pas les mêmes données. Un rapport sur **Effacer le cookie reCAPTCHA** doit nommer cette action et dire si une confirmation apparaît ; **effacer les cookies WebView** est une action compte/WebView distincte, avec sa propre confirmation possible. « J'ai effacé les cookies » ne suffit pas à reproduire.

Avant tout effacement, notez le symptôme et le service. Effacer les cookies déconnecte ou retire un état de challenge : c'est une remise à zéro de diagnostic, pas un remède universel. Retestez ensuite exactement la même URL.

![Réglages Compte PipePipe, 5.2.3 sur Android 16](/screenshots/pipepipe-account-5.2.3-api36.png)

*Capture de référence : PipePipe 5.2.3 · Android 16/API 36. Elle distingue les entrées de services et l'action **Effacer les cookies WebView**.*

## Rapports spécifiques à un service

Identifiez toujours le service : un endpoint YouTube n'explique pas un échec BiliBili ou NicoNico. Ajoutez URL et état de connexion du service.

## Contenu restreint

Pour du contenu YouTube restreint par âge ou membres, indiquez si la connexion est active et si le compte doit pouvoir y accéder, sans divulguer de données personnelles.

Être connecté ne garantit pas qu'un problème d'extracteur/amont disparaît. Si une vidéo restreinte et la traduction automatique échouent après une connexion réussie, signalez leurs comportements respectifs avec URL et erreur visible : ce n'est pas une preuve que le compte est invalide.
