# SABR in the extractor

SABR is YouTube's session-based delivery protocol. The protocol *itself*, the rationale, UMP, BotGuard, attestation, is the [SABR Guide](/developer-guide/introduction). This section is the **extractor-side map**: the ~47 classes in `services/youtube/sabr`, what each one actually does, and how a playing session is driven end to end. It assumes you've read the guide.

## Where it sits

When YouTube returns SABR formats, the stream extractor surfaces them with `DeliveryMethod.SABR` (see [Streams and delivery](./streams-and-delivery)). Unlike progressive or DASH, there is no per-format URL to hand the player. The bytes live behind one endpoint, `serverAbrStreamingUrl`, that only speaks the SABR request/response dance: you POST a binary `VideoPlaybackAbrRequest`, you get back a UMP body, you decode it, you advance, you repeat.

The division of labour:

- **The extractor owns the protocol.** It probes the player response, opens the session, builds each binary request, POSTs it, decodes the UMP, tracks per-track buffered state, reassembles segments, and bounds every failure mode.
- **The client owns the rhythm and the screen.** Its pump decides *when* to ask for more, caches the segments, feeds the decoder, drives seeks, and supplies the one thing the extractor can't produce: a PO token (minted in a WebView).

The extractor never mints a token and never decodes a pixel.

## Read in this order

1. **[Starting a session](./sabr-probe)** — the probe: player response, `serverAbrStreamingUrl`, the client profiles, formats.
2. **[The request](./sabr-request)** — the `VideoPlaybackAbrRequest` proto, field by field, and the wire format.
3. **[UMP and decoding](./sabr-decoding)** — the UMP framing, the full part-type table, the decoded response.
4. **[Media, segments, and the index](./sabr-media)** — how media bytes become playable segments, and how time maps to a segment number.
5. **[The buffered-range model and seeking](./sabr-buffered)** — the contiguous-vs-max model that prevents starvation, and how seeking works.
6. **[The session driver](./sabr-session)** — the pump loop, the cache, eviction, and every bounded retry.
7. **[Control parts reference](./sabr-control-parts)** — every server instruction and its effect.

## Class map

| Area | Classes |
| --- | --- |
| Session lifecycle | `YoutubeSabrProbe`, `YoutubeSabrProbeResult`, `YoutubeSabrInfo`, `YoutubeSabrSession`, `YoutubeSabrStreamState`, `YoutubeSabrClientProfile` |
| Formats | `YoutubeSabrFormat`, `SabrSelectableFormats`, `SabrFormatSelectionConfig`, `SabrFormatInitializationMetadata` |
| Request | `YoutubeSabrRequestBuilder`, `SabrSegmentRequest`, `SabrRequestIdentifier`, `SabrColdStartPoToken`, `SabrProto`, `SabrRequestDumper` |
| UMP + decode | `UmpReader`, `UmpPart`, `SabrResponseDecoder`, `SabrDecodedResponse` |
| Media + segments | `SabrMediaHeader`, `SabrMediaSegment`, `SabrMediaSegmentCollector`, `SabrSegmentIndex`, `SabrMp4SegmentIndexParser`, `SabrWebmSegmentIndexParser`, `SabrOnesieData`, `SabrOnesieHeader`, `SabrOnesieInnertubeResponse` |
| Control parts | `SabrNextRequestPolicy`, `SabrStreamProtectionStatus`, `SabrRedirect`, `SabrSeek`, `SabrReloadPlayerResponse`, `SabrPlaybackStartPolicy`, `SabrContextSendingPolicy`, `SabrContextUpdate`, `SabrContextValue`, `SabrRequestCancellationPolicy`, `SabrPrewarmConnection`, `SabrLiveMetadata`, `SabrError`, `SabrSnackbarMessage` |
| Buffered state | `SabrBufferedRange`, `SabrPlaybackCookie` |
| Tokens | `SabrPoTokenProvider` |
| Errors | `SabrProtocolException` |

## The boundary

The extractor understands and drives the protocol; it does not mint tokens and does not render media. For the protocol itself, the request and response shapes, the session model, BotGuard, and attestation, read the [SABR Guide](/developer-guide/introduction).
