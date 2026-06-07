# Le Downloader

L'extracteur n'ouvre jamais lui-même de socket. Tout appel réseau passe par une seule abstraction, `Downloader`, que l'application hôte implémente. Cela garde l'extracteur libre de toute bibliothèque HTTP et laisse l'application gérer les cookies, la mise en cache, les user agents et le proxying.

![Le Downloader](/diagrams/downloader.png)

## Le contrat

`Downloader` est une classe abstraite. Toutes les méthodes utilitaires assemblent une `Request` et convergent vers un seul appel abstrait :

```java
public abstract Response execute(@Nonnull Request request)
        throws IOException, ReCaptchaException;
```

Les méthodes utilitaires sont celles que les extracteurs appellent réellement : `get(url[, headers][, localization])`, `head(url)`, `post(url, headers, data[, localization])`, `options(url, headers)`. Implémentez `execute` et elles fonctionnent toutes.

## Request et Response

`Request` se construit avec un builder et est immuable :

```java
Request.newBuilder().get(url).headers(h).build();
Request.newBuilder().post(url, body).setHeader("X-Foo", "bar").localization(loc).build();
```

Ses champs : `httpMethod`, `url`, `headers`, `dataToSend`, `localization`, et `automaticLocalizationHeader` (faut-il attacher automatiquement un `Accept-Language`).

`Response` est un simple conteneur :

```java
int responseCode();  String responseMessage();
Map<String, List<String>> responseHeaders();  String getHeader(String name);
String responseBody();  byte[] rawResponseBody();
String latestUrl();   // l'URL finale après redirections
```

## Asynchrone : `CancellableCall`

Au-delà de l'`execute` bloquant, il existe un chemin asynchrone sur lequel s'appuie l'extracteur YouTube pour lancer plusieurs requêtes InnerTube d'un coup :

```java
public abstract CancellableCall executeAsync(@Nonnull Request request, AsyncCallback callback);
// plus les surcharges utilitaires getAsync / postAsync

public interface AsyncCallback {
    void onSuccess(Response response) throws ExtractionException;
    default void onError(Exception e) { e.printStackTrace(); }
}
```

`CancellableCall` enveloppe l'appel sous-jacent avec `cancel()`, `isCancelled()`, `isFinished()`. C'est ainsi que `onFetchPage` lance web + android-VR/safari + next en parallèle et recombine les résultats (voir [Flux d'extraction](./extraction-flow)).

## Qui le fournit

L'application installe un downloader concret au démarrage via `NewPipe.init(downloader)`. Dans PipePipeClient, c'est `DownloaderImpl` (`app/src/main/java/org/schabi/newpipe/DownloaderImpl.java`), basé sur OkHttp : `execute()` construit une `okhttp3.Request` et exécute `newCall(...).execute()` ; `executeAsync()` utilise `enqueue(...)` et enveloppe le `okhttp3.Call` dans un `CancellableCall`.

## Pas de mock downloader ici

Bon à savoir si vous venez du NewPipe amont : ce fork ne livre aucun downloader de test, aucune `DownloaderFactory`, et aucune réponse mock enregistrée. Il n'y a pas de `src/test` du tout (voir [Compiler l'extracteur](./building)). Vous éprouvez l'extracteur en le faisant tourner contre les services en direct, via l'application ou un petit `main()` qui appelle `NewPipe.init(...)` avec un vrai downloader.
