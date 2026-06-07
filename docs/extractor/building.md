# Building the extractor

## Layout

`PipePipeExtractor` is a Gradle build with two modules: `:extractor` (the library) and `:timeago-parser`. Java toolchain 25, Gradle 9.5. Plugins: `java-library`, `checkstyle`, and `com.squareup.wire` (protobuf code generation, used by SABR). Key dependencies: `nanojson`, `jsoup`, `okhttp`, `protobuf-java`, `commons-lang3` / `commons-codec`, `brotli`, `Java-WebSocket`, and `rhino` (pinned to `1.7.13` for Android compatibility).

## Composite build

You rarely build the extractor in isolation. PipePipeClient wires it in as a composite build:

```gradle
includeBuild('../PipePipeExtractor') {
    dependencySubstitution {
        substitute module('com.github.TeamNewPipe:NewPipeExtractor') using project(':extractor')
    }
}
```

So the client compiles the extractor **working tree** directly, uncommitted changes included. Edit the extractor, build the app, and your changes are in, with no publish or version bump.

## Commands

```bash
# compile the library
./gradlew :extractor:compileJava

# checkstyle frequently fails on unrelated rules; skip it while iterating
./gradlew :extractor:compileJava -x checkstyleMain
```

Gradle needs JDK 17+ to launch; the toolchain pulls JDK 25 for compilation. Checkstyle is strict (100-column lines, `ignoreFailures = false`), so a checkstyle failure is usually style, not a real break.

## No tests

This fork has no automated tests. There is no `src/test`, no JUnit, no mock `Downloader`, no recorded fixtures. You validate changes by running against the live services, through the app or a small `main()` that calls `NewPipe.init(...)` with a real downloader and then drives `StreamInfo.getInfo(url)` (or the matching list extractor). Checkstyle is the only automated gate.
