# Configuración, actualizaciones y copias

## Actualiza antes de diagnosticar

Compara la versión instalada con [GitHub Releases](https://github.com/InfinityLoop1308/PipePipe/releases). Los catálogos pueden retrasarse. Usa versiones estables normalmente; prueba una preliminar solo para una corrección identificada y si puedes informar el resultado.

La comprobación integrada de actualizaciones es un mecanismo de aviso: indica que hay una versión disponible, no sustituye silenciosamente el APK instalado. En **Ajustes → Actualizaciones**, comprueba la búsqueda de actualizaciones y **Mostrar actualizaciones preliminares** antes de informar que no aparece una beta esperada.

<div class="screenshot-callout" role="img" aria-label="Ajustes de actualizaciones PipePipe con preliminares y comprobación manual resaltados">
  <img src="/screenshots/pipepipe-updates-5.2.3-api36.png" alt="Ajustes de actualizaciones PipePipe, 5.2.3 en Android 16">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="25" y="555" width="1030" height="235" rx="28" />
    <path class="callout-arrow" d="M 900 470 L 900 535 M 875 510 L 900 535 L 925 510" />
    <circle class="callout-number" cx="990" cy="580" r="42" /><text x="990" y="580">1</text>
    <rect class="callout-box" x="25" y="805" width="1030" height="175" rx="28" />
    <circle class="callout-number" cx="990" cy="830" r="42" /><text x="990" y="830">2</text>
  </svg>
</div>

*Captura de referencia: PipePipe 5.2.3 · Android 16/API 36. **1** activa versiones preliminares; **2** ejecuta comprobación manual. La comprobación solo avisa y no instala un APK silenciosamente.*

::: tip
Cuando una issue diga «corregido en beta» o «en la próxima versión», instala exactamente esa compilación, reinicia PipePipe y vuelve a probar una vez antes de abrir un duplicado.
:::

## Instalación

PipePipe requiere Android 6.0 / API 23 o posterior. Para un fallo de instalación, anota Android, ABI, fuente del APK y mensaje exacto.

No deduzcas la arquitectura de CPU solo por el modelo del teléfono. El proyecto publica `armeabi-v7a`, `arm64-v8a`, `x86` y `x86_64`; un mensaje de paquete incompatible, firma o ABI aporta evidencia útil. Indica si la compilación viene de GitHub Releases, Obtainium, F-Droid/IzzyOnDroid u otra fuente: un catálogo puede publicar después del upstream.

Si Android rechaza una actualización con PipePipe ya instalado, conserva el mensaje exacto. Un conflicto de clave de firma normalmente no se arregla instalando encima: exporta primero los datos locales y desinstala solo si entiendes el riesgo de pérdida de datos.

## Exportación, importación y migración

Crea una exportación antes de importar, migrar o probar una preliminar. La importación puede reemplazar historial, suscripciones, listas y ajustes; no es una combinación inocua que se pueda deshacer fácilmente.

1. Exporta desde la instalación origen y guarda una copia intacta fuera del dispositivo si es posible.
2. Anota versiones origen/destino y formato elegido.
3. Importa una sola vez; evita reintentos repetidos después de cambiar listas locales.
4. Comprueba una muestra: suscripciones, listas locales, historial/posiciones y ajustes.

## Importación interrumpida

Indica formato, versiones origen/destino, paso, número aproximado de elementos e interrupción. Di también si se revocó el acceso al almacenamiento. Para una suscripción ausente, aporta la URL pública del canal en vez del archivo completo e indica si los datos eran locales o de un servicio.

Nunca adjuntes una copia privada a una issue pública.

## Plantilla de informe

```text
Versión y fuente de PipePipe:
Versión de Android / ABI del dispositivo:
Instalación anterior y versión:
Ajustes de actualización (incluidas preliminares):
Error exacto de instalador o importación:
Esperaba / ocurrió:
Formato y tamaño aproximado de la copia (sin adjuntarla):
```
