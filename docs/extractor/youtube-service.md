# Inside the YouTube service

YouTube is the largest and most volatile service, and the one most likely to send you into the code. This is the map.

![Inside the YouTube service](/diagrams/youtube-service.png)

## InnerTube clients

There is no public YouTube API here. The extractor speaks **InnerTube**, YouTube's
own internal RPC, by sending the context expected by an official client. A
context contains a client name/version, platform or device details, locale, and
the endpoint being called.

The current player paths are selected in `YoutubeStreamExtractor`:

```java
fetchVisionOsJsonPlayer(...)       // anonymous VisionOS path
fetchMwebJsonPlayer(...)           // MWEB player response; SABR for ordinary VOD
fetchWebJsonPlayer(...)            // WEB response used by internal paths
fetchConfiguredJsonPlayer(...)     // TVHTML5 fallbacks used internally
```

The Android app currently exposes **VisionOS** and **MWEB (SABR)** while signed
out, and keeps signed-in sessions on **MWEB (SABR)**. The old Android VR picker
option is no longer part of the current client. `web`, `tv_simply`, and
`tv_downgraded` remain implementation/fallback names rather than user-facing
choices; the TV downgraded path also has special live/HLS handling.

### The VisionOS wind-down

**VisionOS** is the anonymous default. The Android client picks it when no
cookies are stored and **MWEB (SABR)** when a session exists
(`App.reconcileYoutubePlayerClient` in PipePipeClient). For a long time it was
the path that worked without an account, and YouTube is now retiring it.

The failing calls are the media requests, not the extraction ones. The player
response still parses and still lists formats; a later media chunk comes back as
HTTP 403. In user reports that appears as `Source error`,
`ERROR_CODE_IO_BAD_HTTP_STATUS`, and usually a stop around 0:59.

Maintainer answers since September 2026 recommend the same move: switch
**Settings → Advanced → YouTube extraction endpoint** to **MWEB (SABR)**
([#2931](https://github.com/InfinityLoop1308/PipePipe/issues/2931),
[#2935](https://github.com/InfinityLoop1308/PipePipe/issues/2935),
[#2992](https://github.com/InfinityLoop1308/PipePipe/issues/2992)). MWEB is also
the only path that builds SABR streams, so it is the one that keeps receiving
work. It is not a free fix: MWEB needs `googleapis.com` and `google.com`
reachable for the proof-of-origin token, so a DNS filter breaks it in a
different way.

One detail worth knowing in the code: `NewPipe.setYoutubePlayerClient()` accepts
only `mweb`, `visionos`, and the internal `tv_downgraded`. Any other value,
including a leftover preference from an older build, falls back to `visionos`.

Client ids and versions live in `ClientsConstants` and the request helpers.
Requests POST to `youtubei/v1/<endpoint>` (`player`, `next`, `browse`, `search`)
through the corresponding JSON helpers. Different clients expose different
stream sets and trip different walls, so a single fetch often queries several
responses and merges them, using the parallel `CancellableCall` fan-out from
[Extraction flow](./extraction-flow).

## Signatures and the `n` parameter

YouTube protects stream URLs two ways: a scrambled **signature**, and a throttling **`n` parameter** that cripples playback speed if it is not transformed. The usual way to solve both is to download the player `base.js` and run its JavaScript.

This fork does it differently, and it is the biggest divergence from upstream. Instead of running `base.js` in Rhino on the device, `YoutubeApiDecoder` offloads the transform to a PipePipe-hosted service:

```java
YoutubeApiDecoder.decodeSignature(playerId, sig);            // POST api.pipepipe.dev/decoder/decode
YoutubeApiDecoder.decodeThrottlingParameter(playerId, nParam);
```

`YoutubeJavaScriptPlayerManager` is the front door (`getSignatureTimestamp`, `deobfuscateSignature`, `getUrlWithThrottlingParameterDeobfuscated`), with results cached. Rhino is still a dependency, but the hot path is the remote decoder. Keep this in mind for offline or self-hosting scenarios: stream URL deciphering depends on that service being reachable.

## `ItagItem`: itag to format

YouTube identifies each format by an integer **itag**. `ItagItem` is the lookup table: a static list mapping an itag to its `ItagType` (`AUDIO`, `VIDEO`, `VIDEO_ONLY`), `MediaFormat`, and resolution/fps or bitrate. `getItag(id)` resolves one; the stream extractor uses it to fill in codec, resolution, and the init/index byte ranges a DASH manifest needs.

## DASH manifest creators

Some YouTube formats do not arrive as a ready manifest, so the `dashmanifestcreators` package synthesises one:

- **`YoutubeProgressiveDashManifestCreator`**: wraps a progressive URL as DASH using byte ranges.
- **`YoutubeOtfDashManifestCreator`**: OTF ("on the fly") sequence streams, fetched as `sq=0`, `sq=1`, ...
- **`YoutubePostLiveStreamDvrDashManifestCreator`**: ended livestreams (DVR).

`DeliveryType` (`PROGRESSIVE`, `OTF`, `LIVE`) selects which one applies.

## SABR

The newest delivery path is **SABR**, YouTube's session protocol, and it has its
own package (`services/youtube/sabr`, including `YoutubeSabrSession`,
`YoutubeSabrRequest`, `YoutubeSabrRequestHelper`, `YoutubeSabrResponse`,
`SabrResponseDecoder`, and `UmpReader`). In the current extractor, MWEB uses the
SABR stream builder for ordinary non-live videos when the player response
contains SABR data; live and post-live paths can use HLS or other direct formats.
The stream extractor exposes SABR formats and the session driver returns
completed media segments. The dedicated [SABR Guide](/developer-guide/introduction)
covers that protocol end to end.
