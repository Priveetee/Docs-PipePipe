# The Downloader

The extractor never opens a socket itself. Every network call goes through one abstraction, `Downloader`, which the host application implements. That keeps the extractor free of any HTTP library and lets the app own cookies, caching, user agents, and proxying.

![The Downloader](/diagrams/downloader.png)

## The contract

`Downloader` is an abstract class. All the convenience methods assemble a `Request` and funnel into one abstract call:

```java
public abstract Response execute(@Nonnull Request request)
        throws IOException, ReCaptchaException;
```

The convenience methods are the ones extractors actually call: `get(url[, headers][, localization])`, `head(url)`, `post(url, headers, data[, localization])`, `options(url, headers)`. Implement `execute` and they all work.

## Request and Response

`Request` is built with a builder and is immutable:

```java
Request.newBuilder().get(url).headers(h).build();
Request.newBuilder().post(url, body).setHeader("X-Foo", "bar").localization(loc).build();
```

Its fields: `httpMethod`, `url`, `headers`, `dataToSend`, `localization`, and `automaticLocalizationHeader` (whether to auto-attach an `Accept-Language`).

`Response` is a plain holder:

```java
int responseCode();  String responseMessage();
Map<String, List<String>> responseHeaders();  String getHeader(String name);
String responseBody();  byte[] rawResponseBody();
String latestUrl();   // the final URL after redirects
```

## Async: `CancellableCall`

Beyond the blocking `execute`, there is an async path the YouTube extractor leans on to fire several InnerTube requests at once:

```java
public abstract CancellableCall executeAsync(@Nonnull Request request, AsyncCallback callback);
// plus getAsync / postAsync convenience overloads

public interface AsyncCallback {
    void onSuccess(Response response) throws ExtractionException;
    default void onError(Exception e) { e.printStackTrace(); }
}
```

`CancellableCall` wraps the underlying call with `cancel()`, `isCancelled()`, `isFinished()`. This is how `onFetchPage` launches web + android-VR/safari + next concurrently and stitches the results back together (see [Extraction flow](./extraction-flow)).

## Who provides it

The app installs one concrete downloader at startup via `NewPipe.init(downloader)`. In PipePipeClient that is `DownloaderImpl` (`app/src/main/java/org/schabi/newpipe/DownloaderImpl.java`), backed by OkHttp: `execute()` builds an `okhttp3.Request` and runs `newCall(...).execute()`; `executeAsync()` uses `enqueue(...)` and wraps the `okhttp3.Call` in a `CancellableCall`.

## No mock downloader here

Worth knowing if you come from upstream NewPipe: this fork ships no test downloader, no `DownloaderFactory`, and no recorded mock responses. There is no `src/test` at all (see [Building the extractor](./building)). You exercise the extractor by running it against the live services, through the app or a small `main()` that calls `NewPipe.init(...)` with a real downloader.
