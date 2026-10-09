# Settings reference

This visual reference complements the focused [Player](./settings-player) and
[Behavior](./settings-behavior) pages. The captures are examples, not a promise
that your screens look identical. Labels can move; use Settings search if yours
differ.

## Player and gestures

The Player screen combines quality, format, opening action, app-switch, autoplay,
and queue controls. The Gestures screen controls player interactions separately.

<div class="screenshot-callout" role="img" aria-label="Player settings with preferred open action and minimize-on-app-switch highlighted">
  <img src="/screenshots/pipepipe-player-5.3.1-beta-api36.png" alt="Player settings on Android 16">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="25" y="1420" width="1030" height="180" rx="28" />
    <path class="callout-arrow" d="M 850 1330 L 850 1400 M 825 1375 L 850 1400 L 875 1375" />
    <circle class="callout-number" cx="990" cy="1450" r="42" /><text x="990" y="1450">1</text>
    <rect class="callout-box" x="25" y="1620" width="1030" height="230" rx="28" />
    <path class="callout-arrow" d="M 850 1535 L 850 1600 M 825 1575 L 850 1600 L 875 1575" />
    <circle class="callout-number" cx="990" cy="1650" r="42" /><text x="990" y="1650">2</text>
  </svg>
</div>

*Reference capture: Android 16/API 36. **1** is used for external links handed to PipePipe; **2** controls leaving the main player for another app.*

![Gesture settings](/screenshots/pipepipe-gestures-5.2.3-api36.png)

## Appearance, content, and feed

Appearance changes theme, grid, and tab layout. Content changes what is shown
for videos and channels. Feed controls the subscribed-content experience. These
are presentation settings; they do not repair an extractor or playback failure.

![Appearance settings](/screenshots/pipepipe-appearance-5.2.3-api36.png)

![Content settings](/screenshots/pipepipe-content-5.2.3-api36.png)

![Feed settings](/screenshots/pipepipe-feed-5.2.3-api36.png)

## Local data and filtering

History and cache, filters, and SponsorBlock each affect different data or
surfaces. Change one category at a time when diagnosing an unexpected result.

![History and cache settings](/screenshots/pipepipe-history-cache-5.2.3-api36.png)

![Content Filter settings](/screenshots/pipepipe-content-filter-5.2.3-api36.png)

![SponsorBlock settings](/screenshots/pipepipe-sponsorblock-5.2.3-api36.png)

## Advanced

Advanced contains compatibility and player-adjacent controls. Do not switch
several of them together: record the initial value, change one option, and
retest the same video. For decoder and surface workarounds, see
[Android playback and integration](/issues/android).

![Advanced settings on Android 16](/screenshots/pipepipe-advanced-5.3.1-beta-api36.png)

### YouTube extraction endpoint

This is the Advanced setting that decides which YouTube client PipePipe asks for
a video. Open **Settings → Advanced → YouTube extraction endpoint**:

<div class="screenshot-callout" role="img" aria-label="YouTube extraction endpoint picker with the VisionOS and MWEB (SABR) choices highlighted">
  <img src="/screenshots/pipepipe-endpoint-picker-5.4.0-api36.png" alt="YouTube extraction endpoint picker on Android 16">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="55" y="1050" width="790" height="280" rx="24" />
    <circle class="callout-number" cx="800" cy="1190" r="42" /><text x="800" y="1190">1</text>
  </svg>
</div>

*Reference capture: Android 16/API 36 on an anonymous installation. **1** is the
picker with both choices. A signed-in installation lists MWEB only.*

| Value | What it is | When it fails |
| --- | --- | --- |
| **MWEB (SABR)** | The current session-based path, and the only one that can play SABR formats. A signed-in session is locked to it. | Needs `googleapis.com` and `google.com` reachable for the proof-of-origin token, so a DNS filter breaks it. |
| **VisionOS** | The anonymous default, kept for installations without a session. | YouTube is retiring that client: playback can stop around 0:59 with `Response code: 403`. |

If a report shows `Endpoint: visionos` and playback stops around 0:59, switch to
**MWEB (SABR)**. The symptom and the checks around it are in [YouTube playback,
network, and sign-in](/issues/youtube-playback#playback-stops-around-1-minute-with-a-403).

![YouTube extraction endpoint entry set to MWEB (SABR) in Advanced settings on Android 16](/screenshots/pipepipe-advanced-endpoint-5.4.0-api36.png)

*Reference capture: the same entry in the Advanced list, here set to MWEB (SABR).
Your value may differ; that is the value to note in a report.*

## More task-specific screens

- [Downloads](/issues/downloads) shows destination and retry controls.
- [Accounts and services](/issues/accounts-and-services) shows service entries
  and WebView-cookie clearing.
- [Setup, updates, and backups](/issues/setup) highlights prereleases and the
  manual update check.
- [Backup and restore](./backup-and-restore) highlights export before import.
- [Playback, network, and sign-in](/issues/youtube-playback#endpoint-is-evidence-not-a-magic-switch)
  covers the endpoint choice and the 0:59 `403` case.
