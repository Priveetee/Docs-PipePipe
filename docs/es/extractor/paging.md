# Paginación y continuaciones

Las listas no llegan todas de golpe. Un `ListExtractor` devuelve una primera página más un token para la siguiente.

## `InfoItemsPage` y `Page`

`getInitialPage()` y `getPage(Page)` devuelven ambos un `InfoItemsPage<R>`: los elementos, una `nextPage` (un `Page`, null cuando no hay más) y una lista de errores por elemento. `hasNextPage()` es simplemente `nextPage != null`.

Un `Page` es el token de continuación, deliberadamente genérico para que cada servicio guarde lo que necesite:

```java
String url;  String id;  List<String> ids;  Map<String, String> cookies;  byte[] body;
```

Un servicio que pagina por URL pone la siguiente URL en `url`. Uno que envía un token de continuación por POST (YouTube) pone el token en `id`, o el cuerpo POST completo en `body`. Las `cookies` viajan junto a él para los servicios con estado. Nada impone una forma; el mismo servicio vuelve a leer lo que escribió.

## Recorrer las páginas

```java
InfoItemsPage<R> page = extractor.getInitialPage();
while (page.hasNextPage()) {
    page = extractor.getPage(page.getNextPage());
    // consumir page.getItems()
}
```

`ListExtractor.getFullPage()` hace exactamente esto para los casos que necesitan todo de antemano. Los tamaños que no se pueden conocer por adelantado usan valores centinela en `ListExtractor`:

```java
ITEM_COUNT_UNKNOWN       = -1;
ITEM_COUNT_INFINITE      = -2;
ITEM_COUNT_MORE_THAN_100 = -3;
```

Así, un getter como el número de flujos de una playlist devuelve un número real cuando el servicio lo proporciona, y un centinela cuando no, en lugar de mentir con un cero.
