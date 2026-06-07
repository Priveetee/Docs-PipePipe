# Subscriptions and feeds

Two features sit slightly outside the per-content extractors: importing a user's subscriptions, and a fast channel feed.

## Subscriptions

`SubscriptionExtractor` imports a user's followed channels into a list of `SubscriptionItem` (`serviceId`, `url`, `name`). It declares where it can import from:

```java
enum ContentSource { CHANNEL_URL, INPUT_STREAM }
```

and exposes entry points that throw `UnsupportedOperationException` unless overridden:

```java
abstract String getRelatedUrl();    // where the user finds their export / following list
List<SubscriptionItem> fromChannelUrl(String channelUrl);
List<SubscriptionItem> fromInputStream(InputStream in);
List<SubscriptionItem> fromInputStream(InputStream in, String contentType);
```

Two services implement it, from different sources:

- **YouTube** (`YoutubeSubscriptionExtractor`): `INPUT_STREAM`. It parses a Google Takeout export, JSON, CSV, or a ZIP containing either.
- **SoundCloud** (`SoundcloudSubscriptionExtractor`): `CHANNEL_URL`. It reads the followings off a user's profile URL.

The app chooses the flow from the declared `ContentSource`: a file picker for `INPUT_STREAM`, a URL field for `CHANNEL_URL`.

## Feeds: the channel fast-path

Loading a full channel is heavy: avatar, banner, tabs, counts, first page. For just "what's new", some services expose a lighter feed. `FeedExtractor` is a `ListExtractor<StreamInfoItem>` with no extra required methods; `FeedInfo.getInfo(service, url)` drives it and throws if the service has none.

`StreamingService.getFeedExtractor(url)` returns null by default. YouTube overrides it (`YoutubeFeedExtractor`) to read the channel **RSS feed**, far cheaper than a full channel extraction, which is what the app uses to refresh the subscription feed.

```java
@Override
public FeedExtractor getFeedExtractor(String channelUrl) throws ExtractionException {
    return new YoutubeFeedExtractor(this, getChannelLHFactory().fromUrl(channelUrl));
}
```

BiliBili's "recommended" lists look similar but are wired as kiosks, not a `FeedExtractor`. So when you build the app's feed, prefer `getFeedExtractor` where it exists and fall back to the channel extractor otherwise.
