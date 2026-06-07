# Errores y excepciones

Los fallos de extracción son excepciones comprobadas (checked). Todo lo que sigue deriva de `ExtractionException` (que extiende `Exception`), así que el compilador obliga a quien llama a manejarlas, y el propio tipo lleva consigo el significado.

## La jerarquía

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
│  │  ├─ AccountTerminatedException        (carries a Reason)
│  │  ├─ LiveNotStartException
│  │  └─ VideoNotReleaseException
│  ├─ ContentNotSupportedException
│  ├─ FoundAdException
│  ├─ AntiBotException
│  └─ NeedLoginException
└─ ReCaptchaException                       (carries the challenge url)
```

## Qué lanzar y cuándo

- **`ParsingException`**: la página cargó pero falta un campo o tiene una forma incorrecta. Envuelve en ella los fallos de IO y de JSON.
- **`ContentNotAvailableException`** y sus subclases: el contenido existe pero este cliente no puede tenerlo. La subclase dice por qué, y la app la mapea a un mensaje concreto:
  - `GeographicRestrictionException`, `AgeRestrictedContentException`, `PaidContentException`, `PrivateContentException`, `AccountTerminatedException` (con un `Reason`), `LiveNotStartException` / `VideoNotReleaseException` para lo que aún no está en directo y los estrenos, además de las específicas de cada servicio (`SoundCloudGoPlusContentException`, `YoutubeMusicPremiumContentException`).
- **`ContentNotSupportedException`**: el extractor no maneja este tipo de contenido, por ejemplo un channel sin pestañas soportadas.
- **`FoundAdException`**: el enlace es una URL de anuncio; se lanza directamente desde el link handler.
- **`ReCaptchaException`**: el servicio exige un captcha; lleva la `url` para que la app pueda presentar el desafío.

## Sitios reales donde se lanzan

`YoutubeStreamExtractor` inspecciona el motivo de error del player y lanza la excepción correcta:

```java
if (message.contains("private"))      throw new PrivateContentException("This video is private");
if (reason.contains("Premieres in"))  throw new VideoNotReleaseException(reason);
```

`SoundcloudStreamExtractor` convierte una política `"SNIP"` en `SoundCloudGoPlusContentException`; `YoutubeStreamLinkHandlerFactory` lanza `FoundAdException` para los hosts de doubleclick. Esta precisión es en lo que se apoya `StreamInfo.getInfo` cuando distingue entre contenido restringido por edad y bloqueado por país (consulta [Flujo de extracción](./extraction-flow)).
