# WebView and YouTube playback

## Start here: check PipePipe before replacing WebView

The WebView requirement changed after PipePipe 5.2.3. Use the installed
PipePipe version, not only the Android version, to choose the next action.

| PipePipe version | What it expects | First action |
| --- | --- | --- |
| **5.2.4-beta or newer** | An active WebView provider that Android can initialize. There is no longer a hard minimum major version of 80. | Keep the provider selected by the ROM. Do not replace it only because it is old. |
| **5.2.3** | A WebView provider at major version 80 or newer. | Prefer updating PipePipe. If you stay on 5.2.3, follow the legacy provider instructions below. |
| Any version reports that no provider exists or initialization fails | Android is not exposing a usable provider to PipePipe. | Check **WebView implementation** and the provider state. |

The exact message below belongs to PipePipe 5.2.3 and older builds:

> **WebView unavailable. Please make sure your WebView version is higher than 80.**

It is a compatibility error, not a request to sign in to YouTube and not proof
that the phone itself is too old. The simplest fix is now to install
[5.2.4-beta](https://github.com/InfinityLoop1308/PipePipe/releases/tag/v5.2.4-beta)
or a newer release. Because 5.2.4-beta is a prerelease, first create a
[backup](/user-guide/backup-and-restore) and keep the previous APK available if
you depend on the device.

![How WebView fits into YouTube playback](/diagrams/webview-playback.png)

## Why PipePipe checks WebView

Some YouTube streams use SABR, a session-based delivery protocol. PipePipe uses
Android WebView locally for two JavaScript jobs: decoding YouTube player data
through EJS and running BotGuard to obtain short-lived session/video tokens.
Google Play Services are not part of this path.

PipePipe 5.2.4-beta ships ES5-compatible EJS assets, compatibility polyfills,
and an older-JavaScript BotGuard bridge. It removed both the major-version-80
gate and the modern-JavaScript capability probe. PipePipe still checks that
Android exposes a provider and that its runtime actually starts; a missing,
disabled, vendor-locked, or broken provider can therefore still fail.

This has three consequences:

- Changing YouTube endpoint does not replace the local WebView runtime.
- An old provider is no longer rejected only for its version number.
- A recent provider can still fail to initialize. That needs a log and provider
  details, not repeated APK installation attempts.

For the implementation-level explanation, read the [SABR guide](/developer-guide/introduction)
and [Attestation](/developer-guide/sabr-attestation).

## Check the active WebView provider

1. Open Android **Settings**.
2. Enable **Developer options** if they are not already available.
3. Open **WebView implementation**. The name and location differ between devices.
4. Verify that a provider is selected and enabled. Note its package name and full version.
5. Restart PipePipe after changing or updating the provider.

Android 6 may not expose the **WebView implementation** selector. Its provider
is normally fixed by the ROM; check the **Android System WebView** version under
**Settings → Apps** and use only the ROM's supported update path.

![Android WebView implementation screen, Android 16](/screenshots/android-webview-provider-api36.png)

*Reference capture: Android 16/API 36. The provider name and version are examples; report the values shown on your own device.*

With PipePipe 5.2.4-beta or newer, the provider bundled with an old ROM may be
enough. We verified real playback with the stock providers from Android 6, 7,
and 8. Do not install Chrome merely because the phone runs Android 7–9.

On the usual Google setup, Android 7–9 may expose Chrome as WebView. A de-Googled
ROM may expose a standalone provider instead. What matters is the provider that
Android actually selects, not whether an unrelated Chrome or WebView APK is
present in the app list.

::: info Privacy-focused and vendor Android builds
Some operating systems offer a different WebView provider; some devices permit
only the vendor's provider. Keep the ROM-supported provider when it works.
PipePipe cannot install, select, or replace a system WebView provider for you.
:::

## What we verified on old Android without Google services

We tested the published x86_64 PipePipe **5.2.4-beta** APK on clean AOSP images
on 2026-07-20. They contained no Play Store, Google Play Services, or Chrome. We
kept each image's original WebView and opened the same public YouTube video.

| System | Original active provider | Verified result |
| --- | --- | --- |
| Android 6.0 / API 23 | AOSP `com.android.webview` 44.0.2403.119 | Shared runtime ready, EJS decoding and token minting succeeded, moving SABR playback verified. |
| Android 7.0 / API 24 | AOSP `com.android.webview` 52.0.2743.100 | Moving SABR playback verified without installing Chrome. |
| Android 8.1 / API 27 | AOSP `com.android.webview` 61.0.3163.98 | Provider selected by Android, moving SABR playback verified. |

These are end-to-end playback results, not tests that stopped after loading a
feed, thumbnail, or video page.

<div class="screenshot-callout" role="img" aria-label="YouTube playback in PipePipe 5.2.4-beta on Android 6 with the original WebView 44">
  <img src="/screenshots/pipepipe-playback-5.2.4-beta-android6-webview44.png" alt="YouTube playback in PipePipe 5.2.4-beta on Android 6 with WebView 44">
  <svg viewBox="0 0 1080 1920" aria-hidden="true">
    <rect class="callout-box" x="12" y="62" width="1056" height="608" rx="28" />
    <path class="callout-arrow" d="M 920 760 L 990 682 M 950 696 L 990 682 L 980 724" />
    <circle class="callout-number" cx="920" cy="760" r="42" /><text x="920" y="760">1</text>
  </svg>
</div>

*PipePipe 5.2.4-beta · Android 6/API 23 · original AOSP WebView 44 · no Google services. **1** highlights a real frame from the moving video.*

<div class="screenshot-callout" role="img" aria-label="YouTube playback in PipePipe 5.2.4-beta on Android 7 with the original WebView 52">
  <img src="/screenshots/pipepipe-playback-5.2.4-beta-android7-webview52.png" alt="YouTube playback in PipePipe 5.2.4-beta on Android 7 with WebView 52">
  <svg viewBox="0 0 1080 1920" aria-hidden="true">
    <rect class="callout-box" x="12" y="72" width="1056" height="608" rx="28" />
    <path class="callout-arrow" d="M 920 770 L 990 692 M 950 706 L 990 692 L 980 734" />
    <circle class="callout-number" cx="920" cy="770" r="42" /><text x="920" y="770">2</text>
  </svg>
</div>

*PipePipe 5.2.4-beta · Android 7/API 24 · original AOSP WebView 52 · no Chrome or Google services. **2** highlights moving playback.*

<div class="screenshot-callout" role="img" aria-label="YouTube playback in PipePipe 5.2.4-beta on Android 8.1 with the original WebView 61">
  <img src="/screenshots/pipepipe-playback-5.2.4-beta-android8-webview61.png" alt="YouTube playback in PipePipe 5.2.4-beta on Android 8.1 with WebView 61">
  <svg viewBox="0 0 1080 1920" aria-hidden="true">
    <rect class="callout-box" x="12" y="72" width="1056" height="608" rx="28" />
    <path class="callout-arrow" d="M 920 770 L 990 692 M 950 706 L 990 692 L 980 734" />
    <circle class="callout-number" cx="920" cy="770" r="42" /><text x="920" y="770">3</text>
  </svg>
</div>

*PipePipe 5.2.4-beta · Android 8.1/API 27 · original AOSP WebView 61 · no Chrome or Google services. **3** highlights moving playback.*

::: details Why the older 5.2.3 captures required a WebView update
PipePipe 5.2.3 rejected providers below major version 80 before playback. On the
same clean systems, WebView 44, 52, and 61 therefore produced the exact
**WebView unavailable** message even though feeds still loaded.

Our earlier controlled tests made 5.2.3 play after integrating WebView 119 on
Android 7 and WebView 131 on Android 8 as trusted ROM providers. Those provider
replacements are no longer required for PipePipe 5.2.4-beta and newer.

![Legacy PipePipe 5.2.3 WebView version error on Android 8.1](/screenshots/pipepipe-webview-unavailable-5.2.3-android8.png)
:::

### Visual check when an error remains

If 5.2.4-beta or newer still reports WebView unavailable, open **Developer
options → WebView implementation**. The selected radio button and complete
version must both be visible. Merely installing an APK is not enough.

<div class="screenshot-callout" role="img" aria-label="Android 8.1 WebView implementation screen with the original WebView 61 selected">
  <img src="/screenshots/android8-webview-provider-61.png" alt="Android 8.1 WebView implementation screen with Android System WebView 61 selected">
  <svg viewBox="0 0 1080 1920" aria-hidden="true">
    <rect class="callout-box" x="18" y="240" width="1044" height="218" rx="28" />
    <path class="callout-arrow" d="M 820 555 L 980 460 M 930 462 L 980 460 L 955 505" />
    <circle class="callout-number" cx="820" cy="555" r="42" /><text x="820" y="555">4</text>
  </svg>
</div>

*Android 8.1/API 27 · original AOSP WebView 61 · no Google services. **4** highlights both the selected provider and its full version. The Android 8 playback capture above verifies that this same provider actually worked.*

Then fully close PipePipe, reopen it, and play a public YouTube video. Loading a
feed or thumbnail alone does not exercise the complete EJS, BotGuard, token, and
SABR path.

### A selected provider can still be incompatible

We also tested Cromite SystemWebView 138.0.7204.169 because Chrome 138 is the
[last Chrome family supporting Android 8 and 9](https://support.google.com/chrome/thread/352616098/sunsetting-chrome-support-for-android-8-0-oreo-and-android-9-0-pie?hl=en-GB).
Its manifest declares API 26 as the minimum and Android 8.1 selected it, but the
provider failed during initialization because `android.webkit.PacProcessor` was
missing from that OS. PipePipe then received an unusable WebView. This build is
therefore deliberately **not** listed below as a working Android 8 download.

<div class="screenshot-callout" role="img" aria-label="Cromite WebView 138 selected on Android 8.1 despite being incompatible at runtime">
  <img src="/screenshots/android8-webview-provider-138-incompatible.png" alt="Android 8.1 showing Android System WebView 138 selected">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="24" y="158" width="672" height="150" rx="20" />
    <path class="callout-arrow" d="M 610 360 L 654 286 M 620 300 L 654 286 L 650 322" />
    <circle class="callout-number" cx="610" cy="360" r="30" /><text x="610" y="360">6</text>
  </svg>
</div>

*Diagnostic capture: Android 8.1 accepted WebView 138 in the provider list. **6** shows why the selected radio button is necessary evidence, but not sufficient proof of compatibility.*

<div class="screenshot-callout" role="img" aria-label="Failed WebView rendering after incompatible WebView 138 was selected on Android 8.1">
  <img src="/screenshots/android8-webview-provider-138-failed.png" alt="Failed WebView rendering surface on Android 8.1 with incompatible WebView 138">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="238" y="126" width="244" height="270" rx="24" />
    <path class="callout-arrow" d="M 580 430 L 488 370 M 514 372 L 488 370 L 500 394" />
    <circle class="callout-number" cx="580" cy="430" r="30" /><text x="580" y="430">7</text>
  </svg>
</div>

*Diagnostic capture: the failed WebView rendering surface after provider initialization failed. **7** is not a PipePipe-specific error page; the Android log identifies the missing framework class.*

The tests establish three different facts:

1. PipePipe does not require Google Play Services or Chrome for local SABR
   playback.
2. PipePipe's compatibility code, not a provider replacement, made WebView 44,
   52, and 61 usable again.
3. Android still decides which WebView package is trusted and active. Sideloading
   an APK that never becomes the selected provider changes nothing. Chromium
   documents provider registration as a system-integrator task in its
   [AOSP WebView integration guide](https://chromium.googlesource.com/chromium/src/+/HEAD/android_webview/docs/aosp-system-integration.md).

::: warning Playback compatibility is not a security update
The stock providers tested above are old and no longer receive Chromium security
fixes. PipePipe making its local JavaScript compatible with them does not make
the whole WebView safe for ordinary browsing or untrusted content. Prefer a
maintained ROM and its supported provider update channel when one exists.
:::

::: details Legacy 5.2.3 provider artifacts for ROM maintainers
This section documents the controlled PipePipe 5.2.3 experiments. It is not
needed for 5.2.4-beta or newer. These links are pinned to the exact archived
releases or commits examined here and are **not** universal one-tap updates. On
the clean AOSP images, a normal
install of the Android 7, Android 8, and Cromite test packages was rejected with
`INSTALL_FAILED_UPDATE_INCOMPATIBLE` because the signature did not match the
ROM provider. Use only an artifact and signing/update procedure explicitly
supported by your ROM.

- **Android 6 / API 23, inspected but not playback-tested:** Bromite
  SystemWebView 106.0.5249.163 for
  [ARM](https://github.com/bromite/bromite/releases/download/106.0.5249.163/arm_SystemWebView.apk),
  [ARM64](https://github.com/bromite/bromite/releases/download/106.0.5249.163/arm64_SystemWebView.apk),
  [x86](https://github.com/bromite/bromite/releases/download/106.0.5249.163/x86_SystemWebView.apk), or
  [x86_64](https://github.com/bromite/bromite/releases/download/106.0.5249.163/x64_SystemWebView.apk).
  See the [release page](https://github.com/bromite/bromite/releases/tag/106.0.5249.163)
  and [official checksums](https://github.com/bromite/bromite/releases/download/106.0.5249.163/brm_106.0.5249.163.sha256.txt).
  Its package is `org.bromite.webview`; the ROM must explicitly allow and trust
  that provider. Bromite is archived and this build is no longer secure.
- **Android 7 / API 24, playback-tested:** AOSP Chromium WebView
  119.0.6045.141 for
  [ARM](https://android.googlesource.com/platform/external/chromium-webview/+archive/aca588a17000289da9b228d94cc82bd751f91f85/prebuilt/arm.tar.gz),
  [ARM64](https://android.googlesource.com/platform/external/chromium-webview/+archive/aca588a17000289da9b228d94cc82bd751f91f85/prebuilt/arm64.tar.gz),
  [x86](https://android.googlesource.com/platform/external/chromium-webview/+archive/aca588a17000289da9b228d94cc82bd751f91f85/prebuilt/x86.tar.gz), or
  [x86_64](https://android.googlesource.com/platform/external/chromium-webview/+archive/aca588a17000289da9b228d94cc82bd751f91f85/prebuilt/x86_64.tar.gz).
  Each official AOSP archive contains `webview.apk`; the
  [integration commit](https://android.googlesource.com/platform/external/chromium-webview/+/aca588a17000289da9b228d94cc82bd751f91f85)
  records `sdkVersion=24` and all package metadata.
- **Android 8/9 / API 26–28, playback-tested on API 27:** Mulch WebView
  131.0.6778.200 for ARM/ARM64 and 131.0.6778.81 for x86/x86_64:
  [ARM](https://gitlab.com/divested-mobile/mulch/-/raw/c4c5b73fa5a599fbc61568c5ce0d2cc6d33ad4f2/prebuilt/arm/webview.apk?inline=false),
  [ARM64](https://gitlab.com/divested-mobile/mulch/-/raw/c4c5b73fa5a599fbc61568c5ce0d2cc6d33ad4f2/prebuilt/arm64/webview.apk?inline=false),
  [x86](https://gitlab.com/divested-mobile/mulch/-/raw/c4c5b73fa5a599fbc61568c5ce0d2cc6d33ad4f2/prebuilt/x86/webview.apk?inline=false), or
  [x86_64](https://gitlab.com/divested-mobile/mulch/-/raw/c4c5b73fa5a599fbc61568c5ce0d2cc6d33ad4f2/prebuilt/x86_64/webview.apk?inline=false).
  The [pinned Mulch commit](https://gitlab.com/divested-mobile/mulch/-/tree/c4c5b73fa5a599fbc61568c5ce0d2cc6d33ad4f2)
  is archived and explicitly intended for compilation into an OS, not ordinary
  sideloading.

To identify the OS architecture, use `adb shell getprop ro.product.cpu.abi`.
`armeabi-v7a` means ARM, `arm64-v8a` means ARM64, and the two x86 choices are
mainly relevant to unusual devices and virtual Android environments. A 64-bit
processor may still run a 32-bit Android build, so use the ABI reported by the OS.
:::

If an alternative provider installs but does not appear under **WebView
implementation**, it is not active. Reinstalling it repeatedly will not change
the ROM's provider allow-list or signing policy. Report the Android version, ROM,
installed provider package/version, active provider, and exact installer result.

::: details Rooted Android 8: what root can and cannot fix
On a rooted Android 8.0/API 26 test image, we reproduced the exact state where a
Mulch package installed successfully but remained absent from **WebView
implementation**. Android knew about the APK, but its WebView service did not
consider `us.spotco.mulch_wv` an eligible provider.

A framework resource overlay that added Mulch's package and official signing
certificate changed that result. After a reboot, Android listed Mulch and
`dumpsys webviewupdate` marked it as both a valid and current provider. Correctly
packaged x86 builds of Mulch 119 and 131 then rendered a live HTTPS page on API
26. We also verified that the certificate allowed by the overlay exactly matches
the official ARM and ARM64 Mulch APKs.

This validates the provider-registration mechanism, not every rooted phone. The
Android emulator on this x86_64 host cannot boot the ARM64 image, so the exact
Sony/ARM combination was not run here. PipePipe 5.2.3 initialized its shared
WebView runtime on API 26, but the tested YouTube stream did not complete
extraction; this run is therefore **not** presented as an API 26 playback pass.
The API 27 playback result documented above remains the verified end-to-end test.

Collect these read-only diagnostics before changing system files:

```sh
adb shell getprop ro.product.cpu.abi
adb shell pm path us.spotco.mulch_wv
adb shell dumpsys webviewupdate
```

- A Mulch path under `/data/app/` with no `us.spotco.mulch_wv` entry under
  **WebView packages** reproduces the provider allow-list problem.
- `Valid package us.spotco.mulch_wv` plus a matching **Current WebView package**
  proves that Android accepted and selected it.
- A valid current provider followed by a PipePipe failure needs the application
  log; selection alone does not prove that JavaScript or video playback works.

[Open WebView](https://github.com/Magisk-Modules-Alt-Repo/open_webview) is one
reference implementation of the required Magisk overlay and declares API 26/27
support. Treat it as an expert-only reference, not a routine update: its latest
release is [2.5.2 from 2024-12-16](https://github.com/Magisk-Modules-Alt-Repo/open_webview/releases/tag/v2.5.2),
it does not update the provider automatically, and Mulch itself is archived.
Back up the complete boot/system state and follow the exact ROM's recovery path;
a generic system replacement can remove every working WebView or prevent boot.
:::

## Do not confuse these failures

| What you see | What it establishes | Next action |
| --- | --- | --- |
| Exact message requiring a version **higher than 80** | The device is running PipePipe 5.2.3 or an older build with the retired version gate. | Update PipePipe before replacing the system provider. |
| **No Android WebView provider is available** or runtime initialization failure on 5.2.4-beta+ | Android did not expose a provider, or the selected provider could not start. | Check **WebView implementation**, then report the provider details and log. |
| `Source error`, buffering, or playback stops | Not enough evidence to blame WebView. SABR, network, account, or player code may be involved. | Update PipePipe and attach the generated error report. |
| `AntiBotException: Sign in to confirm you're not a bot` | A YouTube/network or authentication restriction. | See [YouTube playback and extraction](./youtube-playback). |
| Search gives no results | A separate extractor/search problem. | Open a separate report with the service, country, endpoint, and VPN status. |

An app working on the same device does not prove that Android's selected WebView
provider works. Different apps may use different YouTube clients, endpoints, or
remote services. PipePipe 5.2.4-beta still performs its EJS and attestation work
locally, but it now adapts that JavaScript to older providers.

## If 5.2.4-beta or newer still rejects WebView

1. Confirm the installed PipePipe version. The old version-80 message means the
   application update has not happened yet.
2. Confirm the active provider again in **WebView implementation**; installed
   Chrome or Android System WebView is not enough if Android has not selected it.
3. If the provider is vendor-locked or cannot be changed, do not assume that an
   arbitrary downloaded provider is compatible. Keep the device on a supported,
   maintained system/WebView update path.
4. Send a bug report with the information below.

Provider age alone is no longer the decision point. PipePipe needs the log to
distinguish a missing provider, a runtime initialization failure, and a later
YouTube/SABR error.

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
