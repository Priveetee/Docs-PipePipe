# Flujo de extracción

Aquí tienes una petición de principio a fin: una URL de visualización de YouTube convertida en un `StreamInfo`. El esqueleto es el mismo para cada servicio y cada tipo de contenido. Solo cambian `onFetchPage` y los getters.

![Flujo de extracción](/diagrams/extraction-flow.png)

## De la URL al extractor

`StreamInfo.getInfo(String url)` es el punto de entrada público. Resuelve el servicio y luego construye el extractor:

```java
getInfo(url)
  -> getInfo(NewPipe.getServiceByUrl(url), url)
  -> getInfo(service.getStreamExtractor(url));
```

`getStreamExtractor(url)` pasa la URL por `getStreamLHFactory().fromUrl(url)`. La fábrica acepta la URL, extrae el id y produce una URL canónica. Todavía no hay red: el resultado es solo un `LinkHandler` validado, y el extractor que alimenta conoce su id y su URL antes de haber descargado nada.

## La descarga

`getInfo(extractor)` llama a `extractor.fetchPage()` una vez, que delega en el `onFetchPage(Downloader)` concreto. Aquí es donde vive la E/S.

Toma `YoutubeStreamExtractor.onFetchPage` como caso concreto. Lee el `videoId` de `getId()` y dispara varias peticiones InnerTube en paralelo a través de la API asíncrona del downloader (`CancellableCall`):

- una respuesta del player **web**,
- la respuesta del player seleccionada, **VisionOS** por defecto sin cookies y **MWEB** cuando la cuenta tiene cookies,
- el endpoint **next** para los metadatos,
- llamadas laterales en el mejor de los casos (return-dislike, SponsorBlock y una respuesta Android Reel usada solo como fallback para algunos fallos).

El endpoint seleccionado no está codificado directamente en este método. `NewPipe.getYoutubePlayerClient()` acepta `visionos`, `mweb` o el valor interno `tv_downgraded`. El cliente Android expone actualmente VisionOS y MWEB en los ajustes avanzados; el antiguo endpoint Android-VR ya no es una opción actual.

El endpoint por defecto en modo anónimo es **VisionOS**, un cliente que YouTube
está retirando; el fallo que produce y por qué MWEB es la ruta mantenida se
describen en [Dentro del servicio de
YouTube](./youtube-service#la-retirada-de-visionos) y en la [guía de
reproducción](/es/issues/youtube-playback#la-reproduccion-se-detiene-hacia-el-minuto-1-con-un-403).

```java
public void onFetchPage(@Nonnull final Downloader downloader) {
    final String videoId = getId();
    ...
    CancellableCall webPageCall = YoutubeParsingHelper.getWebPlayerResponse(...);
    final CancellableCall jsonPlayerCall;
    switch (NewPipe.getYoutubePlayerClient()) {
        case "visionos": case "tv_simply": case "tv_downgraded":
            jsonPlayerCall = fetchConfiguredJsonPlayer(...);
            break;
        case "web":
            jsonPlayerCall = fetchWebJsonPlayer(...);
            break;
        default:
            jsonPlayerCall = fetchMwebJsonPlayer(...);
            break;
    }
    CancellableCall nextDataCall = getJsonPostResponseAsync(NEXT, body, ...);
    ...
}
```

El JSON parseado aterriza en campos del extractor (`nextResponse`, las respuestas del player, etc.). No se devuelve nada: `fetchPage()` solo prepara el objeto. Por eso exactamente los getters llaman a `assertPageFetched()` antes de tocar nada.

Por qué varios clientes a la vez: distintos clientes InnerTube exponen distintos conjuntos de flujos y disparan distintas restricciones. El extractor saca lo que necesita de cada uno y los fusiona.

## Construir el modelo

Una vez descargada la página, `getInfo` ejecuta tres pasadas. Cada una se envuelve de modo que un fallo en una se convierta en un error recogido en el `StreamInfo` en lugar de en una pérdida total:

```java
streamInfo = extractImportantData(extractor); // id, url, name, type, duration, age limit
extractStreams(streamInfo, extractor);        // audio / video / video-only / subtitles
extractOptionalData(streamInfo, extractor);   // description, thumbnails, uploader, related
```

- **`extractImportantData`** construye el `StreamInfo` y es la única pasada que debe tener éxito. El camino de YouTube aquí también distingue entre contenido restringido por edad y bloqueado por país, y lanza `ContentNotAvailableException` con el mensaje real del servidor en lugar de uno engañoso.
- **`extractStreams`** saca los formatos reproducibles. Esto es lo que el reproductor consume al final, y donde se decide el `DeliveryMethod` (progressive, DASH, HLS, SABR). Ese es el tema de [Flujos y delivery](./streams-and-delivery).
- **`extractOptionalData`** es en el mejor de los casos. Una descripción o una miniatura que falte degrada un campo, no hace fallar el vídeo.

## El mismo esqueleto en todas partes

Las listas siguen la forma idéntica con un paso extra. En lugar de un único `getInfo`, un `ListExtractor` devuelve `getInitialPage()`, y recorres `getPage(nextPage)` mientras `hasNextPage()` sea verdadero. La descarga, los campos cacheados y la recolección tolerante a errores son todos iguales. Cambia `StreamExtractor` por `ChannelExtractor` o `SearchExtractor` y lo único que cambia de verdad son `onFetchPage` y cómo se parsean los campos.
