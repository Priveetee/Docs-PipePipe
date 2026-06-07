# Recherche et filtres

La recherche est un `ListExtractor` dont le handler est un `SearchQueryHandler`. Les filtres, les types de contenu et les ordres de tri qu'un service propose, forment un petit modèle déclaratif dans `search/filter`.

## Le modèle

- **`FilterItem`** : une option sélectionnable, `(int identifier, String name)`. L'identifiant est attribué par le builder et c'est lui que le reste du code fait circuler, pas le nom d'affichage.
- **`FilterGroup`** : un ensemble nommé de `FilterItem`s, avec `onlyOneCheckable` (bouton radio plutôt que case à cocher) et son propre identifiant.
- **`Filter`** : un ensemble de `FilterGroup`s, assemblé avec `Filter.Builder`.
- **`SearchFiltersBase`** : la base par service. Un service en hérite, crée ses items et ses groupes dans `init()`, et implémente `evaluateSelectedFilters(query)` pour transformer la sélection de l'utilisateur en paramètres de requête réels du service.

## Un ensemble concret

`YoutubeFilters` déclare des filtres de contenu, `all`, `videos`, `channels`, `playlists`, `movies`, `Lives`, plus ceux de YouTube Music (`music_songs`, `music_videos`, `music_albums`, `music_playlists`, `music_artists`). Ses groupes de tri et de fonctionnalités : tri par (pertinence / note / vues), date d'envoi (heure / jour / semaine / mois / année), durée (court / long), et bascules de fonctionnalités (HD, sous-titres, Creative Commons, 3D, live, 4K, 360, HDR, ...).

`evaluateSelectedFilters` encode la sélection dans le paramètre `sp` de YouTube, un protobuf en base64, qu'il ajoute à la requête de recherche. Chaque famille de filtres sait se sérialiser elle-même, donc en ajouter un reste local.

## Comment un handler les expose

Une `ListLinkHandlerFactory` annonce `getAvailableContentFilter()` et `getAvailableSortFilter()`. L'application les lit pour construire son interface de filtres, puis renvoie les `FilterItem`s choisis via `fromQuery(query, contentFilters, sortFilters)`. Les filtres sélectionnés se retrouvent sur le `SearchQueryHandler` que reçoit le `SearchExtractor`, et de là sur la requête.
