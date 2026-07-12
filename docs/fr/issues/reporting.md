# Signaler un problème

Un bon rapport permet au mainteneur de reproduire le problème au lieu de deviner à partir d'un titre. Ouvrez un rapport de bug pour un dysfonctionnement ; réservez les demandes de fonctionnalité à une capacité nouvelle ou une décision produit. Une erreur de compatibilité ou une régression est un bug, même si une amélioration plus large vous intéresse aussi.

## Informations à joindre

- version PipePipe et source d'installation ;
- version Android et modèle ;
- service, URL ou requête concernée ;
- endpoint d'extraction YouTube sélectionné ;
- connexion, pays de contenu et VPN/proxy ;
- étapes exactes, résultat attendu, résultat réel et heure approximative ;
- rapport d'erreur ou crash log généré par PipePipe.

Pour WebView, ajoutez paquet/version du fournisseur et une capture du réglage Android **Implémentation WebView**. Pour la recherche, ajoutez le résultat attendu. Pour la lecture, précisez démarrage, lecture, changement de qualité, retour app ou seek.

![Erreur réseau PipePipe avec action REPORT](/screenshots/pipepipe-network-error-5.2.3-api36.png)

Quand PipePipe propose **REPORT**, ouvrez-le avant de réessayer ou d'effacer des
données. La page générée contient service, URL/requête, endpoint, langue/pays,
version et détails qui ont été essentiels dans les correctifs SABR récents.
Retirez ou masquez URL privée, cookie, jeton, compte ou autre donnée sensible
avant tout partage public.

![Rapport d'erreur PipePipe généré](/screenshots/pipepipe-error-report-5.2.3-api36.png)

*Captures de référence : PipePipe 5.2.3 · Android 16/API 36. L'erreur affichée
est un exemple ; signalez les champs fournis par votre propre échec.*

## Écrire des étapes exécutables

Donnez des actions numérotées, pas une conclusion. « Ouvrir cette URL, choisir MWeb, lire, seek à 01:00, revenir depuis Accueil » est vérifiable ; « la lecture est cassée après mise à jour » ne l'est pas. Dites si cela arrive à chaque fois et quel changement unique, s'il existe, modifie le résultat.

Ne masquez pas le contexte qui modifie l'extraction : connexion, endpoint, pays, UI expérimentale et VPN/proxy. À l'inverse, ne collez ni sauvegarde privée, ni cookie, ni jeton, ni IP, ni e-mail, ni dump de logs sans rapport.

## Modèle copiable

```text
### Environnement
Version PipePipe et source :
Android / appareil :
Service et URL ou requête exacte :
Endpoint / connexion / pays / VPN-proxy :

### Reproduction
1.
2.
3.

### Résultat attendu

### Résultat réel

### Éléments
Erreur exacte, heure approximative, rapport généré et capture sûre :
```

## Garder un périmètre réduit

Une issue doit décrire un symptôme reproductible. Deux rapports séparés pour recherche et lecture sont plus utiles qu'un rapport combiné, même si les deux sont apparus après la même mise à jour.

Avant de créer, cherchez dans les issues récentes ouvertes et fermées l'erreur exacte et la version actuelle. Ajoutez votre reproduction à un rapport existant si le symptôme est le même ; créez une issue quand le service, le déclencheur ou le chemin d'erreur est matériellement différent.
