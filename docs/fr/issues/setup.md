# Configuration, mises à jour et sauvegardes

## Mettre à jour avant de diagnostiquer

Comparez la version installée aux [GitHub Releases](https://github.com/InfinityLoop1308/PipePipe/releases). Les catalogues peuvent être en retard. Utilisez les versions stables au quotidien ; testez une préversion seulement pour un correctif identifié et si vous pouvez faire un retour.

La recherche de mise à jour intégrée sert à notifier qu'une version existe : elle ne remplace pas silencieusement l'APK installé. Dans **Paramètres → Mises à jour**, vérifiez la recherche de mises à jour et l'option **Afficher les préversions** avant de signaler qu'une bêta attendue n'apparaît pas.

<div class="screenshot-callout" role="img" aria-label="Réglages Mises à jour PipePipe avec préversions et contrôle manuel surlignés">
  <img src="/screenshots/pipepipe-updates-5.2.3-api36.png" alt="Réglages Mises à jour de PipePipe, 5.2.3 sur Android 16">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="25" y="555" width="1030" height="235" rx="28" />
    <path class="callout-arrow" d="M 900 470 L 900 535 M 875 510 L 900 535 L 925 510" />
    <circle class="callout-number" cx="990" cy="580" r="42" /><text x="990" y="580">1</text>
    <rect class="callout-box" x="25" y="805" width="1030" height="175" rx="28" />
    <circle class="callout-number" cx="990" cy="830" r="42" /><text x="990" y="830">2</text>
  </svg>
</div>

*Capture de référence : PipePipe 5.2.3 · Android 16/API 36. **1** active les préversions ; **2** lance le contrôle manuel. La vérification ne fait qu'avertir : elle n'installe pas silencieusement un APK.*

::: tip
Quand une issue annonce « corrigé en bêta » ou « dans la prochaine version », installez précisément cette version, redémarrez PipePipe puis refaites un essai avant d'ouvrir un doublon.
:::

## Installation

PipePipe exige Android 6.0 / API 23 ou plus récent. Pour un échec d'installation, notez Android, ABI, source de l'APK et message exact.

Ne déduisez pas l'architecture CPU du seul modèle de téléphone. Le projet fournit `armeabi-v7a`, `arm64-v8a`, `x86` et `x86_64` ; un message d'APK incompatible, de signature ou d'ABI est une information utile. Précisez si le build vient des Releases GitHub, d'Obtainium, de F-Droid/IzzyOnDroid ou d'une autre source : un catalogue peut publier après l'amont.

Si Android refuse une mise à jour alors que PipePipe est déjà installé, conservez le message exact. Un conflit de clé de signature ne se résout généralement pas par une installation par-dessus : exportez d'abord les données locales et ne désinstallez que si vous acceptez le risque de perte de données.

## Export, import et migration

Créez un export avant un import, une migration ou l'essai d'une préversion. L'import peut remplacer historique, abonnements, playlists et réglages ; ce n'est pas une fusion anodine que l'on annule facilement.

1. Exportez depuis l'installation source et gardez si possible une copie intacte hors de l'appareil.
2. Notez les versions source/cible et le format choisi.
3. Importez une seule fois ; évitez les essais répétés après modification des listes locales.
4. Vérifiez un petit échantillon : abonnements, playlists locales, historique/positions et réglages.

## Import interrompu

Indiquez format, versions source/cible, étape, nombre approximatif d'éléments et interruption éventuelle. Signalez aussi si l'accès au stockage a été retiré. Pour un abonnement manquant, fournissez l'URL publique de la chaîne plutôt que l'archive complète et dites si les données concernées sont locales ou liées à un service.

Ne joignez jamais une sauvegarde privée à une issue publique.

## Modèle de rapport

```text
Version PipePipe et source :
Version Android / ABI de l'appareil :
Installation précédente et version :
Réglages de mise à jour (préversions incluses) :
Erreur exacte d'installation ou d'import :
Attendu / résultat obtenu :
Format et taille approximative de la sauvegarde (sans la joindre) :
```
