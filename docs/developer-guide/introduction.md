# SABR

This part of the wiki is about SABR, the protocol YouTube now uses to deliver media, and the attestation that guards protected streams.

SABR, short for Server Adaptive BitRate, is the delivery protocol YouTube increasingly uses in place of plain media URLs. If you build or maintain a YouTube extractor, it matters, because it changes how the whole thing works.

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
