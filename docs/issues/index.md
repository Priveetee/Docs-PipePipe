# Troubleshooting

This section is the user-facing map for problems in PipePipe. Start from the
exact symptom instead of changing several settings at once: each category below
collects the information that is actually useful for a diagnosis.

![Troubleshooting triage](/diagrams/issue-triage.png)

## First steps

1. Check your installed version against [GitHub Releases](https://github.com/InfinityLoop1308/PipePipe/releases).
2. Repeat the problem once and record the time, affected URL or query, and the
   selected YouTube extraction endpoint.
3. Open the matching category below. Keep separate symptoms in separate reports.

![PipePipe Settings, 5.2.3 on Android 16](/screenshots/pipepipe-settings-5.2.3-api36.png)

*Reference capture: PipePipe 5.2.3 · Android 16/API 36. Categories and their order can change between releases.*

## Categories

## Find the right branch quickly

| Exact symptom | Start here | Do not assume |
| --- | --- | --- |
| **WebView unavailable** | [WebView and protected playback](./webview) | That changing the YouTube endpoint bypasses the WebView check. |
| Every YouTube video fails; a Google host resolves to `0.0.0.0` or `127.0.0.1` | [DNS filtering and playback](./youtube-playback#every-youtube-video-fails-check-dns-filtering) | That changing endpoint, reinstalling, or updating WebView bypasses DNS filtering. |
| `AntiBotException`, `Source error`, buffering, live seek failure | [Playback, network, and sign-in](./youtube-playback) | That a current WebView or a login proves the cause. |
| No/incorrect search results | [Search and discovery](./search) | That a player fix will fix search. |
| Link opens in the “wrong” player | [Background, popup, fullscreen, and queue](./player-modes) | That the preferred-open setting controls in-app taps. |
| Download fails or a partial file remains | [Downloads](./downloads) | That final SD-card storage is the only storage used. |
| Lost local data after migration | [Setup, updates, and backups](./setup) | That an import behaves as a reversible merge. |
| App/UI/locale/device-specific issue | [App and device](#app-and-device) | That it is automatically a YouTube extractor fault. |

### Setup and reporting

- [Setup, updates, and backups](./setup): installation, update source, import,
  export, and safe migration.
- [Reporting a problem](./reporting): the evidence that makes an issue reproducible.

### YouTube and playback

- [WebView and protected playback](./webview): PipePipe says WebView is
  unavailable, or a system WebView provider is missing, locked, or incompatible.
- [Playback, network, and sign-in](./youtube-playback): `AntiBotException`,
  DNS filtering, `Source error`, buffering, endpoint choice, or logged-in
  playback.
- [Search and discovery](./search): empty, wrong, or incomplete search results.
- [Background, popup, fullscreen, and queue](./player-modes): lifecycle,
  rotation, picture-in-picture, queue, and playlist transitions.
- [Downloads](./downloads): format, storage, partial file, and merge failures.

### Library and content controls

- [Playlists, history, and subscriptions](./library-and-feeds): local library,
  feed, channel, playlist, import, and position problems.
- [Filters, comments, and subtitles](./content-controls): content filtering,
  comments, bullet comments, and caption behaviour.

### App and device

- [MediaCodec and Android Auto](./android): decoder/surface workarounds and
  Android Auto visibility.
- [Accounts and services](./accounts-and-services): sign-in, cookies, reCAPTCHA,
  restricted content, and service-specific reports.
- [Interface and language](./interface-and-language): experimental UI, layout,
  share sheet, notifications, language, and content-country behaviour.

::: tip One symptom, one report
WebView, stream playback, and search can fail at the same time after an upstream
YouTube change. They still take different code paths. Separating them gives the
maintainer a usable reproduction instead of one ambiguous report.
:::
