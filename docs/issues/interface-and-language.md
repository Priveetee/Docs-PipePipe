# Interface and language

## Experimental interface

The experimental new UI can change behaviour and restarts PipePipe when toggled. For a UI problem, state whether it is enabled, the exact screen/tab, device orientation and size class, and the action immediately before the problem.

Retest once with the experimental UI unchanged. If you deliberately compare it on/off, restart after each toggle and give two separate results. Do not mix an interface regression with a network/extractor failure just because the screen was visible when it happened.

## Language, country, and localization

For unexpected languages, translated titles, or locale-specific parsing errors, include the app language, Android language, default content country, service, and the original URL. A Zulu/Chinese/other-language symptom may be data returned by a service rather than the interface language itself.

Use this distinction: app labels in the wrong language; a service title/description in an unexpected language; a content-country selection not taking effect; or a date/number parsing error. The same screenshot is much more useful when paired with those five settings/values: PipePipe version, app language, Android language, default content country, service, and URL.

## Share sheet, notifications, and navigation

For missing share actions, notification controls, back behaviour, or a visual overlap, include Android version, the originating app/screen, and a screenshot when it does not expose private data. For external-link opening, name the source application and the Android intent/share action; this is also where the “Preferred open action” setting applies.
