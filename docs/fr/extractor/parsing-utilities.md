# Parsing et utilitaires

Écrire un extracteur consiste surtout à transformer une réponse en champs de modèle. Le package `utils` est la boîte à outils, et deux bibliothèques font le gros du travail.

## JSON : nanojson

Le parsing JSON utilise **nanojson** (`com.grack.nanojson`) : `JsonObject`, `JsonArray`, `JsonParser`, `JsonWriter`. Un parse typique :

```java
JsonObject root = JsonParser.object().from(downloader.get(url).responseBody());
JsonArray items = root.getArray("results");
for (int i = 0; i < items.size(); i++) {
    JsonObject item = items.getObject(i);
}
```

`JsonUtils` ajoute un accès par chemin pointé pour éviter d'enchaîner `getObject` à la main, et lève une `ParsingException` (plutôt que de retourner null) quand un chemin est manquant :

```java
JsonUtils.getString(root, "data.items.0.title");
JsonUtils.getArray(root, "contents.section.items");
JsonUtils.toJsonObject(responseBody);   // parse et enveloppe les erreurs
```

## HTML : jsoup

Le scraping HTML utilise **jsoup** (`org.jsoup`) : `Jsoup.parse`, `Document`, `Element`, `Elements`.

```java
Document doc = Jsoup.parse(downloader.get(url).responseBody());
for (Element e : doc.getElementsByClass("writing")) {
    collector.commit(new MyCommentItemExtractor(e));
}
```

## Regex : `Parser`

`Parser` enveloppe `java.util.regex` avec des helpers adaptés à l'extracteur, qui lèvent une `Parser.RegexException` (une `ParsingException`) en l'absence de correspondance, de sorte qu'une correspondance échouée soit une erreur d'extraction, pas un null silencieux :

```java
Parser.matchGroup1("v=([\\w-]+)", url);
Parser.matchGroup(pattern, input, 2);
Parser.matchGroup1MultiplePatterns(patterns, input);   // en essaie plusieurs, la première qui touche
Parser.isMatch(pattern, input);
```

## Helpers du quotidien : `Utils`

`Utils` est le fourre-tout vers lequel on se tourne en permanence :

```java
Utils.isNullOrEmpty(str | collection | map);
Utils.removeNonDigitCharacters("1,234 views");   // -> "1234"
Utils.mixedNumberWordToLong("1.2M");             // compteurs suffixés -> long
Utils.getBaseUrl(url);  Utils.getQueryValue(url, "v");
Utils.replaceHttpWithHttps(url);  Utils.encodeUrlUtf8(s);  Utils.decodeUrlUtf8(s);
Utils.EMPTY_STRING;
```

## Exécuter du JavaScript

Quand un service a besoin d'exécuter le JS du player (le cas de YouTube, voir [Dans YouTube](./youtube-service)), `JavaScript` enveloppe Rhino :

```java
JavaScript.compileOrThrow(fn);
JavaScript.run(fn, "functionName", args...);
```

et le package `jsextractor` (`Lexer`, `JavaScriptExtractor.matchToClosingBrace`) extrait un corps de fonction équilibré depuis du code minifié. À noter que dans ce fork, le chemin de signature YouTube délègue le plus souvent à une API de décodage distante plutôt que d'exécuter ce JS localement.

## Mise en cache des manifestes

`ManifestCreatorCache` est un petit cache borné et sérialisable que les créateurs de manifeste DASH utilisent pour qu'une requête répétée ne reconstruise pas le même manifeste à partir de zéro.
