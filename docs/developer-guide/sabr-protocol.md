# The SABR protocol

A SABR session is a back and forth. The client describes who it is and where playback currently sits, the server replies with media and instructions, and the client uses those instructions to ask for the next chunk. This page walks through the request, the response, and the state that ties them together.

## The request

Every call sends a request object that tells the server three things. Who is asking, which formats the client wants, and where playback is right now.

In practice that means the request carries the selected audio and video formats, the ranges the client has already buffered for each of them, the current player time, and a continuity token that the previous response handed back. When protection is in play, it also carries the attestation data in the client context.

The first request of a session is a cold start. It does not claim any buffered ranges yet, so the server responds with the format initialization metadata and the first media, including the init segments that set up each track. Later requests are follow ups: they carry the growing state, the buffered ranges and the continuity token, so the server only sends what comes next. Getting this distinction wrong, for example sending follow-up shaped state on the very first call, makes the server skip the initialization and the session never starts cleanly.

![Cold start versus follow up](/diagrams/coldstart-vs-followup.png)

## The response is UMP

The server does not answer with a flat file. It answers with a UMP body, which is a stream of length prefixed typed parts. Each part has a kind, and the client reads them in order, handling the kinds it understands and skipping the rest.

![Anatomy of a UMP response](/diagrams/ump-anatomy.png)

The parts fall into three rough groups. Descriptors set the scene: the per format initialization metadata and the list of selectable formats. Media is the payload itself, and it comes as a small sequence: a header that describes an upcoming segment, the segment bytes, then an end marker. Instructions steer the next round: the next request policy tells the client how far to read ahead and hands back the continuity token to echo, and the stream protection status says whether the stream is still open or has been gated.

A single response usually mixes all three. The client walks the parts, collecting media as it goes and recording the instructions so the next request is shaped correctly.

## Assembling the media

The media parts do not arrive as one finished file. Each selected format, one for audio and one for video, comes as an init segment followed by a run of media segments. The init segment sets up the track, the media segments carry the actual audio or video, and together they reconstruct a continuous track for that format.

![Assembling segments into tracks](/diagrams/media-assembly.png)

The client does this for both formats in parallel and feeds the two reconstructed tracks to the player. Because the bytes come from media parts rather than a plain file, the container of each segment is what tells the client and the decoder how to interpret it, which is why the init segment matters so much. Lose it, or assemble the segments out of order, and the track cannot be decoded even though every byte arrived.

## Session state

The reason SABR feels different from a classic extractor is this state. The client keeps a small model in memory across requests. A request number, the continuity token, the buffered ranges per format, and the current player time.

![A SABR session](/diagrams/sabr-session.png)

Echoing the token and reporting accurate buffered ranges is what lets follow up requests advance cleanly. Get those wrong and the session stalls or loops.

## The protection boundary

For some videos and formats, after a certain point the server stops sending media. Instead it returns policy only responses. The stream protection status flips to a protected state, a backoff value is included, and there are no media parts at all.

The status moves through three values. Status 1 is open, media flows normally. Status 2 is the boundary, the point where attestation is about to be required. Status 3 is protected, the server returns policy only and no media. Retrying while in status 3 changes nothing on its own. Presenting a valid Proof of Origin token in the request context is what moves the session back to status 1, and media starts flowing again.

![The protection status flow](/diagrams/protection-states.png)

This is not a bug in your parser or your request. It is a real protection state. That side of the story is covered in [Inside BotGuard](./sabr-botguard) and [Attestation](./sabr-attestation).
