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

![Pantalla Android de implementación WebView, Android 16](/screenshots/android-webview-provider-api36.png)

*Captura de referencia: Android 16/API 36. Nombre y versión son ejemplos: informa los valores de tu propio dispositivo.*

La pantalla de error de PipePipe da estas indicaciones prácticas:

- **Android 6 y Android 10:** actualiza **Android System WebView**.
- **Android 7, 8 y 9:** actualiza **Chrome** y selecciónalo como implementación WebView si Android ofrece esa opción.
- **Otras versiones de Android:** el error es inesperado; repórtalo.

::: info Android orientado a la privacidad y fabricantes
Algunos sistemas ofrecen otro proveedor WebView; algunos dispositivos solo permiten el proveedor del fabricante. Usa un proveedor mantenido que Android acepte para tu dispositivo. PipePipe no puede instalar, seleccionar ni sustituir un proveedor WebView del sistema por ti.
:::

## No confundas estos fallos

| Lo que ves | Lo que establece | Siguiente acción |
| --- | --- | --- |
| Mensaje exacto **WebView no disponible** | PipePipe no pudo usar el proveedor WebView seleccionado. | Sigue esta página y reporta los detalles del proveedor si continúa. |
| `Source error`, buffering o reproducción detenida | No demuestra que WebView sea la causa. Pueden intervenir SABR, red, cuenta o reproductor. | Actualiza PipePipe y adjunta el informe de error generado. |
| `AntiBotException: Sign in to confirm you're not a bot` | Restricción de YouTube, red o autenticación. | Consulta [Reproducción, red e inicio de sesión](./youtube-playback). |
| La búsqueda no devuelve resultados | Problema independiente del extractor o la búsqueda. | Abre un informe separado con servicio, país, endpoint y estado de VPN. |

Que otra aplicación funcione en el mismo dispositivo no demuestra que PipePipe pueda eliminar este requisito. Las aplicaciones pueden usar clientes de YouTube, endpoints o rutas alternativas diferentes.

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
