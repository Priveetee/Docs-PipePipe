# SponsorBlock

Les segments SponsorBlock (sponsor, intro, outro, ...) sont extraits en même temps que le flux pour que le lecteur puisse les sauter ou les marquer. C'est une capacité à laquelle un service adhère, pas une partie de l'extraction de flux principale.

![Récupération SponsorBlock](/diagrams/sponsorblock.png)

## Le modèle

Un `SponsorBlockSegment` est une plage temporelle avec une catégorie et une action :

```java
class SponsorBlockSegment {
    String uuid;  double startTime;  double endTime;   // milliseconds
    SponsorBlockCategory category;  SponsorBlockAction action;  int serviceId;
}
enum SponsorBlockCategory {
    SPONSOR, INTRO, OUTRO, INTERACTION, HIGHLIGHT, SELF_PROMO, NON_MUSIC, PREVIEW, FILLER, PENDING
}   // each maps to an API name, e.g. NON_MUSIC = "music_offtopic", HIGHLIGHT = "poi_highlight"
enum SponsorBlockAction { SKIP, POI }
```

Un `HIGHLIGHT` est un point d'intérêt (un instant unique), aussi l'extracteur lui attribue-t-il une plage d'une seconde pour le rendre visible sur la barre de progression.

## Adhérer

Un service active SponsorBlock en définissant un `SponsorBlockApiSettings` et en déclarant la capacité `SPONSORBLOCK` :

```java
service.setSponsorBlockApiSettings(settings);   // apiUrl + per-category include flags
service.getSponsorBlockApiSettings();
```

Les paramètres portent les catégories voulues par l'utilisateur (`includeSponsorCategory`, `includeIntroCategory`, ...). Seuls YouTube et BiliBili ont une API : `sponsor.ajay.app` pour YouTube, `bsbsb.top` pour BiliBili.

## Comment les segments sont récupérés

SponsorBlock utilise la **k-anonymity** : le client n'envoie jamais l'identifiant complet de la vidéo. `SponsorBlockExtractorHelper.getSegments` :

1. hache l'identifiant de la vidéo en SHA-256 (`Utils.toSha256`),
2. n'envoie que les 4 premiers caractères hexadécimaux comme préfixe : `GET {apiUrl}/skipSegments/{prefix}?categories=[...]&actionTypes=[skip,poi]`,
3. récupère les segments de *toutes* les vidéos partageant ce préfixe, et conserve celles dont le hash complet correspond.

Les temps reviennent en secondes et sont convertis en millisecondes.

## Quand cela s'exécute

`StreamInfo.getInfo` lance la récupération sur un thread annexe dès le début de l'extraction, puis attend jusqu'à environ trois secondes avant de retourner, afin qu'un serveur SponsorBlock lent ne bloque jamais toute l'extraction. Le résultat atterrit sur le `StreamInfo` :

```java
SponsorBlockSegment[] getSponsorBlockSegments();
void setSponsorBlockSegments(SponsorBlockSegment[] segments);
```

Les segments sont donc au mieux : si l'API est lente ou hors service, la vidéo se lit quand même, simplement sans les sauts.
