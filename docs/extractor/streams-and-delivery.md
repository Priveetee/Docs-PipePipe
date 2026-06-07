# Streams and delivery

`extractStreams` produces the formats the player consumes. The result is not one list but three, and each entry describes both *what* the media is and *how* you get it.

![Streams and delivery](/diagrams/streams-and-delivery.png)

## Three lists, not one

`StreamInfo` carries the playable media in three separate lists, plus subtitles:

```java
List<VideoStream>     videoStreams;      // muxed: video + audio together
List<AudioStream>     audioStreams;      // audio only
List<VideoStream>     videoOnlyStreams;  // video with no audio track
List<SubtitlesStream> subtitles;
```

The split is the whole point. Progressive formats ship a single muxed track, that is `videoStreams`. Adaptive playback instead pairs a `videoOnlyStream` with a separate `audioStream` and lets the player pick each one independently by bandwidth. The extractor surfaces all three so the player can choose its own combination, rather than the extractor deciding for it.

## What a `Stream` is

All three extend `Stream` (which is `Serializable`). A `Stream` answers two questions.

**What the media is:**

- `getFormat()` returns a `MediaFormat` (container and codec, with a MIME type and file suffix); `getFormatId()` for the raw id.
- `AudioStream` adds `averageBitrate`, the audio track id / name / locale, and the underlying itag (`ItagItem`).
- `VideoStream` adds `resolution`, `fps`, width and height, and `isVideoOnly`.

**How to get it:**

- `getDeliveryMethod()` returns a `DeliveryMethod`.
- `getContent()` plus `isUrl()`: the content is either a direct URL (`isUrl == true`) or an inline manifest blob (`isUrl == false`), depending on the delivery method; `getManifestUrl()` covers the manifest-by-URL case.

Streams are compared by delivery method and id, not by URL (`equalStats` / `equals`). Media URLs are short-lived and signed, so they make a useless identity.

## `DeliveryMethod`

```java
enum DeliveryMethod { PROGRESSIVE_HTTP, DASH, HLS, SS, TORRENT, SABR }
```

- **`PROGRESSIVE_HTTP`**: a plain media URL served with byte-range GETs. The simple case.
- **`DASH` / `HLS` / `SS`**: an adaptive manifest (a URL or inline blob); the player drives segment selection from it.
- **`SABR`**: YouTube's session protocol. There is no plain URL and no static manifest: the client opens a session and keeps talking to the server for the whole playback.
- **`TORRENT`** exists for completeness and is not used on the YouTube path.

## Where this meets SABR

For every delivery method except SABR, the player ends up with either a URL or a manifest, and ExoPlayer takes it from there. SABR is the exception. A SABR stream is not something you download once; it is a conversation you maintain, request, UMP response, segments, follow-up request, with attestation gating the protected media.

The extractor's job stops at marking the stream `SABR` and handing over the pieces a session needs. Driving that session is a topic of its own: the whole [SABR Guide](/developer-guide/introduction).
