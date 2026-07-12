# YouTube playback, network, and sign-in

## `AntiBotException`

`Sign in to confirm you're not a bot` means YouTube has restricted an anonymous
request. It is not a generic request to clear cache or update WebView. Retry
once, then test another network or VPN exit. Record the selected YouTube
extraction endpoint before reporting it.

Use the same public video for each test. Record the network country/exit and
whether the failure is immediate or starts after a few streams. A result that
changes only with the network is valuable evidence; do not publish an IP address
or account details.

## `Source error` or buffering

These messages do not identify one cause. Update PipePipe, attach the generated
error report, and include the affected URL, endpoint, login state, country, and
VPN/proxy state. Say whether the failure is at startup, after a fixed time, on
quality change, when returning to the app, or after seeking.

Web and MWeb use SABR for anonymous playback. Trying another endpoint can be a
temporary diagnostic step; it is not proof that the original endpoint or WebView
is at fault.

### A controlled playback test

1. Start with one public video and record the selected endpoint.
2. Try once on the normal network; do not keep changing settings during the run.
3. If it fails, repeat once with the same video and note the time/position.
4. If appropriate, change **one** variable—network/VPN exit, endpoint, or login
   state—and retest the same video.
5. Attach the generated report and list both results.

This separates a repeatable extraction failure from a one-off network/session
failure. It also prevents a report from accidentally claiming that five changes
were the fix.

## Logged-in playback

Login is best reserved for IP blocks, age-restricted content, channel-member
content, or YouTube automatic subtitle translation. It has current trade-offs:
AVC-only video formats, no audio-only downloads, no rewind for a live stream
already in progress, and less predictable extraction. If a failure starts after
login, test once while logged out and report both results.

Do not put cookies, tokens, account email, or a screen recording of a login flow
in a public issue. “Logged in / logged out” and the visible error are enough for
the first report.

## Endpoint is evidence, not a magic switch

An endpoint selects a request/extraction path. It can make a symptom appear or
disappear, so it must be recorded, but a single successful endpoint does not
prove that all other endpoints are broken. Report the default endpoint, each
endpoint tested, and the result for the same URL. Keep endpoint experiments out
of an unrelated WebView report unless the exact WebView message is also present.

<div class="screenshot-callout" role="img" aria-label="YouTube extraction endpoint picker with MWEB and Android VR highlighted">
  <img src="/screenshots/pipepipe-endpoint-picker-5.2.3-api36.png" alt="YouTube extraction endpoint picker">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="70" y="995" width="940" height="125" rx="24" />
    <circle class="callout-number" cx="965" cy="1025" r="42" /><text x="965" y="1025">1</text>
    <rect class="callout-box" x="70" y="1260" width="940" height="125" rx="24" />
    <circle class="callout-number" cx="965" cy="1290" r="42" /><text x="965" y="1290">2</text>
  </svg>
</div>

Recent closed report [#2686](https://github.com/InfinityLoop1308/PipePipe/issues/2686)
is a concrete example: for a claimed IP block, the maintainer asked whether
**Android VR (DASH)** was selected and advised testing PipePipe 5.2.3 with
**MWEB (SABR)** instead. In the capture, **1** is MWEB and **2** is Android VR.
Treat that as a controlled endpoint comparison, not a
promise that MWEB fixes every network or account failure.

## Minimum playback report

```text
Video URL and service:
PipePipe version / Android version:
Endpoint before and during the failure:
Logged in or out:
Network country / VPN or proxy state:
Failure point (start / time / seek / quality / return to app):
Exact visible message and generated report:
One-variable retest and result:
```

## Do not mix with WebView errors

The exact **WebView unavailable** message has its own [dedicated guide](./webview).
A current WebView does not rule out a network or SABR failure, and a `Source
error` does not prove that WebView needs updating.
