# Setup, updates, and backups

## Update before diagnosing

Check the installed version against [GitHub Releases](https://github.com/InfinityLoop1308/PipePipe/releases). Catalogues can lag behind upstream. Use stable builds for normal use; use prereleases only when testing a named fix and when you can provide feedback.

The built-in update check is a notification mechanism: it tells Android/PipePipe that an update is available; it does not silently replace the installed APK. In **Settings → Updates**, check whether update checking is enabled and whether **Show prerelease updates** is enabled before reporting that an expected beta did not appear.

<div class="screenshot-callout" role="img" aria-label="PipePipe Updates settings with the Show pre-releases and Check for updates controls highlighted">
  <img src="/screenshots/pipepipe-updates-5.2.3-api36.png" alt="PipePipe Updates settings, 5.2.3 on Android 16">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="25" y="555" width="1030" height="235" rx="28" />
    <path class="callout-arrow" d="M 900 470 L 900 535 M 875 510 L 900 535 L 925 510" />
    <circle class="callout-number" cx="990" cy="580" r="42" /><text x="990" y="580">1</text>
    <rect class="callout-box" x="25" y="805" width="1030" height="175" rx="28" />
    <circle class="callout-number" cx="990" cy="830" r="42" /><text x="990" y="830">2</text>
  </svg>
</div>

*Reference capture: PipePipe 5.2.3 · Android 16/API 36. **1** is the prerelease toggle; **2** is the manual check. The update checker is notification-only and does not silently install an APK.*

::: tip
When an issue says “fixed in beta” or “fixed in the next release”, install exactly that named build, restart PipePipe, and retest once before opening a duplicate report.
:::

## Installation problems

PipePipe requires Android 6.0 / API 23 or newer. If installation fails, record the Android version, device ABI, APK source, exact installer message, and whether a previous PipePipe package is installed.

Do not guess the CPU architecture from the phone model. The project ships `armeabi-v7a`, `arm64-v8a`, `x86`, and `x86_64` variants; an installer message about an incompatible package, signature conflict, or ABI is evidence, not just “the APK does not work”. Record whether the build came from GitHub Releases, Obtainium, F-Droid/IzzyOnDroid, or another source. A store can publish later than upstream.

If Android refuses an update but the app is already installed, preserve the exact message. A mismatched signing key normally cannot be repaired by reinstalling over the old app: export local data first and only uninstall when you understand the data loss risk.

## Backups, import, and export

Create an export before importing, migrating, or testing a prerelease. Import can replace local history, subscriptions, playlists, and settings. Treat an import as a local-data operation, not as a merge you can undo casually.

Before migration:

1. Export from the source installation and keep an untouched copy outside the device if possible.
2. Note the source and target PipePipe versions and the selected export/import format.
3. Import once; do not repeatedly retry after local lists have changed.
4. Check a small sample: subscriptions, local playlists, history/positions, and settings.

For an interrupted import, missing subscriptions, or changed playlists, report the backup format, source/target versions, step at which it stopped, approximate item count, and whether storage access was revoked. Say whether the affected data was local or tied to an online service.

Never attach a private backup to a public issue.

## A useful setup report

Use this compact template when installation, updating, or migration is the problem:

```text
PipePipe version and source:
Android version / device ABI:
Previous installation and version:
Update settings (including prereleases):
Exact installer or import error:
What I expected / what happened:
Backup format and approximate size (do not attach private data):
```
