# Abonnements et fils

Deux fonctionnalités se situent légèrement en dehors des extracteurs par contenu : importer les abonnements d'un utilisateur, et un fil de channel rapide.

## Abonnements

`SubscriptionExtractor` importe les channels suivis par un utilisateur dans une liste de `SubscriptionItem` (`serviceId`, `url`, `name`). Il déclare depuis où il peut importer :

```java
enum ContentSource { CHANNEL_URL, INPUT_STREAM }
```

et expose des points d'entrée qui lèvent `UnsupportedOperationException` tant qu'ils ne sont pas surchargés :

```java
abstract String getRelatedUrl();    // where the user finds their export / following list
List<SubscriptionItem> fromChannelUrl(String channelUrl);
List<SubscriptionItem> fromInputStream(InputStream in);
List<SubscriptionItem> fromInputStream(InputStream in, String contentType);
```

Deux services l'implémentent, à partir de sources différentes :

- **YouTube** (`YoutubeSubscriptionExtractor`) : `INPUT_STREAM`. Il analyse un export Google Takeout, en JSON, CSV, ou un ZIP contenant l'un des deux.
- **SoundCloud** (`SoundcloudSubscriptionExtractor`) : `CHANNEL_URL`. Il lit les abonnements depuis l'URL de profil d'un utilisateur.

L'application choisit le flux à partir du `ContentSource` déclaré : un sélecteur de fichier pour `INPUT_STREAM`, un champ d'URL pour `CHANNEL_URL`.

## Fils : le chemin rapide du channel

Charger un channel complet est coûteux : avatar, bannière, onglets, compteurs, première page. Pour seulement « quoi de neuf », certains services exposent un fil plus léger. `FeedExtractor` est un `ListExtractor<StreamInfoItem>` sans méthode obligatoire supplémentaire ; `FeedInfo.getInfo(service, url)` le pilote et lève une exception si le service n'en a pas.

`StreamingService.getFeedExtractor(url)` renvoie null par défaut. YouTube le surcharge (`YoutubeFeedExtractor`) pour lire le **flux RSS** du channel, bien moins coûteux qu'une extraction de channel complète, ce que l'application utilise pour rafraîchir le fil d'abonnements.

```java
@Override
public FeedExtractor getFeedExtractor(String channelUrl) throws ExtractionException {
    return new YoutubeFeedExtractor(this, getChannelLHFactory().fromUrl(channelUrl));
}
```

Les listes « recommandées » de BiliBili y ressemblent mais sont câblées en tant que kiosques, pas en tant que `FeedExtractor`. Donc quand vous construisez le fil de l'application, privilégiez `getFeedExtractor` là où il existe et repliez-vous sur l'extracteur de channel sinon.
