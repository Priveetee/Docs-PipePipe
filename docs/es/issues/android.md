# Reproducción e integración Android

## MediaCodec y fallos de superficie de vídeo

Si el informe PipePipe menciona `MediaCodec`, el decodificador Android puede fallar en vez de la extracción YouTube. En **Ajustes → Avanzado → Ajustes ExoPlayer**, prueba un solo ajuste pertinente cada vez:

- **Desactivar cola asíncrona MediaCodec** para problemas de compatibilidad de cola asíncrona; puede reducir rendimiento.
- **Usar siempre el workaround de superficie de salida de vídeo ExoPlayer** si el fallo ocurre al cambiar la superficie de vídeo Android.

Reinicia la reproducción tras cada cambio y conserva informe si no ayuda. Estos interruptores intercambian compatibilidad por rendimiento o usan otra ruta de salida; no son soluciones generales de calidad/red. Anota estado original, un único interruptor cambiado, URL/formato probado y resultado. Restablece el workaround inútil para que informes posteriores describan estado normal.

Si el audio sigue pero la imagen es negra, parpadea o se entrecorta, incluye códec/formato y resolución seleccionados. Códecs avanzados o resolución alta pueden exponer una limitación del decodificador no visible en un stream sencillo.

## Problemas específicos del dispositivo

Para un fallo limitado a teléfono, ROM, tableta, modo TV o versión Android, indica modelo, Android/ROM, orientación y si ocurre en otro equipo. «Funciona en mi otro teléfono» es comparación útil, no reproducción suficiente.

## Android Auto

Android Auto puede ocultar apps instaladas fuera de Google Play. Activa ajustes de desarrollador de Android Auto, permite fuentes desconocidas allí y reconecta el dispositivo. Esto afecta visibilidad, no red ni comportamiento YouTube.

Para Android Auto, aclara si PipePipe falta en lanzador, aparece pero no abre, o abre pero no reproduce. Añade versión Android Auto, Android del teléfono, contexto de vehículo/unidad si procede y fuente de instalación.
