# Reproducción e integración Android

## MediaCodec y fallos de superficie de vídeo

¿El vídeo empieza y después se congela, o PipePipe muestra un error? Abre el
informe y busca `MediaCodec`. Si aparece, el problema probablemente viene del
decodificador de vídeo del dispositivo, no de la conexión ni de la extracción
de YouTube.

No cambies varios ajustes al azar. Busca en el informe el texto que coincide con
una fila de la tabla y prueba solo la solución de esa fila.

En un teléfono, desliza la tabla horizontalmente para ver la primera prueba de
la última columna.

| Evidencia del informe | Qué significa | Primera prueba |
| --- | --- | --- |
| `video/av01` o un códec que empieza por `av01` | El flujo seleccionado usa AV1. | Desactiva **AV01** en **Ajustes → Reproductor → Activar formatos avanzados**, vuelve a abrir el vídeo y prueba VP9 o AVC. |
| `video/x-vnd.on2.vp9` | El flujo seleccionado usa VP9. | Prueba AVC o una resolución inferior. |
| `video/avc` | El flujo seleccionado usa H.264/AVC. | Prueba una resolución inferior y después el ajuste MediaCodec correspondiente si su marcador aparece en la traza. |
| `format_supported=NO_EXCEEDS_CAPABILITIES` | El flujo supera las capacidades que Android declaró para ese decodificador. | Selecciona una resolución inferior u otro códec. |
| `format_supported=YES` seguido de `MediaCodecVideoDecoderException` | Android declaró compatibilidad, pero el decodificador falló durante la ejecución. | Cambia primero de códec; `YES` no garantiza una decodificación estable. |
| `The surface has been released` o `setOutputSurface` | Android perdió o cambió la superficie de vídeo al configurar el decodificador. | Activa el ajuste de superficie indicado abajo. |
| `AsynchronousMediaCodecAdapter` o `AsynchronousMediaCodecBufferEnqueuer` | El fallo pasó por la cola asíncrona de MediaCodec. | Prueba el ajuste de cola asíncrona indicado abajo. |
| `InvalidResponseCodeException: Response code: 403` | YouTube rechazó una petición multimedia antes de que llegara al decodificador. | Sigue [Reproducción y extracción de YouTube](./youtube-playback); cambiar de códec no corrige este error. |

### El vídeo se detiene al cabo de un rato con un error AV1

Si el informe contiene las tres líneas siguientes, estás en el lugar correcto.
Es exactamente el caso de
[#2727](https://github.com/InfinityLoop1308/PipePipe/issues/2727):

```text
video/av01, av01.0.08M.08
format_supported=YES
Decoder failed: c2.android.av1-dav1d.decoder
```

En pocas palabras, PipePipe eligió la versión AV1 1080p del vídeo. Android
empezó a reproducirla con su decodificador por software
`c2.android.av1-dav1d.decoder`, pero este se detuvo durante la reproducción. La
solución más sencilla es pedirle a PipePipe que use VP9.

No te preocupes: desactivar AV1 no borra vídeos, suscripciones ni ajustes.
Podrás seguir viendo los mismos vídeos; PipePipe solo evitará su versión AV1.

#### Desactivar AV1 paso a paso

1. En la pantalla principal de PipePipe, busca el botón **☰** de la esquina
   superior izquierda y púlsalo. Las capturas muestran los nombres en inglés
   porque la aplicación utilizada para esta guía está configurada en inglés.

<div class="screenshot-callout" role="img" aria-label="Pantalla principal de PipePipe con el botón del menú resaltado">
  <img src="/screenshots/pipepipe-home-5.2.4-beta3-api36.png" alt="Pantalla principal de PipePipe mostrando el botón del menú en la esquina superior izquierda">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="8" y="58" width="142" height="158" rx="24" />
    <path class="callout-arrow" d="M 280 285 L 120 185 M 183 195 L 120 185 L 151 240" />
    <circle class="callout-number" cx="280" cy="285" r="42" /><text x="280" y="285">1</text>
  </svg>
</div>

2. Se abre el menú lateral. Pulsa **Ajustes**, al final de la lista.

<div class="screenshot-callout" role="img" aria-label="Menú lateral de PipePipe con Ajustes resaltado">
  <img src="/screenshots/pipepipe-drawer-settings-5.2.4-beta3-api36.png" alt="Menú lateral de PipePipe mostrando Settings, o Ajustes en español">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="12" y="1205" width="720" height="190" rx="28" />
    <path class="callout-arrow" d="M 820 1320 L 710 1310 M 762 1275 L 710 1310 L 770 1340" />
    <circle class="callout-number" cx="820" cy="1320" r="42" /><text x="820" y="1320">2</text>
  </svg>
</div>

3. En la pantalla Ajustes, pulsa **Reproductor** o **Player**.

<div class="screenshot-callout" role="img" aria-label="Pantalla Ajustes de PipePipe con Reproductor resaltado">
  <img src="/screenshots/pipepipe-settings-5.2.4-beta3-api36.png" alt="Pantalla Ajustes de PipePipe mostrando Player, o Reproductor en español">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="12" y="205" width="1056" height="155" rx="28" />
    <path class="callout-arrow" d="M 900 450 L 980 350 M 930 380 L 980 350 L 968 410" />
    <circle class="callout-number" cx="900" cy="450" r="42" /><text x="900" y="450">3</text>
  </svg>
</div>

4. Pulsa toda la fila **Activar formatos avanzados**. Es un botón aunque la
   fila no parezca un interruptor.

<div class="screenshot-callout" role="img" aria-label="Ajustes del Reproductor con Activar formatos avanzados resaltado">
  <img src="/screenshots/pipepipe-player-5.2.4-beta3-api36.png" alt="Ajustes del Reproductor mostrando Enable advanced formats, o Activar formatos avanzados en español">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="12" y="580" width="1056" height="435" rx="28" />
    <path class="callout-arrow" d="M 890 1090 L 990 1000 M 932 1020 L 990 1000 L 968 1058" />
    <circle class="callout-number" cx="890" cy="1090" r="42" /><text x="890" y="1090">4</text>
  </svg>
</div>

5. Busca **AV01**. Una casilla roja marcada significa que AV1 está activado.
   Pulsa **AV01** una vez para dejar su casilla vacía. Mantén **VP9** marcado para
   la primera prueba.

<div class="screenshot-callout" role="img" aria-label="Ventana Formatos avanzados con AV01 activado y resaltado">
  <img src="/screenshots/pipepipe-advanced-formats-av01-on-5.2.4-beta3-api36.png" alt="Ventana Formatos avanzados con una casilla roja marcada junto a AV01">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="100" y="1015" width="860" height="155" rx="24" />
    <path class="callout-arrow" d="M 935 1235 L 900 1150 M 889 1198 L 900 1150 L 930 1190" />
    <circle class="callout-number" cx="935" cy="1235" r="42" /><text x="935" y="1235">5</text>
  </svg>
</div>

6. Comprueba que la casilla junto a **AV01** esté vacía y pulsa **OK**. No pulses
   **Cancelar** o **Cancel**, porque descartaría el cambio.

<div class="screenshot-callout" role="img" aria-label="Ventana Formatos avanzados con AV01 desactivado y OK resaltado">
  <img src="/screenshots/pipepipe-advanced-formats-av01-off-5.2.4-beta3-api36.png" alt="Ventana Formatos avanzados con una casilla vacía junto a AV01 y el botón OK">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="100" y="1015" width="860" height="155" rx="24" />
    <path class="callout-arrow" d="M 940 970 L 900 1040 M 940 1010 L 900 1040 L 910 992" />
    <circle class="callout-number" cx="940" cy="970" r="42" /><text x="940" y="970">6</text>
    <rect class="callout-box" x="790" y="1395" width="205" height="185" rx="24" />
    <path class="callout-arrow" d="M 730 1640 L 820 1560 M 768 1575 L 820 1560 L 800 1610" />
    <circle class="callout-number" cx="730" cy="1640" r="42" /><text x="730" y="1640">7</text>
  </svg>
</div>

7. Sal del vídeo afectado con el botón Atrás hasta que su reproductor se cierre
   y después vuelve a abrir ese vídeo. No necesitas borrar la caché, eliminar
   datos ni reinstalar PipePipe.

Prueba otra vez con 1080p o 720p. Si el decodificador sigue fallando, vuelve a
la misma lista, desmarca también VP9 y HEVC, deja AV01 desmarcado, pulsa **OK** y
prueba AVC en 720p. Si el fallo continúa, adjunta el nuevo informe. Su códec y
formato mostrarán si realmente cambió el decodificador afectado.

#### Por qué funciona

AV1 no está activado por defecto. Si lo activas, PipePipe prefiere actualmente
AV1 a VP9, HEVC y AVC para la misma resolución. PipePipe también
activa el fallback de decodificadores de Media3, pero solo prueba otro
decodificador del mismo formato cuando falla la inicialización. No sustituye un
flujo AV1 activo por VP9 o AVC después de un fallo durante la reproducción.

### Usa un ajuste MediaCodec solo si coincide su marcador

En **Ajustes → Avanzado → Ajustes ExoPlayer**, prueba un solo ajuste pertinente
cada vez:

- **Desactivar cola asíncrona MediaCodec** para problemas de compatibilidad de cola asíncrona; puede reducir rendimiento.
- **Usar siempre el workaround de superficie de salida de vídeo ExoPlayer** si el fallo ocurre al cambiar la superficie de vídeo Android.

Reinicia la reproducción tras cada cambio y conserva informe si no ayuda. Estos interruptores intercambian compatibilidad por rendimiento o usan otra ruta de salida; no son soluciones generales de calidad/red. Anota estado original, un único interruptor cambiado, URL/formato probado y resultado. Restablece el workaround inútil para que informes posteriores describan estado normal.

Si el audio sigue pero la imagen es negra, parpadea o se entrecorta, incluye códec/formato y resolución seleccionados. Códecs avanzados o resolución alta pueden exponer una limitación del decodificador no visible en un stream sencillo.

## Problemas específicos del dispositivo

Para un fallo limitado a teléfono, ROM, tableta, modo TV o versión Android, indica modelo, Android/ROM, orientación y si ocurre en otro equipo. «Funciona en mi otro teléfono» es comparación útil, no reproducción suficiente.

## Android Auto

Android Auto puede ocultar apps instaladas fuera de Google Play. Activa ajustes de desarrollador de Android Auto, permite fuentes desconocidas allí y reconecta el dispositivo. Esto afecta visibilidad, no red ni comportamiento YouTube.

Para Android Auto, aclara si PipePipe falta en lanzador, aparece pero no abre, o abre pero no reproduce. Añade versión Android Auto, Android del teléfono, contexto de vehículo/unidad si procede y fuente de instalación.
