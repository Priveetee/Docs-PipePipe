# Comentarios y bullet comments

Dos sistemas de comentarios conviven uno junto al otro: los comentarios ordinarios en hilos, y los bullet comments (danmaku), el texto superpuesto que se desplaza por el vídeo sincronizado con la reproducción.

## Comentarios ordinarios

Un `CommentsExtractor` es un `ListExtractor<CommentsInfoItem>`; `CommentsInfo.getInfo(url)` lo conduce como a cualquier lista, con `getMoreItems` para la paginación. Puede reportar que toda la sección está desactivada mediante `isCommentsDisabled()`.

Un `CommentsInfoItem` es rico:

```java
String getCommentText();  String getUploaderName();  String getUploaderAvatarUrl();
int getLikeCount();  String getTextualLikeCount();
boolean isPinned();  boolean isHeartedByUploader();  boolean isUploaderVerified();
int getStreamPosition();        // timestamp the comment points at, or NO_STREAM_POSITION
int getReplyCount();  Page getReplies();   // replies are their own page
Collection<Image> getPictures();
```

Las respuestas no van en línea: cada item lleva una `Page` de `replies`, obtenida a través de la misma maquinaria de `getMoreItems` cuando el usuario expande un hilo.

## Bullet comments (danmaku)

Los bullet comments son otra historia, modelados para una superposición en lugar de para una lista. `BulletCommentsExtractor` (también un `ListExtractor`) añade controles conscientes del directo:

```java
boolean isLive();  boolean isDisabled();
List<BulletCommentsInfoItem> getLiveMessages();   // poll new ones on a live stream
void setCurrentPlayPosition(long ms);             // align the overlay to playback
void disconnect();  void reconnect();  void clearMappingState();
```

Un `BulletCommentsInfoItem` describe cómo y cuándo pintar un comentario:

```java
String getCommentText();
Duration getDuration();      // when in the video it appears (required)
int getArgbColor();          // ARGB32, e.g. white = 0xFFFFFFFF
Position getPosition();       // REGULAR, BOTTOM, TOP, SUPERCHAT
double getRelativeFontSize();
int getLastingTime();        // how long it stays on screen
boolean isLive();
```

Los items son `Comparable` por su timestamp, así que la superposición puede reproducirlos en orden.

## Quién los tiene

Los bullet comments están implementados por BiliBili (`BilibiliBulletCommentsExtractor`), NicoNico (`NiconicoBulletCommentsExtractor`) y el chat en directo de YouTube (`YoutubeBulletCommentsExtractor`). Un servicio se suma sobrescribiendo `getBulletCommentsLHFactory()` / `getBulletCommentsExtractor()` (null por defecto) y declarando la capacidad `BULLET_COMMENTS`. Los servicios sin danmaku simplemente nunca lo exponen.
