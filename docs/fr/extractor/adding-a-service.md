# Ajouter un service

Un service, c'est une sous-classe de `StreamingService` plus un dossier d'extracteurs et de link handlers. Voici la checklist complète, avec les méthodes exactes que vous êtes obligé d'implémenter.

## 1. L'enregistrer

Ajoutez-le à `ServiceList` avec le prochain id libre, en fin de liste. Les ids sont persistés dans les abonnements, l'historique et les favoris, donc ne les réutilisez jamais et ne les réordonnez jamais :

```java
YouTube   = new YoutubeService(0),
SoundCloud = new SoundcloudService(1),
...
NicoNico  = new NiconicoService(6)
// MyService = new MyService(7)   <- next free id, appended
```

## 2. Le `StreamingService`

Sous-classez `StreamingService(id, name, capabilities)` et implémentez `getBaseUrl()` plus les deux familles de fabriques.

Fabriques de LinkHandler :

```java
getStreamLHFactory(); getChannelLHFactory(); getChannelTabLHFactory();
getPlaylistLHFactory(); getSearchQHFactory(); getCommentsLHFactory();
```

Fabriques d'extracteurs :

```java
getStreamExtractor(LinkHandler);      getChannelExtractor(ListLinkHandler);
getChannelTabExtractor(ListLinkHandler); getPlaylistExtractor(ListLinkHandler);
getSearchExtractor(SearchQueryHandler);  getCommentsExtractor(ListLinkHandler);
getSuggestionExtractor(); getSubscriptionExtractor(); getKioskList();
```

Déclarez votre jeu de `MediaCapability` (`AUDIO`, `VIDEO`, `LIVE`, `COMMENTS`, ...) pour que l'app ne propose que ce que vous supportez. Surchargez `getSupportedLocalizations()` / `getSupportedCountries()` si vous faites plus que `en-GB`.

## 3. Les link handlers

Pour chaque type de contenu, une fabrique qui implémente `getId`, `getUrl`, `onAcceptUrl` (et le `getUrl` filtré pour les listes). Rappelez-vous que `getId` doit être stable : c'est l'identité persistée.

## 4. Les extracteurs

Chacun étend la base correspondante et fait ses I/O dans `onFetchPage(Downloader)`. Les méthodes abstraites que vous devez remplir, par base :

- **`StreamExtractor`** : `getName`, `getThumbnailUrl`, `getUploaderUrl`, `getUploaderName`, `getAudioStreams`, `getVideoStreams`, `getVideoOnlyStreams`, `getStreamType`. La plupart du reste (description, durée, compteurs, sous-titres) a une valeur par défaut sûre que vous surchargez à mesure que la donnée est disponible.
- **`ChannelExtractor`** : `getAvatarUrl`, `getSubscriberCount`, `getDescription` (plus `getInitialPage` / `getPage` venus de `ListExtractor`).
- **`PlaylistExtractor`** : `getUploaderUrl`, `getUploaderName`, `getUploaderAvatarUrl`, `isUploaderVerified`, `getStreamCount`.
- **`SearchExtractor`** : `getInitialPageInternal`, `getPageInternal`.
- **`SuggestionExtractor`** : `suggestionList(query)`. **`SubscriptionExtractor`** : `getRelatedUrl`. **`KioskExtractor`** : `getName`.

`getFeedExtractor`, les bullet comments et l'import des abonnements sont optionnels : la base renvoie null ou lève `UnsupportedOperationException` jusqu'à ce que vous surchargiez.

## 5. Recopier une disposition existante

Servez-vous d'un service actuel comme modèle :

```
services/<name>/
  <Name>Service.java
  extractors/    <Name>StreamExtractor, ChannelExtractor, PlaylistExtractor, SearchExtractor, ...
  linkHandler/   <Name>StreamLinkHandlerFactory, ChannelLinkHandlerFactory, ...
  search/filter/ (only if you expose filters)
```

Construisez via le build composite (voir [Construire l'extracteur](./building)) ; le client récupère votre service immédiatement, sans étape de publication.
