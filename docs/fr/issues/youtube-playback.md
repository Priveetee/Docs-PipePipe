# Lecture YouTube, réseau et connexion

## Toutes les vidéos YouTube échouent : vérifiez le filtrage DNS

Si toutes les vidéos YouTube publiques échouent presque immédiatement, consultez
le rapport généré par PipePipe avant de changer l'endpoint d'extraction, de
réinstaller l'application ou de mettre WebView à jour.

### Étape 1 : confirmer la signature DNS

Si PipePipe affiche **Network error**, appuyez sur **REPORT** :

<div class="screenshot-callout" role="img" aria-label="Bouton Report surligné sur l'écran Network error de PipePipe">
  <img src="/screenshots/pipepipe-network-error-5.2.4-api36.png" alt="Écran Network error de PipePipe avec les boutons Report et Retry">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="395" y="990" width="320" height="205" rx="28" />
    <path class="callout-arrow" d="M 810 920 C 780 955, 740 1005, 690 1050" />
    <circle class="callout-number" cx="830" cy="900" r="42" /><text x="830" y="900">1</text>
  </svg>
</div>

Sur la page **Error report**, utilisez l'icône de partage pour copier le texte
généré dans une note locale, puis effectuez la recherche dans ce texte :

<div class="screenshot-callout" role="img" aria-label="Bouton de partage surligné sur l'écran Error report de PipePipe">
  <img src="/screenshots/pipepipe-error-report-5.2.4-api36.png" alt="Écran Error report de PipePipe avec le bouton de partage">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="935" y="55" width="135" height="165" rx="24" />
    <path class="callout-arrow" d="M 880 285 C 915 250, 950 210, 985 170" />
    <circle class="callout-number" cx="850" cy="310" r="42" /><text x="850" y="310">2</text>
  </svg>
</div>

*Ces écrans montrent PipePipe 5.2.4 sur Android 16. L'échec réseau contrôlé sert
uniquement à repérer les boutons ; utilisez le texte de votre propre rapport
pour le diagnostic.*

Recherchez `googleapis.com` et `google.com` dans le rapport. Les formes suivantes
indiquent un blocage DNS ou réseau local :

```text
jnn-pa.googleapis.com/0.0.0.0:443
jnn-pa.googleapis.com/127.0.0.1:443
localhost/127.0.0.1:...
```

::: warning La requête n'a jamais atteint Google
`0.0.0.0`, `127.0.0.1` et `localhost` renvoient vers l'appareil au lieu du vrai
service. PipePipe ne peut pas contourner cette redirection en changeant
d'endpoint.
:::

![Comment le filtrage DNS bloque la lecture YouTube](/diagrams/dns-filtering.png)

### Étape 2 : trouver le filtre responsable

Vérifiez chaque couche séparément :

1. **DNS privé Android :** ouvrez **Paramètres → Réseau et Internet → DNS
   privé**. Sur Samsung, le chemin habituel est **Paramètres → Connexions →
   Plus de paramètres de connexion → DNS privé**. Notez le fournisseur choisi,
   puis consultez son tableau de bord ou son journal de requêtes.
2. **VPN ou filtre local :** consultez le journal des requêtes bloquées du VPN,
   du bloqueur de publicités, du pare-feu ou de l'application DNS pendant une
   nouvelle tentative.
3. **Routeur ou DNS auto-hébergé :** vérifiez le journal et la liste
   d'autorisation du routeur, de Pi-hole, d'AdGuard Home, de NextDNS ou du
   service équivalent.
4. **Appareil rooté ou ROM custom :** vérifiez si le fichier hosts redirige un
   domaine requis vers `0.0.0.0` ou `127.0.0.1`.

<div class="screenshot-callout" role="img" aria-label="Ligne DNS privé surlignée dans les paramètres Réseau et Internet Android">
  <img src="/screenshots/android-network-private-dns-api36.png" alt="Paramètres Réseau et Internet Android avec la ligne DNS privé">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="35" y="1700" width="1010" height="225" rx="28" />
    <path class="callout-arrow" d="M 970 1640 C 925 1670, 900 1710, 865 1760" />
    <circle class="callout-number" cx="985" cy="1620" r="42" /><text x="985" y="1620">3</text>
  </svg>
</div>

**3.** Ouvrez **DNS privé**. Cette page permet aussi de voir si un VPN est
actif.

<div class="screenshot-callout" role="img" aria-label="Fenêtre du mode DNS privé Android surlignée">
  <img src="/screenshots/android-private-dns-api36.png" alt="Fenêtre du mode DNS privé Android">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="105" y="805" width="860" height="410" rx="28" />
    <path class="callout-arrow" d="M 965 705 C 920 730, 900 775, 865 835" />
    <circle class="callout-number" cx="980" cy="690" r="42" /><text x="980" y="690">4</text>
  </svg>
</div>

**4.** Notez le mode ou le fournisseur actif. Si un nom d'hôte fournisseur est
sélectionné, ouvrez le tableau de bord et le journal de requêtes de ce service.
Le mode **Automatic** n'exclut pas un filtre sur le routeur ou ailleurs sur le
réseau.

*Les captures montrent Android 16 en anglais. Le nom et le chemin peuvent varier
selon le constructeur.*

### Étape 3 : autoriser les familles de domaines requises

PipePipe a actuellement besoin de :

- `googleapis.com` et tous ses sous-domaines, dont
  `jnn-pa.googleapis.com` et `youtubei.googleapis.com` ;
- `google.com` et tous ses sous-domaines.

Ajoutez les deux familles à la liste d'autorisation du composant trouvé à
l'étape 2. La syntaxe dépend de l'outil : domaine de base, wildcard comme
`*.googleapis.com` ou règle propre au service. Configurez cette liste au lieu de
désactiver durablement tout filtrage. N'autoriser que le nom visible aujourd'hui
ne garantit pas qu'un autre hôte utilisé plus tard par YouTube fonctionnera.

::: info Pourquoi PipePipe a besoin de ces adresses
Le client actuel contacte `jnn-pa.googleapis.com` pour préparer la preuve
nécessaire à la lecture protégée, tandis que l'extracteur utilise
`youtubei.googleapis.com` pour demander les informations YouTube. Si le DNS
renvoie l'une de ces adresses vers le téléphone, l'échange s'arrête avant la
lecture. Cela ne nécessite **aucun service Google Play**.
:::

### Étape 4 : se reconnecter et vérifier le correctif

1. Reconnectez le Wi-Fi ou activez brièvement le mode avion pour éliminer les
   anciens résultats DNS.
2. Forcez l'arrêt de PipePipe, puis rouvrez l'application.
3. Relancez la même vidéo publique.
4. Générez un nouveau rapport et vérifiez que le domaine requis ne pointe plus
   vers `0.0.0.0`, `127.0.0.1` ou `localhost`.

Un test temporaire en données mobiles ou sur un autre réseau non filtré peut
confirmer le diagnostic. Il ne s'agit pas de laisser la protection désactivée.

L'avertissement épinglé [#2757](https://github.com/InfinityLoop1308/PipePipe/issues/2757)
documente les familles de domaines requises. Dans
[#2712](https://github.com/InfinityLoop1308/PipePipe/issues/2712), la lecture a
été rétablie après l'autorisation de `jnn-pa.googleapis.com`.
[#2750](https://github.com/InfinityLoop1308/PipePipe/issues/2750) contient la
même signature `0.0.0.0`/localhost.

### Si le rapport montre une vraie adresse publique

Une erreur `ENETUNREACH`, un délai dépassé ou un échec de connexion vers une
vraie adresse IP est un autre cas : le DNS n'a pas redirigé le domaine
localement. Continuez avec le test réseau contrôlé ci-dessous et notez le VPN,
le FAI, le pays, l'endpoint et l'erreur exacte au lieu d'ajouter des exceptions
DNS sans rapport.

## `AntiBotException`

`Sign in to confirm you're not a bot` signifie que YouTube restreint une requête anonyme. Ce n'est pas une demande générique de vider le cache ou de mettre à jour WebView. Réessayez une fois, puis testez un autre réseau ou une autre sortie VPN. Notez l'endpoint d'extraction YouTube sélectionné avant de le signaler.

Utilisez la même vidéo publique à chaque essai. Notez pays/sortie réseau et si l'échec est immédiat ou arrive après quelques streams. Un résultat qui change seulement avec le réseau est une information utile ; ne publiez ni IP ni données de compte.

## `Source error` ou buffering

Ces messages n'identifient pas une cause unique. Mettez PipePipe à jour, joignez le rapport d'erreur généré et indiquez l'URL, l'endpoint, l'état de connexion, le pays et l'état VPN/proxy. Précisez si l'échec arrive au démarrage, après une durée fixe, au changement de qualité, au retour dans l'app ou après un seek.

Web et MWeb utilisent SABR pour la lecture YouTube anonyme. Essayer un autre endpoint peut être une étape de diagnostic temporaire ; cela ne prouve pas que l'endpoint initial ou WebView est responsable.

### Test de lecture contrôlé

1. Commencez avec une vidéo publique et notez l'endpoint.
2. Testez une fois sur le réseau normal sans changer plusieurs réglages.
3. En cas d'échec, répétez une fois avec la même vidéo et notez temps/position.
4. Si nécessaire, ne changez qu'une variable — réseau/sortie VPN, endpoint ou connexion — et retestez la même vidéo.
5. Joignez le rapport généré et les deux résultats.

Cela sépare un échec d'extraction répétable d'un incident réseau/session isolé et évite d'affirmer que cinq changements ont été le correctif.

## Lecture connectée

La connexion est surtout utile en cas de blocage IP, de contenu restreint par âge, de contenu réservé aux membres ou de traduction automatique YouTube. Ses limites actuelles incluent les formats vidéo AVC, l'absence de téléchargement audio seul, l'absence de retour en arrière dans un live déjà commencé et une extraction moins prévisible. Si l'échec commence après connexion, testez une fois déconnecté et signalez les deux résultats.

Ne publiez ni cookies, ni jetons, ni e-mail de compte, ni capture du flux de connexion. « connecté/déconnecté » et l'erreur visible suffisent au premier rapport.

## L'endpoint est une information, pas un bouton magique

Un endpoint choisit un chemin de requête/extraction. Il peut faire apparaître ou disparaître un symptôme et doit être noté, mais un endpoint qui réussit une fois ne prouve pas que tous les autres sont cassés. Donnez l'endpoint par défaut, ceux testés et le résultat pour la même URL. Gardez les essais d'endpoint hors d'une issue WebView sauf si le message WebView exact est aussi présent.

<div class="screenshot-callout" role="img" aria-label="Sélecteur d'endpoint YouTube avec MWEB et Android VR surlignés">
  <img src="/screenshots/pipepipe-endpoint-picker-5.2.3-api36.png" alt="Sélecteur d'endpoint d'extraction YouTube">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="70" y="995" width="940" height="125" rx="24" />
    <circle class="callout-number" cx="965" cy="1025" r="42" /><text x="965" y="1025">1</text>
    <rect class="callout-box" x="70" y="1260" width="940" height="125" rx="24" />
    <circle class="callout-number" cx="965" cy="1290" r="42" /><text x="965" y="1290">2</text>
  </svg>
</div>

L'issue résolue [#2686](https://github.com/InfinityLoop1308/PipePipe/issues/2686)
est un exemple concret : pour un blocage IP signalé, le mainteneur a demandé si
**Android VR (DASH)** était choisi et conseillé de tester PipePipe 5.2.3 avec
**MWEB (SABR)**. Dans la capture, **1** est MWEB et **2** Android VR. C'est une comparaison contrôlée, pas la promesse que MWEB
résout chaque problème de réseau ou de compte.

## Rapport minimal de lecture

```text
URL vidéo et service :
Version PipePipe / Android :
Endpoint avant et pendant l'échec :
Connecté ou déconnecté :
Pays réseau / VPN ou proxy :
DNS privé / bloqueur / pare-feu et domaine bloqué, le cas échéant :
Moment de l'échec (début / temps / seek / qualité / retour app) :
Message visible et rapport généré :
Retest d'une seule variable et résultat :
```

## Ne pas confondre avec WebView

Le message exact **WebView indisponible** a son [guide dédié](./webview). Une WebView récente n'exclut pas un problème réseau ou SABR, et un `Source error` ne prouve pas qu'il faut mettre WebView à jour.
