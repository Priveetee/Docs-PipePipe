# El Downloader

El extractor nunca abre un socket por sí mismo. Toda llamada de red pasa por una única abstracción, `Downloader`, que implementa la aplicación anfitriona. Eso mantiene al extractor libre de cualquier librería HTTP y deja que la app sea dueña de las cookies, la caché, los user agents y el proxying.

![El Downloader](/diagrams/downloader.png)

## El contrato

`Downloader` es una clase abstracta. Todos los métodos de conveniencia ensamblan un `Request` y desembocan en una única llamada abstracta:

```java
public abstract Response execute(@Nonnull Request request)
        throws IOException, ReCaptchaException;
```

Los métodos de conveniencia son los que los extractores llaman de verdad: `get(url[, headers][, localization])`, `head(url)`, `post(url, headers, data[, localization])`, `options(url, headers)`. Implementa `execute` y todos funcionan.

## Request y Response

`Request` se construye con un builder y es inmutable:

```java
Request.newBuilder().get(url).headers(h).build();
Request.newBuilder().post(url, body).setHeader("X-Foo", "bar").localization(loc).build();
```

Sus campos: `httpMethod`, `url`, `headers`, `dataToSend`, `localization` y `automaticLocalizationHeader` (si adjuntar automáticamente un `Accept-Language`).

`Response` es un simple contenedor:

```java
int responseCode();  String responseMessage();
Map<String, List<String>> responseHeaders();  String getHeader(String name);
String responseBody();  byte[] rawResponseBody();
String latestUrl();   // la URL final tras las redirecciones
```

## Asíncrono: `CancellableCall`

Más allá del `execute` bloqueante, hay una vía asíncrona en la que se apoya el extractor de YouTube para lanzar varias peticiones InnerTube a la vez:

```java
public abstract CancellableCall executeAsync(@Nonnull Request request, AsyncCallback callback);
// más sobrecargas de conveniencia getAsync / postAsync

public interface AsyncCallback {
    void onSuccess(Response response) throws ExtractionException;
    default void onError(Exception e) { e.printStackTrace(); }
}
```

`CancellableCall` envuelve la llamada subyacente con `cancel()`, `isCancelled()`, `isFinished()`. Así es como `onFetchPage` lanza web + android-VR/safari + next de forma concurrente y vuelve a unir los resultados (consulta [Flujo de extracción](./extraction-flow)).

## Quién lo provee

La app instala un downloader concreto al arrancar mediante `NewPipe.init(downloader)`. En PipePipeClient ese es `DownloaderImpl` (`app/src/main/java/org/schabi/newpipe/DownloaderImpl.java`), respaldado por OkHttp: `execute()` construye un `okhttp3.Request` y ejecuta `newCall(...).execute()`; `executeAsync()` usa `enqueue(...)` y envuelve el `okhttp3.Call` en un `CancellableCall`.

## Aquí no hay downloader de prueba

Conviene saberlo si vienes del NewPipe original: este fork no incluye ningún downloader de prueba, ningún `DownloaderFactory` ni respuestas mock grabadas. No hay ningún `src/test` en absoluto (consulta [Compilar el extractor](./building)). El extractor se ejercita ejecutándolo contra los servicios en vivo, a través de la app o de un pequeño `main()` que llama a `NewPipe.init(...)` con un downloader real.
