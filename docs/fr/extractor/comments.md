# Commentaires et bullet comments

Deux systèmes de commentaires coexistent : les commentaires classiques en fil, et les bullet comments (danmaku), ce texte en surimpression qui défile sur la vidéo en suivant la lecture.

## Commentaires classiques

Un `CommentsExtractor` est un `ListExtractor<CommentsInfoItem>` ; `CommentsInfo.getInfo(url)` le pilote comme n'importe quelle liste, avec `getMoreItems` pour la pagination. Il peut signaler que toute la section est désactivée via `isCommentsDisabled()`.

Un `CommentsInfoItem` est riche :

```java
String getCommentText();  String getUploaderName();  String getUploaderAvatarUrl();
int getLikeCount();  String getTextualLikeCount();
boolean isPinned();  boolean isHeartedByUploader();  boolean isUploaderVerified();
int getStreamPosition();        // timestamp the comment points at, or NO_STREAM_POSITION
int getReplyCount();  Page getReplies();   // replies are their own page
Collection<Image> getPictures();
```

Les réponses ne sont pas en ligne : chaque élément porte une `Page` `replies`, récupérée via la même mécanique `getMoreItems` quand l'utilisateur déplie un fil.

## Bullet comments (danmaku)

Les bullet comments sont une autre bête, modélisés pour une surimpression plutôt que pour une liste. `BulletCommentsExtractor` (aussi un `ListExtractor`) ajoute des contrôles adaptés au direct :

```java
boolean isLive();  boolean isDisabled();
List<BulletCommentsInfoItem> getLiveMessages();   // poll new ones on a live stream
void setCurrentPlayPosition(long ms);             // align the overlay to playback
void disconnect();  void reconnect();  void clearMappingState();
```

Un `BulletCommentsInfoItem` décrit comment et quand peindre un bullet comment :

```java
String getCommentText();
Duration getDuration();      // when in the video it appears (required)
int getArgbColor();          // ARGB32, e.g. white = 0xFFFFFFFF
Position getPosition();       // REGULAR, BOTTOM, TOP, SUPERCHAT
double getRelativeFontSize();
int getLastingTime();        // how long it stays on screen
boolean isLive();
```

Les éléments sont `Comparable` par leur timestamp, ainsi la surimpression peut les rejouer dans l'ordre.

## Qui en dispose

Les bullet comments sont implémentés par BiliBili (`BilibiliBulletCommentsExtractor`), NicoNico (`NiconicoBulletCommentsExtractor`) et le chat en direct de YouTube (`YoutubeBulletCommentsExtractor`). Un service y adhère en surchargeant `getBulletCommentsLHFactory()` / `getBulletCommentsExtractor()` (null par défaut) et en déclarant la capacité `BULLET_COMMENTS`. Les services sans danmaku ne l'exposent simplement jamais.
