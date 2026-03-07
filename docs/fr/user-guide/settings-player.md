# Paramètres du Lecteur

Cette section couvre tous les paramètres liés au lecteur vidéo et audio.

## Résolution par défaut

Définit la qualité vidéo préférée pour toutes les vidéos lues dans le lecteur principal.

- **Options :** Meilleure résolution, 1080p60, 1080p, 720p60, 720p, 480p, 360p, 240p, 144p.
- **Défaut :** 1080p60

::: tip
Choisir une résolution plus basse comme 720p peut aider à économiser des données mobiles et à réduire le temps de chargement sur des connexions lentes.
:::

## Résolution popup par défaut

Définit la qualité vidéo préférée pour les vidéos lues dans le lecteur popup.

- **Options :** Identiques à la résolution par défaut.
- **Défaut :** 480p

::: info
Une résolution plus basse est souvent suffisante pour la petite fenêtre du popup et consomme moins de ressources.
:::

## Activer les formats avancés

**Chemin :** Paramètres > Vidéo et audio > Activer les formats avancés

Permet au lecteur d'utiliser des codecs vidéo et audio modernes si votre appareil les prend en charge.

- **VP9** — Un codec ouvert largement supporté. Bonne compatibilité sur la plupart des appareils Android.
- **AV1** — Un codec plus efficace que VP9. Requis pour la lecture en 2K/4K sur YouTube. Consomme plus de CPU que VP9 sur les appareils sans décodage matériel AV1.
- **HEVC** — Un codec courant sur iOS. La prise en charge sur Android varie selon l'appareil.
- **EC-3** — Un codec audio Dolby Digital Plus. Utile uniquement si votre appareil le prend en charge.

Les formats activés ici déterminent quels streams apparaissent dans le sélecteur de qualité du lecteur. Par exemple, activer AV1 ajoute des streams `AV01` dans la liste de qualité directement dans le lecteur. Une fois activé, ouvrez une vidéo, appuyez sur l'icône de qualité dans le lecteur, et sélectionnez un stream VP9 ou AV01.

::: tip
Si votre vidéo lagge périodiquement (l'audio est correct mais la vidéo saccade toutes les quelques secondes), essayez de changer de codec :
1. Allez dans **Paramètres > Vidéo et audio > Activer les formats avancés**
2. Activez **VP9** ou **AV1**
3. Ouvrez une vidéo, appuyez sur le sélecteur de qualité dans le lecteur
4. Sélectionnez un stream **VP9** ou **AV01**

C'est la solution confirmée par le développeur pour ce type de lag (voir [#2085](https://github.com/InfinityLoop1308/PipePipe/issues/2085) et [#2045](https://github.com/InfinityLoop1308/PipePipe/issues/2045)).
:::

::: warning
Activer un format que votre appareil ne supporte pas peut entraîner un écran noir ou des plantages. WEBM ou AV1 sont nécessaires pour la lecture en 2K/4K sur YouTube.
:::

## Limiter la résolution lors de l'utilisation des données mobiles

Bascule automatiquement vers une résolution inférieure lorsque vous n'êtes pas connecté au Wi-Fi pour économiser des données.

- **Options :** Aucune limite, 1080p60, 1080p, 720p60, 720p, 480p, 360p, 240p, 144p.
- **Défaut :** 480p

## Nécessiter l'accent audio

S'assure que PipePipe est la seule application à jouer du son. Lorsque cette option est activée, les autres applications (comme les lecteurs de musique) se mettront en pause au démarrage d'une vidéo PipePipe.

- **Défaut :** Activé

## Reprendre la lecture

Reprend automatiquement la lecture après une interruption, comme un appel téléphonique.

- **Défaut :** Activé

## Toujours commencer la lecture depuis le début

Désactive la fonction de reprise de lecture pour les vidéos que vous avez déjà commencées. Chaque vidéo commencera à 00:00.

- **Défaut :** Désactivé

## Mémoriser les propriétés du popup

L'application se souviendra de la taille et de la position du lecteur popup de votre dernière session.

- **Défaut :** Activé

## Durée d'avance rapide/retour rapide

Définit la durée de saut en avant ou en arrière lorsque vous double-tapez sur les côtés du lecteur.

- **Options :** 5, 10, 15, 20, 25, 30 secondes.
- **Défaut :** 10 secondes

## Appuyer longuement pour accélérer la lecture

Vous permet d'accélérer temporairement la vidéo en maintenant un appui long sur le lecteur.

- **Options :** 0.1x à 5x, Désactiver.
- **Défaut :** 5x

## Minuterie de mise en veille

Arrête automatiquement la lecture après une durée définie.

- **Options :** 5, 10, 15, 20, 30 minutes, 1 heure.
- **Défaut :** 1 heure

## Paramètres des gestes

Ouvre un sous-menu pour configurer les gestes de balayage du lecteur.

## Paramètres des commentaires défilants

Ouvre un sous-menu pour configurer les commentaires du chat en direct de style "danmaku" (défilants).

## Sous-titres

Ouvre un sous-menu pour configurer l'apparence des sous-titres.
