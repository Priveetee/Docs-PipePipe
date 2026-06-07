# Channels, playlists y kioscos

La mayoría de los extractores devuelven una lista, y todos comparten una misma base, `ListExtractor`, y una misma forma de resultado, `ListInfo`. Esta página cubre los tipos de lista más allá de la búsqueda y los comentarios.

![Familia de extractores de lista](/diagrams/list-extractors.png)

## `ListInfo`: el resultado de lista

Cada `*Info` de lista extiende `ListInfo<T extends InfoItem>` (que a su vez extiende `Info`). Sobre la identidad y la lista de errores de `Info`, añade:

```java
List<T> getRelatedItems();        // the items of the first page
boolean hasNextPage();  Page getNextPage();
List<FilterItem> getContentFilters();  List<FilterItem> getSortFilter();
```

Construir uno es siempre el mismo baile: `getInfo(extractor)` llama a `fetchPage()`, lee `getInitialPage()`, copia los items y `nextPage` en el `ListInfo`, y luego rellena los campos específicos del tipo. Así que `ChannelInfo`, `PlaylistInfo`, `KioskInfo`, `ChannelTabInfo`, `FeedInfo` y `CommentsInfo` son idénticos a este nivel.

## Channels y pestañas

Un `ChannelExtractor` es un `ListExtractor<StreamInfoItem>`. Sus campos obligatorios son `getAvatarUrl`, `getSubscriberCount` (o `UNKNOWN_SUBSCRIBER_COUNT`) y `getDescription`; el resto (banner, channel padre, verificado, etiquetas) por defecto quedan vacíos.

Un channel no es una sola lista plana. `getTabs()` devuelve una `List<ListLinkHandler>`, una por pestaña, y cada pestaña es su propio `ChannelTabExtractor` (un `ListExtractor<InfoItem>`). El nombre de la pestaña es el primer content filter del handler, tomado de las constantes de `ChannelTabs`:

```java
VIDEOS, TRACKS, SHORTS, LIVESTREAMS, CHANNELS, PLAYLISTS, PODCASTS, ALBUMS, SEARCH
```

Así que "los vídeos de este channel" y "las playlists de este channel" son dos `ChannelTabExtractor` construidos a partir de dos handlers y obtenidos de forma independiente.

## Playlists

Un `PlaylistExtractor` es un `ListExtractor<StreamInfoItem>` con `getUploaderUrl` / `getUploaderName` / `getUploaderAvatarUrl`, `isUploaderVerified` y `getStreamCount`. Su `getPlaylistType()` etiqueta qué clase de lista es:

```java
enum PlaylistType { NORMAL, MIX_STREAM, MIX_MUSIC, MIX_CHANNEL, MIX_GENRE }
```

Un `MIX_*` es una playlist interminable autogenerada (una radio o mix) que la app trata de forma distinta a una `NORMAL`: sigue añadiendo elementos a medida que reproduces. `PlaylistInfo.getInfoWithFullItems` recorre todas las páginas cuando de verdad las necesitas todas.

## Kioscos

Un kiosco es una lista con nombre y sin id: tendencias, listas, conferencias, los feeds de portada de un servicio. Un `KioskExtractor<T>` extiende `ListExtractor<T>` y lleva un id de kiosco.

Un servicio registra sus kioscos en una `KioskList` dentro de `getKioskList()`:

```java
kioskList.addKioskEntry(extractorFactory, listLinkHandlerFactory, id);
kioskList.setDefaultKiosk(id);
```

Cada entrada empareja una `KioskExtractorFactory` (construye el extractor para una url + id de kiosco) con una factoría de link-handler. Así es como YouTube expone Trending, BiliBili sus Recommended / Top-100, PeerTube sus Trending / Recent / Local, y media.ccc.de sus conferencias, todos detrás de un único `getKioskList()` uniforme.
