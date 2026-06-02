# Attestation

To return protected media, SABR needs a Proof of Origin token in the request context. This page explains where that token comes from and how the server side behaves, at a logical level. It does not describe how to forge one, which is not possible from the client anyway, as the last section explains.

## The flow

Getting a token is a chain of steps. The client fetches a challenge, runs it, sends the result to Google, gets an integrity token back, and mints a token bound to the specific video.

![Attestation flow](/diagrams/attestation-flow.png)

It starts when the client fetches an attestation challenge from YouTube. That challenge runs inside BotGuard, the VM described in [Inside BotGuard](./sabr-botguard), which measures the environment and produces a snapshot. The snapshot goes to a Google endpoint called GenerateIT, which checks it and returns an integrity token. From that integrity token the client mints a Proof of Origin token for the video it wants to play, and places it in the SABR request context.

## What the server returns

Seen from the outside, GenerateIT behaves in a few consistent ways that are worth knowing when you build against it.

A valid snapshot gives back a token together with a lifetime, around twelve hours. The same valid snapshot can be reused, the call is not single use. When the snapshot is invalid or truncated, the endpoint does not error out with an HTTP failure. It returns a degraded response with no real token, so an integration has to check that it actually received a usable token rather than assuming success from the status code.

One useful consequence of the lifetime is that a single attestation amortises across many videos. You do not need to run the whole challenge for every video. The expensive part runs once, and from it the client can mint per video tokens for as long as the integrity token is valid.

![Token lifecycle](/diagrams/token-lifecycle.png)

## Why this cannot be done offline

This is the part to internalise as an implementer.

The integrity token is issued on Google's servers, using a secret that never leaves them. No amount of client reverse engineering gives you that secret. You can understand every layer of BotGuard and still not be able to sign a token yourself, because the trust root is on the server, by design.

So a correct integration does not fake anything. It runs the real challenge in a real JavaScript runtime or a WebView, sends the snapshot to GenerateIT like a normal client, and uses the token it gets back. Understanding the protocol makes the integration robust. It does not, and is not meant to, remove the server from the loop.

## This will keep changing

SABR and BotGuard are moving targets. YouTube will almost certainly keep changing them over time, and some of what is described here will drift out of date as that happens. When it does, this documentation will be updated to follow. Treat it as a living description of a system that is still evolving, not a final word on it.
