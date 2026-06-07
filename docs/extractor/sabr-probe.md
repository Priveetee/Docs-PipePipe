# Starting a session

Part of [SABR in the extractor](./sabr). Here: how a session is bootstrapped from a player response, the client identities it can wear, and the format model.

## Two entry points

There are two distinct SABR code paths, and it's worth separating them up front:

- **The extractor's stream listing.** `YoutubeStreamExtractor.buildSabrStreams()` reads `streamingData`, and for each adaptive format emits an `AudioStream` / `VideoStream` with `DeliveryMethod.SABR` (content = `serverAbrStreamingUrl`, `isUrl=false`). This is what `getStreams()` returns. Each stream's `ItagItem` carries the init range and index range. A temporary flag `FORCE_SABR_FOR_TESTING` routes every non-live video through SABR; with it off, SABR is used only for SABR-only responses that have no HLS manifest.
- **The session driver.** `YoutubeSabrProbe` + `YoutubeSabrSession` + friends are a self-contained driver that actually *plays* a SABR stream. The client constructs and pumps this; the extractor's job is just to expose that the streams exist and provide a `SabrPoTokenProvider`.

The rest of this section is about the second path.

## The probe

`YoutubeSabrProbe` is a static utility. `fetchSabrInfo(...)` builds a `YoutubeSabrInfo`:

1. Generate a `cpn` (content-playback nonce).
2. POST the InnerTube `player` request (`fetchPlayerResponse`) for the chosen `YoutubeSabrClientProfile`.
3. Read `streamingData`; throw `SabrProtocolException` if absent.
4. Take `serverAbrStreamingUrl` and **deobfuscate its `n` parameter** through the JS player (`maybeDeobfuscateNParameter`), handling both `?n=` and `/n/` forms.
5. Extract the **ustreamer config** (`playerConfig.mediaCommonConfig.mediaUstreamerRequestConfig.videoPlaybackUstreamerConfig`), an opaque blob echoed back in every request.
6. Extract `visitorData` (override or `responseContext.visitorData`).
7. Build `YoutubeSabrFormat`s from `streamingData.adaptiveFormats`.

The player request body (`createPlayerBody`) is a normal InnerTube call with a few SABR-relevant pieces: `playbackContext.contentPlaybackContext.signatureTimestamp` (from the JS player), `cpn`, `videoId`, `contentCheckOk`, and, if available, a *player* PO token at `serviceIntegrityDimensions.poToken` (distinct from the *media* PO token used later).

### `YoutubeSabrInfo`

Immutable, the session's root state: `profile`, `videoId`, `cpn`, `clientVersion`, `visitorData`, `serverAbrStreamingUrl`, `videoPlaybackUstreamerConfig`, and the `formats` list. Selection helpers: `findBestAudioFormat()` (max bitrate), `findBestVideoFormat()` (max height), `findFormatByItag(itag)`. (Note: no duration field, duration is per-format `approxDurationMs`; no PO token field, that comes from the provider.)

## Client profiles

`YoutubeSabrClientProfile` is the InnerTube identity the request is sent as. The server tailors formats, headers, and behaviour to it.

| Profile | clientName | id | clientVersion | web-like |
| --- | --- | --- | --- | --- |
| `WEB` | WEB | 1 | 2.20250122.04.00 (live-resolved) | no |
| `WEB_EMBEDDED` | WEB_EMBEDDED_PLAYER | 56 | 1.20250121.00.00 | yes |
| `ANDROID` | ANDROID | 3 | 21.03.36 | no |
| `ANDROID_VR` | ANDROID_VR | 28 | 1.65.10 | no |
| `IOS` | IOS | 5 | 19.45.4 | no |
| `TVHTML5` | TVHTML5 | 7 | 7.20250923.13.00 | yes |
| `SAFARI_WEB` | WEB | 1 | 2.20260114.08.00 | no* |

Each profile also carries an OS name/version and a User-Agent where relevant. `WEB` resolves its version live (`YoutubeParsingHelper.getClientVersion()`), falling back to the constant. `SAFARI_WEB` reuses the `WEB` name/id but is treated as web-like through explicit `WEB || SAFARI_WEB` checks. Android/iOS go to the gapis InnerTube host and add `X-Goog-Api-Format-Version: 2`; web-like profiles add `Origin`/`Referer`/`X-YouTube-Client-*` and cookies.

## Posting a media request

`postMediaRequest` is the actual SABR POST:

- URL = `withSabrSessionParameters(serverAbrStreamingUrl, cpn, requestNumber)`, which ensures `alr=yes` and `cpn=...` and sets `rn=<requestNumber + 1>` (the URL `rn` is 1-based).
- Headers (`buildSabrHeaders`): `Accept: application/vnd.yt-ump`, profile User-Agent; non-web adds `X-Goog-Visitor-Id`; web-like switches to `Accept: */*` + browser `Origin`/`Referer`.
- The body is the protobuf `VideoPlaybackAbrRequest` (see [The request](./sabr-request)).
- The response **must** have `Content-Type: application/vnd.yt-ump`, else `SabrProtocolException`. It's decoded by `SabrResponseDecoder` into a `SabrDecodedResponse`, wrapped in a `YoutubeSabrProbeResult` (info + decoded + HTTP code + body length + content type).

## Formats

`YoutubeSabrFormat` is one adaptive format: `itag`, `lastModified`, `xtags`, `mimeType` (codec lives inside it), `audioTrackId`, `qualityLabel`, `audioQuality`, `drc`, `width`, `height`, `bitrate`, `contentLength`, `approxDurationMs`. `isAudio()`/`isVideo()` test the mime type. `fromAdaptiveFormats` parses the JSON array (long-valued fields like `contentLength` are serialized as strings, so `parseLong` is lenient).

Two server-sent control parts refine selection at runtime: `SabrSelectableFormats` (the video/audio `FormatId`s the server will serve, including "wrapped" variants) and `SabrFormatSelectionConfig` (the itags + a resolution the server wants the client to request).

## Onesie

The "onesie" parts (`SabrOnesieHeader` / `SabrOnesieData` / `SabrOnesieInnertubeResponse`) let the server inline an entire InnerTube player response (type `0 = ONESIE_PLAYER_RESPONSE`) or media/keys into the SABR stream, so a client can skip a separate `player` call. The decoder here reads them defensively (clear, gzip-or-raw, no encryption material) and mostly for diagnostics, but the mechanism is why a SABR response can be self-contained.

---

Next: [The request](./sabr-request).
