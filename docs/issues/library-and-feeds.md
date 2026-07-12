# Playlists, history, and subscriptions

## Playlists and queue

For an online playlist that is empty, incomplete, or cannot load, include its URL, service, login state, endpoint, and whether the same playlist works after reopening. For local playlists, also include the sort mode and the action that changed the list.

Online playlists are service data; local playlists are PipePipe data. Always say which one you mean. For an online list, capture whether every page/continuation fails or only later items are missing. For a local list, capture the exact edit/navigation sequence and whether backup import or a sort mode preceded it.

## Subscriptions and feeds

For missing feed items, a failed subscription, or an interrupted import, include the channel URL, service, content country, login state, and whether the problem affects one channel or all subscriptions. Do not publish a complete private subscription export.

Say whether the channel page itself shows the missing item. If it does, but the subscription feed does not, give the item URL/date and whether refresh/reopen changes the result. If the channel page also fails, it is likely a different service/extraction route.

::: info Expected incomplete feed metadata
Closed report [#2521](https://github.com/InfinityLoop1308/PipePipe/issues/2521)
showed that missing durations in a feed can be expected when the dedicated/fast
feed path is enabled: it can return faster but omit metadata such as duration,
live/upcoming state, or Short filtering. First identify the feed mode and
refresh once before filing it as a display defect.
:::

## History and playback positions

Describe whether history is enabled, whether positions are restored, and whether the problem occurs after a backup import. Playback-position behaviour and watch-history visibility are separate settings.

For an unexpected restart, add whether it is a saved playback position, a queue transition, or an online playlist reload. These look similar from the player, but belong to different subsystems.
