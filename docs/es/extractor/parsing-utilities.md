# Parseo y utilidades

Escribir un extractor consiste en su mayor parte en convertir una respuesta en campos del modelo. El paquete `utils` es la caja de herramientas, y dos librerías hacen el trabajo pesado.

## JSON: nanojson

El parseo de JSON usa **nanojson** (`com.grack.nanojson`): `JsonObject`, `JsonArray`, `JsonParser`, `JsonWriter`. Un parseo típico:

```java
JsonObject root = JsonParser.object().from(downloader.get(url).responseBody());
JsonArray items = root.getArray("results");
for (int i = 0; i < items.size(); i++) {
    JsonObject item = items.getObject(i);
}
```

`JsonUtils` añade acceso por ruta con puntos para no encadenar `getObject` a mano, y lanza `ParsingException` (en lugar de devolver null) cuando falta una ruta:

```java
JsonUtils.getString(root, "data.items.0.title");
JsonUtils.getArray(root, "contents.section.items");
JsonUtils.toJsonObject(responseBody);   // parsea y envuelve los errores
```

## HTML: jsoup

El scraping de HTML usa **jsoup** (`org.jsoup`): `Jsoup.parse`, `Document`, `Element`, `Elements`.

```java
Document doc = Jsoup.parse(downloader.get(url).responseBody());
for (Element e : doc.getElementsByClass("writing")) {
    collector.commit(new MyCommentItemExtractor(e));
}
```

## Regex: `Parser`

`Parser` envuelve `java.util.regex` con helpers pensados para el extractor que lanzan `Parser.RegexException` (una `ParsingException`) cuando no hay coincidencia, de modo que una coincidencia fallida es un error de extracción, no un null silencioso:

```java
Parser.matchGroup1("v=([\\w-]+)", url);
Parser.matchGroup(pattern, input, 2);
Parser.matchGroup1MultiplePatterns(patterns, input);   // prueba varios, el primero que acierte
Parser.isMatch(pattern, input);
```

## Helpers de uso diario: `Utils`

`Utils` es el cajón de sastre al que recurres constantemente:

```java
Utils.isNullOrEmpty(str | collection | map);
Utils.removeNonDigitCharacters("1,234 views");   // -> "1234"
Utils.mixedNumberWordToLong("1.2M");             // recuentos con sufijo -> long
Utils.getBaseUrl(url);  Utils.getQueryValue(url, "v");
Utils.replaceHttpWithHttps(url);  Utils.encodeUrlUtf8(s);  Utils.decodeUrlUtf8(s);
Utils.EMPTY_STRING;
```

## Ejecutar JavaScript

Cuando un servicio necesita ejecutar el JS del player (el caso de YouTube, consulta [Dentro de YouTube](./youtube-service)), `JavaScript` envuelve Rhino:

```java
JavaScript.compileOrThrow(fn);
JavaScript.run(fn, "functionName", args...);
```

y el paquete `jsextractor` (`Lexer`, `JavaScriptExtractor.matchToClosingBrace`) extrae un cuerpo de función equilibrado del código minificado. Ten en cuenta que en este fork la ruta de la firma de YouTube delega en su mayor parte en una API remota de decodificación en lugar de ejecutar este JS localmente.

## Cachear manifiestos

`ManifestCreatorCache` es una pequeña caché acotada y serializable que usan los creadores de manifiestos DASH para que una petición repetida no reconstruya el mismo manifiesto desde cero.
