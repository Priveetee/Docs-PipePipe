# Comments and bullet comments

Two comment systems live side by side: ordinary threaded comments, and bullet comments (danmaku), the overlay text that scrolls across the video timed to playback.

## Ordinary comments

A `CommentsExtractor` is a `ListExtractor<CommentsInfoItem>`; `CommentsInfo.getInfo(url)` drives it like any list, with `getMoreItems` for pagination. It can report the whole section off via `isCommentsDisabled()`.

A `CommentsInfoItem` is rich:

```java
String getCommentText();  String getUploaderName();  String getUploaderAvatarUrl();
int getLikeCount();  String getTextualLikeCount();
boolean isPinned();  boolean isHeartedByUploader();  boolean isUploaderVerified();
int getStreamPosition();        // timestamp the comment points at, or NO_STREAM_POSITION
int getReplyCount();  Page getReplies();   // replies are their own page
Collection<Image> getPictures();
```

Replies are not inline: each item carries a `replies` `Page`, fetched through the same `getMoreItems` machinery when the user expands a thread.

## Bullet comments (danmaku)

Bullet comments are a different beast, modelled for an overlay rather than a list. `BulletCommentsExtractor` (also a `ListExtractor`) adds live-aware controls:

```java
boolean isLive();  boolean isDisabled();
List<BulletCommentsInfoItem> getLiveMessages();   // poll new ones on a live stream
void setCurrentPlayPosition(long ms);             // align the overlay to playback
void disconnect();  void reconnect();  void clearMappingState();
```

A `BulletCommentsInfoItem` describes how and when to paint one comment:

```java
String getCommentText();
Duration getDuration();      // when in the video it appears (required)
int getArgbColor();          // ARGB32, e.g. white = 0xFFFFFFFF
Position getPosition();       // REGULAR, BOTTOM, TOP, SUPERCHAT
double getRelativeFontSize();
int getLastingTime();        // how long it stays on screen
boolean isLive();
```

Items are `Comparable` by their timestamp, so the overlay can play them back in order.

## Who has them

Bullet comments are implemented by BiliBili (`BilibiliBulletCommentsExtractor`), NicoNico (`NiconicoBulletCommentsExtractor`), and YouTube live chat (`YoutubeBulletCommentsExtractor`). A service opts in by overriding `getBulletCommentsLHFactory()` / `getBulletCommentsExtractor()` (null by default) and declaring the `BULLET_COMMENTS` capability. Services without danmaku simply never expose it.
