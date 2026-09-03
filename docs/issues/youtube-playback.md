# YouTube playback, network, and sign-in

PipePipe's YouTube extraction paths change as YouTube changes its requests. This
page was checked against the current 5.3.x code and the [latest stable and
prerelease builds](https://github.com/InfinityLoop1308/PipePipe/releases). If a
recent issue asks for a specific prerelease, test that exact build and mention
it in the report; do not describe an older beta as the current behaviour.

## Every YouTube video fails: check DNS filtering

If every public YouTube video fails almost immediately, inspect the generated
PipePipe report before changing the extraction endpoint, reinstalling the app,
or updating WebView.

### Step 1: confirm the DNS signature

If PipePipe displays **Network error**, tap **REPORT**:

<div class="screenshot-callout" role="img" aria-label="Report button highlighted on the PipePipe Network error screen">
  <img src="/screenshots/pipepipe-network-error-5.2.4-api36.png" alt="PipePipe Network error screen with Report and Retry buttons">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="395" y="990" width="320" height="205" rx="28" />
    <path class="callout-arrow" d="M 810 920 C 780 955, 740 1005, 690 1050" />
    <circle class="callout-number" cx="830" cy="900" r="42" /><text x="830" y="900">1</text>
  </svg>
</div>

On the **Error report** page, tap the share icon to copy the generated text into
a local note, then search that text:

<div class="screenshot-callout" role="img" aria-label="Share button highlighted on the PipePipe Error report screen">
  <img src="/screenshots/pipepipe-error-report-5.2.4-api36.png" alt="PipePipe Error report screen with the share button">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="935" y="55" width="135" height="165" rx="24" />
    <path class="callout-arrow" d="M 880 285 C 915 250, 950 210, 985 170" />
    <circle class="callout-number" cx="850" cy="310" r="42" /><text x="850" y="310">2</text>
  </svg>
</div>

*These screens show PipePipe 5.2.4 on Android 16. The controlled network failure
was created only to show where the buttons are; diagnose the text from your own
report.*

Search the report for `googleapis.com` and `google.com`. These forms identify a
local DNS or network block:

```text
jnn-pa.googleapis.com/0.0.0.0:443
jnn-pa.googleapis.com/127.0.0.1:443
localhost/127.0.0.1:...
```

::: warning The request never reached Google
`0.0.0.0`, `127.0.0.1`, and `localhost` point back to the device instead of the
real service. PipePipe cannot work around that redirect by changing its
endpoint.
:::

![How DNS filtering stops YouTube playback](/diagrams/dns-filtering.png)

### Step 2: find which filter is responsible

Check these layers one at a time:

1. **Android Private DNS:** open **Settings → Network & internet → Private
   DNS**. On Samsung devices, the usual path is **Settings → Connections → More
   connection settings → Private DNS**. Note the selected provider and check its
   dashboard or query log.
2. **VPN or local filter:** inspect the blocked-query log of the VPN, ad blocker,
   firewall, or DNS app while retrying the video.
3. **Router or self-hosted DNS:** inspect the query log and allowlist on the
   router, Pi-hole, AdGuard Home, NextDNS, or equivalent service.
4. **Rooted device or custom ROM:** check whether the hosts file redirects a
   required domain to `0.0.0.0` or `127.0.0.1`.

<div class="screenshot-callout" role="img" aria-label="Private DNS row highlighted in Android Network and internet settings">
  <img src="/screenshots/android-network-private-dns-api36.png" alt="Android Network and internet settings with the Private DNS row">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="35" y="1700" width="1010" height="225" rx="28" />
    <path class="callout-arrow" d="M 970 1640 C 925 1670, 900 1710, 865 1760" />
    <circle class="callout-number" cx="985" cy="1620" r="42" /><text x="985" y="1620">3</text>
  </svg>
</div>

**3.** Open **Private DNS**. This page also shows whether a VPN is active.

<div class="screenshot-callout" role="img" aria-label="Android Private DNS mode dialog highlighted">
  <img src="/screenshots/android-private-dns-api36.png" alt="Android Private DNS mode dialog">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="105" y="805" width="860" height="410" rx="28" />
    <path class="callout-arrow" d="M 965 705 C 920 730, 900 775, 865 835" />
    <circle class="callout-number" cx="980" cy="690" r="42" /><text x="980" y="690">4</text>
  </svg>
</div>

**4.** Note the active mode or provider. If a provider hostname is selected,
open that service's dashboard and query log. **Automatic** does not rule out a
filter on the router or elsewhere on the network.

*Android 16 is shown in English. Names and paths can differ by manufacturer.*

### Step 3: allow the required domain families

PipePipe currently needs:

- `googleapis.com` and all its subdomains, including
  `jnn-pa.googleapis.com` and `youtubei.googleapis.com`;
- `google.com` and all its subdomains.

Add both families to the allowlist of the component found in step 2. The syntax
depends on the tool: it may expect the base domain, a wildcard such as
`*.googleapis.com`, or its own allowlist rule. Configure the allowlist instead
of permanently disabling all filtering. Allowing only the host visible today
may not cover another host used by YouTube later.

::: info Why PipePipe needs these addresses
The current client contacts `jnn-pa.googleapis.com` to prepare the proof needed
for protected playback, while the extractor uses `youtubei.googleapis.com` to
request YouTube information. If DNS sends either address back to the phone, the
exchange stops before playback. This does **not** require Google Play Services.
:::

### Step 4: reconnect and verify the fix

1. Reconnect Wi-Fi or briefly toggle airplane mode so stale DNS results are
   discarded.
2. Force-stop and reopen PipePipe.
3. Retry the same public video.
4. Generate a new report and confirm that the required host no longer resolves
   to `0.0.0.0`, `127.0.0.1`, or `localhost`.

A temporary test on mobile data or another clean network can confirm the
diagnosis. It is not a recommendation to leave privacy protection disabled.

The pinned upstream notice [#2757](https://github.com/InfinityLoop1308/PipePipe/issues/2757)
documents the required domain families. In
[#2712](https://github.com/InfinityLoop1308/PipePipe/issues/2712), the reporter
confirmed that allowing `jnn-pa.googleapis.com` restored playback.
[#2750](https://github.com/InfinityLoop1308/PipePipe/issues/2750) contains the
same `0.0.0.0`/localhost signature.

### If the report shows a real public address

An error such as `ENETUNREACH`, a timeout, or a connection failure to a real
public IP is different: DNS did not redirect the host locally. Continue with
the controlled network test below and record the VPN, ISP, country, endpoint,
and exact error instead of adding unrelated DNS exceptions.

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

For ordinary non-live YouTube videos, **MWEB (SABR)** is the current
session-based playback path when the MWEB response exposes SABR data.
**VisionOS** is a separate anonymous extraction path. Trying another endpoint
can be a temporary diagnostic step; it is not proof that the original endpoint
or WebView is at fault.

### One video (or a few) fail while other videos play

This is a different starting point from “every video fails”. First try the same
public URL again after updating PipePipe, then record the result. Do not begin
by reinstalling WebView or changing DNS when the rest of YouTube still plays.

1. Check whether the item is a live stream, a Short, age-restricted, members
   only, or otherwise unavailable in a normal browser. Note that in the report.
2. Open **Settings → Advanced → YouTube extraction endpoint** and write down the
   selected value. In current 5.3.x builds, a signed-out account can choose
   **VisionOS** or **MWEB (SABR)**; a signed-in account is kept on **MWEB
   (SABR)**. **Android VR** is from an older build and is no longer a current
   picker option.
3. Retry the same URL once without changing quality, codec, network, or login.
4. If it still fails, change only one variable, then retry the same URL. The
   useful comparison is “same video, one change”, not a list of simultaneous
   switches.
5. Attach the generated report and say whether other public videos still work.

An isolated failure can come from the response returned for that particular
video or from a format the device cannot decode. It does not by itself show that
PipePipe, WebView, or the whole network is broken. If the report contains
`video/av01`, `MediaCodec`, or a decoder name, follow the
[MediaCodec guide](./android) as a separate codec check.

::: info Current endpoint choices

| Account state | Choices shown in current 5.3.x builds | Default |
| --- | --- | --- |
| Signed out | VisionOS, MWEB (SABR) | VisionOS |
| Signed in | MWEB (SABR) | MWEB (SABR) |
| Older screenshots/issues | Android VR may be shown | Not a current choice |

The labels and defaults may change again after a YouTube change. Always report
what the installed build actually shows.
:::

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

<div class="screenshot-callout" role="img" aria-label="Historical YouTube extraction endpoint picker with MWEB and Android VR highlighted">
  <img src="/screenshots/pipepipe-endpoint-picker-5.2.3-api36.png" alt="YouTube extraction endpoint picker">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="70" y="995" width="940" height="125" rx="24" />
    <circle class="callout-number" cx="965" cy="1025" r="42" /><text x="965" y="1025">1</text>
    <rect class="callout-box" x="70" y="1260" width="940" height="125" rx="24" />
    <circle class="callout-number" cx="965" cy="1290" r="42" /><text x="965" y="1290">2</text>
  </svg>
</div>

*Historical capture: PipePipe 5.2.3 on Android 16/API 36. It shows an endpoint
that is no longer offered by current 5.3.x builds; use the table above for the
current choices.*

![Current YouTube extraction endpoint picker, PipePipe 5.3.1-beta on Android 16](/screenshots/pipepipe-endpoint-picker-5.3.1-beta-api36.png)

*Current capture: PipePipe 5.3.1-beta · Android 16/API 36. Signed-out builds
show VisionOS and MWEB (SABR); the selected entry is visible in the dialog.*

Recent closed report [#2686](https://github.com/InfinityLoop1308/PipePipe/issues/2686)
is a concrete example of an older endpoint comparison: the maintainer asked
whether **Android VR (DASH)** was selected and advised testing **MWEB (SABR)**.
In the capture, **1** is MWEB and **2** is Android VR. Treat that as historical
evidence, not as a current instruction or a promise that MWEB fixes every
network or account failure.

Recent reports show why the exact stage matters. In [#2901](https://github.com/InfinityLoop1308/PipePipe/issues/2901), playback stopped after the
phone went to sleep and the report included an `UnknownHost` destination. In
[#2905](https://github.com/InfinityLoop1308/PipePipe/issues/2905), playback
worked but a SABR download failed on a VPN. They are both “YouTube/SABR”
reports, but they need different evidence and should not be merged into one
generic WebView or DNS diagnosis.

## Minimum playback report

```text
Video URL and service:
PipePipe version / Android version:
Endpoint before and during the failure:
Logged in or out:
Network country / VPN or proxy state:
Video type and selected quality/codec, if shown:
Private DNS / blocker / firewall state and blocked host, if any:
Failure point (start / time / seek / quality / return to app):
Exact visible message and generated report:
One-variable retest and result:
```

## Do not mix with WebView errors

The exact **WebView unavailable** message has its own [dedicated guide](./webview).
A current WebView does not rule out a network or SABR failure, and a `Source
error` does not prove that WebView needs updating.
