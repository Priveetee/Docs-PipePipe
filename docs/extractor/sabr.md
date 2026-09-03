# SABR in the extractor

SABR is YouTube's session-based delivery protocol. The protocol itself, its
motivation, UMP, BotGuard and attestation are covered by the [SABR
Guide](/developer-guide/introduction). This page maps the current
`services/youtube/sabr` package in PipePipeExtractor and explains the boundary
between extraction, requests, decoding and media assembly.

## Where it sits

When the MWEB player response contains SABR formats,
`YoutubeStreamExtractor.buildSabrStreams()` exposes them as
`DeliveryMethod.SABR`. There is no per-format media URL. The stream carries the
common `serverAbrStreamingUrl` as reference, while the client chooses formats
and drives the session with `YoutubeSabrRequest`.

The current division of labour is:

- `YoutubeStreamExtractor` parses `streamingData`, resolves JavaScript `n` and
  signature parameters in one batch, and creates `YoutubeSabrInfo` plus SABR
  stream metadata;
- `YoutubeSabrSession` and `YoutubeSabrRequestHelper` encode and send each
  transaction, follow redirects and policies, track cookies, contexts and live
  metadata, and apply bounded recovery;
- `SabrStreamingResponseReader` and `SabrMediaSegmentCollector` decode the UMP
  envelope and assemble completed media segments, optionally using a spool file
  for large uncompressed segments;
- the application layer consumes the completed segments and supplies a PO token
  when YouTube requests one. The extractor does not mint that token or render
  media.

In PipePipeClient, `SabrSessionHelper` validates the extractor metadata and
creates the session, `SabrMediaBridge` translates Media3 segment demand into
preparation/playback requests, and `SabrRequestCoordinator` serializes retries,
backoff and attestation recovery. Downloads use the same extractor session from
`SabrDownloader`, then remux the collected audio/video files. The local DOM
provider supplies the PO token; it is not a second SABR implementation.

## Read in this order

1. **[Starting a session](./sabr-probe)** — player-response parsing,
   `YoutubeSabrInfo`, request creation and the state carried between calls.
2. **[The request](./sabr-request)** — `VideoPlaybackAbrRequest`, preferred and
   selected formats, buffered ranges and the protobuf wire format.
3. **[UMP and decoding](./sabr-decoding)** — framing, part identifiers and the
   `YoutubeSabrResponse` produced by the decoder.
4. **[Media, segments, and the index](./sabr-media)** — headers, compressed
   payloads, segment assembly and initialization timelines.
5. **[The session driver](./sabr-session)** — one-transaction semantics,
   redirects, backoff, attestation and recovery limits.
6. **[Control parts reference](./sabr-control-parts)** — the wire-level control
   parts currently recognized by `SabrResponseDecoder`.

## Current class map

| Area | Current classes |
| --- | --- |
| Player response | `YoutubeStreamExtractor`, `YoutubeSabrInfo`, `YoutubeSabrInfo.Format` |
| Session and requests | `YoutubeSabrSession`, `YoutubeSabrRequest`, `YoutubeSabrRequest.Track`, `YoutubeSabrRequestHelper` |
| Response and UMP | `YoutubeSabrResponse`, `SabrResponseDecoder`, `SabrStreamingResponseReader`, `UmpReader`, `SabrProto` |
| Media assembly | `SabrMediaSegment`, `SabrMediaSegmentCollector`, `SabrMediaHeader`, `SabrFormatInitializationMetadata` |
| Timelines | `YoutubeSabrFormatTimeline`, `SabrSegmentIndex`, `SabrMp4SegmentIndexParser`, `SabrWebmSegmentIndexParser` |
| Diagnostics | `YoutubeSabrSessionDiagnostics`, `YoutubeSabrSession.TraceSnapshot` |
| Errors | `SabrProtocolException`, `SabrRecoverableException`, `SabrAttestationException` |

The class map intentionally lists only classes present in the current
PipePipeExtractor source. Older documentation referred to probe, profile and
stream-state classes that are no longer part of this package.

## The boundary

The extractor knows how to describe and drive a SABR transaction, but it does
not turn the response into decoded audio or video. For the protocol's request
and response shapes, BotGuard and attestation, continue with the [SABR
Guide](/developer-guide/introduction).
