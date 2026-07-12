# Installation et mises à jour

PipePipe est distribué hors de Google Play. Choisissez une source de mise à jour fiable et gardez-la cohérente afin de pouvoir identifier précisément la version installée lors d'un rapport.

## Prérequis système

L'application actuelle nécessite **Android 6.0 (API 23) ou plus récent**. Les APK de publication existent pour `arm64-v8a`, `armeabi-v7a`, `x86_64` et `x86` ; utilisez l'APK universel si vous ne connaissez pas l'ABI de l'appareil.

## Choisir une source de mise à jour

### Réglages de mise à jour de PipePipe

PipePipe propose ses propres réglages de mise à jour. Ils permettent de vérifier manuellement les mises à jour et, si vous l'activez, d'afficher les préversions. Préférez les versions stables, sauf si vous testez un correctif et êtes prêt à signaler les régressions avec des logs.

### GitHub Releases

[GitHub Releases](https://github.com/InfinityLoop1308/PipePipe/releases) est la source amont directe. C'est le meilleur endroit pour vérifier si un problème signalé est déjà corrigé dans une version plus récente.

### Obtainium

[Obtainium](https://github.com/ImranR98/Obtainium/releases) surveille le dépôt GitHub et peut notifier les nouvelles versions sans compte de magasin d'applications. Ajoutez `https://github.com/InfinityLoop1308/PipePipe` comme source, puis vérifiez le certificat de signature ci-dessous avant d'activer les mises à jour automatiques.

### F-Droid et IzzyOnDroid

[F-Droid](https://f-droid.org/packages/InfinityLoop1309.NewPipeEnhanced/) et [IzzyOnDroid](https://apt.izzysoft.de/fdroid/index/apk/InfinityLoop1309.NewPipeEnhanced) sont des catalogues alternatifs. Leur publication est indépendante de GitHub : une version amont récente peut ne pas y apparaître immédiatement. Pour un correctif urgent connu, comparez la version installée avec GitHub Releases au lieu de supposer le catalogue à jour.

## Vérifier l'APK

Avant toute installation ou mise à jour, vérifiez le certificat de signature de PipePipe. Obtainium accepte la forme hexadécimale comme empreinte de clé autorisée ; AppVerifier peut afficher et comparer la forme avec deux-points.

**SHA-256 (hex) :**

```
dec73429ce2563275f5ed19825e44652b32b363a46f38bdff9ad6dcde4842d88
```

**SHA-256 (avec deux-points) :**

```
DE:C7:34:29:CE:25:63:27:5F:5E:D1:98:25:E4:46:52:B3:2B:36:3A:46:F3:8B:DF:F9:AD:6D:CD:E4:84:2D:88
```

Si Android refuse un APK, vérifiez la version Android, l'ABI et que le téléchargement est complet. N'installez pas un APK provenant d'un miroir non fiable uniquement pour contourner un délai de mise à jour.
