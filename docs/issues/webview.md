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

Android 6 may not expose the **WebView implementation** selector. Its provider
is normally fixed by the ROM; check the **Android System WebView** version under
**Settings → Apps** and use only the ROM's supported update path.

![Android WebView implementation screen, Android 16](/screenshots/android-webview-provider-api36.png)

*Reference capture: Android 16/API 36. The provider name and version are examples; report the values shown on your own device.*

PipePipe's error screen gives these practical directions:

- **Android 6 and Android 10:** update **Android System WebView**.
- **Android 7, 8, and 9:** update **Chrome**, then select it as the WebView
  implementation if Android offers that choice.
- **Other Android versions:** the error is unexpected; report it.

Those names describe the usual Google Android setup. On a de-Googled ROM, the
active provider may instead be the ROM's standalone WebView. Update the provider
that Android actually accepts and selects; installing Chrome is neither required
nor useful when the ROM does not recognize it as a WebView provider.

::: info Privacy-focused and vendor Android builds
Some operating systems offer a different WebView provider; some devices permit
only the vendor's provider. Use a maintained provider that Android accepts for
your device. PipePipe cannot install, select, or replace a system WebView
provider for you.
:::

## What we verified on old Android without Google services

We tested the x86_64 PipePipe **5.2.3** release on clean AOSP images on
2026-07-13. The images contained no Play Store, Google Play Services, or Chrome.
The same public YouTube video was used for every run.

| System | WebView supplied by the clean image | Result | Controlled follow-up |
| --- | --- | --- | --- |
| Android 6.0 / API 23 | AOSP `com.android.webview` 44.0.2403.119 | PipePipe installed and the YouTube home feed loaded, but opening the video produced **WebView unavailable**. | Bromite SystemWebView 106 was inspected and declares API 23 as its minimum, but it was not activated as the ROM provider; playback with a replacement was therefore not validated. |
| Android 7.0 / API 24 | AOSP `com.android.webview` 52.0.2743.100 | The home feed loaded; video playback was blocked by the same message. | With AOSP Chromium WebView 119.0.6045.141 integrated as a trusted system provider, the same video played. A normal APK update was rejected because its signature did not match the ROM provider. |
| Android 8.1 / API 27 | AOSP `com.android.webview` 61.0.3163.98 | The home feed loaded; video playback was blocked by the same message. | With Mulch WebView 131.0.6778.81 integrated as a trusted system provider, the same video played. A normal APK update was rejected for the same signature mismatch. |

“Integrated as a trusted system provider” describes a disposable laboratory
image modified like a ROM build. It is **not** a recommendation to replace files
on a real device. The Android 7 and 8 runs both produced moving playback
recordings, rather than only loading metadata or a thumbnail.
Both normal installation attempts returned the exact Android error
`INSTALL_FAILED_UPDATE_INCOMPATIBLE`.

On Android 6, the home feed loaded before the same run failed when a video was
opened. These two screens separate general network/extractor access from the
WebView capability needed by the playback path.

<div class="screenshot-callout" role="img" aria-label="PipePipe YouTube home feed loaded on Android 6 before opening a video">
  <img src="/screenshots/pipepipe-home-5.2.3-android6.png" alt="PipePipe YouTube home feed on Android 6">
  <svg viewBox="0 0 320 640" aria-hidden="true">
    <rect class="callout-box" x="8" y="112" width="304" height="510" rx="12" />
    <path class="callout-arrow" d="M 270 70 L 270 106 M 255 90 L 270 106 L 285 90" />
    <circle class="callout-number" cx="292" cy="128" r="22" /><text x="292" y="128">A</text>
  </svg>
</div>

*Reference capture: PipePipe 5.2.3 · Android 6/API 23 · stock AOSP WebView 44 · no Google services. **A** shows that the feed and thumbnails loaded.*

<div class="screenshot-callout" role="img" aria-label="PipePipe WebView unavailable error after a video was opened on Android 6">
  <img src="/screenshots/pipepipe-webview-unavailable-5.2.3-android6.png" alt="PipePipe WebView unavailable screen on Android 6">
  <svg viewBox="0 0 320 640" aria-hidden="true">
    <rect class="callout-box" x="10" y="286" width="300" height="216" rx="12" />
    <path class="callout-arrow" d="M 280 238 L 280 278 M 264 262 L 280 278 L 296 262" />
    <circle class="callout-number" cx="292" cy="304" r="22" /><text x="292" y="304">B</text>
  </svg>
</div>

*Reference capture: the video action reached PipePipe's WebView check and stopped. **B** highlights the exact requirement, while the feed shown in **A** had already succeeded.*

<div class="screenshot-callout" role="img" aria-label="PipePipe WebView unavailable screen on Android 8.1 with the compatibility guidance highlighted">
  <img src="/screenshots/pipepipe-webview-unavailable-5.2.3-android8.png" alt="PipePipe WebView unavailable screen on Android 8.1">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="28" y="640" width="664" height="365" rx="24" />
    <path class="callout-arrow" d="M 620 565 L 620 620 M 598 598 L 620 620 L 642 598" />
    <circle class="callout-number" cx="660" cy="670" r="30" /><text x="660" y="670">1</text>
  </svg>
</div>

*Reference capture: PipePipe 5.2.3 · Android 8.1/API 27 · stock AOSP WebView 61. **1** is the exact compatibility error; the feed itself had loaded before the video was opened.*

<div class="screenshot-callout" role="img" aria-label="A YouTube video playing in PipePipe on Android 7 with system-integrated WebView 119">
  <img src="/screenshots/pipepipe-playback-5.2.3-android7-webview119.png" alt="YouTube playback in PipePipe on Android 7 with WebView 119">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="16" y="48" width="688" height="405" rx="20" />
    <path class="callout-arrow" d="M 620 500 L 620 470 M 598 492 L 620 470 L 642 492" />
    <circle class="callout-number" cx="668" cy="420" r="30" /><text x="668" y="420">2</text>
  </svg>
</div>

*Reference capture: PipePipe 5.2.3 · Android 7/API 24 · system-integrated AOSP WebView 119 · no Google services. **2** highlights a real video frame during playback.*

<div class="screenshot-callout" role="img" aria-label="A YouTube video playing in PipePipe on Android 8.1 with system-integrated Mulch WebView 131">
  <img src="/screenshots/pipepipe-playback-5.2.3-android8-mulch131.png" alt="YouTube playback in PipePipe on Android 8.1 with Mulch WebView 131">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="16" y="48" width="688" height="405" rx="20" />
    <path class="callout-arrow" d="M 620 500 L 620 470 M 598 492 L 620 470 L 642 492" />
    <circle class="callout-number" cx="668" cy="420" r="30" /><text x="668" y="420">3</text>
  </svg>
</div>

*Reference capture: PipePipe 5.2.3 · Android 8.1/API 27 · system-integrated Mulch WebView 131 · no Google services. **3** highlights a real video frame during playback.*

### Visual check on an old Android device

After the ROM has installed or updated its trusted provider, open **Developer
options → WebView implementation**. The selected radio button and the complete
version must both be visible. Merely installing an APK is not enough.

<div class="screenshot-callout" role="img" aria-label="Android 8.1 WebView implementation screen with trusted WebView 131 selected">
  <img src="/screenshots/android8-webview-provider-131.png" alt="Android 8.1 WebView implementation screen with Android System WebView 131 selected">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="24" y="158" width="672" height="150" rx="20" />
    <path class="callout-arrow" d="M 610 360 L 654 286 M 620 300 L 654 286 L 650 322" />
    <circle class="callout-number" cx="610" cy="360" r="30" /><text x="610" y="360">4</text>
  </svg>
</div>

*Tutorial capture: Android 8.1/API 27 · Mulch WebView 131 integrated by the laboratory ROM · no Google services. **4** highlights the selected provider and its version.*

Then fully close PipePipe, reopen it, and play a public YouTube video. Loading a
feed or a thumbnail alone does not test the SABR/WebView path.

<div class="screenshot-callout" role="img" aria-label="Live YouTube video playing in PipePipe on Android 8.1 after WebView 131 was selected">
  <img src="/screenshots/pipepipe-playback-5.2.3-android8-webview131-tutorial.png" alt="Live YouTube playback in PipePipe on Android 8.1 with WebView 131">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="16" y="48" width="688" height="405" rx="20" />
    <path class="callout-arrow" d="M 620 500 L 620 470 M 598 492 L 620 470 L 642 492" />
    <circle class="callout-number" cx="668" cy="420" r="30" /><text x="668" y="420">5</text>
  </svg>
</div>

*Tutorial capture: PipePipe 5.2.3 · Android 8.1/API 27 · Mulch WebView 131 · no Google services. **5** highlights the moving playback area; a seven-second recording confirmed that the frames changed.*

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

1. PipePipe does not require Google Play Services for SABR playback itself.
2. The minimum Android version for installing PipePipe is not a promise that the
   bundled WebView can run current YouTube JavaScript.
3. On old Android, installing an alternative WebView APK is often insufficient.
   Android only lists providers trusted by the ROM's framework configuration and
   signing policy. The Chromium project documents this as a system-integrator
   task in its [AOSP WebView integration guide](https://chromium.googlesource.com/chromium/src/+/HEAD/android_webview/docs/aosp-system-integration.md).

::: warning Old WebView builds are not a safe long-term fix
Versions 119 and 131 above were controlled compatibility probes, not update
recommendations. They no longer receive current Chromium security fixes. Prefer
a maintained ROM and its supported provider update channel. If the ROM cannot
offer a maintained, selectable WebView, using a maintained device/OS or another
client architecture is safer than forcing an archived APK into the system.
:::

::: details Direct old-Android artifacts for ROM maintainers and reproducible tests
These links are pinned to the exact archived releases or commits examined here.
They are **not** universal one-tap updates. On the clean AOSP images, a normal
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
  131.0.6778.81 for
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

## Do not confuse these failures

| What you see | What it establishes | Next action |
| --- | --- | --- |
| Exact **WebView unavailable** message | PipePipe could not use the selected WebView provider. | Follow this page and report the provider details if it remains. |
| `Source error`, buffering, or playback stops | Not enough evidence to blame WebView. SABR, network, account, or player code may be involved. | Update PipePipe and attach the generated error report. |
| `AntiBotException: Sign in to confirm you're not a bot` | A YouTube/network or authentication restriction. | See [YouTube playback and extraction](./youtube-playback). |
| Search gives no results | A separate extractor/search problem. | Open a separate report with the service, country, endpoint, and VPN status. |

An app working on the same device does not prove PipePipe can remove this
requirement. Different apps may use different YouTube clients, endpoints, or
fallback paths. A client backed by a remote extraction service can also move the
JavaScript and attestation work off the phone; that is a different architecture,
not evidence that the local WebView is usable.

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
