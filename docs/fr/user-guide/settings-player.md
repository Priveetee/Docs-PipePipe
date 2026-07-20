# Paramètres du Lecteur

Cette section couvre tous les paramètres liés au lecteur vidéo et audio.

![Réglages Lecteur de PipePipe, 5.2.3 sur Android 16](/screenshots/pipepipe-player-5.2.3-api36.png)

*Capture de référence : PipePipe 5.2.3 · Android 16/API 36. L'ordre et les valeurs peuvent évoluer selon la version.*

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

**Chemin :** menu latéral de PipePipe > Paramètres > Lecteur > Activer les formats avancés

Vous n'avez pas besoin d'activer toutes les cases. Si vos vidéos fonctionnent,
gardez simplement les valeurs d'origine : VP9 et HEVC cochés, AV1 et EC-3
décochés.

- **VP9** : un codec vidéo ouvert largement pris en charge sous Android.
- **AV1** : un codec vidéo récent et efficace. Il peut être exigeant lorsqu'Android
  doit le décoder de façon logicielle.
- **HEVC** : un codec vidéo dont la prise en charge varie selon votre appareil.
- **EC-3** : l'audio Dolby Digital Plus, utile seulement si votre appareil le prend
  en charge.

Chaque case cochée autorise PipePipe à utiliser ce format. Cela ne garantit pas
que votre appareil réussira toujours à le décoder. À résolution égale, PipePipe
choisit actuellement AV1 avant VP9, HEVC et AVC. Si vous cochez AV1, PipePipe
peut donc le sélectionner sans vous le redemander.

VP9/WebM ou AV1 doit être activé pour faire apparaître les streams YouTube en
2K/4K. AV1 seul n'est pas nécessaire.

::: tip
Si l'image saccade alors que le son continue normalement, essayez d'abord VP9
et réduisez la résolution. Chaque codec utilise un décodeur Android différent :
un changement peut aider sur un appareil et dégrader la lecture sur un autre.
Voir [#2085](https://github.com/InfinityLoop1308/PipePipe/issues/2085) et
[#2045](https://github.com/InfinityLoop1308/PipePipe/issues/2045).
:::

::: warning
Si un rapport d'erreur contient `video/av01` ou
`c2.android.av1-dav1d.decoder`, décochez **AV01**, rouvrez complètement la vidéo
et essayez VP9 à la même résolution ou à une résolution inférieure. Si VP9
échoue aussi, décochez VP9 et HEVC pour ne laisser qu'AVC, puis essayez en 720p.
Suivez le [guide MediaCodec complet](/fr/issues/android#votre-video-s-arrete-apres-un-moment-avec-une-erreur-av1).
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

::: warning
Sur certaines versions, le passage en plein écran peut relancer une vidéo mise en pause. Dans ce cas, conservez la séquence exacte (pause, plein écran, rotation, retour, etc.) pour un signalement : ce n'est pas le même réglage que la reprise après interruption.
:::

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

Ouvre un sous-menu pour l'apparence et les choix liés aux sous-titres. Les pistes de sous-titres ordinaires sont fournies par le service/la vidéo. La traduction automatique est une fonction YouTube distincte et exige une connexion YouTube ; un contrôle de traduction grisé peut donc indiquer qu'aucune connexion compatible n'est active, pas que les sous-titres sont absents.

Dans un rapport, distinguez : aucune piste ordinaire proposée ; une piste ordinaire ne s'affiche pas ; une traduction automatique ne peut pas être sélectionnée ; ou la traduction choisie est incorrecte. Indiquez l'URL, les langues source/cible, la piste choisie, l'état de connexion et la version, sans jamais joindre de cookie ni d'identifiants.
