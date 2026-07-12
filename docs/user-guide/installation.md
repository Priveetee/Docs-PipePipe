# Installation and updates

PipePipe is distributed outside Google Play. Choose one trusted update path and
keep it consistent so that you can identify the installed version when reporting
a problem.

## System requirements

The current application requires **Android 6.0 (API 23) or newer**. Release APKs
are available for `arm64-v8a`, `armeabi-v7a`, `x86_64`, and `x86`; use the
universal APK when you are unsure which ABI your device uses.

## Choose an update path

### PipePipe's update settings

PipePipe includes update settings. They let you check for updates manually and,
if you opt in, show prerelease builds. Prefer stable releases unless you are
testing a fix and are prepared to report regressions with logs.

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
