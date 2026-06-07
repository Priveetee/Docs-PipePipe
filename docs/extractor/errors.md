# Errors and exceptions

Extraction failures are checked exceptions. Everything below derives from `ExtractionException` (which extends `Exception`), so the compiler forces callers to handle them, and the type itself carries the meaning.

## The hierarchy

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

## What to throw when

- **`ParsingException`**: the page loaded but a field is missing or shaped wrong. Wrap IO and JSON failures in it.
- **`ContentNotAvailableException`** and its subclasses: the content exists but this client cannot have it. The subclass says why, and the app maps it to a specific message:
  - `GeographicRestrictionException`, `AgeRestrictedContentException`, `PaidContentException`, `PrivateContentException`, `AccountTerminatedException` (with a `Reason`), `LiveNotStartException` / `VideoNotReleaseException` for not-yet-live and premieres, plus service-specific ones (`SoundCloudGoPlusContentException`, `YoutubeMusicPremiumContentException`).
- **`ContentNotSupportedException`**: the extractor does not handle this kind of content, for example a channel with no supported tabs.
- **`FoundAdException`**: the link is an ad URL; thrown straight from the link handler.
- **`ReCaptchaException`**: the service demands a captcha; it carries the `url` so the app can present the challenge.

## Real throw sites

`YoutubeStreamExtractor` inspects the player error reason and raises the right one:

```java
if (message.contains("private"))      throw new PrivateContentException("This video is private");
if (reason.contains("Premieres in"))  throw new VideoNotReleaseException(reason);
```

`SoundcloudStreamExtractor` turns a `"SNIP"` policy into `SoundCloudGoPlusContentException`; `YoutubeStreamLinkHandlerFactory` throws `FoundAdException` for doubleclick hosts. This precision is what `StreamInfo.getInfo` relies on when it disambiguates age-restricted from country-blocked (see [Extraction flow](./extraction-flow)).
