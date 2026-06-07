# Channels, playlists et kiosques

La plupart des extracteurs renvoient une liste, et tous partagent une même base, `ListExtractor`, et une même forme de résultat, `ListInfo`. Cette page couvre les types de listes au-delà de la recherche et des commentaires.

![Famille des extracteurs de listes](/diagrams/list-extractors.png)

## `ListInfo` : le résultat de liste

Chaque `*Info` de liste étend `ListInfo<T extends InfoItem>` (qui étend lui-même `Info`). En plus de l'identité et de la liste d'erreurs d'`Info`, il ajoute :

```java
List<T> getRelatedItems();        // the items of the first page
boolean hasNextPage();  Page getNextPage();
List<FilterItem> getContentFilters();  List<FilterItem> getSortFilter();
```

En construire un suit toujours la même chorégraphie : `getInfo(extractor)` appelle `fetchPage()`, lit `getInitialPage()`, recopie les éléments et `nextPage` sur le `ListInfo`, puis remplit les champs spécifiques au type. Ainsi `ChannelInfo`, `PlaylistInfo`, `KioskInfo`, `ChannelTabInfo`, `FeedInfo` et `CommentsInfo` sont identiques à ce niveau.

## Channels et onglets

Un `ChannelExtractor` est un `ListExtractor<StreamInfoItem>`. Ses champs obligatoires sont `getAvatarUrl`, `getSubscriberCount` (ou `UNKNOWN_SUBSCRIBER_COUNT`) et `getDescription` ; le reste (bannière, channel parent, vérification, tags) vaut vide par défaut.

Un channel n'est pas une seule liste à plat. `getTabs()` renvoie une `List<ListLinkHandler>`, une par onglet, et chaque onglet est son propre `ChannelTabExtractor` (un `ListExtractor<InfoItem>`). Le nom de l'onglet est le premier filtre de contenu du handler, tiré des constantes `ChannelTabs` :

```java
VIDEOS, TRACKS, SHORTS, LIVESTREAMS, CHANNELS, PLAYLISTS, PODCASTS, ALBUMS, SEARCH
```

Ainsi « les vidéos de ce channel » et « les playlists de ce channel » sont deux `ChannelTabExtractor` construits à partir de deux handlers et récupérés indépendamment.

## Playlists

Un `PlaylistExtractor` est un `ListExtractor<StreamInfoItem>` doté de `getUploaderUrl` / `getUploaderName` / `getUploaderAvatarUrl`, `isUploaderVerified` et `getStreamCount`. Son `getPlaylistType()` indique de quel genre de liste il s'agit :

```java
enum PlaylistType { NORMAL, MIX_STREAM, MIX_MUSIC, MIX_CHANNEL, MIX_GENRE }
```

Une `MIX_*` est une playlist sans fin générée automatiquement (une radio/un mix) que l'application traite différemment d'une `NORMAL` : elle continue de s'allonger au fur et à mesure de la lecture. `PlaylistInfo.getInfoWithFullItems` parcourt chaque page quand vous avez réellement besoin de tous les éléments.

## Kiosques

Un kiosque est une liste nommée et sans identifiant : tendances, classements, conférences, les fils de la page d'accueil d'un service. Un `KioskExtractor<T>` étend `ListExtractor<T>` et porte un identifiant de kiosque.

Un service enregistre ses kiosques sur un `KioskList` dans `getKioskList()` :

```java
kioskList.addKioskEntry(extractorFactory, listLinkHandlerFactory, id);
kioskList.setDefaultKiosk(id);
```

Chaque entrée associe une `KioskExtractorFactory` (qui construit l'extracteur pour une url + un identifiant de kiosque) à une factory de link-handler. C'est ainsi que YouTube expose Tendances, BiliBili ses Recommandés / Top-100, PeerTube ses Tendances / Récents / Local, et media.ccc.de ses conférences, tous derrière un même `getKioskList()` uniforme.
