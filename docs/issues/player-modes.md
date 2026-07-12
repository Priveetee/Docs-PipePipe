# Background, popup, fullscreen, and queue

## First, identify how the video was opened

**Settings → Behavior → Preferred 'open' action** applies to video links handed to PipePipe by *another app*. It is not a global override for taps inside PipePipe. Test the setting by sharing/opening a link from a browser or messenger; an ordinary tap in a PipePipe feed follows the normal detail/main-player path.

For a report, say which path was used: an in-app feed/search/channel tap, an Android “Open with” intent, a browser link, or a share sheet. This prevents an expected design behaviour from being filed as a broken setting.

## Background and popup playback

For audio that stops after minimizing, a video that reloads on return, or a popup crash, record the selected playback mode, whether the app was switched away from, Android version, and the exact action that triggers it. These are player-lifecycle issues, not necessarily YouTube extraction issues.

Use a short, repeatable sequence: open a specific URL → choose main/background/popup → press Home or open app X → wait N seconds → return. State whether audio continued, the player was paused, the stream buffered again, or playback restarted at 0:00. A longer reload after returning can be an upstream stream/session characteristic; it still needs a reproducible sequence to distinguish it from a crash.

## Fullscreen, rotation, and picture-in-picture

For rotation, fullscreen, or picture-in-picture problems, include the device orientation before and after the action, whether popup/background mode was active, and whether playback resumed, paused, or restarted. Include whether the stream was intentionally paused before entering fullscreen: a paused video resuming during that transition is a distinct defect from normal automatic continuation.

## Queue and playlist transitions

If enqueue crashes, the next item does not play, or a playlist restarts a video, include the queue order, repeat/shuffle state, autoplay state, and whether the item was added from search, a playlist, or a feed. For a crash when moving from one item to the next, say whether the player had already transitioned; “tap Enqueue while the current video is ending” is much more useful than “queue crashes”.

For a playlist item that restarts after navigating away and back, include the playlist URL/local-list name, the two items visited, current position, and whether the list is local or online.

## What to attach

Do not attach a screen recording containing private notifications. A trimmed recording is useful when it shows the mode selector, transition, and result. Otherwise give the video URL, exact steps, Android version, app version, mode, orientation, autoplay/repeat/shuffle values, and whether the experimental UI is enabled.
