# Référence des réglages

Cette référence visuelle complète les pages [Lecteur](./settings-player) et
[Comportement](./settings-behavior). Les captures sont des exemples, pas la
promesse que vos écrans seront identiques. Les libellés peuvent changer ;
utilisez la recherche des réglages si besoin.

## Lecteur et gestes

L'écran Lecteur rassemble qualité, formats, action d'ouverture, changement
d'application, autoplay et file. L'écran Gestes règle séparément les interactions
du lecteur.

<div class="screenshot-callout" role="img" aria-label="Réglages Lecteur avec action d'ouverture préférée et minimisation surlignées">
  <img src="/screenshots/pipepipe-player-5.3.1-beta-api36.png" alt="Réglages Lecteur sur Android 16">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="25" y="1420" width="1030" height="180" rx="28" />
    <path class="callout-arrow" d="M 850 1330 L 850 1400 M 825 1375 L 850 1400 L 875 1375" />
    <circle class="callout-number" cx="990" cy="1450" r="42" /><text x="990" y="1450">1</text>
    <rect class="callout-box" x="25" y="1620" width="1030" height="230" rx="28" />
    <path class="callout-arrow" d="M 850 1535 L 850 1600 M 825 1575 L 850 1600 L 875 1575" />
    <circle class="callout-number" cx="990" cy="1650" r="42" /><text x="990" y="1650">2</text>
  </svg>
</div>

*Capture de référence : Android 16/API 36. **1** concerne les liens externes transmis à PipePipe ; **2** contrôle la sortie du lecteur principal vers une autre app.*

![Réglages Gestes](/screenshots/pipepipe-gestures-5.2.3-api36.png)

## Apparence, contenu et feed

Apparence modifie thème, grille et onglets. Contenu modifie les éléments montrés
pour vidéos et chaînes. Feed règle l'expérience des contenus suivis. Ce sont des
réglages de présentation : ils ne réparent pas un échec d'extracteur ou de lecture.

![Réglages Apparence](/screenshots/pipepipe-appearance-5.2.3-api36.png)

![Réglages Contenu](/screenshots/pipepipe-content-5.2.3-api36.png)

![Réglages Feed](/screenshots/pipepipe-feed-5.2.3-api36.png)

## Données locales et filtrage

Historique/cache, filtres et SponsorBlock agissent sur des données ou surfaces
différentes. Pour diagnostiquer un résultat inattendu, ne changez qu'une catégorie
à la fois.

![Réglages Historique et cache](/screenshots/pipepipe-history-cache-5.2.3-api36.png)

![Réglages Filtre de contenu](/screenshots/pipepipe-content-filter-5.2.3-api36.png)

![Réglages SponsorBlock](/screenshots/pipepipe-sponsorblock-5.2.3-api36.png)

## Avancé

Avancé contient des contrôles de compatibilité proches du lecteur. Ne basculez
pas plusieurs options ensemble : notez la valeur initiale, changez-en une seule
et retestez la même vidéo. Pour les contournements décodeur/surface, consultez
[Lecture et intégration Android](/fr/issues/android).

![Réglages Avancé sur Android 16](/screenshots/pipepipe-advanced-5.3.1-beta-api36.png)

### Point de terminaison d'extraction YouTube

C'est le réglage Avancé qui décide quel client YouTube PipePipe interroge pour
une vidéo. Ouvrez **Paramètres → Avancé → Point de terminaison d'extraction
YouTube** :

<div class="screenshot-callout" role="img" aria-label="Sélecteur Point de terminaison d'extraction YouTube avec les choix VisionOS et MWEB (SABR) surlignés">
  <img src="/screenshots/pipepipe-endpoint-picker-5.4.0-api36.png" alt="Sélecteur Point de terminaison d'extraction YouTube sur Android 16">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="55" y="1050" width="790" height="280" rx="24" />
    <circle class="callout-number" cx="800" cy="1190" r="42" /><text x="800" y="1190">1</text>
  </svg>
</div>

*Capture de référence : Android 16/API 36 sur une installation anonyme. **1**
montre le sélecteur et ses deux choix. Une installation connectée n'affiche que
MWEB.*

| Valeur | Ce que c'est | Quand cela casse |
| --- | --- | --- |
| **MWEB (SABR)** | Le chemin actuel basé sur des sessions, et le seul qui lit les formats SABR. Une session connectée y est limitée. | Nécessite `googleapis.com` et `google.com` joignables pour le jeton proof-of-origin, donc un filtrage DNS le casse. |
| **VisionOS** | L'endpoint par défaut en mode anonyme, conservé pour les installations sans session. | YouTube retire ce client : la lecture peut s'arrêter vers 0:59 avec `Response code: 403`. |

Si un rapport affiche `Endpoint: visionos` et que la lecture s'arrête vers 0:59,
passez sur **MWEB (SABR)**. Le symptôme et les vérifications associées sont dans
[Lecture YouTube, réseau et connexion](/fr/issues/youtube-playback#la-lecture-s-arrete-vers-1-minute-avec-un-403).

![Ligne Point de terminaison d'extraction YouTube réglée sur MWEB (SABR) dans les réglages Avancé sur Android 16](/screenshots/pipepipe-advanced-endpoint-5.4.0-api36.png)

*Capture de référence : la même ligne dans la liste Avancé, ici réglée sur
MWEB (SABR). Votre valeur peut différer ; c'est celle à noter dans un rapport.*

## Écrans liés à une tâche

- [Téléchargements](/fr/issues/downloads) : destination et tentatives.
- [Comptes et services](/fr/issues/accounts-and-services) : services et cookies WebView.
- [Configuration, mises à jour et sauvegardes](/fr/issues/setup) : préversions et contrôle manuel.
- [Sauvegarde et restauration](./backup-and-restore) : export avant import.
- [Lecture YouTube, réseau et connexion](/fr/issues/youtube-playback#l-endpoint-est-une-information-pas-un-bouton-magique)
  : le choix d'endpoint et le cas du 403 à 0:59.
