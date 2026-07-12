# Interface et langue

## Interface expérimentale

La nouvelle interface expérimentale peut modifier le comportement et redémarre PipePipe au changement. Pour un problème UI, indiquez son état, écran/onglet, orientation/taille et action juste avant l'échec.

Refaites un essai sans modifier l'option. Si vous comparez volontairement activée/désactivée, redémarrez après chaque changement et donnez deux résultats séparés. Ne mélangez pas une régression d'interface et un échec réseau/extracteur parce que l'écran était affiché au même moment.

## Langue, pays et localisation

Pour une langue inattendue, un titre traduit ou une erreur de parsing locale, indiquez langue de l'app, langue Android, pays de contenu, service et URL. Un symptôme Zulu, chinois ou autre peut venir des données du service plutôt que de la langue de l'interface.

Distinguez : libellés de l'app dans une mauvaise langue ; titre/description renvoyé par un service ; pays de contenu sans effet ; erreur de date/nombre locale. Une capture devient exploitable avec ces valeurs : version PipePipe, langue app, langue Android, pays de contenu par défaut, service et URL.

## Partage, notifications et navigation

Pour une action de partage, un contrôle de notification, le retour ou un chevauchement visuel, indiquez Android, application/écran d'origine et une capture si elle ne révèle rien de privé. Pour l'ouverture d'un lien externe, nommez l'application source et l'action Android/intention utilisée : c'est aussi ici que l'« action préférée ouvrir » intervient.
