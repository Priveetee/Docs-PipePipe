# Compilar el extractor

## Estructura

`PipePipeExtractor` es una compilación de Gradle con dos módulos: `:extractor` (la biblioteca) y `:timeago-parser`. Toolchain de Java 25, Gradle 9.5. Plugins: `java-library`, `checkstyle` y `com.squareup.wire` (generación de código protobuf, usada por SABR). Dependencias clave: `nanojson`, `jsoup`, `okhttp`, `protobuf-java`, `commons-lang3` / `commons-codec`, `brotli`, `Java-WebSocket` y `rhino` (fijado a `1.7.13` por compatibilidad con Android).

## Compilación compuesta

Rara vez compilarás el extractor de forma aislada. PipePipeClient lo integra como una compilación compuesta (composite build):

```gradle
includeBuild('../PipePipeExtractor') {
    dependencySubstitution {
        substitute module('com.github.TeamNewPipe:NewPipeExtractor') using project(':extractor')
    }
}
```

Así el cliente compila directamente el **árbol de trabajo** del extractor, cambios sin confirmar incluidos. Edita el extractor, compila la app, y tus cambios ya están dentro, sin publicación ni subida de versión.

## Comandos

```bash
# compilar la biblioteca
./gradlew :extractor:compileJava

# checkstyle falla a menudo por reglas no relacionadas; sáltalo mientras iteras
./gradlew :extractor:compileJava -x checkstyleMain
```

Gradle necesita JDK 17+ para arrancar; la toolchain trae el JDK 25 para la compilación. Checkstyle es estricto (líneas de 100 columnas, `ignoreFailures = false`), así que un fallo de checkstyle suele ser de estilo, no una ruptura real.

## Sin tests

Este fork no tiene tests automatizados. No hay `src/test`, ni JUnit, ni un `Downloader` simulado, ni fixtures grabados. Validas los cambios ejecutándolos contra los servicios en vivo, a través de la app o de un pequeño `main()` que llame a `NewPipe.init(...)` con un downloader real y luego ejecute `StreamInfo.getInfo(url)` (o el extractor de lista correspondiente). Checkstyle es la única barrera automatizada.
