# Ajustes de Comportamiento

Esta sección controla el comportamiento general de la aplicación, como lo que ocurre cuando abres contenido o cambias entre apps.

::: info Ubicación actual
En PipePipe 5.2.3, estos controles están en **Ajustes → Reproductor**. La agrupación puede cambiar en una versión futura; usa la búsqueda de ajustes si una etiqueta no está donde indica esta guía.
:::

### Acción 'abrir' preferida

Define la acción usada **cuando PipePipe recibe un enlace de vídeo desde otra aplicación Android** (navegador, mensajería, hoja de compartir, etc.). No cambia el comportamiento habitual al tocar un vídeo dentro de PipePipe: los toques internos siguen abriendo la ficha o el reproductor principal.

- **Opciones:** Mostrar información, Reproductor de vídeo, Reproductor en segundo plano, Reproductor popup, Descargar, Añadir a la lista, Preguntar siempre.
- **Por defecto:** Reproductor de vídeo

Si parece que se ignora, pruébalo con un enlace compartido desde otra aplicación e indica cuál era. Un toque normal dentro de PipePipe no es un fallo de este ajuste: queda fuera de su alcance.

![Ajustes de reproductor PipePipe, 5.2.3 en Android 16](/screenshots/pipepipe-player-5.2.3-api36.png)

*Captura de referencia: PipePipe 5.2.3 · Android 16/API 36. Los valores y apariencia Android pueden variar.*

::: tip Mi Preferencia
Yo lo configuro en **Reproductor de vídeo** para empezar a ver el contenido de inmediato sin pasos adicionales.
:::

### Usar un reproductor de audio externo

Cuando está activado, reproduce los flujos de audio usando una app de música de terceros en tu dispositivo en lugar del reproductor integrado de PipePipe.

- **Por defecto:** Desactivado

### Minimizar al cambiar de app

Determina qué le ocurre al vídeo cuando cambias a otra app desde el reproductor principal.

- **Opciones:** Ninguna, Minimizar al reproductor en segundo plano, Minimizar al reproductor popup.
- **Por defecto:** Minimizar al reproductor en segundo plano

Solo controla la salida del reproductor principal hacia otra aplicación. Es independiente de la acción para enlaces externos. Si al volver a PipePipe el vídeo se reinicia o vuelve a cargar, descríbelo como un problema del ciclo de vida del reproductor e indica el modo de reproducción.

::: tip Mi Preferencia
**Minimizar al reproductor en segundo plano** es perfecto para escuchar contenido mientras haces otras cosas en el teléfono.
:::

### Iniciar el reproductor principal en pantalla completa

Omite el mini-reproductor y abre los vídeos directamente en modo pantalla completa. Aún puedes acceder al mini-reproductor deslizando hacia abajo para salir de la pantalla completa.

- **Por defecto:** Desactivado

### Reproducción automática

Controla la reproducción automática del siguiente vídeo de una lista o cola.

- **Opciones:** Siempre, Solo con Wi-Fi, Nunca.
- **Por defecto:** Siempre

::: tip Mi Preferencia
**Siempre** es genial para escuchar listas de música sin interrupciones.
:::

### Encolar automáticamente el siguiente flujo

Mientras ves un vídeo, añade automáticamente el siguiente vídeo recomendado a tu cola.

- **Por defecto:** Activado

### No encolar automáticamente los vídeos largos

Evita que la app encole automáticamente vídeos que superen una cierta duración. El umbral por defecto es de 6 minutos.

- **Por defecto:** Activado

### Encolar automáticamente la siguiente parte

Para los vídeos de varias partes, esta opción encola automáticamente la siguiente parte.

- **Por defecto:** Activado

### Modo reproductor de música

Reproduce automáticamente el contenido en el reproductor en segundo plano cuando seleccionas un elemento de una lista de reproducción local.

- **Por defecto:** Desactivado

### Aleatorio

Reproduce automáticamente tus listas locales en orden aleatorio cuando las reproduces en segundo plano.

- **Por defecto:** Desactivado

### Pedir confirmación antes de vaciar una cola

Muestra un diálogo de confirmación antes de vaciar tu cola de reproducción actual.

- **Por defecto:** Desactivado

### Confirmar al salir

Requiere que pulses el botón de retroceso dos veces para salir de la app, evitando cierres accidentales.

- **Por defecto:** Activado

### Desplazamiento interno de comentarios

Mantiene el reproductor de vídeo fijo en la parte superior de la pantalla mientras te desplazas por los comentarios.

- **Por defecto:** Desactivado

### Cargar la lista completa

Carga todos los elementos de una lista de reproducción de una vez al abrirla, en lugar de cargarlos a medida que te desplazas.

- **Por defecto:** Desactivado

### Deslizar para refrescar

Activa el gesto de deslizar hacia abajo en el feed principal para refrescar el contenido.

- **Por defecto:** Activado

### Acción al deslizar a la derecha en listas locales

Configura la acción que se realiza al deslizar a la derecha sobre un elemento de una lista de reproducción local.

- **Opciones:** Eliminar, Encolar, Desactivado.
- **Por defecto:** Eliminar

::: tip Mi Preferencia
**Eliminar** es una forma rápida y eficiente de gestionar y limpiar mis listas de reproducción.
:::
