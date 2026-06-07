# Añadir un servicio

Un servicio es una subclase de `StreamingService` más una carpeta de extractores y manejadores de enlaces (link handlers). Aquí está la lista completa, con los métodos exactos que estás obligado a implementar.

## 1. Regístralo

Añádelo a `ServiceList` con el siguiente id libre, al final de la lista. Los ids se persisten en suscripciones, historial y marcadores, así que nunca los reutilices ni los reordenes:

```java
YouTube   = new YoutubeService(0),
SoundCloud = new SoundcloudService(1),
...
NicoNico  = new NiconicoService(6)
// MyService = new MyService(7)   <- next free id, appended
```

## 2. El `StreamingService`

Hereda de `StreamingService(id, name, capabilities)` e implementa `getBaseUrl()` más las dos familias de factorías.

Factorías de LinkHandler:

```java
getStreamLHFactory(); getChannelLHFactory(); getChannelTabLHFactory();
getPlaylistLHFactory(); getSearchQHFactory(); getCommentsLHFactory();
```

Factorías de extractores:

```java
getStreamExtractor(LinkHandler);      getChannelExtractor(ListLinkHandler);
getChannelTabExtractor(ListLinkHandler); getPlaylistExtractor(ListLinkHandler);
getSearchExtractor(SearchQueryHandler);  getCommentsExtractor(ListLinkHandler);
getSuggestionExtractor(); getSubscriptionExtractor(); getKioskList();
```

Declara tu conjunto de `MediaCapability` (`AUDIO`, `VIDEO`, `LIVE`, `COMMENTS`, ...) para que la app solo ofrezca lo que soportas. Sobrescribe `getSupportedLocalizations()` / `getSupportedCountries()` si haces algo más que `en-GB`.

## 3. Manejadores de enlaces

Para cada tipo de contenido, una factoría que implemente `getId`, `getUrl`, `onAcceptUrl` (y el `getUrl` filtrado para listas). Recuerda que `getId` debe ser estable: es la identidad persistida.

## 4. Extractores

Cada uno extiende la base correspondiente y hace su E/S en `onFetchPage(Downloader)`. Los métodos abstractos que debes rellenar, por base:

- **`StreamExtractor`**: `getName`, `getThumbnailUrl`, `getUploaderUrl`, `getUploaderName`, `getAudioStreams`, `getVideoStreams`, `getVideoOnlyStreams`, `getStreamType`. La mayor parte del resto (descripción, duración, recuentos, subtítulos) tiene un valor por defecto seguro que sobrescribes según los datos estén disponibles.
- **`ChannelExtractor`**: `getAvatarUrl`, `getSubscriberCount`, `getDescription` (más `getInitialPage` / `getPage` de `ListExtractor`).
- **`PlaylistExtractor`**: `getUploaderUrl`, `getUploaderName`, `getUploaderAvatarUrl`, `isUploaderVerified`, `getStreamCount`.
- **`SearchExtractor`**: `getInitialPageInternal`, `getPageInternal`.
- **`SuggestionExtractor`**: `suggestionList(query)`. **`SubscriptionExtractor`**: `getRelatedUrl`. **`KioskExtractor`**: `getName`.

`getFeedExtractor`, los bullet comments y la importación de suscripciones son opcionales: la base devuelve null o lanza `UnsupportedOperationException` hasta que los sobrescribas.

## 5. Replica una estructura existente

Usa un servicio actual como plantilla:

```
services/<name>/
  <Name>Service.java
  extractors/    <Name>StreamExtractor, ChannelExtractor, PlaylistExtractor, SearchExtractor, ...
  linkHandler/   <Name>StreamLinkHandlerFactory, ChannelLinkHandlerFactory, ...
  search/filter/ (only if you expose filters)
```

Compila a través de la compilación compuesta (ver [Compilar el extractor](./building)); el cliente recoge tu servicio de inmediato, sin paso de publicación.
