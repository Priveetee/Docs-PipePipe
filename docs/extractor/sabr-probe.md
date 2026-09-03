# Starting a session

Part of [SABR in the extractor](./sabr). The current PipePipeExtractor keeps
player-response parsing and the media-session driver separate. There is no
stand-alone `YoutubeSabrProbe` or client-profile enum in the current source.

## From the player response to `YoutubeSabrInfo`

`YoutubeStreamExtractor.buildSabrInfoFromPlayerResponse(...)` is the entry point
used after the selected **MWEB** player response has been fetched. It builds the
immutable `YoutubeSabrInfo` object consumed by `YoutubeSabrSession`:

1. Read `streamingData`. A response without it is rejected as a SABR protocol
   error.
2. Read `serverAbrStreamingUrl`, the `videoPlaybackUstreamerConfig`, visitor
   data, and `adaptiveFormats`.
3. Collect signatures and `n` parameters from the adaptive format URLs and the
   SABR endpoint. If any are present, `YoutubeJavaScriptPlayerManager` performs
   one batch deobfuscation and the resolved values are put back into the URLs.
4. Convert the adaptive formats into `YoutubeSabrInfo.Format` values and keep
   the optional player PO token, when the caller supplied one.

`YoutubeSabrInfo` contains the video id, CPN, client version, visitor data,
resolved SABR endpoint, ustreamer configuration, optional PO token, and the
format list. A format keeps its parsed `ItagItem`, MIME type, codec-related
metadata, audio-track identity, DRC flag, initialization URL/range, and the
approximate duration. The class deliberately exposes no HTTP or decoder state.

## Creating requests

The session is created with:

```java
YoutubeSabrSession session = new YoutubeSabrSession(info);
```

An optional spool directory enables disk-backed assembly for large, uncompressed
media segments. The caller creates immutable requests with `YoutubeSabrRequest`:

```java
YoutubeSabrRequest preparation = YoutubeSabrRequest.preparation(
    playerTimeMs, preferredFormats);
YoutubeSabrRequest playback = YoutubeSabrRequest.playback(
    playerTimeMs, playbackRate, tracks);
```

`preparation` asks for format timelines without declaring selected tracks.
`playback` declares one audio track, one video track, or either one alone, and
may carry a `YoutubeSabrFormatTimeline` plus the last buffered sequence for each
track. A request cannot contain two audio tracks, two video tracks, or the same
itag as both audio and video.

## Sending a request

`YoutubeSabrSession.requestOnce(request, consumer)` performs at most one HTTP
transaction. It returns the number of completed media segments, the server
backoff, and whether the call was deferred because an earlier backoff is still
active. The session increments its request number only after a response has been
read. `YoutubeSabrRequestHelper` then:

- adds `alr=yes`, `cpn`, and the zero-based request number to the SABR endpoint;
- encodes the request as `VideoPlaybackAbrRequest`;
- sends the MWEB user agent and localization;
- requires an `application/vnd.yt-ump` response;
- streams UMP parts through `SabrStreamingResponseReader` so large media payloads
  do not require buffering the complete HTTP body;
- returns a `YoutubeSabrResponse` with control summaries, media statistics, and
  completed `SabrMediaSegment` objects.

The consumer receives segments as soon as a `MEDIA_END` part completes one. When
an optional spool directory is used, large segments can be read from a file (or
progressively while the file is still being written) through
`SabrMediaSegment.openStream()`.

## What state is carried forward

`YoutubeSabrSession` keeps only protocol state between calls: request number,
the current redirected SABR URL, playback cookie, active SABR contexts, PO
token, bandwidth estimate, live metadata, and bounded diagnostic counters. A
`NEXT_REQUEST_POLICY` can update the cookie and backoff. Context updates and
context-sending policy decide which opaque context values are echoed in later
requests.

The session validates redirects before accepting them: they must use HTTPS and
remain on `googlevideo.com` or one of its subdomains. A media-bearing response
resets the redirect counter, while malformed or incomplete media is classified
for bounded recovery.

Next: [The request](./sabr-request).
