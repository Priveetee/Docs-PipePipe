# Listas, historial y suscripciones

## Listas y cola

Para una lista en línea vacía, incompleta o que no carga, incluye URL, servicio, sesión, endpoint y resultado al reabrir. Para lista local, añade orden y acción que cambió la lista.

Una lista en línea es dato del servicio; una lista local es dato de PipePipe. Di siempre cuál. Para la primera, indica si falla cada página/continuación o solo faltan elementos posteriores. Para la segunda, ofrece la secuencia exacta de edición/navegación y si la precedió importación u ordenación.

## Suscripciones y feeds

Para elementos ausentes, suscripción fallida o importación interrumpida, indica URL del canal, servicio, país de contenido, sesión y si afecta a uno o todos los canales. No publiques una exportación completa de suscripciones privadas.

Indica si la propia página de canal muestra el elemento ausente. Si sí, pero el feed de suscripciones no, da URL/fecha del elemento y qué ocurre al actualizar/reabrir. Si el canal también falla, probablemente sea otra ruta de servicio/extracción.

::: info Metadatos de feed incompletos que pueden ser esperados
La issue cerrada [#2521](https://github.com/InfinityLoop1308/PipePipe/issues/2521)
muestra que falta de duración puede ser normal con el camino de feed dedicado/rápido:
vuelve antes pero puede omitir duración, estado en directo/próximo o filtrado de
Shorts. Identifica primero el modo de feed y actualiza una vez antes de informarlo
como defecto visual.
:::

## Historial y posiciones

Indica si el historial está activo, si las posiciones se restauran y si el problema ocurre tras importar. Posiciones de reproducción y visibilidad de historial son ajustes distintos.

Para un reinicio inesperado, añade si es posición guardada, transición de cola o recarga de una lista en línea. Parecen iguales desde el reproductor, pero pertenecen a subsistemas distintos.
