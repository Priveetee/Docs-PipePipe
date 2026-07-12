# Lecture YouTube, réseau et connexion

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
Moment de l'échec (début / temps / seek / qualité / retour app) :
Message visible et rapport généré :
Retest d'une seule variable et résultat :
```

## Ne pas confondre avec WebView

Le message exact **WebView indisponible** a son [guide dédié](./webview). Une WebView récente n'exclut pas un problème réseau ou SABR, et un `Source error` ne prouve pas qu'il faut mettre WebView à jour.
