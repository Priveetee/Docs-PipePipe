# WebView and YouTube playback

## When this guide applies

Use this guide when PipePipe shows the following message while loading a YouTube
video:

> **WebView unavailable. Please make sure your WebView version is higher than 80.**

This is a compatibility error. It is not a request to sign in to YouTube, and it
is not proof that the phone itself is too old.

![How WebView fits into YouTube playback](/diagrams/webview-playback.png)

## Why PipePipe checks WebView

Some YouTube streams use SABR, a session-based delivery protocol. When YouTube
protects a stream, the client must obtain a short-lived Proof of Origin (PO)
token before YouTube will return more media. PipePipe runs YouTube's BotGuard
challenge in Android WebView to obtain that token.

The current PipePipe client also checks that WebView is usable before it begins
YouTube stream extraction. It verifies that Android has selected a provider,
that the provider initializes, and that it can run the JavaScript features the
challenge needs. The message's version-80 guidance is therefore a useful floor,
not the only possible reason for the error.

This has two consequences:

- Web and MWeb are the endpoints that use SABR, but changing endpoint does not
  bypass PipePipe's WebView availability check.
- A current WebView can still fail if its provider is disabled, cannot start, or
  fails its JavaScript capability check. That needs a bug report, not endless
  WebView updates.

For the implementation-level explanation, read the [SABR guide](/developer-guide/introduction)
and [Attestation](/developer-guide/sabr-attestation).

## Check the active WebView provider

1. Open Android **Settings**.
2. Enable **Developer options** if they are not already available.
3. Open **WebView implementation**. The name and location differ between devices.
4. Verify that a provider is selected and enabled. Note its package name and full version.
5. Restart PipePipe after changing or updating the provider.

![Android WebView implementation screen, Android 16](/screenshots/android-webview-provider-api36.png)

*Reference capture: Android 16/API 36. The provider name and version are examples; report the values shown on your own device.*

PipePipe's error screen gives these practical directions:

- **Android 6 and Android 10:** update **Android System WebView**.
- **Android 7, 8, and 9:** update **Chrome**, then select it as the WebView
  implementation if Android offers that choice.
- **Other Android versions:** the error is unexpected; report it.

::: info Privacy-focused and vendor Android builds
Some operating systems offer a different WebView provider; some devices permit
only the vendor's provider. Use a maintained provider that Android accepts for
your device. PipePipe cannot install, select, or replace a system WebView
provider for you.
:::

## Do not confuse these failures

| What you see | What it establishes | Next action |
| --- | --- | --- |
| Exact **WebView unavailable** message | PipePipe could not use the selected WebView provider. | Follow this page and report the provider details if it remains. |
| `Source error`, buffering, or playback stops | Not enough evidence to blame WebView. SABR, network, account, or player code may be involved. | Update PipePipe and attach the generated error report. |
| `AntiBotException: Sign in to confirm you're not a bot` | A YouTube/network or authentication restriction. | See [YouTube playback and extraction](./youtube-playback). |
| Search gives no results | A separate extractor/search problem. | Open a separate report with the service, country, endpoint, and VPN status. |

An app working on the same device does not prove PipePipe can remove this
requirement. Different apps may use different YouTube clients, endpoints, or
fallback paths.

## If WebView is recent but PipePipe still rejects it

1. Update PipePipe to the latest stable release, then restart Android and PipePipe.
2. Confirm the active provider again in **WebView implementation**; installed
   Chrome or Android System WebView is not enough if Android has not selected it.
3. If the provider is vendor-locked or cannot be changed, do not assume that an
   arbitrary downloaded provider is compatible. Keep the device on a supported,
   maintained system/WebView update path.
4. Send a bug report with the information below.

This matters even on recent Android versions. A current provider can fail during
initialization, and PipePipe needs the log to distinguish that application-side
problem from an old or incompatible provider.

## What to include in a bug report

Open a **bug report**, not a feature request, and include:

- PipePipe version and installation source;
- Android version and device model;
- WebView provider package name and full version;
- the selected YouTube extraction endpoint;
- YouTube login state, network country, and VPN/proxy state;
- one affected video URL and the time of the test;
- PipePipe's generated error report or crash log;
- a screenshot of **WebView implementation** if the provider is unavailable or locked.

Keep unrelated symptoms, especially search problems, in a separate issue. The
two reports require different evidence and may have unrelated causes.
