# Téléchargements

## Avant de signaler un échec

Notez le service et l'URL, format/résolution choisi, dossier ou fournisseur de documents, espace disponible, connexion et moment de l'échec : avant, pendant ou lors de la fusion audio/vidéo. Dites aussi s'il s'agit d'un téléchargement audio seul, vidéo seule ou vidéo+audio fusionnés : les chemins ne défaillent pas au même endroit.

## Distinguer les cas

- Une vidéo lisible mais non téléchargeable peut être un problème de downloader ou de format.
- Un fichier incomplet demande taille finale, format et point d'arrêt.
- Un échec de stockage demande Android et destination : interne, SD ou fournisseur de documents.
- Une demande de miniature pour un audio est une fonctionnalité, pas un bug de lecture.

![Réglages Téléchargement PipePipe, 5.2.3 sur Android 16](/screenshots/pipepipe-download-5.2.3-api36.png)

*Capture de référence : PipePipe 5.2.3 · Android 16/API 36. Les dossiers vidéo/audio sont les destinations finales ; ils ne représentent pas l'espace de travail interne temporaire.*

Le dossier configuré est la destination **finale**. Les fichiers de travail temporaires peuvent néanmoins utiliser le stockage interne de PipePipe puis être supprimés à la fin. « Ma carte SD est sélectionnée » ne prouve donc pas que l'espace interne temporaire suffisait. Relevez l'espace libre interne *et* celui de destination, et dites si l'échec survient avant l'apparition du fichier final.

::: warning
N'activez pas une option expérimentale YouTube/SABR seulement pour forcer un téléchargement. Une vidéo ouverte avec cette option peut garder un moment des métadonnées de stream en cache après sa désactivation. Pour diagnostiquer ce cas, désactivez-la, forcez l'arrêt complet de PipePipe, rouvrez la vidéo fraîchement (ou attendez l'expiration du cache), puis testez une fois. Indiquez build et réglage exacts.
:::

Les téléchargements HLS/live peuvent avoir des limites distinctes des streams progressifs. Ne concluez pas à un « MP4 corrompu » sans format choisi et erreur exacte de l'étape de téléchargement.

Ne supprimez pas le seul fichier partiel utile avant d'avoir relevé son erreur.

## Modèle de rapport

```text
Service et URL :
Version PipePipe / Android :
Format audio/vidéo et résolution :
Destination finale (interne / SD / fournisseur de documents) :
Espace libre interne / destination :
Étape de l'échec (début / transfert / fusion / déplacement final) :
Message exact et lecture de ce même élément possible ? :
Connexion et réglages expérimentaux pertinents :
```
