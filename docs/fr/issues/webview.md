# WebView et lecture YouTube

## Commencez ici : vérifiez PipePipe avant de remplacer WebView

Le prérequis WebView a changé après PipePipe 5.2.3. Utilisez la version de
PipePipe installée, pas seulement la version d'Android, pour choisir l'action.

| Version de PipePipe | Ce qu'elle attend | Première action |
| --- | --- | --- |
| **5.2.4-beta ou ultérieure** | Un fournisseur WebView actif qu'Android sait initialiser. La version majeure 80 n'est plus un minimum imposé. | Gardez le fournisseur sélectionné par la ROM. Ne le remplacez pas uniquement parce qu'il est ancien. |
| **5.2.3** | Un fournisseur WebView en version majeure 80 ou ultérieure. | Mettez de préférence PipePipe à jour. Si vous restez sur 5.2.3, suivez les instructions historiques plus bas. |
| Toute version signale l'absence du fournisseur ou un échec d'initialisation | Android ne fournit pas de WebView utilisable à PipePipe. | Vérifiez **Implémentation WebView** et l'état du fournisseur. |

Le message exact ci-dessous appartient à PipePipe 5.2.3 et aux versions plus
anciennes :

> **WebView indisponible. Veuillez vous assurer que la version de votre WebView est supérieure à 80.**

C'est une erreur de compatibilité, pas une demande de connexion à YouTube ni la
preuve que le téléphone est trop ancien. La solution la plus simple est
désormais d'installer
[5.2.4-beta](https://github.com/InfinityLoop1308/PipePipe/releases/tag/v5.2.4-beta)
ou une version ultérieure. Comme 5.2.4-beta est une préversion, créez d'abord
une [sauvegarde](/fr/user-guide/backup-and-restore) et conservez l'ancien APK si
vous dépendez de cet appareil.

![Comment WebView intervient dans la lecture YouTube](/diagrams/webview-playback.png)

## Pourquoi PipePipe vérifie WebView

Certains flux YouTube utilisent SABR, un protocole de livraison basé sur une
session. PipePipe utilise Android WebView localement pour deux tâches
JavaScript : décoder les données du lecteur YouTube avec EJS et exécuter
BotGuard afin d'obtenir les jetons de session et de vidéo. Google Play Services
n'intervient pas dans ce parcours.

PipePipe 5.2.4-beta fournit les ressources EJS en ES5, des polyfills et un pont
BotGuard compatible avec l'ancien JavaScript. Le blocage sur la version 80 et
le test de capacités JavaScript modernes ont été supprimés. PipePipe vérifie
toujours qu'Android expose un fournisseur et que son moteur démarre vraiment ;
un fournisseur absent, désactivé, verrouillé ou cassé peut donc encore échouer.

Trois conséquences importantes :

- Changer d'endpoint YouTube ne remplace pas le moteur WebView local.
- Un ancien fournisseur n'est plus refusé uniquement à cause de son numéro de version.
- Un fournisseur récent peut encore ne pas démarrer. Il faut alors le journal et
  les détails du fournisseur, pas des installations d'APK répétées.

Pour l'explication technique, lisez le [guide SABR](/fr/developer-guide/introduction) et [Attestation](/fr/developer-guide/sabr-attestation).

## Vérifier le fournisseur WebView actif

1. Ouvrez les **Paramètres** Android.
2. Activez les **Options pour les développeurs** si elles ne sont pas visibles.
3. Ouvrez **Implémentation WebView**. Le libellé et l'emplacement varient selon l'appareil.
4. Vérifiez qu'un fournisseur est sélectionné et activé. Notez son nom de paquet et sa version complète.
5. Redémarrez PipePipe après avoir changé ou mis à jour le fournisseur.

Android 6 peut ne pas proposer le sélecteur **Implémentation WebView**. Son
fournisseur est normalement imposé par la ROM ; vérifiez la version
**Android System WebView** dans **Paramètres → Applications** et utilisez
uniquement le parcours de mise à jour pris en charge par la ROM.

![Écran Android d'implémentation WebView, Android 16](/screenshots/android-webview-provider-api36.png)

*Capture de référence : Android 16/API 36. Nom et version sont des exemples : relevez ceux de votre appareil.*

Avec PipePipe 5.2.4-beta ou une version ultérieure, le fournisseur inclus dans
une ancienne ROM peut suffire. Nous avons vérifié une vraie lecture avec les
fournisseurs d'origine d'Android 6, 7 et 8. N'installez pas Chrome uniquement
parce que le téléphone utilise Android 7 à 9.

Dans la configuration Google habituelle, Android 7 à 9 peut exposer Chrome
comme WebView. Une ROM dégooglisée peut proposer un fournisseur autonome. Ce
qui compte est le fournisseur réellement sélectionné par Android, pas la
présence d'un APK Chrome ou WebView sans rapport dans la liste des applications.

::: info Android orienté vie privée et constructeurs
Certains systèmes proposent un autre fournisseur WebView ; certains appareils
n'autorisent que celui du constructeur. Gardez le fournisseur pris en charge
par la ROM lorsqu'il fonctionne. PipePipe ne peut pas installer, sélectionner
ou remplacer un fournisseur WebView système à votre place.
:::

## Ce que nous avons vérifié sur d'anciens Android sans services Google

Nous avons testé l'APK x86_64 publié de PipePipe **5.2.4-beta** sur des images
AOSP propres le 2026-07-20. Elles ne contenaient ni Play Store, ni Google Play
Services, ni Chrome. Nous avons conservé la WebView d'origine de chaque système
et ouvert la même vidéo YouTube publique.

| Système | Fournisseur actif d'origine | Résultat vérifié |
| --- | --- | --- |
| Android 6.0 / API 23 | AOSP `com.android.webview` 44.0.2403.119 | Moteur partagé prêt, décodage EJS et création des jetons réussis, lecture SABR en mouvement vérifiée. |
| Android 7.0 / API 24 | AOSP `com.android.webview` 52.0.2743.100 | Lecture SABR en mouvement vérifiée sans installer Chrome. |
| Android 8.1 / API 27 | AOSP `com.android.webview` 61.0.3163.98 | Fournisseur sélectionné par Android, lecture SABR en mouvement vérifiée. |

Il s'agit de résultats de lecture de bout en bout, pas d'essais arrêtés après le
chargement d'un accueil, d'une miniature ou d'une page vidéo.

<div class="screenshot-callout" role="img" aria-label="Lecture YouTube dans PipePipe 5.2.4-beta sous Android 6 avec la WebView 44 d'origine">
  <img src="/screenshots/pipepipe-playback-5.2.4-beta-android6-webview44.png" alt="Lecture YouTube dans PipePipe 5.2.4-beta sous Android 6 avec WebView 44">
  <svg viewBox="0 0 1080 1920" aria-hidden="true">
    <rect class="callout-box" x="12" y="62" width="1056" height="608" rx="28" />
    <path class="callout-arrow" d="M 920 760 L 990 682 M 950 696 L 990 682 L 980 724" />
    <circle class="callout-number" cx="920" cy="760" r="42" /><text x="920" y="760">1</text>
  </svg>
</div>

*PipePipe 5.2.4-beta · Android 6/API 23 · WebView AOSP 44 d'origine · aucun service Google. **1** surligne une vraie image de la vidéo en mouvement.*

<div class="screenshot-callout" role="img" aria-label="Lecture YouTube dans PipePipe 5.2.4-beta sous Android 7 avec la WebView 52 d'origine">
  <img src="/screenshots/pipepipe-playback-5.2.4-beta-android7-webview52.png" alt="Lecture YouTube dans PipePipe 5.2.4-beta sous Android 7 avec WebView 52">
  <svg viewBox="0 0 1080 1920" aria-hidden="true">
    <rect class="callout-box" x="12" y="72" width="1056" height="608" rx="28" />
    <path class="callout-arrow" d="M 920 770 L 990 692 M 950 706 L 990 692 L 980 734" />
    <circle class="callout-number" cx="920" cy="770" r="42" /><text x="920" y="770">2</text>
  </svg>
</div>

*PipePipe 5.2.4-beta · Android 7/API 24 · WebView AOSP 52 d'origine · aucun Chrome ni service Google. **2** surligne la lecture en mouvement.*

<div class="screenshot-callout" role="img" aria-label="Lecture YouTube dans PipePipe 5.2.4-beta sous Android 8.1 avec la WebView 61 d'origine">
  <img src="/screenshots/pipepipe-playback-5.2.4-beta-android8-webview61.png" alt="Lecture YouTube dans PipePipe 5.2.4-beta sous Android 8.1 avec WebView 61">
  <svg viewBox="0 0 1080 1920" aria-hidden="true">
    <rect class="callout-box" x="12" y="72" width="1056" height="608" rx="28" />
    <path class="callout-arrow" d="M 920 770 L 990 692 M 950 706 L 990 692 L 980 734" />
    <circle class="callout-number" cx="920" cy="770" r="42" /><text x="920" y="770">3</text>
  </svg>
</div>

*PipePipe 5.2.4-beta · Android 8.1/API 27 · WebView AOSP 61 d'origine · aucun Chrome ni service Google. **3** surligne la lecture en mouvement.*

::: details Pourquoi les anciennes captures 5.2.3 exigeaient une mise à jour WebView

Nous avons testé la version x86_64 de PipePipe **5.2.3** sur des images AOSP propres le 2026-07-13. Elles ne contenaient ni Play Store, ni Google Play Services, ni Chrome. La même vidéo YouTube publique a servi pour chaque essai.

| Système | WebView fournie par l'image propre | Résultat | Essai contrôlé complémentaire |
| --- | --- | --- | --- |
| Android 6.0 / API 23 | AOSP `com.android.webview` 44.0.2403.119 | PipePipe s'est installé et l'accueil YouTube a chargé, mais l'ouverture de la vidéo a affiché **WebView indisponible**. | Bromite SystemWebView 106 a été inspecté et déclare l'API 23 comme minimum, mais il n'a pas été activé comme fournisseur de la ROM ; la lecture avec ce remplacement n'a donc pas été validée. |
| Android 7.0 / API 24 | AOSP `com.android.webview` 52.0.2743.100 | L'accueil a chargé ; la lecture a été bloquée par le même message. | Avec Chromium WebView AOSP 119.0.6045.141 intégré comme fournisseur système de confiance, la même vidéo a été lue. Une mise à jour APK normale a été refusée car sa signature ne correspondait pas à celle du fournisseur de la ROM. |
| Android 8.1 / API 27 | AOSP `com.android.webview` 61.0.3163.98 | L'accueil a chargé ; la lecture a été bloquée par le même message. | Avec Mulch WebView 131.0.6778.81 intégré comme fournisseur système de confiance, la même vidéo a été lue. Une installation normale a été refusée pour la même incompatibilité de signature. |

« Intégré comme fournisseur système de confiance » décrit une image de laboratoire jetable modifiée comme lors de la construction d'une ROM. Ce n'est **pas** une recommandation pour remplacer des fichiers sur un vrai appareil. Les essais Android 7 et 8 ont produit des enregistrements avec une lecture en mouvement, pas seulement des métadonnées ou une miniature.

Les deux installations normales ont renvoyé l'erreur Android exacte `INSTALL_FAILED_UPDATE_INCOMPATIBLE`.

Sous Android 6, l'accueil a chargé avant que le même essai échoue à l'ouverture
d'une vidéo. Ces deux écrans séparent l'accès général au réseau et à
l'extracteur de la capacité WebView nécessaire à la lecture.

<div class="screenshot-callout" role="img" aria-label="Accueil YouTube de PipePipe chargé sous Android 6 avant l'ouverture d'une vidéo">
  <img src="/screenshots/pipepipe-home-5.2.3-android6.png" alt="Accueil YouTube de PipePipe sous Android 6">
  <svg viewBox="0 0 320 640" aria-hidden="true">
    <rect class="callout-box" x="8" y="112" width="304" height="510" rx="12" />
    <path class="callout-arrow" d="M 270 70 L 270 106 M 255 90 L 270 106 L 285 90" />
    <circle class="callout-number" cx="292" cy="128" r="22" /><text x="292" y="128">A</text>
  </svg>
</div>

*Capture de référence : PipePipe 5.2.3 · Android 6/API 23 · WebView AOSP 44 d'origine · aucun service Google. **A** montre que l'accueil et les miniatures ont chargé.*

<div class="screenshot-callout" role="img" aria-label="Erreur WebView indisponible de PipePipe après l'ouverture d'une vidéo sous Android 6">
  <img src="/screenshots/pipepipe-webview-unavailable-5.2.3-android6.png" alt="Écran WebView indisponible de PipePipe sous Android 6">
  <svg viewBox="0 0 320 640" aria-hidden="true">
    <rect class="callout-box" x="10" y="286" width="300" height="216" rx="12" />
    <path class="callout-arrow" d="M 280 238 L 280 278 M 264 262 L 280 278 L 296 262" />
    <circle class="callout-number" cx="292" cy="304" r="22" /><text x="292" y="304">B</text>
  </svg>
</div>

*Capture de référence : l'action vidéo a atteint le contrôle WebView de PipePipe puis s'est arrêtée. **B** surligne le prérequis exact, alors que l'accueil montré en **A** avait déjà fonctionné.*

<div class="screenshot-callout" role="img" aria-label="Écran WebView indisponible de PipePipe sous Android 8.1 avec les instructions de compatibilité surlignées">
  <img src="/screenshots/pipepipe-webview-unavailable-5.2.3-android8.png" alt="Écran WebView indisponible de PipePipe sous Android 8.1">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="28" y="640" width="664" height="365" rx="24" />
    <path class="callout-arrow" d="M 620 565 L 620 620 M 598 598 L 620 620 L 642 598" />
    <circle class="callout-number" cx="660" cy="670" r="30" /><text x="660" y="670">1</text>
  </svg>
</div>

*Capture de référence : PipePipe 5.2.3 · Android 8.1/API 27 · WebView AOSP 61 d'origine. **1** est l'erreur de compatibilité exacte ; l'accueil avait bien chargé avant l'ouverture de la vidéo.*

<div class="screenshot-callout" role="img" aria-label="Vidéo YouTube lue dans PipePipe sous Android 7 avec WebView 119 intégrée au système">
  <img src="/screenshots/pipepipe-playback-5.2.3-android7-webview119.png" alt="Lecture YouTube dans PipePipe sous Android 7 avec WebView 119">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="16" y="48" width="688" height="405" rx="20" />
    <path class="callout-arrow" d="M 620 500 L 620 470 M 598 492 L 620 470 L 642 492" />
    <circle class="callout-number" cx="668" cy="420" r="30" /><text x="668" y="420">2</text>
  </svg>
</div>

*Capture de référence : PipePipe 5.2.3 · Android 7/API 24 · WebView AOSP 119 intégrée au système · aucun service Google. **2** surligne une vraie image de la vidéo pendant la lecture.*

<div class="screenshot-callout" role="img" aria-label="Vidéo YouTube lue dans PipePipe sous Android 8.1 avec Mulch WebView 131 intégrée au système">
  <img src="/screenshots/pipepipe-playback-5.2.3-android8-mulch131.png" alt="Lecture YouTube dans PipePipe sous Android 8.1 avec Mulch WebView 131">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="16" y="48" width="688" height="405" rx="20" />
    <path class="callout-arrow" d="M 620 500 L 620 470 M 598 492 L 620 470 L 642 492" />
    <circle class="callout-number" cx="668" cy="420" r="30" /><text x="668" y="420">3</text>
  </svg>
</div>

*Capture de référence : PipePipe 5.2.3 · Android 8.1/API 27 · Mulch WebView 131 intégrée au système · aucun service Google. **3** surligne une vraie image de la vidéo pendant la lecture.*
:::

### Vérification visuelle lorsqu'une erreur persiste

Si 5.2.4-beta ou une version ultérieure signale encore WebView indisponible,
ouvrez **Options pour les développeurs → Implémentation WebView**. Le bouton
sélectionné et la version complète doivent être visibles. Installer un APK ne
suffit pas.

<div class="screenshot-callout" role="img" aria-label="Écran d'implémentation WebView sous Android 8.1 avec la WebView 61 d'origine sélectionnée">
  <img src="/screenshots/android8-webview-provider-61.png" alt="Écran d'implémentation WebView sous Android 8.1 avec Android System WebView 61 sélectionnée">
  <svg viewBox="0 0 1080 1920" aria-hidden="true">
    <rect class="callout-box" x="18" y="240" width="1044" height="218" rx="28" />
    <path class="callout-arrow" d="M 820 555 L 980 460 M 930 462 L 980 460 L 955 505" />
    <circle class="callout-number" cx="820" cy="555" r="42" /><text x="820" y="555">4</text>
  </svg>
</div>

*Android 8.1/API 27 · WebView AOSP 61 d'origine · aucun service Google. **4** surligne le fournisseur sélectionné et sa version complète. La capture Android 8 plus haut vérifie que ce même fournisseur fonctionnait réellement.*

Fermez ensuite complètement PipePipe, rouvrez-le et lancez une vidéo YouTube
publique. Le chargement d'un accueil ou d'une miniature ne teste pas à lui seul
le parcours complet EJS, BotGuard, jetons et SABR.

### Un fournisseur sélectionné peut rester incompatible

Nous avons aussi testé Cromite SystemWebView 138.0.7204.169, car Chrome 138 est
la [dernière famille Chrome compatible avec Android 8 et 9](https://support.google.com/chrome/thread/352616098/sunsetting-chrome-support-for-android-8-0-oreo-and-android-9-0-pie?hl=en-GB).
Son manifeste déclare l'API 26 comme minimum et Android 8.1 l'a bien sélectionné,
mais son initialisation a échoué car `android.webkit.PacProcessor` est absent de
ce système. PipePipe s'est donc retrouvé avec une WebView inutilisable. Cette
version n'est volontairement **pas** présentée ci-dessous comme téléchargement
fonctionnel pour Android 8.

<div class="screenshot-callout" role="img" aria-label="Cromite WebView 138 sélectionnée sous Android 8.1 malgré son incompatibilité à l'exécution">
  <img src="/screenshots/android8-webview-provider-138-incompatible.png" alt="Android 8.1 affichant Android System WebView 138 comme fournisseur sélectionné">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="24" y="158" width="672" height="150" rx="20" />
    <path class="callout-arrow" d="M 610 360 L 654 286 M 620 300 L 654 286 L 650 322" />
    <circle class="callout-number" cx="610" cy="360" r="30" /><text x="610" y="360">6</text>
  </svg>
</div>

*Capture de diagnostic : Android 8.1 a accepté WebView 138 dans la liste. **6** montre pourquoi le bouton sélectionné est une preuve nécessaire, mais pas une garantie de compatibilité.*

<div class="screenshot-callout" role="img" aria-label="Échec du rendu WebView après la sélection de WebView 138 incompatible sous Android 8.1">
  <img src="/screenshots/android8-webview-provider-138-failed.png" alt="Surface de rendu WebView en échec sous Android 8.1 avec WebView 138 incompatible">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="238" y="126" width="244" height="270" rx="24" />
    <path class="callout-arrow" d="M 580 430 L 488 370 M 514 372 L 488 370 L 500 394" />
    <circle class="callout-number" cx="580" cy="430" r="30" /><text x="580" y="430">7</text>
  </svg>
</div>

*Capture de diagnostic : surface de rendu en échec après l'initialisation du fournisseur. **7** n'est pas une page d'erreur propre à PipePipe ; le journal Android identifie la classe système manquante.*

Ces tests établissent trois faits distincts :

1. PipePipe n'a besoin ni de Google Play Services ni de Chrome pour la lecture SABR locale.
2. C'est le code de compatibilité de PipePipe, et non le remplacement du fournisseur, qui a rendu les WebView 44, 52 et 61 utilisables.
3. Android décide toujours quel paquet WebView est approuvé et actif. Installer un APK qui ne devient jamais le fournisseur sélectionné ne change rien. Le projet Chromium décrit l'enregistrement d'un fournisseur comme une tâche d'intégration système dans son [guide d'intégration WebView pour AOSP](https://chromium.googlesource.com/chromium/src/+/HEAD/android_webview/docs/aosp-system-integration.md).

::: warning La compatibilité de lecture n'est pas une mise à jour de sécurité
Les fournisseurs d'origine testés ci-dessus sont anciens et ne reçoivent plus
les correctifs de sécurité Chromium. Le fait que PipePipe rende son JavaScript
local compatible ne sécurise pas WebView pour la navigation courante ou les
contenus non fiables. Préférez une ROM maintenue et son canal de mise à jour
pris en charge lorsqu'il existe.
:::

::: details Artefacts historiques de PipePipe 5.2.3 pour les mainteneurs de ROM
Cette section documente les essais contrôlés de PipePipe 5.2.3. Elle n'est pas
nécessaire avec 5.2.4-beta ou une version ultérieure. Ces liens sont épinglés
sur les versions ou commits archivés examinés ici. Ce ne
sont **pas** des mises à jour universelles en un clic. Sur les images AOSP
propres, l'installation normale des paquets testés sous Android 7, Android 8 et
de Cromite a été refusée avec `INSTALL_FAILED_UPDATE_INCOMPATIBLE`, car leur
signature ne correspondait pas à celle du fournisseur de la ROM. Utilisez
uniquement un artefact et une procédure de signature ou de mise à jour pris en
charge explicitement par votre ROM.

- **Android 6 / API 23, inspecté mais lecture non testée :** Bromite
  SystemWebView 106.0.5249.163 pour
  [ARM](https://github.com/bromite/bromite/releases/download/106.0.5249.163/arm_SystemWebView.apk),
  [ARM64](https://github.com/bromite/bromite/releases/download/106.0.5249.163/arm64_SystemWebView.apk),
  [x86](https://github.com/bromite/bromite/releases/download/106.0.5249.163/x86_SystemWebView.apk) ou
  [x86_64](https://github.com/bromite/bromite/releases/download/106.0.5249.163/x64_SystemWebView.apk).
  Consultez la [page de la version](https://github.com/bromite/bromite/releases/tag/106.0.5249.163)
  et les [sommes de contrôle officielles](https://github.com/bromite/bromite/releases/download/106.0.5249.163/brm_106.0.5249.163.sha256.txt).
  Son paquet est `org.bromite.webview` ; la ROM doit autoriser et approuver ce
  fournisseur. Bromite est archivé et cette version n'est plus sûre.
- **Android 7 / API 24, lecture testée :** AOSP Chromium WebView
  119.0.6045.141 pour
  [ARM](https://android.googlesource.com/platform/external/chromium-webview/+archive/aca588a17000289da9b228d94cc82bd751f91f85/prebuilt/arm.tar.gz),
  [ARM64](https://android.googlesource.com/platform/external/chromium-webview/+archive/aca588a17000289da9b228d94cc82bd751f91f85/prebuilt/arm64.tar.gz),
  [x86](https://android.googlesource.com/platform/external/chromium-webview/+archive/aca588a17000289da9b228d94cc82bd751f91f85/prebuilt/x86.tar.gz) ou
  [x86_64](https://android.googlesource.com/platform/external/chromium-webview/+archive/aca588a17000289da9b228d94cc82bd751f91f85/prebuilt/x86_64.tar.gz).
  Chaque archive AOSP officielle contient `webview.apk` ; le
  [commit d'intégration](https://android.googlesource.com/platform/external/chromium-webview/+/aca588a17000289da9b228d94cc82bd751f91f85)
  indique `sdkVersion=24` et toutes les métadonnées du paquet.
- **Android 8/9 / API 26 à 28, lecture testée sur l'API 27 :** Mulch WebView
  131.0.6778.200 pour ARM/ARM64 et 131.0.6778.81 pour x86/x86_64 :
  [ARM](https://gitlab.com/divested-mobile/mulch/-/raw/c4c5b73fa5a599fbc61568c5ce0d2cc6d33ad4f2/prebuilt/arm/webview.apk?inline=false),
  [ARM64](https://gitlab.com/divested-mobile/mulch/-/raw/c4c5b73fa5a599fbc61568c5ce0d2cc6d33ad4f2/prebuilt/arm64/webview.apk?inline=false),
  [x86](https://gitlab.com/divested-mobile/mulch/-/raw/c4c5b73fa5a599fbc61568c5ce0d2cc6d33ad4f2/prebuilt/x86/webview.apk?inline=false) ou
  [x86_64](https://gitlab.com/divested-mobile/mulch/-/raw/c4c5b73fa5a599fbc61568c5ce0d2cc6d33ad4f2/prebuilt/x86_64/webview.apk?inline=false).
  Le [commit Mulch épinglé](https://gitlab.com/divested-mobile/mulch/-/tree/c4c5b73fa5a599fbc61568c5ce0d2cc6d33ad4f2)
  est archivé et destiné explicitement à l'intégration dans un OS, pas à une
  installation APK ordinaire.

Pour identifier l'architecture de l'OS, utilisez
`adb shell getprop ro.product.cpu.abi`. `armeabi-v7a` correspond à ARM,
`arm64-v8a` à ARM64, et les deux choix x86 concernent surtout des appareils
atypiques et les environnements Android virtualisés. Un processeur 64 bits peut
faire tourner un Android 32 bits ; utilisez donc l'ABI signalée par l'OS.
:::

Si un autre fournisseur s'installe mais n'apparaît pas dans **Implémentation WebView**, il n'est pas actif. Le réinstaller ne modifiera ni la liste des fournisseurs autorisés ni la politique de signature de la ROM. Indiquez la version Android, la ROM, le paquet et la version installés, le fournisseur actif et le résultat exact de l'installation.

::: details Android 8 rooté : ce que root peut corriger, et ses limites
Sur une image de test Android 8.0/API 26 rootée, nous avons reproduit exactement
le cas où le paquet Mulch s'installe correctement sans apparaître dans
**Implémentation WebView**. Android connaissait l'APK, mais son service WebView ne
considérait pas `us.spotco.mulch_wv` comme un fournisseur autorisé.

Un overlay de ressources du framework ajoutant le paquet Mulch et son certificat
de signature officiel a changé ce résultat. Après redémarrage, Android affichait
Mulch et `dumpsys webviewupdate` le déclarait à la fois valide et actif. Des
versions x86 correctement empaquetées de Mulch 119 et 131 ont ensuite affiché une
vraie page HTTPS sur l'API 26. Nous avons aussi vérifié que le certificat autorisé
par l'overlay correspond exactement aux APK Mulch ARM et ARM64 officiels.

Cela valide le mécanisme d'enregistrement du fournisseur, pas chaque téléphone
rooté. L'émulateur Android de cet hôte x86_64 ne peut pas démarrer l'image ARM64 ;
la combinaison Sony/ARM exacte n'a donc pas été exécutée ici. PipePipe 5.2.3 a
initialisé sa WebView partagée sur l'API 26, mais l'extraction du flux YouTube
testé n'a pas abouti : ce test n'est **pas** présenté comme une lecture réussie
sur l'API 26. Le résultat de lecture complet sur l'API 27 documenté plus haut
reste le test de bout en bout vérifié.

Récupérez ces diagnostics en lecture seule avant de modifier le système :

```sh
adb shell getprop ro.product.cpu.abi
adb shell pm path us.spotco.mulch_wv
adb shell dumpsys webviewupdate
```

- Un chemin Mulch sous `/data/app/` sans entrée `us.spotco.mulch_wv` dans
  **WebView packages** reproduit le blocage de la liste des fournisseurs.
- `Valid package us.spotco.mulch_wv` avec le même **Current WebView package**
  prouve qu'Android l'a accepté et sélectionné.
- Un fournisseur valide et actif suivi d'un échec PipePipe exige le log de
  l'application ; la sélection seule ne prouve ni le JavaScript ni la lecture.

[Open WebView](https://github.com/Magisk-Modules-Alt-Repo/open_webview) est une
implémentation de référence de l'overlay Magisk requis et annonce la prise en
charge des API 26 et 27. Considérez-le comme une référence pour utilisateurs
expérimentés, pas comme une mise à jour courante : sa dernière version est la
[2.5.2 du 16 décembre 2024](https://github.com/Magisk-Modules-Alt-Repo/open_webview/releases/tag/v2.5.2),
le module ne met pas automatiquement le fournisseur à jour, et Mulch est
archivé. Sauvegardez entièrement l'état de démarrage et du système, puis suivez
la procédure de récupération propre à la ROM ; un remplacement générique peut
supprimer toute WebView fonctionnelle ou empêcher le démarrage.
:::

## Ne pas confondre ces échecs

| Ce que vous voyez | Ce que cela établit | Action suivante |
| --- | --- | --- |
| Message exact exigeant une version **supérieure à 80** | L'appareil utilise PipePipe 5.2.3 ou une version antérieure avec l'ancien blocage par version. | Mettez PipePipe à jour avant de remplacer le fournisseur système. |
| **Aucun fournisseur Android WebView n'est disponible** ou échec d'initialisation du moteur avec 5.2.4-beta+ | Android n'a exposé aucun fournisseur, ou le fournisseur sélectionné n'a pas pu démarrer. | Vérifiez **Implémentation WebView**, puis signalez les détails du fournisseur et le journal. |
| `Source error`, buffering ou lecture arrêtée | Ce n'est pas une preuve que WebView est en cause. SABR, le réseau, le compte ou le lecteur peuvent être impliqués. | Mettez PipePipe à jour et joignez le rapport d'erreur généré. |
| `AntiBotException: Sign in to confirm you're not a bot` | Restriction YouTube, réseau ou authentification. | Consultez [Lecture, réseau et connexion](./youtube-playback). |
| La recherche ne renvoie aucun résultat | Problème distinct d'extracteur ou de recherche. | Ouvrez un rapport séparé avec le service, le pays, l'endpoint et l'état du VPN. |

Le fait qu'une autre application fonctionne sur le même appareil ne prouve pas
que le fournisseur WebView sélectionné par Android fonctionne. Les applications
peuvent utiliser d'autres clients YouTube, endpoints ou services distants.
PipePipe 5.2.4-beta exécute toujours EJS et l'attestation localement, mais adapte
désormais ce JavaScript aux anciens fournisseurs.

## Si 5.2.4-beta ou une version ultérieure rejette encore WebView

1. Confirmez la version de PipePipe installée. L'ancien message exigeant la
   version 80 signifie que l'application n'a pas encore été mise à jour.
2. Confirmez à nouveau le fournisseur actif dans **Implémentation WebView** ; installer Chrome ou Android System WebView ne suffit pas si Android ne l'a pas sélectionné.
3. Si le fournisseur est verrouillé par le constructeur ou ne peut pas être changé, ne supposez pas qu'un fournisseur téléchargé arbitrairement est compatible. Gardez un chemin de mise à jour système/WebView pris en charge et maintenu.
4. Envoyez un rapport de bug avec les informations ci-dessous.

L'âge du fournisseur ne suffit plus à décider. PipePipe a besoin du journal pour
distinguer un fournisseur absent, un échec d'initialisation du moteur et une
erreur YouTube/SABR plus tardive.

## Contenu d'un rapport de bug

Ouvrez un **rapport de bug**, pas une demande de fonctionnalité, et ajoutez :

- version de PipePipe et source d'installation ;
- version Android et modèle de l'appareil ;
- nom de paquet et version complète du fournisseur WebView ;
- endpoint d'extraction YouTube sélectionné ;
- état de connexion YouTube, pays réseau et état VPN/proxy ;
- une URL concernée et l'heure du test ;
- le rapport d'erreur ou crash log généré par PipePipe ;
- une capture de **l'implémentation WebView** si le fournisseur est indisponible ou verrouillé.

Gardez les symptômes sans rapport, notamment les problèmes de recherche, dans une issue séparée. Les deux rapports demandent des éléments différents et leurs causes peuvent être indépendantes.
