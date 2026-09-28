# Installation and updates

PipePipe is distributed outside Google Play. Choose a trusted update source and
keep using it; release timing can differ between sources.

## System requirements

PipePipe requires **Android 6.0 (API 23) or newer**. Release assets may include
separate APKs for `arm64-v8a`, `armeabi-v7a`, `x86_64`, and `x86`. Most phones
use `arm64-v8a`; `armeabi-v7a` is for 32-bit ARM devices, and x86 builds are
mainly for Android emulators. Choose the APK matching your device's ABI; one
APK for every device is not always available.

That is the APK installation floor, not a guarantee that the WebView bundled by
an old ROM can still play current YouTube streams. Protected playback also needs
an active, compatible WebView provider. See [WebView and YouTube playback](/issues/webview),
including the Android 6, 7, and 8 results without Google services.

## Choose an update path

Use the [GitHub Releases page](https://github.com/InfinityLoop1308/PipePipe/releases)
to compare stable builds with prereleases and read the notes attached to each
one. A prerelease is not necessarily newer than the installed stable build.
For everyday use, stick with stable releases unless you are testing a specific
change.

### PipePipe's update settings

PipePipe includes update settings under **Settings → Updates**. You can check
manually and opt in to prerelease notifications. The checker tells you when a
build is available; it does not install an APK for you. Stick with stable
releases unless you are trying a specific fix and are ready to report what
happened.

### GitHub Releases

[GitHub Releases](https://github.com/InfinityLoop1308/PipePipe/releases) is the
direct upstream source. It is the best place to check whether a reported issue
has already been fixed in a newer release.

### Obtainium

[Obtainium](https://github.com/ImranR98/Obtainium/releases) watches the GitHub
repository and can notify you about new releases without an app-store account.
Add `https://github.com/InfinityLoop1308/PipePipe` as the source, then verify
the signing certificate below before enabling automatic updates.

### F-Droid and IzzyOnDroid

[F-Droid](https://f-droid.org/packages/InfinityLoop1309.NewPipeEnhanced/) and
[IzzyOnDroid](https://apt.izzysoft.de/fdroid/index/apk/InfinityLoop1309.NewPipeEnhanced)
are alternative catalogues. Their publication timing is independent of GitHub,
so a new upstream release may not appear there immediately. For a known urgent
fix, compare the installed version with GitHub Releases instead of assuming a
catalogue is current.

## Verify the APK

Before installing or accepting an update from any source, verify PipePipe's
signing certificate. Obtainium accepts the hex form as an allowed signing-key
fingerprint; AppVerifier can display and compare the colon-separated form.

**SHA-256 (hex):**

```
dec73429ce2563275f5ed19825e44652b32b363a46f38bdff9ad6dcde4842d88
```

**SHA-256 (colon-separated):**

```
DE:C7:34:29:CE:25:63:27:5F:5E:D1:98:25:E4:46:52:B3:2B:36:3A:46:F3:8B:DF:F9:AD:6D:CD:E4:84:2D:88
```

If Android refuses an APK, check both the Android version/ABI and whether the
package was downloaded completely. Do not install an APK from an untrusted
mirror merely to bypass an update delay.
