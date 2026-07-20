# Ajustes del Reproductor

Esta sección cubre todos los ajustes relacionados con el reproductor de vídeo y audio.

![Ajustes de reproductor PipePipe, 5.2.3 en Android 16](/screenshots/pipepipe-player-5.2.3-api36.png)

*Captura de referencia: PipePipe 5.2.3 · Android 16/API 36. El orden y valores pueden cambiar según versión.*

## Resolución por defecto

Establece la calidad de vídeo preferida para todos los vídeos reproducidos en el reproductor principal.

- **Opciones:** Mejor resolución, 1080p60, 1080p, 720p60, 720p, 480p, 360p, 240p, 144p.
- **Por defecto:** 1080p60

::: tip
Elegir una resolución más baja como 720p puede ayudar a ahorrar datos móviles y reducir el almacenamiento en búfer en conexiones lentas.
:::

## Resolución por defecto del popup

Establece la calidad de vídeo preferida para los vídeos reproducidos en el reproductor popup.

- **Opciones:** Las mismas que la resolución por defecto.
- **Por defecto:** 480p

::: info
Una resolución más baja suele bastar para la pequeña ventana del popup y consume menos recursos.
:::

## Activar formatos avanzados

**Ruta:** menú lateral de PipePipe > Ajustes > Reproductor > Activar formatos avanzados

Controla los formatos modernos de vídeo y audio que PipePipe puede usar.

- **VP9**: un códec de vídeo abierto con amplia compatibilidad en Android.
- **AV1**: un códec de vídeo reciente y eficiente. Puede exigir muchos recursos
  cuando Android debe decodificarlo por software.
- **HEVC**: un códec de vídeo cuya compatibilidad varía según tu dispositivo.
- **EC-3**: audio Dolby Digital Plus, útil solo si tu dispositivo lo admite.

VP9 y HEVC están habilitados por defecto. AV1 y EC-3 están deshabilitados por
defecto. Habilitar un formato permite que sus streams aparezcan en la lista de
calidad, pero no garantiza que el decodificador de tu dispositivo sea estable
durante la reproducción. Para una misma resolución, PipePipe ordena actualmente
los formatos habilitados así: AV1, VP9, HEVC y AVC. Habilitar AV1 puede hacer que
sea la opción automática.

VP9/WebM o AV1 debe estar habilitado para mostrar streams de YouTube en 2K/4K.
AV1 por sí solo no es obligatorio.

::: tip
Si el vídeo se entrecorta pero el audio continúa normalmente, prueba primero
VP9 y baja la resolución. Cada códec usa un decodificador Android diferente, por
lo que un cambio puede ayudar en un dispositivo y empeorar la reproducción en
otro. Consulta [#2085](https://github.com/InfinityLoop1308/PipePipe/issues/2085)
y [#2045](https://github.com/InfinityLoop1308/PipePipe/issues/2045).
:::

::: warning
Si un informe contiene `video/av01` o `c2.android.av1-dav1d.decoder`, desmarca
**AV01**, vuelve a abrir completamente el vídeo y prueba VP9 con la misma
resolución o una inferior. Si VP9 también falla, desmarca VP9 y HEVC para dejar
AVC disponible y prueba 720p. Sigue la [guía completa de MediaCodec](/es/issues/android#el-video-se-detiene-al-cabo-de-un-rato-con-un-error-av1).
:::

## Limitar la resolución con datos móviles

Cambia automáticamente a una resolución más baja cuando no estás conectado a Wi-Fi para ahorrar datos.

- **Opciones:** Sin límite, 1080p60, 1080p, 720p60, 720p, 480p, 360p, 240p, 144p.
- **Por defecto:** 480p

## Solicitar el foco de audio

Garantiza que PipePipe sea la única app que reproduce audio. Cuando está activado, otras apps (como los reproductores de música) se pausan al iniciarse un vídeo de PipePipe.

- **Por defecto:** Activado

## Reanudar la reproducción

Reanuda automáticamente la reproducción tras una interrupción, como una llamada telefónica.

- **Por defecto:** Activado

::: warning
En algunas versiones, entrar en pantalla completa puede reanudar un vídeo que estaba en pausa. Conserva la secuencia exacta (pausa, pantalla completa, rotación, volver, etc.) para un informe: no es el mismo ajuste que reanudar tras una interrupción.
:::

## Empezar siempre desde el principio

Desactiva la función de "reanudar la reproducción" para los vídeos que ya has empezado a ver. Cada vídeo empezará desde 00:00.

- **Por defecto:** Desactivado

## Recordar las propiedades del popup

La app recordará el tamaño y la posición del reproductor popup de tu última sesión.

- **Por defecto:** Activado

## Duración del avance/retroceso rápido

Establece la cantidad de tiempo que se salta hacia delante o hacia atrás cuando tocas dos veces los lados del reproductor.

- **Opciones:** 5, 10, 15, 20, 25, 30 segundos.
- **Por defecto:** 10 segundos

## Mantener pulsado para acelerar la reproducción

Te permite acelerar temporalmente el vídeo manteniendo pulsado sobre el reproductor.

- **Opciones:** De 0.1x a 5x, Desactivar.
- **Por defecto:** 5x

## Temporizador de apagado

Detiene automáticamente la reproducción tras un tiempo establecido.

- **Opciones:** 5, 10, 15, 20, 30 minutos, 1 hora.
- **Por defecto:** 1 hora

## Ajustes de gestos

Abre un submenú para configurar los gestos de deslizamiento del reproductor.

## Ajustes de comentarios desplazables

Abre un submenú para configurar los comentarios de chat en directo estilo Danmaku (desplazables).

## Subtítulos

Abre un submenú para la apariencia y las opciones relacionadas con subtítulos. Las pistas normales las proporciona el servicio o el vídeo. La traducción automática es una función distinta de YouTube y requiere iniciar sesión en YouTube; un control de traducción en gris puede indicar que no hay una sesión compatible activa, no que falten subtítulos.

Al informar, distingue: no aparece ninguna pista normal; una pista normal no se muestra; no se puede seleccionar traducción automática; o la traducción elegida es incorrecta. Incluye URL, idiomas de origen/destino, pista seleccionada, estado de inicio de sesión y versión, sin cookies ni credenciales.
