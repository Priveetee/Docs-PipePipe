# Instalación y actualizaciones

PipePipe se distribuye fuera de Google Play. Elige una fuente de actualización fiable y mantenla para poder identificar con precisión la versión instalada al informar de un problema.

## Requisitos del sistema

La aplicación actual requiere **Android 6.0 (API 23) o posterior**. Los APK de publicación existen para `arm64-v8a`, `armeabi-v7a`, `x86_64` y `x86`; usa el APK universal si no conoces el ABI del dispositivo.

Ese es el mínimo para instalar el APK, no una garantía de que la WebView incluida en una ROM antigua aún pueda reproducir los flujos actuales de YouTube. La reproducción protegida también necesita un proveedor WebView activo y compatible. Consulta [WebView y la reproducción de YouTube](/es/issues/webview), incluidos los resultados de Android 6, 7 y 8 sin servicios de Google.

## Elegir una fuente de actualización

### Ajustes de actualización de PipePipe

PipePipe incluye sus propios ajustes de actualización. Permiten comprobar actualizaciones manualmente y, si lo activas, mostrar versiones preliminares. Prefiere las versiones estables salvo que estés probando una corrección y puedas informar regresiones con logs.

### GitHub Releases

[GitHub Releases](https://github.com/InfinityLoop1308/PipePipe/releases) es la fuente directa aguas arriba. Es el mejor lugar para comprobar si un problema informado ya está corregido en una versión más reciente.

### Obtainium

[Obtainium](https://github.com/ImranR98/Obtainium/releases) vigila el repositorio GitHub y puede avisar de nuevas versiones sin una cuenta de tienda. Añade `https://github.com/InfinityLoop1308/PipePipe` como fuente y verifica el certificado de firma siguiente antes de activar actualizaciones automáticas.

### F-Droid e IzzyOnDroid

[F-Droid](https://f-droid.org/packages/InfinityLoop1309.NewPipeEnhanced/) e [IzzyOnDroid](https://apt.izzysoft.de/fdroid/index/apk/InfinityLoop1309.NewPipeEnhanced) son catálogos alternativos. Su publicación es independiente de GitHub: una versión reciente aguas arriba puede no aparecer allí inmediatamente. Para una corrección urgente conocida, compara la versión instalada con GitHub Releases en vez de asumir que el catálogo está actualizado.

## Verificar el APK

Antes de instalar o actualizar, verifica el certificado de firma de PipePipe. Obtainium acepta la forma hexadecimal como huella de clave permitida; AppVerifier puede mostrar y comparar la forma con dos puntos.

**SHA-256 (hex):**

```
dec73429ce2563275f5ed19825e44652b32b363a46f38bdff9ad6dcde4842d88
```

**SHA-256 (con dos puntos):**

```
DE:C7:34:29:CE:25:63:27:5F:5E:D1:98:25:E4:46:52:B3:2B:36:3A:46:F3:8B:DF:F9:AD:6D:CD:E4:84:2D:88
```

Si Android rechaza un APK, comprueba la versión de Android, el ABI y que la descarga esté completa. No instales un APK de un espejo no fiable solo para evitar un retraso de actualización.
