# Gestion des liens

Chaque extracteur est construit à partir d'un `LinkHandler`, et chaque `LinkHandler` provient d'une factory. C'est la couche qui transforme une URL arbitraire en une paire `(id, url)` validée et normalisée, avant tout appel réseau.

## Les handlers

`LinkHandler` est immuable, `Serializable`, trois chaînes :

```java
String getOriginalUrl();  String getUrl();  String getId();  String getBaseUrl();
```

`ListLinkHandler` l'étend pour tout ce qui retourne une liste, en ajoutant les filtres sélectionnés :

```java
List<FilterItem> getContentFilters();
List<FilterItem> getSortFilter();
```

`SearchQueryHandler` étend `ListLinkHandler` et stocke la requête dans l'emplacement de l'id :

```java
String getSearchString();   // == getId()
```

## Les factories

`LinkHandlerFactory` est abstraite sur trois méthodes :

```java
abstract String  getId(String url);
abstract String  getUrl(String id);
abstract boolean onAcceptUrl(String url);
```

`fromUrl(url)` est le point d'entrée : elle appelle `acceptUrl(url)` (qui délègue à `onAcceptUrl`), puis construit un `LinkHandler` à partir de l'id extrait et d'un `getUrl(id)` canonique. `fromId(id)` fait le chemin inverse. Une même factory reconnaît donc une URL et en émet une canonique.

`ListLinkHandlerFactory` ajoute les filtres :

```java
abstract String getUrl(String id, List<FilterItem> contentFilter, List<FilterItem> sortFilter);
Filter getAvailableContentFilter();
Filter getAvailableSortFilter();
```

`SearchQueryHandlerFactory` construit des URLs de recherche à partir d'une requête, et son `onAcceptUrl` retourne toujours `false` : une recherche se produit à partir d'une requête, elle ne se reconnaît pas à partir d'une URL collée.

## Une factory concrète

`YoutubeStreamLinkHandlerFactory` illustre le motif. L'id est un token de 11 caractères :

```java
Pattern.compile("^([a-zA-Z0-9_-]{11})")
```

`getId` gère toute la ménagerie des formes d'URL YouTube, `watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`, `/live/`, le schéma `vnd.youtube:`, les miroirs invidious et piped, les redirections `attribution_link`, et lève une `FoundAdException` pour les liens publicitaires doubleclick. `onAcceptUrl` se résume à « est-ce que `getId` réussit » :

```java
public boolean onAcceptUrl(String url) throws FoundAdException {
    try { getId(url); return true; }
    catch (FoundAdException fe) { throw fe; }
    catch (ParsingException e)  { return false; }
}
```

`getUrl` reconstruit la forme canonique : `"https://www.youtube.com/watch?v=" + id`.

Pour les listes, `YoutubeChannelTabLinkHandlerFactory` associe les filtres de contenu (Videos, Playlists, Shorts, Livestreams, ...) à des suffixes d'URL (`/videos`, `/playlists`, `/shorts`, `/streams`) et un filtre de tri (`latest` / `popular` / `oldest`) à une requête `?sort=`.

Parce que `getId` est ce qui se trouve persisté dans les abonnements et l'historique, il doit être stable : un même contenu doit toujours produire le même id.
