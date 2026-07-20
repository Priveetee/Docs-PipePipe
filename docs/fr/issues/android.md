# Lecture et intégration Android

## MediaCodec et erreurs de surface vidéo

Votre vidéo démarre, puis l'image se fige ou PipePipe affiche une erreur ?
Ouvrez le rapport et cherchez le mot `MediaCodec`. S'il apparaît, le problème
vient probablement du décodeur vidéo de votre appareil, pas de votre connexion
ni de l'extraction YouTube.

Inutile de modifier plusieurs réglages. Repérez dans le rapport le texte qui
correspond à une ligne du tableau, puis commencez par la solution de cette
ligne.

Sur téléphone, faites glisser le tableau horizontalement pour voir le premier
essai dans la dernière colonne.

| Élément du rapport | Ce qu'il signifie | Premier essai |
| --- | --- | --- |
| `video/av01` ou codec commençant par `av01` | Le flux sélectionné utilise AV1. | Désactivez **AV01** dans **Paramètres → Lecteur → Activer les formats avancés**, rouvrez la vidéo et essayez VP9 ou AVC. |
| `video/x-vnd.on2.vp9` | Le flux sélectionné utilise VP9. | Essayez AVC ou une résolution inférieure. |
| `video/avc` | Le flux sélectionné utilise H.264/AVC. | Essayez une résolution inférieure, puis le contournement MediaCodec correspondant si son marqueur apparaît dans la trace. |
| `format_supported=NO_EXCEEDS_CAPABILITIES` | Le flux dépasse les capacités annoncées par Android pour ce décodeur. | Sélectionnez une résolution inférieure ou un autre codec. |
| `format_supported=YES` suivi de `MediaCodecVideoDecoderException` | Android a annoncé la compatibilité, mais le décodeur a tout de même échoué pendant l'exécution. | Changez d'abord de codec ; `YES` ne garantit pas un décodage stable. |
| `The surface has been released` ou `setOutputSurface` | Android a perdu ou modifié la surface vidéo pendant la configuration du décodeur. | Activez le contournement de surface ci-dessous. |
| `AsynchronousMediaCodecAdapter` ou `AsynchronousMediaCodecBufferEnqueuer` | L'échec est passé par la file asynchrone de MediaCodec. | Testez le contournement de file asynchrone ci-dessous. |
| `InvalidResponseCodeException: Response code: 403` | YouTube a refusé une requête média avant son arrivée au décodeur. | Suivez [Lecture et extraction YouTube](./youtube-playback) ; changer de codec ne corrige pas cette erreur. |

### Votre vidéo s'arrête après un moment avec une erreur AV1

Si votre rapport contient les trois lignes ci-dessous, vous êtes au bon endroit.
C'est exactement le cas signalé dans
[#2727](https://github.com/InfinityLoop1308/PipePipe/issues/2727) :

```text
video/av01, av01.0.08M.08
format_supported=YES
Decoder failed: c2.android.av1-dav1d.decoder
```

En clair, PipePipe a choisi une vidéo AV1 en 1080p. Android a commencé à la lire
avec son décodeur logiciel `c2.android.av1-dav1d.decoder`, puis ce décodeur s'est
arrêté en cours de lecture. Le plus simple est donc de demander à PipePipe
d'utiliser VP9 à la place.

Cette manipulation ne supprimera ni vos vidéos, ni vos abonnements, ni vos
réglages. Vous pourrez toujours regarder les mêmes vidéos ; PipePipe évitera
simplement leur version AV1.

#### Désactiver AV1, étape par étape

1. Depuis l'écran principal de PipePipe, repérez le bouton **☰** en haut à
   gauche et appuyez dessus. Les captures affichent les noms anglais parce que
   l'application utilisée pour ce guide est réglée en anglais.

<div class="screenshot-callout" role="img" aria-label="Écran principal de PipePipe avec le bouton du menu surligné">
  <img src="/screenshots/pipepipe-home-5.2.4-beta3-api36.png" alt="Écran principal de PipePipe montrant le bouton du menu en haut à gauche">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="8" y="58" width="142" height="158" rx="24" />
    <path class="callout-arrow" d="M 280 285 L 120 185 M 183 195 L 120 185 L 151 240" />
    <circle class="callout-number" cx="280" cy="285" r="42" /><text x="280" y="285">1</text>
  </svg>
</div>

2. Le menu latéral s'ouvre. Appuyez sur **Paramètres**, tout en bas de la liste.

<div class="screenshot-callout" role="img" aria-label="Menu latéral de PipePipe avec Paramètres surligné">
  <img src="/screenshots/pipepipe-drawer-settings-5.2.4-beta3-api36.png" alt="Menu latéral de PipePipe montrant Settings, ou Paramètres en français">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="12" y="1205" width="720" height="190" rx="28" />
    <path class="callout-arrow" d="M 820 1320 L 710 1310 M 762 1275 L 710 1310 L 770 1340" />
    <circle class="callout-number" cx="820" cy="1320" r="42" /><text x="820" y="1320">2</text>
  </svg>
</div>

3. Vous arrivez sur la liste des réglages. Appuyez sur **Lecteur** ou **Player**.

<div class="screenshot-callout" role="img" aria-label="Écran Paramètres de PipePipe avec Lecteur surligné">
  <img src="/screenshots/pipepipe-settings-5.2.4-beta3-api36.png" alt="Écran Paramètres de PipePipe montrant Player, ou Lecteur en français">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="12" y="205" width="1056" height="155" rx="28" />
    <path class="callout-arrow" d="M 900 450 L 980 350 M 930 380 L 980 350 L 968 410" />
    <circle class="callout-number" cx="900" cy="450" r="42" /><text x="900" y="450">3</text>
  </svg>
</div>

4. Appuyez sur la ligne **Activer les formats avancés**. Vous pouvez toucher le
   texte ou la description grise : toute la zone est un bouton.

<div class="screenshot-callout" role="img" aria-label="Paramètres du Lecteur avec Activer les formats avancés surligné">
  <img src="/screenshots/pipepipe-player-5.2.4-beta3-api36.png" alt="Paramètres du Lecteur montrant Enable advanced formats, ou Activer les formats avancés en français">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="12" y="580" width="1056" height="435" rx="28" />
    <path class="callout-arrow" d="M 890 1090 L 990 1000 M 932 1020 L 990 1000 L 968 1058" />
    <circle class="callout-number" cx="890" cy="1090" r="42" /><text x="890" y="1090">4</text>
  </svg>
</div>

5. Regardez la case devant **AV01**. Si elle est rouge et cochée comme sur cette
   image, appuyez une fois sur la ligne **AV01**. Ne touchez pas à **VP9** pour
   ce premier essai.

<div class="screenshot-callout" role="img" aria-label="Fenêtre Formats avancés avec AV01 activé et surligné">
  <img src="/screenshots/pipepipe-advanced-formats-av01-on-5.2.4-beta3-api36.png" alt="Fenêtre Formats avancés avec une case rouge cochée devant AV01">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="100" y="1015" width="860" height="155" rx="24" />
    <path class="callout-arrow" d="M 935 1235 L 900 1150 M 889 1198 L 900 1150 L 930 1190" />
    <circle class="callout-number" cx="935" cy="1235" r="42" /><text x="935" y="1235">5</text>
  </svg>
</div>

6. La case devant **AV01** doit maintenant être vide. Appuyez sur **OK** pour
   enregistrer. Si vous appuyez sur **Annuler** ou **Cancel**, PipePipe ne gardera
   pas la modification.

<div class="screenshot-callout" role="img" aria-label="Fenêtre Formats avancés avec AV01 désactivé et OK surligné">
  <img src="/screenshots/pipepipe-advanced-formats-av01-off-5.2.4-beta3-api36.png" alt="Fenêtre Formats avancés avec une case vide devant AV01 et le bouton OK">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="100" y="1015" width="860" height="155" rx="24" />
    <path class="callout-arrow" d="M 940 970 L 900 1040 M 940 1010 L 900 1040 L 910 992" />
    <circle class="callout-number" cx="940" cy="970" r="42" /><text x="940" y="970">6</text>
    <rect class="callout-box" x="790" y="1395" width="205" height="185" rx="24" />
    <path class="callout-arrow" d="M 730 1640 L 820 1560 M 768 1575 L 820 1560 L 800 1610" />
    <circle class="callout-number" cx="730" cy="1640" r="42" /><text x="730" y="1640">7</text>
  </svg>
</div>

7. Revenez à la vidéo. Si son lecteur était déjà ouvert, quittez-le avec le
   bouton Retour, puis ouvrez de nouveau la vidéo. Elle devrait maintenant
   utiliser VP9. Il est inutile de vider le cache, de supprimer vos données ou
   de réinstaller PipePipe.

Essayez d'abord en 1080p, puis en 720p si nécessaire. Si la même erreur revient,
ouvrez de nouveau la liste des formats, décochez aussi VP9 et HEVC, laissez AV01
décoché, puis appuyez sur **OK**. PipePipe utilisera alors AVC ; réessayez en
720p. Si cela échoue encore, envoyez le nouveau rapport : le nom du codec nous
dira si PipePipe a bien changé de décodeur.

#### Pourquoi cette manipulation fonctionne

AV1 est désactivé dans les réglages d'origine. Si vous l'avez activé, PipePipe le
choisit actuellement avant VP9, HEVC et AVC pour une même résolution. Le repli
de Media3 ne peut pas passer automatiquement de la vidéo AV1 à la vidéo VP9
après un plantage en cours de lecture. Décochez AV01 pour que PipePipe choisisse
un autre flux dès l'ouverture de la vidéo.

### N'utiliser un contournement MediaCodec que si son marqueur correspond

Dans **Paramètres → Avancé → Paramètres ExoPlayer**, essayez un contournement
pertinent à la fois :

- **Désactiver la file asynchrone MediaCodec** pour les problèmes de compatibilité liés à la file asynchrone ; cela peut réduire les performances.
- **Toujours utiliser le contournement de surface de sortie vidéo ExoPlayer** lorsqu'un échec survient pendant le changement de surface vidéo Android.

Relancez la lecture après chaque changement et gardez le rapport si cela ne suffit pas. Ces interrupteurs échangent compatibilité contre performance ou utilisent un autre chemin de sortie ; ce ne sont pas des correctifs généraux de qualité/réseau. Notez l'état initial, le seul interrupteur modifié, URL/format testés et résultat. Réinitialisez le contournement inutile afin que les rapports suivants décrivent l'état normal.

Si l'audio continue mais l'image est noire, clignote ou saccade régulièrement, donnez codec/format et résolution choisis. Les codecs avancés ou hautes résolutions peuvent révéler une limite du décodeur absente sur un stream plus simple.

## Problèmes propres à l'appareil

Si le problème ne se produit que sur votre téléphone, votre ROM, une tablette ou
en mode TV, indiquez le modèle, la version Android/ROM, l'orientation de l'écran
et ce qui se passe sur un autre appareil. La comparaison nous aide, mais nous
avons aussi besoin des étapes qui déclenchent le problème sur l'appareil touché.

## Android Auto

Android Auto peut masquer les applications installées hors de Google Play. Activez les réglages développeur d'Android Auto, autorisez-y les sources inconnues et reconnectez l'appareil. Cela agit sur la visibilité de l'application, pas sur le réseau ou la lecture YouTube.

Si vous avez encore un problème avec Android Auto, dites-nous simplement où cela
bloque : PipePipe est absent du lanceur, apparaît mais ne s'ouvre pas, ou s'ouvre
sans lancer la lecture. Ajoutez les versions d'Android Auto et d'Android, le type
de véhicule ou d'unité si cela semble utile, et la source d'installation.
