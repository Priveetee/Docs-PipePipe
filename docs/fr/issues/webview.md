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

![Écran Android d'implémentation WebView, Android 16](/screenshots/android-webview-provider-api36.png)

*Capture de référence : Android 16/API 36. Nom et version sont des exemples : relevez ceux de votre appareil.*

L'écran d'erreur de PipePipe donne ces consignes pratiques :

- **Android 6 et Android 10 :** mettez à jour **Android System WebView**.
- **Android 7, 8 et 9 :** mettez à jour **Chrome**, puis sélectionnez-le comme implémentation WebView si Android propose ce choix.
- **Autres versions Android :** l'erreur est inattendue ; signalez-la.

::: info Android orienté vie privée et constructeurs
Certains systèmes proposent un autre fournisseur WebView ; certains appareils n'autorisent que le fournisseur du constructeur. Utilisez un fournisseur maintenu qu'Android accepte pour votre appareil. PipePipe ne peut pas installer, sélectionner ou remplacer un fournisseur WebView système à votre place.
:::

## Ne pas confondre ces échecs

| Ce que vous voyez | Ce que cela établit | Action suivante |
| --- | --- | --- |
| Message exact **WebView indisponible** | PipePipe n'a pas pu utiliser le fournisseur WebView sélectionné. | Suivez cette page et signalez les détails du fournisseur si le problème persiste. |
| `Source error`, buffering ou lecture arrêtée | Ce n'est pas une preuve que WebView est en cause. SABR, le réseau, le compte ou le lecteur peuvent être impliqués. | Mettez PipePipe à jour et joignez le rapport d'erreur généré. |
| `AntiBotException: Sign in to confirm you're not a bot` | Restriction YouTube, réseau ou authentification. | Consultez [Lecture, réseau et connexion](./youtube-playback). |
| La recherche ne renvoie aucun résultat | Problème distinct d'extracteur ou de recherche. | Ouvrez un rapport séparé avec le service, le pays, l'endpoint et l'état du VPN. |

Le fait qu'une autre application fonctionne sur le même appareil ne prouve pas que PipePipe peut retirer ce prérequis. Les applications peuvent utiliser des clients YouTube, endpoints ou chemins de repli différents.

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
