# Lecture et intégration Android

## MediaCodec et erreurs de surface vidéo

Si le rapport PipePipe mentionne `MediaCodec`, le décodeur Android peut être en cause plutôt que l'extraction YouTube. Dans **Paramètres → Avancé → Paramètres ExoPlayer**, essayez un contournement pertinent à la fois :

- **Désactiver la file asynchrone MediaCodec** pour les problèmes de compatibilité liés à la file asynchrone ; cela peut réduire les performances.
- **Toujours utiliser le contournement de surface de sortie vidéo ExoPlayer** lorsqu'un échec survient pendant le changement de surface vidéo Android.

Relancez la lecture après chaque changement et gardez le rapport si cela ne suffit pas. Ces interrupteurs échangent compatibilité contre performance ou utilisent un autre chemin de sortie ; ce ne sont pas des correctifs généraux de qualité/réseau. Notez l'état initial, le seul interrupteur modifié, URL/format testés et résultat. Réinitialisez le contournement inutile afin que les rapports suivants décrivent l'état normal.

Si l'audio continue mais l'image est noire, clignote ou saccade régulièrement, donnez codec/format et résolution choisis. Les codecs avancés ou hautes résolutions peuvent révéler une limite du décodeur absente sur un stream plus simple.

## Problèmes propres à l'appareil

Pour un défaut limité à un téléphone, une ROM, une tablette, le mode TV ou une version Android, indiquez modèle, Android/ROM, orientation et si un autre appareil est touché. « Marche sur mon autre téléphone » est une comparaison utile, pas une reproduction suffisante.

## Android Auto

Android Auto peut masquer les applications installées hors de Google Play. Activez les réglages développeur d'Android Auto, autorisez-y les sources inconnues et reconnectez l'appareil. Cela agit sur la visibilité de l'application, pas sur le réseau ou la lecture YouTube.

Pour Android Auto, précisez si PipePipe est absent du lanceur, apparaît sans s'ouvrir ou s'ouvre sans lire. Ajoutez version Android Auto, Android du téléphone, contexte véhicule/unité si utile et source d'installation.
