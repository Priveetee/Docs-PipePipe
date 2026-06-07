# Suscripciones y feeds

Dos funcionalidades quedan ligeramente fuera de los extractores por contenido: importar las suscripciones de un usuario, y un feed rápido de channel.

## Suscripciones

`SubscriptionExtractor` importa los channels que sigue un usuario a una lista de `SubscriptionItem` (`serviceId`, `url`, `name`). Declara desde dónde puede importar:

```java
enum ContentSource { CHANNEL_URL, INPUT_STREAM }
```

y expone puntos de entrada que lanzan `UnsupportedOperationException` salvo que se sobrescriban:

```java
abstract String getRelatedUrl();    // where the user finds their export / following list
List<SubscriptionItem> fromChannelUrl(String channelUrl);
List<SubscriptionItem> fromInputStream(InputStream in);
List<SubscriptionItem> fromInputStream(InputStream in, String contentType);
```

Dos servicios lo implementan, desde fuentes distintas:

- **YouTube** (`YoutubeSubscriptionExtractor`): `INPUT_STREAM`. Analiza una exportación de Google Takeout, en JSON, CSV, o un ZIP que contenga cualquiera de los dos.
- **SoundCloud** (`SoundcloudSubscriptionExtractor`): `CHANNEL_URL`. Lee los seguidos a partir de la URL del perfil de un usuario.

La app elige el flujo según el `ContentSource` declarado: un selector de archivos para `INPUT_STREAM`, un campo de URL para `CHANNEL_URL`.

## Feeds: la vía rápida del channel

Cargar un channel completo es pesado: avatar, banner, pestañas, contadores, primera página. Para saber solo "qué hay de nuevo", algunos servicios exponen un feed más ligero. `FeedExtractor` es un `ListExtractor<StreamInfoItem>` sin métodos obligatorios adicionales; `FeedInfo.getInfo(service, url)` lo conduce y lanza una excepción si el servicio no tiene ninguno.

`StreamingService.getFeedExtractor(url)` devuelve null por defecto. YouTube lo sobrescribe (`YoutubeFeedExtractor`) para leer el **feed RSS** del channel, mucho más barato que una extracción completa del channel, que es lo que la app usa para refrescar el feed de suscripciones.

```java
@Override
public FeedExtractor getFeedExtractor(String channelUrl) throws ExtractionException {
    return new YoutubeFeedExtractor(this, getChannelLHFactory().fromUrl(channelUrl));
}
```

Las listas "recommended" de BiliBili se parecen, pero están cableadas como kioscos, no como un `FeedExtractor`. Así que cuando construyas el feed de la app, prefiere `getFeedExtractor` allí donde exista y recurre al extractor de channel en caso contrario.
