# Búsqueda y filtros

La búsqueda es un `ListExtractor` cuyo handler es un `SearchQueryHandler`. Los filtros, los tipos de contenido y los criterios de orden que ofrece un servicio, son un pequeño modelo declarativo en `search/filter`.

## El modelo

- **`FilterItem`**: una opción seleccionable, `(int identifier, String name)`. El identificador lo asigna el builder y es lo que el resto del código pasa de un lado a otro, no el nombre visible.
- **`FilterGroup`**: un conjunto con nombre de `FilterItem`s, con `onlyOneCheckable` (radio frente a checkbox) y su propio identificador.
- **`Filter`**: un conjunto de `FilterGroup`s, ensamblado con `Filter.Builder`.
- **`SearchFiltersBase`**: la base por servicio. Un servicio crea una subclase, define sus items y grupos en `init()`, e implementa `evaluateSelectedFilters(query)` para convertir la selección del usuario en los parámetros de petición reales del servicio.

## Un conjunto concreto

`YoutubeFilters` declara filtros de contenido, `all`, `videos`, `channels`, `playlists`, `movies`, `Lives`, además de los de YouTube Music (`music_songs`, `music_videos`, `music_albums`, `music_playlists`, `music_artists`). Sus grupos de orden y características: ordenar por (relevancia / valoración / vistas), fecha de subida (hora / día / semana / mes / año), duración (corta / larga) y conmutadores de características (HD, subtítulos, Creative Commons, 3D, en directo, 4K, 360, HDR, ...).

`evaluateSelectedFilters` codifica la selección en el parámetro `sp` de YouTube (un protobuf en base64), que adjunta a la petición de búsqueda. Cada familia de filtros sabe serializarse a sí misma, así que añadir uno es algo local.

## Cómo los expone un handler

Un `ListLinkHandlerFactory` anuncia `getAvailableContentFilter()` y `getAvailableSortFilter()`. La app los lee para construir su interfaz de filtros, y luego devuelve los `FilterItem`s elegidos a través de `fromQuery(query, contentFilters, sortFilters)`. Los filtros seleccionados aterrizan en el `SearchQueryHandler` que recibe el `SearchExtractor`, y desde ahí en la petición.
