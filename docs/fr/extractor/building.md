# Construire l'extracteur

## Disposition

`PipePipeExtractor` est un build Gradle avec deux modules : `:extractor` (la bibliothèque) et `:timeago-parser`. Toolchain Java 25, Gradle 9.5. Plugins : `java-library`, `checkstyle`, et `com.squareup.wire` (génération de code protobuf, utilisée par SABR). Dépendances clés : `nanojson`, `jsoup`, `okhttp`, `protobuf-java`, `commons-lang3` / `commons-codec`, `brotli`, `Java-WebSocket`, et `rhino` (épinglé à `1.7.13` pour la compatibilité Android).

## Build composite

Vous construisez rarement l'extracteur de manière isolée. PipePipeClient le branche comme un build composite :

```gradle
includeBuild('../PipePipeExtractor') {
    dependencySubstitution {
        substitute module('com.github.TeamNewPipe:NewPipeExtractor') using project(':extractor')
    }
}
```

Donc le client compile directement l'**arbre de travail** de l'extracteur, modifications non commitées incluses. Modifiez l'extracteur, construisez l'app, et vos changements sont pris en compte, sans publication ni bump de version.

## Commandes

```bash
# compile the library
./gradlew :extractor:compileJava

# checkstyle frequently fails on unrelated rules; skip it while iterating
./gradlew :extractor:compileJava -x checkstyleMain
```

Gradle a besoin de JDK 17+ pour démarrer ; la toolchain tire JDK 25 pour la compilation. Checkstyle est strict (lignes à 100 colonnes, `ignoreFailures = false`), donc un échec checkstyle est en général du style, pas une vraie casse.

## Pas de tests

Ce fork n'a aucun test automatisé. Il n'y a pas de `src/test`, pas de JUnit, pas de `Downloader` mock, pas de fixtures enregistrées. Vous validez les changements en les exécutant contre les services en direct, via l'app ou un petit `main()` qui appelle `NewPipe.init(...)` avec un vrai downloader puis pilote `StreamInfo.getInfo(url)` (ou l'extracteur de liste correspondant). Checkstyle est le seul garde-fou automatisé.
