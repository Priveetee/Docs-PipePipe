# What you can do with PipePipe

PipePipe brings several video and audio services into one Android app. What you
can watch or download depends on the service and on what it currently makes
available.

## Privacy, in plain terms

You do not need a PipePipe account, and PipePipe does not sync your library to a
PipePipe cloud. Subscriptions, history, local playlists, and settings are kept
on your device.

That does not make network use anonymous: when you search, open, or play content,
PipePipe has to contact the service you chose. That service can see the requests
coming from your connection. Optional sign-in and features such as WebView-based
playback also involve their own requests. See [WebView and protected
playback](/issues/webview) for what that means for YouTube.

## Services

The app currently includes YouTube, NicoNico, BiliBili, SoundCloud, Bandcamp,
PeerTube, and media.ccc.de. YouTube supports videos, Shorts, and live streams;
NicoNico and BiliBili also have service-specific live and comment features.
Menus and features are not identical across services, and a change on one site
can affect that service without breaking the others.

## Watching and listening

- Keep audio playing in the background or watch in a floating popup window.
- Pick a quality for supported live streams when the service offers more than
  one. See [Player settings](./settings-player) for the live quality control.
- Available video formats depend on the service and your device. Enabling AV1,
  VP9, or another advanced format does not guarantee that Android can decode it;
  the [player settings guide](./settings-player) explains what to try if video
  stutters or fails.
- Show scrolling live comments (danmaku) on services that provide them.

## Make the app yours

- Use SponsorBlock to skip submitted segments such as sponsor messages.
- Choose whether YouTube titles should use the original title or a translation.
- Hide Shorts, paid items, or videos that match your content filters.
- Sort subscriptions into local groups and build local playlists.

## Downloads and your library

Download available audio or video formats, choose a storage location, and save
playlists or channel content where the service supports it. Download controls
and available formats can differ from ordinary playback; see the
[downloads guide](/issues/downloads) if a download fails.
