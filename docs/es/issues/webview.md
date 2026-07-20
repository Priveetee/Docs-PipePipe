# WebView y la reproducción de YouTube

## Empieza aquí: comprueba PipePipe antes de sustituir WebView

El requisito de WebView cambió después de PipePipe 5.2.3. Usa la versión de
PipePipe instalada, no solo la versión de Android, para decidir el siguiente paso.

| Versión de PipePipe | Qué necesita | Primera acción |
| --- | --- | --- |
| **5.2.4-beta o posterior** | Un proveedor WebView activo que Android pueda inicializar. La versión mayor 80 ya no es un mínimo obligatorio. | Conserva el proveedor seleccionado por la ROM. No lo sustituyas solo porque sea antiguo. |
| **5.2.3** | Un proveedor WebView con versión mayor 80 o posterior. | Actualiza PipePipe preferentemente. Si mantienes 5.2.3, consulta las instrucciones históricas más abajo. |
| Cualquier versión informa que no existe proveedor o que falla la inicialización | Android no está ofreciendo a PipePipe un proveedor utilizable. | Comprueba **Implementación de WebView** y el estado del proveedor. |

El mensaje exacto siguiente pertenece a PipePipe 5.2.3 y versiones anteriores:

> **WebView no disponible. Por favor, asegúrese de que su versión de WebView sea superior a 80.**

Es un error de compatibilidad, no una petición para iniciar sesión en YouTube ni
una prueba de que el teléfono sea demasiado antiguo. La solución más sencilla
ahora es instalar
[5.2.4-beta](https://github.com/InfinityLoop1308/PipePipe/releases/tag/v5.2.4-beta)
o una versión posterior. Como 5.2.4-beta es una versión preliminar, crea primero
una [copia de seguridad](/es/user-guide/backup-and-restore) y conserva el APK
anterior si dependes del dispositivo.

![Cómo interviene WebView en la reproducción de YouTube](/diagrams/webview-playback.png)

## Por qué PipePipe comprueba WebView

Algunos flujos de YouTube usan SABR, un protocolo de entrega basado en sesiones.
PipePipe usa Android WebView localmente para dos tareas JavaScript: decodificar
datos del reproductor de YouTube mediante EJS y ejecutar BotGuard para obtener
tokens de sesión y vídeo de corta duración. Google Play Services no participa
en esta ruta.

PipePipe 5.2.4-beta incluye recursos EJS compatibles con ES5, polyfills y un
puente BotGuard compatible con JavaScript antiguo. Se eliminaron tanto el
bloqueo por versión 80 como la prueba de capacidades JavaScript modernas.
PipePipe todavía comprueba que Android expone un proveedor y que su motor se
inicia de verdad; un proveedor ausente, desactivado, bloqueado por el fabricante
o averiado todavía puede fallar.

Tres consecuencias importantes:

- Cambiar el endpoint de YouTube no sustituye el motor WebView local.
- Un proveedor antiguo ya no se rechaza solo por su número de versión.
- Un proveedor reciente todavía puede no inicializarse. En ese caso hace falta
  el registro y los datos del proveedor, no instalaciones repetidas de APK.

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

Con PipePipe 5.2.4-beta o posterior, el proveedor incluido en una ROM antigua
puede ser suficiente. Verificamos una reproducción real con los proveedores
originales de Android 6, 7 y 8. No instales Chrome únicamente porque el teléfono
use Android 7 a 9.

En la configuración habitual con Google, Android 7 a 9 puede ofrecer Chrome
como WebView. Una ROM sin Google puede ofrecer un proveedor independiente. Lo
importante es el proveedor que Android selecciona realmente, no que aparezca un
APK de Chrome o WebView sin relación en la lista de aplicaciones.

::: info Android orientado a la privacidad y fabricantes
Algunos sistemas ofrecen otro proveedor WebView; algunos dispositivos solo
permiten el proveedor del fabricante. Conserva el proveedor admitido por la ROM
cuando funcione. PipePipe no puede instalar, seleccionar ni sustituir un
proveedor WebView del sistema por ti.
:::

## Lo que verificamos en Android antiguos sin servicios de Google

Probamos el APK x86_64 publicado de PipePipe **5.2.4-beta** en imágenes AOSP
limpias el 2026-07-20. No contenían Play Store, Google Play Services ni Chrome.
Conservamos la WebView original de cada sistema y abrimos el mismo vídeo público
de YouTube.

| Sistema | Proveedor activo original | Resultado verificado |
| --- | --- | --- |
| Android 6.0 / API 23 | AOSP `com.android.webview` 44.0.2403.119 | Motor compartido listo, decodificación EJS y creación de tokens correctas, reproducción SABR en movimiento verificada. |
| Android 7.0 / API 24 | AOSP `com.android.webview` 52.0.2743.100 | Reproducción SABR en movimiento verificada sin instalar Chrome. |
| Android 8.1 / API 27 | AOSP `com.android.webview` 61.0.3163.98 | Proveedor seleccionado por Android y reproducción SABR en movimiento verificada. |

Son resultados de reproducción de extremo a extremo, no pruebas que terminaron
después de cargar el inicio, una miniatura o la página del vídeo.

<div class="screenshot-callout" role="img" aria-label="Reproducción de YouTube en PipePipe 5.2.4-beta en Android 6 con la WebView 44 original">
  <img src="/screenshots/pipepipe-playback-5.2.4-beta-android6-webview44.png" alt="Reproducción de YouTube en PipePipe 5.2.4-beta en Android 6 con WebView 44">
  <svg viewBox="0 0 1080 1920" aria-hidden="true">
    <rect class="callout-box" x="12" y="62" width="1056" height="608" rx="28" />
    <path class="callout-arrow" d="M 920 760 L 990 682 M 950 696 L 990 682 L 980 724" />
    <circle class="callout-number" cx="920" cy="760" r="42" /><text x="920" y="760">1</text>
  </svg>
</div>

*PipePipe 5.2.4-beta · Android 6/API 23 · WebView AOSP 44 original · sin servicios de Google. **1** resalta un fotograma real del vídeo en movimiento.*

<div class="screenshot-callout" role="img" aria-label="Reproducción de YouTube en PipePipe 5.2.4-beta en Android 7 con la WebView 52 original">
  <img src="/screenshots/pipepipe-playback-5.2.4-beta-android7-webview52.png" alt="Reproducción de YouTube en PipePipe 5.2.4-beta en Android 7 con WebView 52">
  <svg viewBox="0 0 1080 1920" aria-hidden="true">
    <rect class="callout-box" x="12" y="72" width="1056" height="608" rx="28" />
    <path class="callout-arrow" d="M 920 770 L 990 692 M 950 706 L 990 692 L 980 734" />
    <circle class="callout-number" cx="920" cy="770" r="42" /><text x="920" y="770">2</text>
  </svg>
</div>

*PipePipe 5.2.4-beta · Android 7/API 24 · WebView AOSP 52 original · sin Chrome ni servicios de Google. **2** resalta la reproducción en movimiento.*

<div class="screenshot-callout" role="img" aria-label="Reproducción de YouTube en PipePipe 5.2.4-beta en Android 8.1 con la WebView 61 original">
  <img src="/screenshots/pipepipe-playback-5.2.4-beta-android8-webview61.png" alt="Reproducción de YouTube en PipePipe 5.2.4-beta en Android 8.1 con WebView 61">
  <svg viewBox="0 0 1080 1920" aria-hidden="true">
    <rect class="callout-box" x="12" y="72" width="1056" height="608" rx="28" />
    <path class="callout-arrow" d="M 920 770 L 990 692 M 950 706 L 990 692 L 980 734" />
    <circle class="callout-number" cx="920" cy="770" r="42" /><text x="920" y="770">3</text>
  </svg>
</div>

*PipePipe 5.2.4-beta · Android 8.1/API 27 · WebView AOSP 61 original · sin Chrome ni servicios de Google. **3** resalta la reproducción en movimiento.*

::: details Por qué las capturas antiguas de 5.2.3 exigían actualizar WebView

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

:::

### Comprobación visual si el error continúa

Si 5.2.4-beta o una versión posterior todavía informa que WebView no está
disponible, abre **Opciones para desarrolladores → Implementación de WebView**.
Deben verse el botón seleccionado y la versión completa. Instalar un APK no es
suficiente.

<div class="screenshot-callout" role="img" aria-label="Pantalla de implementación WebView de Android 8.1 con la WebView 61 original seleccionada">
  <img src="/screenshots/android8-webview-provider-61.png" alt="Pantalla de implementación WebView de Android 8.1 con Android System WebView 61 seleccionada">
  <svg viewBox="0 0 1080 1920" aria-hidden="true">
    <rect class="callout-box" x="18" y="240" width="1044" height="218" rx="28" />
    <path class="callout-arrow" d="M 820 555 L 980 460 M 930 462 L 980 460 L 955 505" />
    <circle class="callout-number" cx="820" cy="555" r="42" /><text x="820" y="555">4</text>
  </svg>
</div>

*Android 8.1/API 27 · WebView AOSP 61 original · sin servicios de Google. **4** resalta el proveedor seleccionado y su versión completa. La captura de Android 8 anterior verifica que este mismo proveedor funcionó realmente.*

Después cierra PipePipe por completo, vuelve a abrirlo y reproduce un vídeo
público de YouTube. Cargar el inicio o una miniatura no prueba por sí solo la
ruta completa de EJS, BotGuard, tokens y SABR.

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

1. PipePipe no necesita Google Play Services ni Chrome para la reproducción SABR local.
2. El código de compatibilidad de PipePipe, no la sustitución del proveedor, hizo utilizables de nuevo las WebView 44, 52 y 61.
3. Android todavía decide qué paquete WebView está autorizado y activo. Instalar un APK que nunca se convierte en el proveedor seleccionado no cambia nada. Chromium documenta el registro de proveedores como tarea de integración del sistema en su [guía de integración de WebView en AOSP](https://chromium.googlesource.com/chromium/src/+/HEAD/android_webview/docs/aosp-system-integration.md).

::: warning La compatibilidad de reproducción no es una actualización de seguridad
Los proveedores originales probados arriba son antiguos y ya no reciben los
parches de seguridad de Chromium. Que PipePipe haga compatible su JavaScript
local no convierte WebView en una opción segura para navegación normal o
contenido no fiable. Prefiere una ROM mantenida y su canal de actualización
compatible cuando exista.
:::

::: details Artefactos históricos de PipePipe 5.2.3 para responsables de ROM
Esta sección documenta los ensayos controlados de PipePipe 5.2.3. No es
necesaria con 5.2.4-beta o una versión posterior. Estos enlaces están fijados a
las versiones o commits archivados examinados
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
  131.0.6778.200 para ARM/ARM64 y 131.0.6778.81 para x86/x86_64:
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

::: details Android 8 rooteado: qué puede corregir root y qué no
En una imagen de prueba rooteada con Android 8.0/API 26 reproducimos el estado
exacto en el que el paquete Mulch se instala correctamente, pero no aparece en
**Implementación de WebView**. Android conocía el APK, pero su servicio WebView
no consideraba `us.spotco.mulch_wv` un proveedor permitido.

Un overlay de recursos del framework que añadía el paquete Mulch y su certificado
de firma oficial cambió el resultado. Tras reiniciar, Android mostró Mulch y
`dumpsys webviewupdate` lo marcó como proveedor válido y actual. Compilaciones x86
correctamente empaquetadas de Mulch 119 y 131 pudieron renderizar después una
página HTTPS real en API 26. También verificamos que el certificado permitido
por el overlay coincide exactamente con los APK oficiales Mulch ARM y ARM64.

Esto valida el mecanismo de registro del proveedor, no todos los teléfonos
rooteados. El emulador Android de este host x86_64 no puede arrancar la imagen
ARM64, por lo que aquí no se ejecutó la combinación Sony/ARM exacta. PipePipe
5.2.3 inicializó su WebView compartida en API 26, pero la extracción del flujo de
YouTube probado no terminó; esta ejecución **no** se presenta como una prueba de
reproducción superada en API 26. El resultado de reproducción en API 27 descrito
arriba sigue siendo la prueba completa verificada.

Recoge estos diagnósticos de solo lectura antes de modificar el sistema:

```sh
adb shell getprop ro.product.cpu.abi
adb shell pm path us.spotco.mulch_wv
adb shell dumpsys webviewupdate
```

- Una ruta de Mulch bajo `/data/app/` sin una entrada `us.spotco.mulch_wv` en
  **WebView packages** reproduce el problema de la lista de proveedores.
- `Valid package us.spotco.mulch_wv` junto con el mismo **Current WebView
  package** demuestra que Android lo aceptó y seleccionó.
- Un proveedor válido y actual seguido de un fallo en PipePipe requiere el log
  de la aplicación; la selección no demuestra por sí sola JavaScript o vídeo.

[Open WebView](https://github.com/Magisk-Modules-Alt-Repo/open_webview) es una
implementación de referencia del overlay Magisk necesario y declara soporte para
API 26/27. Trátalo como referencia para usuarios expertos, no como una actualización
rutinaria: su última versión es la
[2.5.2 del 16 de diciembre de 2024](https://github.com/Magisk-Modules-Alt-Repo/open_webview/releases/tag/v2.5.2),
no actualiza automáticamente el proveedor y Mulch está archivado. Haz una copia
completa del estado de arranque y del sistema y sigue la ruta de recuperación
específica de la ROM; un reemplazo genérico puede eliminar todas las WebView
funcionales o impedir el arranque.
:::

## No confundas estos fallos

| Lo que ves | Lo que establece | Siguiente acción |
| --- | --- | --- |
| Mensaje exacto que exige una versión **superior a 80** | El dispositivo usa PipePipe 5.2.3 o una versión anterior con el bloqueo de versión retirado. | Actualiza PipePipe antes de sustituir el proveedor del sistema. |
| **No hay ningún proveedor Android WebView disponible** o falla la inicialización del motor en 5.2.4-beta+ | Android no ofreció un proveedor, o el proveedor seleccionado no pudo iniciarse. | Comprueba **Implementación de WebView** y después informa los datos del proveedor y el registro. |
| `Source error`, buffering o reproducción detenida | No demuestra que WebView sea la causa. Pueden intervenir SABR, red, cuenta o reproductor. | Actualiza PipePipe y adjunta el informe de error generado. |
| `AntiBotException: Sign in to confirm you're not a bot` | Restricción de YouTube, red o autenticación. | Consulta [Reproducción, red e inicio de sesión](./youtube-playback). |
| La búsqueda no devuelve resultados | Problema independiente del extractor o la búsqueda. | Abre un informe separado con servicio, país, endpoint y estado de VPN. |

Que otra aplicación funcione en el mismo dispositivo no demuestra que el
proveedor WebView seleccionado por Android funcione. Las aplicaciones pueden
usar otros clientes de YouTube, endpoints o servicios remotos. PipePipe
5.2.4-beta todavía ejecuta EJS y la atestación localmente, pero ahora adapta ese
JavaScript a proveedores antiguos.

## Si 5.2.4-beta o una versión posterior todavía rechaza WebView

1. Confirma la versión instalada de PipePipe. El antiguo mensaje que exige la
   versión 80 significa que la aplicación todavía no se ha actualizado.
2. Confirma de nuevo el proveedor activo en **Implementación de WebView**; instalar Chrome o Android System WebView no basta si Android no lo ha seleccionado.
3. Si el proveedor está bloqueado por el fabricante o no se puede cambiar, no supongas que un proveedor descargado arbitrariamente es compatible. Mantén una ruta de actualización de sistema/WebView compatible y mantenida.
4. Envía un informe de bug con la información siguiente.

La antigüedad del proveedor ya no decide por sí sola. PipePipe necesita el
registro para distinguir un proveedor ausente, un fallo al inicializar el motor
y un error posterior de YouTube o SABR.

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
