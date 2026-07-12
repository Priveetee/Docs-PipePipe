# Sauvegarde et restauration

PipePipe conserve sa base de données sur l'appareil. Une sauvegarde peut contenir
abonnements, historique, playlists, positions de lecture et réglages. Gardez un
export avant une réinitialisation, une migration ou le test d'une préversion.

## Créer une sauvegarde

1. Ouvrez **Paramètres → Sauvegarde**.
2. Sélectionnez **Exporter la base de données**.
3. Choisissez un emplacement que vous retrouverez et terminez le sélecteur de fichiers Android.
4. Copiez le fichier hors de l'appareil si cette sauvegarde compte réellement.

<div class="screenshot-callout" role="img" aria-label="Écran Sauvegarde PipePipe avec Import database et Export database surlignés">
  <img src="/screenshots/pipepipe-backup-5.2.3-api36.png" alt="Réglages Sauvegarde PipePipe, 5.2.3 sur Android 16">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="25" y="300" width="1030" height="225" rx="28" />
    <circle class="callout-number" cx="990" cy="330" r="42" /><text x="990" y="330">1</text>
    <rect class="callout-box" x="25" y="545" width="1030" height="180" rx="28" />
    <circle class="callout-number" cx="990" cy="575" r="42" /><text x="990" y="575">2</text>
  </svg>
</div>

*Capture de référence : PipePipe 5.2.3 · Android 16/API 36. **1** importe et peut remplacer les données locales ; **2** crée l'export de récupération à faire d'abord.*

::: warning Une sauvegarde peut contenir des données de visionnage personnelles
Traitez l'export comme une archive privée. Ne le joignez pas à une issue publique
et ne l'envoyez pas à une personne non fiable.
:::

## Restaurer une sauvegarde

1. Créez d'abord un export actuel : l'import peut remplacer historique,
   abonnements, playlists et, selon le choix, les réglages.
2. Ouvrez **Paramètres → Sauvegarde → Importer la base de données**.
3. Sélectionnez le fichier et lisez les choix d'import avant confirmation.
4. Redémarrez PipePipe si Android ou l'application le demande.

## Migrer vers une autre application

PipePipe peut aussi exporter une sauvegarde au format compatible NewPipe. Utilisez
cette option seulement si l'application cible documente sa prise en charge ;
conservez l'export PipePipe normal comme copie de récupération.
