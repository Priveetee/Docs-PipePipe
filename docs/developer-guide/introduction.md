# SABR

This part of the wiki is about SABR, the protocol YouTube now uses to deliver media, and the attestation that guards protected streams.

SABR, short for Server Adaptive BitRate, is the delivery protocol YouTube increasingly uses in place of plain media URLs. If you build or maintain a YouTube extractor, it matters, because it changes how the whole thing works.

The implementation is split between two repositories. The
[extractor](https://github.com/InfinityLoop1308/PipePipeExtractor) builds
service requests and interprets service responses, including SABR/UMP data.
The [Android client](https://github.com/InfinityLoop1308/PipePipeClient)
coordinates playback, manages the SABR session, and connects parsed formats to
the media player. The app repository chooses which revisions are combined in a
published build. For a specific behaviour or limit, inspect the linked source
and issue history rather than assuming that an extractor change alone changes
playback. For example, [issue #2973](https://github.com/InfinityLoop1308/PipePipe/issues/2973)
and [client PR #99](https://github.com/InfinityLoop1308/PipePipeClient/pull/99)
document a long-video segment-count case; their pages show the current status.
YouTube changes this flow over time, so this guide focuses on its architecture
and links to live source for implementation details.

Useful entry points in the code are the extractor's
[`SabrResponseDecoder.java`](https://github.com/InfinityLoop1308/PipePipeExtractor/blob/main/extractor/src/main/java/org/schabi/newpipe/extractor/services/youtube/sabr/protocol/SabrResponseDecoder.java)
and [`YoutubeSabrSession.java`](https://github.com/InfinityLoop1308/PipePipeExtractor/blob/main/extractor/src/main/java/org/schabi/newpipe/extractor/services/youtube/sabr/YoutubeSabrSession.java),
plus the client's
[`SabrDashMediaSource.java`](https://github.com/InfinityLoop1308/PipePipeClient/blob/dev/app/src/main/java/org/schabi/newpipe/player/datasource/SabrDashMediaSource.java).

The old way was mostly stateless. You resolved a URL or a manifest and downloaded the bytes. SABR is a conversation instead. The client opens a session and keeps talking to the server, sending its current playback state and receiving media in small pieces, until playback is done.

![SABR pipeline](/diagrams/sabr-pipeline.png)

The flow above is the whole story in one picture. The client reads the streaming config from the player response, builds a request, and posts it. The server answers with a UMP body that carries typed parts, some of which are media and some of which are instructions for the next request. As long as media keeps coming, the client assembles audio and video. When the server decides the stream is protected, it stops sending media until the client presents a valid Proof of Origin token.

## What this section covers

This is a developer level description of how SABR works, written from what we observed while studying it. It is split into a few pages.

For the background, why YouTube moved to SABR and where the analysis stops, see [The origins of SABR](./sabr-origins).

The protocol itself is the request, the UMP response, and the session state the client carries between calls. That is on [The SABR protocol](./sabr-protocol).

The protection side is the harder part. Protected media is gated by an attestation system called BotGuard. How it is built and why it is so hard to analyse is on [Inside BotGuard](./sabr-botguard). How the attestation actually flows, and what the Proof of Origin token is, is on [Attestation](./sabr-attestation).

## A note on scope

This stays at a logical level: concepts, structure, and flow, not exact constants, internal names, or byte-level layouts. Those are version-specific and brittle, and you do not need them to understand how SABR works. The goal is to explain the system clearly enough that the community can reason about a legitimate integration.
