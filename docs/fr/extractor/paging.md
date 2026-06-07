# Pagination et continuations

Les listes n'arrivent pas d'un seul coup. Un `ListExtractor` retourne une première page accompagnée d'un token pour la suivante.

## `InfoItemsPage` et `Page`

`getInitialPage()` et `getPage(Page)` retournent tous deux un `InfoItemsPage<R>` : les éléments, une `nextPage` (un `Page`, null quand il n'y a plus rien), et une liste d'erreurs par élément. `hasNextPage()` n'est rien d'autre que `nextPage != null`.

Un `Page` est le token de continuation, volontairement générique pour que chaque service y stocke ce dont il a besoin :

```java
String url;  String id;  List<String> ids;  Map<String, String> cookies;  byte[] body;
```

Un service qui pagine par URL place l'URL suivante dans `url`. Un service qui poste un token de continuation (YouTube) place le token dans `id`, ou le corps POST complet dans `body`. Les `cookies` voyagent avec, pour les services à état. Rien n'impose de forme ; le service relit ce qu'il a écrit.

## Parcourir les pages

```java
InfoItemsPage<R> page = extractor.getInitialPage();
while (page.hasNextPage()) {
    page = extractor.getPage(page.getNextPage());
    // consommer page.getItems()
}
```

`ListExtractor.getFullPage()` fait exactement cela pour les cas qui ont besoin de tout d'emblée. Les tailles qui ne peuvent pas être connues à l'avance utilisent des sentinelles sur `ListExtractor` :

```java
ITEM_COUNT_UNKNOWN       = -1;
ITEM_COUNT_INFINITE      = -2;
ITEM_COUNT_MORE_THAN_100 = -3;
```

Ainsi un getter comme le nombre de streams d'une playlist retourne un vrai nombre quand le service en fournit un, et une sentinelle quand ce n'est pas le cas, plutôt que de mentir avec un zéro.
