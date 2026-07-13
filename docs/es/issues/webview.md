# WebView y la reproducción de YouTube

## Cuándo seguir esta guía

Sigue esta guía cuando PipePipe muestre el siguiente mensaje al cargar un vídeo de YouTube:

> **WebView no disponible. Por favor, asegúrese de que su versión de WebView sea superior a 80.**

Es un error de compatibilidad. No es una petición para iniciar sesión en YouTube ni demuestra que el teléfono sea necesariamente demasiado antiguo.

![Cómo interviene WebView en la reproducción de YouTube](/diagrams/webview-playback.png)

## Por qué PipePipe comprueba WebView

Algunos flujos de YouTube usan SABR, un protocolo de entrega basado en sesiones. Cuando YouTube protege un flujo, el cliente debe obtener un token Proof of Origin (PO) de corta duración antes de que YouTube entregue más contenido. PipePipe ejecuta el challenge BotGuard de YouTube en Android WebView para obtener ese token.

El cliente actual de PipePipe también comprueba que WebView se puede usar antes de iniciar la extracción de un flujo de YouTube. Comprueba que Android ha seleccionado un proveedor, que ese proveedor se inicializa y que puede ejecutar las funciones JavaScript que necesita el challenge. Por ello, la indicación de «versión 80» es un límite práctico, no la única causa posible del error.

Dos consecuencias importantes:

- Web y MWeb son los endpoints que usan SABR, pero cambiar de endpoint no evita la comprobación de disponibilidad de WebView de PipePipe.
- Una WebView reciente aún puede fallar si su proveedor está desactivado, no se inicia o falla la comprobación de capacidades JavaScript. En ese caso hace falta un informe de bug, no actualizaciones repetidas de WebView sin diagnóstico.

Para la explicación técnica, consulta la [guía SABR](/es/developer-guide/introduction) y [Atestación](/es/developer-guide/sabr-attestation).

## Comprobar el proveedor WebView activo

1. Abre los **Ajustes** de Android.
2. Activa las **Opciones de desarrollador** si aún no están disponibles.
3. Abre **Implementación de WebView**. El texto y la ubicación varían entre dispositivos.
4. Comprueba que hay un proveedor seleccionado y activado. Anota el nombre de paquete y la versión completa.
5. Reinicia PipePipe después de cambiar o actualizar el proveedor.

Android 6 puede no mostrar el selector **Implementación de WebView**. Su
proveedor normalmente está fijado por la ROM; comprueba la versión de
**Android System WebView** en **Ajustes → Aplicaciones** y usa únicamente la
ruta de actualización admitida por la ROM.

![Pantalla Android de implementación WebView, Android 16](/screenshots/android-webview-provider-api36.png)

*Captura de referencia: Android 16/API 36. Nombre y versión son ejemplos: informa los valores de tu propio dispositivo.*

La pantalla de error de PipePipe da estas indicaciones prácticas:

- **Android 6 y Android 10:** actualiza **Android System WebView**.
- **Android 7, 8 y 9:** actualiza **Chrome** y selecciónalo como implementación WebView si Android ofrece esa opción.
- **Otras versiones de Android:** el error es inesperado; repórtalo.

Esos nombres describen la configuración habitual de Android con Google. En una ROM sin Google, el proveedor activo puede ser la WebView independiente de la ROM. Actualiza el proveedor que Android acepte y seleccione realmente; instalar Chrome no es necesario ni útil si la ROM no lo reconoce como proveedor WebView.

::: info Android orientado a la privacidad y fabricantes
Algunos sistemas ofrecen otro proveedor WebView; algunos dispositivos solo permiten el proveedor del fabricante. Usa un proveedor mantenido que Android acepte para tu dispositivo. PipePipe no puede instalar, seleccionar ni sustituir un proveedor WebView del sistema por ti.
:::

## Lo que verificamos en Android antiguos sin servicios de Google

Probamos la versión x86_64 de PipePipe **5.2.3** en imágenes AOSP limpias el 2026-07-13. No contenían Play Store, Google Play Services ni Chrome. Se usó el mismo vídeo público de YouTube en todas las pruebas.

| Sistema | WebView incluida en la imagen limpia | Resultado | Prueba controlada adicional |
| --- | --- | --- | --- |
| Android 6.0 / API 23 | AOSP `com.android.webview` 44.0.2403.119 | PipePipe se instaló y cargó el inicio de YouTube, pero al abrir el vídeo apareció **WebView no disponible**. | Se inspeccionó Bromite SystemWebView 106 y declara la API 23 como mínima, pero no se activó como proveedor de la ROM; por tanto, no se validó la reproducción con un sustituto. |
| Android 7.0 / API 24 | AOSP `com.android.webview` 52.0.2743.100 | El inicio cargó; el mismo mensaje bloqueó el vídeo. | Con Chromium WebView AOSP 119.0.6045.141 integrado como proveedor de sistema de confianza, el mismo vídeo se reprodujo. Una actualización APK normal fue rechazada porque su firma no coincidía con la del proveedor de la ROM. |
| Android 8.1 / API 27 | AOSP `com.android.webview` 61.0.3163.98 | El inicio cargó; el mismo mensaje bloqueó el vídeo. | Con Mulch WebView 131.0.6778.81 integrado como proveedor de sistema de confianza, el mismo vídeo se reprodujo. Una instalación normal fue rechazada por la misma incompatibilidad de firma. |

«Integrado como proveedor de sistema de confianza» describe una imagen de laboratorio desechable modificada como una compilación de ROM. **No** es una recomendación para sustituir archivos en un dispositivo real. Las pruebas de Android 7 y 8 produjeron grabaciones con reproducción en movimiento, no solo metadatos o una miniatura.

Los dos intentos de instalación normal devolvieron el error exacto de Android `INSTALL_FAILED_UPDATE_INCOMPATIBLE`.

En Android 6, el inicio cargó antes de que el mismo ensayo fallara al abrir un
vídeo. Estas dos pantallas separan el acceso general a la red y al extractor de
la capacidad WebView necesaria para la reproducción.

<div class="screenshot-callout" role="img" aria-label="Inicio de YouTube de PipePipe cargado en Android 6 antes de abrir un vídeo">
  <img src="/screenshots/pipepipe-home-5.2.3-android6.png" alt="Inicio de YouTube de PipePipe en Android 6">
  <svg viewBox="0 0 320 640" aria-hidden="true">
    <rect class="callout-box" x="8" y="112" width="304" height="510" rx="12" />
    <path class="callout-arrow" d="M 270 70 L 270 106 M 255 90 L 270 106 L 285 90" />
    <circle class="callout-number" cx="292" cy="128" r="22" /><text x="292" y="128">A</text>
  </svg>
</div>

*Captura de referencia: PipePipe 5.2.3 · Android 6/API 23 · WebView AOSP 44 original · sin servicios de Google. **A** muestra que el inicio y las miniaturas cargaron.*

<div class="screenshot-callout" role="img" aria-label="Error WebView no disponible de PipePipe después de abrir un vídeo en Android 6">
  <img src="/screenshots/pipepipe-webview-unavailable-5.2.3-android6.png" alt="Pantalla WebView no disponible de PipePipe en Android 6">
  <svg viewBox="0 0 320 640" aria-hidden="true">
    <rect class="callout-box" x="10" y="286" width="300" height="216" rx="12" />
    <path class="callout-arrow" d="M 280 238 L 280 278 M 264 262 L 280 278 L 296 262" />
    <circle class="callout-number" cx="292" cy="304" r="22" /><text x="292" y="304">B</text>
  </svg>
</div>

*Captura de referencia: la acción de vídeo llegó a la comprobación WebView de PipePipe y se detuvo. **B** resalta el requisito exacto, mientras que el inicio mostrado en **A** ya había funcionado.*

<div class="screenshot-callout" role="img" aria-label="Pantalla WebView no disponible de PipePipe en Android 8.1 con las indicaciones de compatibilidad resaltadas">
  <img src="/screenshots/pipepipe-webview-unavailable-5.2.3-android8.png" alt="Pantalla WebView no disponible de PipePipe en Android 8.1">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="28" y="640" width="664" height="365" rx="24" />
    <path class="callout-arrow" d="M 620 565 L 620 620 M 598 598 L 620 620 L 642 598" />
    <circle class="callout-number" cx="660" cy="670" r="30" /><text x="660" y="670">1</text>
  </svg>
</div>

*Captura de referencia: PipePipe 5.2.3 · Android 8.1/API 27 · WebView AOSP 61 original. **1** es el error de compatibilidad exacto; el inicio había cargado antes de abrir el vídeo.*

<div class="screenshot-callout" role="img" aria-label="Vídeo de YouTube reproduciéndose en PipePipe en Android 7 con WebView 119 integrada en el sistema">
  <img src="/screenshots/pipepipe-playback-5.2.3-android7-webview119.png" alt="Reproducción de YouTube en PipePipe en Android 7 con WebView 119">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="16" y="48" width="688" height="405" rx="20" />
    <path class="callout-arrow" d="M 620 500 L 620 470 M 598 492 L 620 470 L 642 492" />
    <circle class="callout-number" cx="668" cy="420" r="30" /><text x="668" y="420">2</text>
  </svg>
</div>

*Captura de referencia: PipePipe 5.2.3 · Android 7/API 24 · WebView AOSP 119 integrada en el sistema · sin servicios de Google. **2** resalta un fotograma real durante la reproducción.*

<div class="screenshot-callout" role="img" aria-label="Vídeo de YouTube reproduciéndose en PipePipe en Android 8.1 con Mulch WebView 131 integrada en el sistema">
  <img src="/screenshots/pipepipe-playback-5.2.3-android8-mulch131.png" alt="Reproducción de YouTube en PipePipe en Android 8.1 con Mulch WebView 131">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="16" y="48" width="688" height="405" rx="20" />
    <path class="callout-arrow" d="M 620 500 L 620 470 M 598 492 L 620 470 L 642 492" />
    <circle class="callout-number" cx="668" cy="420" r="30" /><text x="668" y="420">3</text>
  </svg>
</div>

*Captura de referencia: PipePipe 5.2.3 · Android 8.1/API 27 · Mulch WebView 131 integrada en el sistema · sin servicios de Google. **3** resalta un fotograma real durante la reproducción.*

### Comprobación visual en un Android antiguo

Después de que la ROM instale o actualice su proveedor de confianza, abre
**Opciones para desarrolladores → Implementación de WebView**. Deben verse tanto
el botón seleccionado como la versión completa. Instalar un APK no es suficiente.

<div class="screenshot-callout" role="img" aria-label="Pantalla de implementación WebView de Android 8.1 con WebView 131 seleccionada">
  <img src="/screenshots/android8-webview-provider-131.png" alt="Pantalla de implementación WebView de Android 8.1 con Android System WebView 131 seleccionada">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="24" y="158" width="672" height="150" rx="20" />
    <path class="callout-arrow" d="M 610 360 L 654 286 M 620 300 L 654 286 L 650 322" />
    <circle class="callout-number" cx="610" cy="360" r="30" /><text x="610" y="360">4</text>
  </svg>
</div>

*Captura del tutorial: Android 8.1/API 27 · Mulch WebView 131 integrada por la ROM de laboratorio · sin servicios de Google. **4** resalta el proveedor seleccionado y su versión.*

Después cierra PipePipe por completo, vuelve a abrirlo y reproduce un vídeo
público de YouTube. Cargar el inicio o una miniatura no prueba por sí solo la
ruta SABR/WebView.

<div class="screenshot-callout" role="img" aria-label="Vídeo de YouTube en directo reproduciéndose en PipePipe en Android 8.1 tras seleccionar WebView 131">
  <img src="/screenshots/pipepipe-playback-5.2.3-android8-webview131-tutorial.png" alt="Reproducción de YouTube en directo en PipePipe en Android 8.1 con WebView 131">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="16" y="48" width="688" height="405" rx="20" />
    <path class="callout-arrow" d="M 620 500 L 620 470 M 598 492 L 620 470 L 642 492" />
    <circle class="callout-number" cx="668" cy="420" r="30" /><text x="668" y="420">5</text>
  </svg>
</div>

*Captura del tutorial: PipePipe 5.2.3 · Android 8.1/API 27 · Mulch WebView 131 · sin servicios de Google. **5** resalta la zona de reproducción; una grabación de siete segundos confirmó que los fotogramas cambiaban.*

### Un proveedor seleccionado puede seguir siendo incompatible

También probamos Cromite SystemWebView 138.0.7204.169 porque Chrome 138 es la
[última familia Chrome compatible con Android 8 y 9](https://support.google.com/chrome/thread/352616098/sunsetting-chrome-support-for-android-8-0-oreo-and-android-9-0-pie?hl=en-GB).
Su manifiesto declara la API 26 como mínima y Android 8.1 lo seleccionó, pero el
proveedor falló durante la inicialización porque `android.webkit.PacProcessor`
no existe en ese sistema. PipePipe recibió una WebView inutilizable. Por eso
esta versión **no** aparece abajo como descarga funcional para Android 8.

<div class="screenshot-callout" role="img" aria-label="Cromite WebView 138 seleccionada en Android 8.1 pese a su incompatibilidad en tiempo de ejecución">
  <img src="/screenshots/android8-webview-provider-138-incompatible.png" alt="Android 8.1 mostrando Android System WebView 138 como proveedor seleccionado">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="24" y="158" width="672" height="150" rx="20" />
    <path class="callout-arrow" d="M 610 360 L 654 286 M 620 300 L 654 286 L 650 322" />
    <circle class="callout-number" cx="610" cy="360" r="30" /><text x="610" y="360">6</text>
  </svg>
</div>

*Captura de diagnóstico: Android 8.1 aceptó WebView 138 en la lista. **6** muestra por qué el botón seleccionado es una prueba necesaria, pero no garantiza la compatibilidad.*

<div class="screenshot-callout" role="img" aria-label="Fallo de renderizado WebView tras seleccionar WebView 138 incompatible en Android 8.1">
  <img src="/screenshots/android8-webview-provider-138-failed.png" alt="Superficie de renderizado WebView fallida en Android 8.1 con WebView 138 incompatible">
  <svg viewBox="0 0 720 1280" aria-hidden="true">
    <rect class="callout-box" x="238" y="126" width="244" height="270" rx="24" />
    <path class="callout-arrow" d="M 580 430 L 488 370 M 514 372 L 488 370 L 500 394" />
    <circle class="callout-number" cx="580" cy="430" r="30" /><text x="580" y="430">7</text>
  </svg>
</div>

*Captura de diagnóstico: superficie WebView fallida después del error de inicialización. **7** no es una página de error propia de PipePipe; el registro de Android identifica la clase de sistema ausente.*

Las pruebas establecen tres hechos diferentes:

1. PipePipe no necesita Google Play Services para la propia reproducción SABR.
2. La versión mínima de Android para instalar PipePipe no garantiza que la WebView incluida pueda ejecutar el JavaScript actual de YouTube.
3. En Android antiguos, instalar el APK de otra WebView suele ser insuficiente. Android solo enumera proveedores autorizados por la configuración y la política de firmas de la ROM. El proyecto Chromium documenta esta tarea para integradores de sistema en su [guía de integración de WebView en AOSP](https://chromium.googlesource.com/chromium/src/+/HEAD/android_webview/docs/aosp-system-integration.md).

::: warning Una WebView antigua no es una solución segura a largo plazo
Las versiones 119 y 131 anteriores fueron pruebas controladas de compatibilidad, no recomendaciones de actualización. Ya no reciben los parches de seguridad actuales de Chromium. Es preferible una ROM mantenida y su canal de actualización compatible. Si la ROM no puede ofrecer una WebView mantenida y seleccionable, un dispositivo u OS mantenido, o una arquitectura de cliente distinta, es más seguro que forzar un APK archivado dentro del sistema.
:::

::: details Descargas directas para responsables de ROM y pruebas reproducibles
Estos enlaces están fijados a las versiones o commits archivados examinados
aquí. **No** son actualizaciones universales de un solo toque. En las imágenes
AOSP limpias, la instalación normal de los paquetes probados en Android 7,
Android 8 y Cromite fue rechazada con `INSTALL_FAILED_UPDATE_INCOMPATIBLE`
porque su firma no coincidía con la del proveedor de la ROM. Usa solo un
artefacto y un procedimiento de firma o actualización admitidos expresamente
por tu ROM.

- **Android 6 / API 23, inspeccionado pero sin prueba de reproducción:**
  Bromite SystemWebView 106.0.5249.163 para
  [ARM](https://github.com/bromite/bromite/releases/download/106.0.5249.163/arm_SystemWebView.apk),
  [ARM64](https://github.com/bromite/bromite/releases/download/106.0.5249.163/arm64_SystemWebView.apk),
  [x86](https://github.com/bromite/bromite/releases/download/106.0.5249.163/x86_SystemWebView.apk) o
  [x86_64](https://github.com/bromite/bromite/releases/download/106.0.5249.163/x64_SystemWebView.apk).
  Consulta la [página de la versión](https://github.com/bromite/bromite/releases/tag/106.0.5249.163)
  y las [sumas de comprobación oficiales](https://github.com/bromite/bromite/releases/download/106.0.5249.163/brm_106.0.5249.163.sha256.txt).
  Su paquete es `org.bromite.webview`; la ROM debe permitir y confiar en ese
  proveedor. Bromite está archivado y esta versión ya no es segura.
- **Android 7 / API 24, reproducción probada:** AOSP Chromium WebView
  119.0.6045.141 para
  [ARM](https://android.googlesource.com/platform/external/chromium-webview/+archive/aca588a17000289da9b228d94cc82bd751f91f85/prebuilt/arm.tar.gz),
  [ARM64](https://android.googlesource.com/platform/external/chromium-webview/+archive/aca588a17000289da9b228d94cc82bd751f91f85/prebuilt/arm64.tar.gz),
  [x86](https://android.googlesource.com/platform/external/chromium-webview/+archive/aca588a17000289da9b228d94cc82bd751f91f85/prebuilt/x86.tar.gz) o
  [x86_64](https://android.googlesource.com/platform/external/chromium-webview/+archive/aca588a17000289da9b228d94cc82bd751f91f85/prebuilt/x86_64.tar.gz).
  Cada archivo AOSP oficial contiene `webview.apk`; el
  [commit de integración](https://android.googlesource.com/platform/external/chromium-webview/+/aca588a17000289da9b228d94cc82bd751f91f85)
  registra `sdkVersion=24` y todos los metadatos del paquete.
- **Android 8/9 / API 26 a 28, reproducción probada en API 27:** Mulch WebView
  131.0.6778.81 para
  [ARM](https://gitlab.com/divested-mobile/mulch/-/raw/c4c5b73fa5a599fbc61568c5ce0d2cc6d33ad4f2/prebuilt/arm/webview.apk?inline=false),
  [ARM64](https://gitlab.com/divested-mobile/mulch/-/raw/c4c5b73fa5a599fbc61568c5ce0d2cc6d33ad4f2/prebuilt/arm64/webview.apk?inline=false),
  [x86](https://gitlab.com/divested-mobile/mulch/-/raw/c4c5b73fa5a599fbc61568c5ce0d2cc6d33ad4f2/prebuilt/x86/webview.apk?inline=false) o
  [x86_64](https://gitlab.com/divested-mobile/mulch/-/raw/c4c5b73fa5a599fbc61568c5ce0d2cc6d33ad4f2/prebuilt/x86_64/webview.apk?inline=false).
  El [commit fijado de Mulch](https://gitlab.com/divested-mobile/mulch/-/tree/c4c5b73fa5a599fbc61568c5ce0d2cc6d33ad4f2)
  está archivado y está destinado expresamente a integrarse en un OS, no a una
  instalación APK normal.

Para identificar la arquitectura del OS, usa
`adb shell getprop ro.product.cpu.abi`. `armeabi-v7a` corresponde a ARM,
`arm64-v8a` a ARM64, y las dos opciones x86 interesan sobre todo a dispositivos
poco habituales y entornos Android virtualizados. Un procesador de 64 bits
puede ejecutar un Android de 32 bits, así que usa la ABI que indique el OS.
:::

Si un proveedor alternativo se instala pero no aparece en **Implementación de WebView**, no está activo. Reinstalarlo no cambiará la lista de proveedores permitidos ni la política de firmas de la ROM. Informa la versión de Android, ROM, paquete y versión instalados, proveedor activo y resultado exacto del instalador.

## No confundas estos fallos

| Lo que ves | Lo que establece | Siguiente acción |
| --- | --- | --- |
| Mensaje exacto **WebView no disponible** | PipePipe no pudo usar el proveedor WebView seleccionado. | Sigue esta página y reporta los detalles del proveedor si continúa. |
| `Source error`, buffering o reproducción detenida | No demuestra que WebView sea la causa. Pueden intervenir SABR, red, cuenta o reproductor. | Actualiza PipePipe y adjunta el informe de error generado. |
| `AntiBotException: Sign in to confirm you're not a bot` | Restricción de YouTube, red o autenticación. | Consulta [Reproducción, red e inicio de sesión](./youtube-playback). |
| La búsqueda no devuelve resultados | Problema independiente del extractor o la búsqueda. | Abre un informe separado con servicio, país, endpoint y estado de VPN. |

Que otra aplicación funcione en el mismo dispositivo no demuestra que PipePipe pueda eliminar este requisito. Las aplicaciones pueden usar clientes de YouTube, endpoints o rutas alternativas diferentes. Un cliente respaldado por un servicio de extracción remoto también puede sacar del teléfono el JavaScript y la atestación; es una arquitectura distinta, no una prueba de que la WebView local sea utilizable.

## Si WebView es reciente pero PipePipe la rechaza

1. Actualiza PipePipe a la versión estable más reciente y reinicia Android y PipePipe.
2. Confirma de nuevo el proveedor activo en **Implementación de WebView**; instalar Chrome o Android System WebView no basta si Android no lo ha seleccionado.
3. Si el proveedor está bloqueado por el fabricante o no se puede cambiar, no supongas que un proveedor descargado arbitrariamente es compatible. Mantén una ruta de actualización de sistema/WebView compatible y mantenida.
4. Envía un informe de bug con la información siguiente.

Esto importa incluso en una versión reciente de Android. Un proveedor actual puede fallar durante la inicialización, y PipePipe necesita el log para distinguir un problema de la aplicación de un proveedor antiguo o incompatible.

## Contenido de un informe de bug

Abre un **informe de bug**, no una petición de función, e incluye:

- versión de PipePipe y fuente de instalación;
- versión de Android y modelo del dispositivo;
- nombre de paquete y versión completa del proveedor WebView;
- endpoint de extracción de YouTube seleccionado;
- estado de sesión de YouTube, país de red y estado de VPN/proxy;
- una URL afectada y hora de la prueba;
- el informe de error o crash log generado por PipePipe;
- una captura de **Implementación de WebView** si el proveedor no está disponible o está bloqueado.

Mantén los síntomas no relacionados, especialmente los problemas de búsqueda, en una issue independiente. Los dos informes necesitan evidencias distintas y sus causas pueden ser independientes.
