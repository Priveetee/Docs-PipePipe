# Erreurs et exceptions

Les échecs d'extraction sont des exceptions vérifiées. Tout ce qui suit dérive de `ExtractionException` (qui étend `Exception`), donc le compilateur oblige les appelants à les gérer, et le type lui-même porte le sens.

## La hiérarchie

```
ExtractionException
├─ ParsingException
│  ├─ ContentNotAvailableException
│  │  ├─ GeographicRestrictionException
│  │  ├─ AgeRestrictedContentException
│  │  ├─ PaidContentException
│  │  ├─ PrivateContentException
│  │  ├─ SoundCloudGoPlusContentException
│  │  ├─ YoutubeMusicPremiumContentException
│  │  ├─ AccountTerminatedException        (porte un Reason)
│  │  ├─ LiveNotStartException
│  │  └─ VideoNotReleaseException
│  ├─ ContentNotSupportedException
│  ├─ FoundAdException
│  ├─ AntiBotException
│  └─ NeedLoginException
└─ ReCaptchaException                       (porte l'url du challenge)
```

## Quoi lever et quand

- **`ParsingException`** : la page s'est chargée mais un champ est manquant ou mal formé. Enveloppez-y les échecs IO et JSON.
- **`ContentNotAvailableException`** et ses sous-classes : le contenu existe mais ce client ne peut pas l'obtenir. La sous-classe dit pourquoi, et l'application l'associe à un message précis :
  - `GeographicRestrictionException`, `AgeRestrictedContentException`, `PaidContentException`, `PrivateContentException`, `AccountTerminatedException` (avec un `Reason`), `LiveNotStartException` / `VideoNotReleaseException` pour les directs pas encore commencés et les premières, plus celles spécifiques à un service (`SoundCloudGoPlusContentException`, `YoutubeMusicPremiumContentException`).
- **`ContentNotSupportedException`** : l'extracteur ne gère pas ce type de contenu, par exemple un channel sans onglet pris en charge.
- **`FoundAdException`** : le lien est une URL publicitaire ; levée directement depuis le link handler.
- **`ReCaptchaException`** : le service exige un captcha ; elle porte l'`url` pour que l'application puisse présenter le challenge.

## Sites de levée réels

`YoutubeStreamExtractor` inspecte la raison de l'erreur du player et lève la bonne :

```java
if (message.contains("private"))      throw new PrivateContentException("This video is private");
if (reason.contains("Premieres in"))  throw new VideoNotReleaseException(reason);
```

`SoundcloudStreamExtractor` transforme une politique `"SNIP"` en `SoundCloudGoPlusContentException` ; `YoutubeStreamLinkHandlerFactory` lève `FoundAdException` pour les hôtes doubleclick. C'est cette précision sur laquelle s'appuie `StreamInfo.getInfo` quand il distingue le contenu soumis à une restriction d'âge de celui bloqué par pays (voir [Flux d'extraction](./extraction-flow)).
