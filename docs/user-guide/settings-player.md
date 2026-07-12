# Player Settings

This section covers all settings related to the video and audio player.

![PipePipe Player settings, 5.2.3 on Android 16](/screenshots/pipepipe-player-5.2.3-api36.png)

*Reference capture: PipePipe 5.2.3 · Android 16/API 36. Settings and their order can change between releases.*

## Default resolution

Sets the preferred video quality for all videos played in the main player.

- **Options:** Best resolution, 1080p60, 1080p, 720p60, 720p, 480p, 360p, 240p, 144p.
- **Default:** 1080p60

::: tip
Choosing a lower resolution like 720p can help save mobile data and reduce buffering on slow connections.
:::

## Default popup resolution

Sets the preferred video quality for videos played in the popup player.

- **Options:** Same as default resolution.
- **Default:** 480p

::: info
A lower resolution is often sufficient for the small popup window and consumes fewer resources.
:::

## Enable advanced formats

**Path:** Settings > Video and audio > Enable advanced formats

Allows the player to use modern video and audio codecs if your device supports them.

- **VP9** — A widely supported open codec. Good compatibility across most Android devices.
- **AV1** — A more efficient codec than VP9. Required for 2K/4K playback on YouTube. Uses more CPU than VP9 on devices without hardware AV1 decoding.
- **HEVC** — A codec common on iOS devices. Android support varies by device.
- **EC-3** — A Dolby Digital Plus audio codec. Only useful if your device supports it.

The formats you enable here determine which streams appear in the in-player quality selector. For example, enabling AV1 adds `AV01` streams to the quality list directly in the player. Once enabled, open a video, tap the quality icon in the player, and select a VP9 or AV01 stream.

::: tip
If your video lags periodically (audio is fine but video stutters every few seconds), try switching codec:
1. Go to **Settings > Video and audio > Enable advanced formats**
2. Enable **VP9** or **AV1**
3. Open a video, tap the quality selector in the player
4. Select a **VP9** or **AV01** stream

This is the fix confirmed by the developer for this type of lag (see [#2085](https://github.com/InfinityLoop1308/PipePipe/issues/2085) and [#2045](https://github.com/InfinityLoop1308/PipePipe/issues/2045)).
:::

::: warning
Enabling a format that your device does not support can lead to a black screen or crashes. WEBM or AV1 are required for 2K/4K playback on YouTube.
:::

## Limit resolution on mobile data

Automatically switches to a lower resolution when you are not connected to Wi-Fi to save data.

- **Options:** No limit, 1080p60, 1080p, 720p60, 720p, 480p, 360p, 240p, 144p.
- **Default:** 480p

## Request audio focus

Ensures that PipePipe is the only app playing audio. When enabled, other apps (like music players) will pause when a PipePipe video starts.

- **Default:** Enabled

## Resume playback

Automatically resumes playback after an interruption, such as a phone call.

- **Default:** Enabled

::: warning
On some builds, entering fullscreen can resume a video that was paused. If that happens, keep the selected playback mode and the exact sequence (pause, enter fullscreen, rotate, return, etc.) for a report; it is not the same setting as resume after an interruption.
:::

## Always start from the beginning

Disables the "resume playback" feature for videos you've already started watching. Every video will start from 00:00.

- **Default:** Disabled

## Remember popup properties

The app will remember the size and position of the popup player from your last session.

- **Default:** Enabled

## Fast forward/rewind duration

Sets the amount of time to skip forward or backward when you double-tap the sides of the player.

- **Options:** 5, 10, 15, 20, 25, 30 seconds.
- **Default:** 10 seconds

## Long press to speed up playback

Allows you to temporarily speed up the video by long-pressing on the player.

- **Options:** 0.1x to 5x, Disable.
- **Default:** 5x

## Sleep timer

Automatically stops playback after a set amount of time.

- **Options:** 5, 10, 15, 20, 30 minutes, 1 hour.
- **Default:** 1 hour

## Gesture settings

Opens a sub-menu to configure the player's swipe gestures.

## Scrolling comment settings

Opens a sub-menu to configure the danmaku-style (scrolling) live chat comments.

## Subtitles

Opens a sub-menu to configure subtitle appearance and subtitle-related choices. Ordinary caption tracks are supplied by the service/video. Automatic translation is a separate YouTube feature and requires a YouTube login; a greyed-out translation control can therefore mean that no supported login is active, not that captions are missing.

When a subtitle problem is reported, distinguish these cases: no normal track is offered; a normal track does not render; an automatic translation cannot be selected; or a selected translation is wrong. Include the video URL, source/target languages, selected track, login state, and app version. Never include cookies or account credentials.
