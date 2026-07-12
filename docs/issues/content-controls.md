# Filters, comments, and subtitles

## Filters and blocked channels

For blocked content that still appears, include where it appears: search, channel, feed, playlist, or related videos. Record the filter rule, the channel/video URL, and whether the item was already loaded before the rule changed.

Do not reduce this to “filter does not work”. A rule may be evaluated differently for an already loaded list versus a newly fetched page. Refresh/reopen once, then report the precise surface and whether the offending item is a channel, title, keyword, or service-specific result.

## Comments and bullet comments

For missing, stale, or incorrectly placed comments, include the video URL, selected tab, playback mode, and whether the experimental UI is enabled. For bullet comments, also include the service and the display setting you changed. “Comments are missing” needs the service, because comment APIs and bullet/danmaku comments are not interchangeable.

## Subtitles

Include the video URL, language, selected subtitle track, login state, and whether the problem concerns normal subtitles or automatic translation. Automatic translation has different upstream requirements from ordinary captions: on YouTube it requires an active YouTube login. A disabled/grey translation control can therefore be expected when the user is signed out.

Use one of these descriptions: “no original caption track is listed”, “original captions are listed but do not render”, “automatic translation is unavailable while signed out”, or “automatic translation is wrong while signed in”. The last case needs source and target language; none of them needs account credentials or cookies.

![Player Captions entry](/screenshots/pipepipe-player-captions-5.2.3-api36.png)

The Captions entry controls player caption presentation. It does not by itself
make automatic translation available. Closed report [#2627](https://github.com/InfinityLoop1308/PipePipe/issues/2627)
confirmed that a grey automatic-translation control meant the user was not
logged in to YouTube.
