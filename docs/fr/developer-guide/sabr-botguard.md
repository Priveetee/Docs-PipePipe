# Dans BotGuard

Quand vous demandez un flux protégé à YouTube, le serveur ne livre pas le média tant que votre client n'a pas prouvé qu'il tourne dans une vraie session de navigateur. Cette preuve est produite par un bout de code que Google fournit, appelé BotGuard. C'est la partie la plus difficile à appréhender de toute l'histoire SABR, et cette page explique comment il est construit et pourquoi il résiste à l'analyse, à partir de ce que nous avons observé en l'étudiant.

L'objectif ici est de comprendre la forme du système, pas de le reproduire.

## Ce n'est pas un script normal

Ce que le navigateur charge est un petit interpréteur stable. Cet interpréteur ne contient pas la logique directement. Il transporte plutôt un programme sous une forme compacte et chiffrée, et il déchiffre ce programme à la volée pendant qu'il s'exécute. Le résultat déchiffré n'est pas non plus du JavaScript lisible. C'est du bytecode pour une petite machine virtuelle que l'interpréteur implémente lui-même.

La vraie logique vit donc plusieurs couches en dessous de tout ce que vous pouvez lire.

![Les couches de BotGuard](/diagrams/botguard-layers.png)

L'interpréteur lit le bytecode chiffré, l'exécute dans sa propre VM, et la VM finit par produire un snapshot. Ce snapshot est ce que le client envoie à Google pour l'attestation. Il est lui-même chiffré avant de partir, donc même la sortie est opaque.

## Pourquoi il résiste à l'analyse

Quelques choix de conception s'empilent et rendent la chose bien plus difficile qu'un script obfusqué ordinaire.

Le bytecode est chiffré, vous ne pouvez donc pas simplement lire le programme. L'interpréteur ne le déchiffre qu'au moment de l'exécuter, par petits bouts, jamais en un seul bloc lisible.

Le runtime est régénéré. À chaque exécution du challenge, la forme exécutable est reconstruite et les noms internes changent d'une exécution à l'autre. Un point d'arrêt ou un hook qui marchait une fois ne tombe plus juste la fois suivante, parce que la chose qu'il visait n'existe plus au même endroit.

Il y a de l'auto-vérification. Le snapshot intègre une mesure du code en cours d'exécution, donc si vous patchez la source pour ajouter un log ou un hook, le snapshot change et le serveur le rejette. Vous ne pouvez pas l'instrumenter discrètement de l'intérieur.

La VM regarde aussi son environnement. Elle inspecte des détails du navigateur et du DOM, pas seulement de simples drapeaux, donc falsifier une ou deux valeurs ne suffit pas. Elle vérifie que le monde autour d'elle se comporte comme un vrai navigateur.

Mis bout à bout, tout cela fait que la seule façon fiable d'obtenir un résultat valide est de laisser le vrai challenge s'exécuter dans un véritable environnement JavaScript. Lire le code vous dit la structure, mais cela ne vous permet pas de raccourcir l'exécution.

## Ce que cela implique si vous intégrez SABR

La conclusion pratique est simple. Une intégration SABR qui fonctionne exécute le challenge BotGuard officiel dans un runtime JavaScript ou une WebView, le laisse produire son snapshot, et utilise le jeton qui revient. Elle n'essaie pas de reconstruire BotGuard ni de forger sa sortie, parce que la conception est faite exprès pour que cela ne marche pas.

Pour ce que le serveur fait du snapshot, voir [Attestation](./sabr-attestation).
