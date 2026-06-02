# The origins of SABR

A bit of background: why SABR exists, what changed when it arrived, and where studying it stops.

## The problem it created

For a long time YouTube playback was simple to extract. You resolved a media URL or a manifest and downloaded the bytes. Then that started to break, in waves that looked random but were not. Videos that used to work would suddenly fail with "content not supported," sometimes a whole batch at once, sometimes only for some accounts or regions.

A few reports that captured it:

- [#2330 — Content Not Yet Supported (SABR) after 5.1.0](https://github.com/InfinityLoop1308/PipePipe/issues/2330)
- [#2272 — "This content is not yet supported" when a YouTube link is pushed in](https://github.com/InfinityLoop1308/PipePipe/issues/2272)
- [#2318 — most videos won't play for no reason randomly](https://github.com/InfinityLoop1308/PipePipe/issues/2318)

The cause was not a flaky parser. It was YouTube moving media delivery to SABR and, for more and more videos, no longer handing out usable plain media URLs at all. When there is nothing to resolve, the old extraction model has nothing to download, and the only honest thing it can report is "not supported." The fix is not a patch, it is understanding a new protocol.

## What SABR changed

SABR is not a download, it is a conversation. The client opens a session and keeps talking to the server: it sends its current playback state, the server answers with media in small pieces plus instructions for the next request, and this repeats until playback is done. [The SABR protocol](./sabr-protocol) covers the details.

The protocol side of this is, by now, fairly well understood and openly implemented. The harder part is the protection layer: on some videos the server stops sending media until the client proves itself with a valid Proof of Origin token. That is where most of the difficulty lives, and it is covered in [Inside BotGuard](./sabr-botguard) and [Attestation](./sabr-attestation).

## Where the analysis stops

The obvious question, once the attestation is understood, is whether the token can be minted fully offline, with no browser in the loop. It cannot. The secret that signs the token lives on the server by design. You can understand every client-side layer perfectly and that secret is still not yours.

So this documentation stops there, on purpose. It is not a dead end and not a missing chapter. A legitimate integration runs the real challenge, sends it off like a normal client, and uses the token it gets back. Understanding the protocol is what makes that integration solid; it does not, and should not, remove the server from the loop.

## Credits and prior work

None of this understanding came from nowhere. SABR and the attestation around it had already been mapped, in the open, by other projects. This documentation leans on their work, and they are worth a look and a star:

- [LuanRT/googlevideo](https://github.com/LuanRT/googlevideo) — reference implementation of SABR streaming and UMP parsing.
- [LuanRT/BgUtils](https://github.com/LuanRT/BgUtils) — the BotGuard and Proof of Origin token flow.
- [FreeTube](https://github.com/FreeTubeApp/FreeTube) — real-world client request shapes and token handling.
- [Piped](https://github.com/TeamPiped/Piped) — request shapes, redirect handling, and segment-index logic.
- [NewPipe / NewPipeExtractor](https://github.com/TeamNewPipe/NewPipeExtractor) — the extractor foundation a lot of this builds on.
- [Shaka Player](https://github.com/shaka-project/shaka-player) — segment-index concepts behind buffered ranges.
