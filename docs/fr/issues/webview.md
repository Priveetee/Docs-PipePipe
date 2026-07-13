# WebView et lecture YouTube

## Quand suivre ce guide

Suivez ce guide lorsque PipePipe affiche le message suivant au chargement d'une vidéo YouTube :

> **WebView indisponible. Veuillez vous assurer que la version de votre WebView est supérieure à 80.**

C'est une erreur de compatibilité. Ce n'est ni une demande de connexion à YouTube, ni la preuve que le téléphone est forcément trop ancien.

![Comment WebView intervient dans la lecture YouTube](/diagrams/webview-playback.png)

## Pourquoi PipePipe vérifie WebView

Certains flux YouTube utilisent SABR, un protocole de livraison basé sur une session. Lorsque YouTube protège un flux, le client doit obtenir un jeton Proof of Origin (PO) de courte durée avant que YouTube ne renvoie plus de média. PipePipe exécute le challenge BotGuard de YouTube dans Android WebView pour obtenir ce jeton.

Le client PipePipe actuel vérifie aussi que WebView est utilisable avant de commencer l'extraction d'un flux YouTube. Il vérifie qu'Android a sélectionné un fournisseur, que ce fournisseur s'initialise et qu'il sait exécuter les fonctionnalités JavaScript nécessaires au challenge. L'indication « version 80 » du message est donc un seuil pratique, pas la seule cause possible de l'erreur.

Deux conséquences importantes :

- Web et MWeb sont les endpoints qui utilisent SABR, mais changer d'endpoint ne contourne pas le contrôle de disponibilité WebView de PipePipe.
- Une WebView récente peut tout de même échouer si son fournisseur est désactivé, ne démarre pas ou échoue au contrôle des capacités JavaScript. Il faut alors un rapport de bug, pas des mises à jour WebView répétées sans diagnostic.

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

L'écran d'erreur de PipePipe donne ces consignes pratiques :

- **Android 6 et Android 10 :** mettez à jour **Android System WebView**.
- **Android 7, 8 et 9 :** mettez à jour **Chrome**, puis sélectionnez-le comme implémentation WebView si Android propose ce choix.
- **Autres versions Android :** l'erreur est inattendue ; signalez-la.

Ces noms correspondent à la configuration Android Google habituelle. Sur une ROM dégooglisée, le fournisseur actif peut être la WebView autonome de la ROM. Mettez à jour le fournisseur qu'Android accepte et sélectionne réellement ; installer Chrome n'est ni nécessaire ni utile si la ROM ne le reconnaît pas comme fournisseur WebView.

::: info Android orienté vie privée et constructeurs
Certains systèmes proposent un autre fournisseur WebView ; certains appareils n'autorisent que le fournisseur du constructeur. Utilisez un fournisseur maintenu qu'Android accepte pour votre appareil. PipePipe ne peut pas installer, sélectionner ou remplacer un fournisseur WebView système à votre place.
:::

## Ce que nous avons vérifié sur d'anciens Android sans services Google

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

### Vérification visuelle sur un ancien Android

Après l'installation ou la mise à jour du fournisseur de confiance par la ROM,
ouvrez **Options pour les développeurs → Implémentation WebView**. Le bouton de
sélection et la version complète doivent être visibles. La simple installation
d'un APK ne suffit pas.

<div class="screenshot-callout" role="img" aria-label="Écran d'implémentation WebView sous Android 8.1 avec WebView 131 sélectionnée">
  <img src="/screenshots/android8-webview-provider-131.png" alt="Écran d'implémentation WebView sous Android 8.1 avec Android System WebView 131 sélectionnée">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="24" y="158" width="672" height="150" rx="20" />
    <path class="callout-arrow" d="M 610 360 L 654 286 M 620 300 L 654 286 L 650 322" />
    <circle class="callout-number" cx="610" cy="360" r="30" /><text x="610" y="360">4</text>
  </svg>
</div>

*Capture du tutoriel : Android 8.1/API 27 · Mulch WebView 131 intégrée par la ROM de laboratoire · aucun service Google. **4** surligne le fournisseur sélectionné et sa version.*

Fermez ensuite complètement PipePipe, rouvrez-le et lancez une vidéo YouTube
publique. Le chargement de l'accueil ou d'une miniature ne teste pas à lui seul
le parcours SABR/WebView.

<div class="screenshot-callout" role="img" aria-label="Vidéo YouTube en direct lue dans PipePipe sous Android 8.1 après la sélection de WebView 131">
  <img src="/screenshots/pipepipe-playback-5.2.3-android8-webview131-tutorial.png" alt="Lecture YouTube en direct dans PipePipe sous Android 8.1 avec WebView 131">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="16" y="48" width="688" height="405" rx="20" />
    <path class="callout-arrow" d="M 620 500 L 620 470 M 598 492 L 620 470 L 642 492" />
    <circle class="callout-number" cx="668" cy="420" r="30" /><text x="668" y="420">5</text>
  </svg>
</div>

*Capture du tutoriel : PipePipe 5.2.3 · Android 8.1/API 27 · Mulch WebView 131 · aucun service Google. **5** surligne la zone de lecture ; un enregistrement de sept secondes a confirmé que les images changeaient.*

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

1. PipePipe n'a pas besoin de Google Play Services pour la lecture SABR elle-même.
2. La version Android minimale permettant d'installer PipePipe ne garantit pas que la WebView fournie puisse exécuter le JavaScript YouTube actuel.
3. Sur un ancien Android, installer l'APK d'une autre WebView ne suffit souvent pas. Android ne liste que les fournisseurs autorisés par la configuration et la politique de signature de la ROM. Le projet Chromium décrit ce travail destiné aux intégrateurs système dans son [guide d'intégration WebView pour AOSP](https://chromium.googlesource.com/chromium/src/+/HEAD/android_webview/docs/aosp-system-integration.md).

::: warning Une ancienne WebView n'est pas une solution sûre à long terme
Les versions 119 et 131 ci-dessus étaient des sondes de compatibilité contrôlées, pas des recommandations de mise à jour. Elles ne reçoivent plus les correctifs de sécurité Chromium actuels. Préférez une ROM maintenue et son canal de mise à jour pris en charge. Si la ROM ne peut fournir aucune WebView maintenue et sélectionnable, un appareil ou OS maintenu, ou une autre architecture de client, est plus sûr que de forcer un APK archivé dans le système.
:::

::: details Téléchargements directs pour les mainteneurs de ROM et les tests reproductibles
Ces liens sont épinglés sur les versions ou commits archivés examinés ici. Ce ne
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
  131.0.6778.81 pour
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

## Ne pas confondre ces échecs

| Ce que vous voyez | Ce que cela établit | Action suivante |
| --- | --- | --- |
| Message exact **WebView indisponible** | PipePipe n'a pas pu utiliser le fournisseur WebView sélectionné. | Suivez cette page et signalez les détails du fournisseur si le problème persiste. |
| `Source error`, buffering ou lecture arrêtée | Ce n'est pas une preuve que WebView est en cause. SABR, le réseau, le compte ou le lecteur peuvent être impliqués. | Mettez PipePipe à jour et joignez le rapport d'erreur généré. |
| `AntiBotException: Sign in to confirm you're not a bot` | Restriction YouTube, réseau ou authentification. | Consultez [Lecture, réseau et connexion](./youtube-playback). |
| La recherche ne renvoie aucun résultat | Problème distinct d'extracteur ou de recherche. | Ouvrez un rapport séparé avec le service, le pays, l'endpoint et l'état du VPN. |

Le fait qu'une autre application fonctionne sur le même appareil ne prouve pas que PipePipe peut retirer ce prérequis. Les applications peuvent utiliser des clients YouTube, endpoints ou chemins de repli différents. Un client adossé à un service d'extraction distant peut aussi déplacer le JavaScript et l'attestation hors du téléphone ; c'est une autre architecture, pas la preuve que la WebView locale est utilisable.

## Si WebView est récente mais rejetée par PipePipe

1. Mettez PipePipe à jour vers la dernière version stable, puis redémarrez Android et PipePipe.
2. Confirmez à nouveau le fournisseur actif dans **Implémentation WebView** ; installer Chrome ou Android System WebView ne suffit pas si Android ne l'a pas sélectionné.
3. Si le fournisseur est verrouillé par le constructeur ou ne peut pas être changé, ne supposez pas qu'un fournisseur téléchargé arbitrairement est compatible. Gardez un chemin de mise à jour système/WebView pris en charge et maintenu.
4. Envoyez un rapport de bug avec les informations ci-dessous.

Ce point vaut même sur une version Android récente. Un fournisseur actuel peut échouer à l'initialisation, et PipePipe a besoin du log pour distinguer un problème de l'application d'un fournisseur trop ancien ou incompatible.

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
