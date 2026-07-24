# Dépannage

Cette section est la carte utilisateur des problèmes PipePipe. Partez du symptôme
exact au lieu de modifier plusieurs réglages à la fois : chaque catégorie indique
les éléments réellement utiles au diagnostic.

![Triage de dépannage](/diagrams/issue-triage.png)

## Premiers gestes

1. Comparez votre version installée aux [GitHub Releases](https://github.com/InfinityLoop1308/PipePipe/releases).
2. Reproduisez le problème une fois et notez l'heure, l'URL ou la requête, ainsi que l'endpoint YouTube sélectionné.
3. Ouvrez la catégorie correspondante ci-dessous. Gardez les symptômes distincts dans des rapports distincts.

![Réglages PipePipe, 5.2.3 sur Android 16](/screenshots/pipepipe-settings-5.2.3-api36.png)

*Capture de référence : PipePipe 5.2.3 · Android 16/API 36. Les catégories et leur ordre peuvent évoluer.*

## Catégories

## Trouver rapidement la bonne branche

| Symptôme exact | Commencer ici | Ne pas supposer |
| --- | --- | --- |
| **WebView unavailable** | [WebView et lecture protégée](./webview) | Qu'un changement d'endpoint contourne WebView. |
| Toutes les vidéos YouTube échouent ; un domaine Google pointe vers `0.0.0.0` ou `127.0.0.1` | [Filtrage DNS et lecture](./youtube-playback#toutes-les-videos-youtube-echouent-verifiez-le-filtrage-dns) | Qu'un changement d'endpoint, une réinstallation ou une mise à jour WebView contourne le filtrage DNS. |
| `AntiBotException`, `Source error`, tampon, seek live | [Lecture, réseau et connexion](./youtube-playback) | Qu'un WebView à jour ou une connexion prouve la cause. |
| Recherche vide/incorrecte | [Recherche et découverte](./search) | Qu'un correctif lecteur corrige la recherche. |
| Lien dans le « mauvais » lecteur | [Arrière-plan, popup, plein écran et file](./player-modes) | Que l'action préférée contrôle les appuis internes. |
| Téléchargement/fichier partiel | [Téléchargements](./downloads) | Que seule la carte SD finale est utilisée. |
| Données perdues après migration | [Configuration, mises à jour et sauvegardes](./setup) | Qu'un import est une fusion réversible. |

### Configuration et rapports

- [Configuration, mises à jour et sauvegardes](./setup) : installation, source
  de mise à jour, import, export et migration sûre.
- [Signaler un problème](./reporting) : les éléments qui rendent une issue reproductible.

### YouTube et lecture

- [WebView et lecture protégée](./webview) : PipePipe indique que WebView est indisponible, ou le fournisseur système manque, est verrouillé ou incompatible.
- [Lecture, réseau et connexion](./youtube-playback) : filtrage DNS, `Source
  error`, buffering, endpoint ou lecture connectée.
- [Recherche et découverte](./search) : résultats de recherche vides, erronés ou incomplets.
- [Arrière-plan, popup, plein écran et file](./player-modes) : cycle de vie,
  rotation, image dans l'image, file et transitions de playlist.
- [Téléchargements](./downloads) : format, stockage, fichier partiel et fusion.

### Bibliothèque et contrôles de contenu

- [Playlists, historique et abonnements](./library-and-feeds) : bibliothèque,
  feed, chaîne, playlist, import et positions.
- [Filtres, commentaires et sous-titres](./content-controls) : filtrage,
  commentaires, bullet comments et sous-titres.

### Application et appareil

- [MediaCodec et Android Auto](./android) : contournements décodeur/surface et visibilité Android Auto.
- [Comptes et services](./accounts-and-services) : connexion, cookies, reCAPTCHA,
  contenu restreint et rapports spécifiques au service.
- [Interface et langue](./interface-and-language) : UI expérimentale, mise en
  page, partage, notifications, langue et pays de contenu.

::: tip Un symptôme, un rapport
WebView, lecture de flux et recherche peuvent échouer ensemble après un changement YouTube. Ils empruntent tout de même des chemins de code différents. Les séparer donne au mainteneur une reproduction exploitable.
:::
