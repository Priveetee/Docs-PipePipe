# Backup and restore

PipePipe keeps its database on the device. A backup can contain subscriptions,
history, playlists, playback positions, and settings. Keep an export before a
device reset, migration, or a risky test build.

## Create a backup

1. Open **Settings → Backup**.
2. Select **Export database**.
3. Choose a location you can find again and complete the Android file-picker flow.
4. Copy the resulting file to storage outside the device if the backup matters.

<div class="screenshot-callout" role="img" aria-label="PipePipe Backup screen with Import database and Export database highlighted">
  <img src="/screenshots/pipepipe-backup-5.2.3-api36.png" alt="PipePipe Backup settings, 5.2.3 on Android 16">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="25" y="300" width="1030" height="225" rx="28" />
    <circle class="callout-number" cx="990" cy="330" r="42" /><text x="990" y="330">1</text>
    <rect class="callout-box" x="25" y="545" width="1030" height="180" rx="28" />
    <circle class="callout-number" cx="990" cy="575" r="42" /><text x="990" y="575">2</text>
  </svg>
</div>

*Reference capture: PipePipe 5.2.3 · Android 16/API 36. **1** imports and can replace local data; **2** creates the recovery export first.*

::: warning A backup can contain personal viewing data
Treat the export like any other private archive. Do not attach it to a public
issue or send it to someone you do not trust.
:::

## Restore a backup

1. Save a current export first: importing can replace existing history,
   subscriptions, playlists, and optionally settings.
2. Open **Settings → Backup → Import database**.
3. Select the backup file and read the import choices before confirming.
4. Restart PipePipe if Android or the app asks you to do so.

## Moving to another app

PipePipe can also export a backup in a NewPipe-compatible format. Use that
option only when the receiving app documents support for it; keep the normal
PipePipe export as your recovery copy.
