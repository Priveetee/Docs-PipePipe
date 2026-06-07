# Gestión de enlaces

Todo extractor se construye a partir de un `LinkHandler`, y todo `LinkHandler` proviene de una factory. Esta es la capa que convierte una URL arbitraria en un par `(id, url)` validado y normalizado antes de que se produzca cualquier llamada de red.

## Los handlers

`LinkHandler` es inmutable, `Serializable`, tres strings:

```java
String getOriginalUrl();  String getUrl();  String getId();  String getBaseUrl();
```

`ListLinkHandler` lo extiende para cualquier cosa que devuelva una lista, añadiendo los filtros seleccionados:

```java
List<FilterItem> getContentFilters();
List<FilterItem> getSortFilter();
```

`SearchQueryHandler` extiende `ListLinkHandler` y guarda la consulta en el hueco del id:

```java
String getSearchString();   // == getId()
```

## Las factories

`LinkHandlerFactory` es abstracta en tres métodos:

```java
abstract String  getId(String url);
abstract String  getUrl(String id);
abstract boolean onAcceptUrl(String url);
```

`fromUrl(url)` es el punto de entrada: llama a `acceptUrl(url)` (que delega en `onAcceptUrl`), y luego construye un `LinkHandler` a partir del id extraído y una `getUrl(id)` canónica. `fromId(id)` hace el camino inverso. Así, una misma factory tanto reconoce una URL como emite una canónica.

`ListLinkHandlerFactory` añade filtros:

```java
abstract String getUrl(String id, List<FilterItem> contentFilter, List<FilterItem> sortFilter);
Filter getAvailableContentFilter();
Filter getAvailableSortFilter();
```

`SearchQueryHandlerFactory` construye URLs de búsqueda a partir de una consulta, y su `onAcceptUrl` siempre devuelve `false`: una búsqueda se produce a partir de una consulta, no se reconoce a partir de una URL pegada.

## Una factory concreta

`YoutubeStreamLinkHandlerFactory` muestra el patrón. El id es un token de 11 caracteres:

```java
Pattern.compile("^([a-zA-Z0-9_-]{11})")
```

`getId` maneja todo el zoológico de formas de URL de YouTube, `watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`, `/live/`, el esquema `vnd.youtube:`, los espejos invidious y piped, las redirecciones `attribution_link`, y lanza `FoundAdException` para los enlaces de anuncios de doubleclick. `onAcceptUrl` es simplemente "¿tiene éxito `getId`?":

```java
public boolean onAcceptUrl(String url) throws FoundAdException {
    try { getId(url); return true; }
    catch (FoundAdException fe) { throw fe; }
    catch (ParsingException e)  { return false; }
}
```

`getUrl` reconstruye la forma canónica: `"https://www.youtube.com/watch?v=" + id`.

Para las listas, `YoutubeChannelTabLinkHandlerFactory` mapea filtros de contenido (Videos, Playlists, Shorts, Livestreams, ...) a sufijos de URL (`/videos`, `/playlists`, `/shorts`, `/streams`) y un filtro de orden (`latest` / `popular` / `oldest`) a una query `?sort=`.

Como `getId` es lo que se persiste en las suscripciones y el historial, debe ser estable: el mismo contenido debe producir siempre el mismo id.
