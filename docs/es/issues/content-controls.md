# Filtros, comentarios y subtítulos

## Filtros y canales bloqueados

Para contenido bloqueado que aún aparece, indica dónde: búsqueda, canal, feed, lista o sugerencias. Añade regla, URL y si el elemento ya estaba cargado antes del cambio.

No lo reduzcas a «el filtro no funciona». Una regla puede evaluarse de forma distinta en una lista que ya se cargó y en una página recuperada de nuevo. Actualiza o vuelve a abrir una vez; luego informa la superficie exacta y si el elemento es canal, título, palabra clave o resultado específico de un servicio.

## Comentarios y bullet comments

Para comentarios ausentes, obsoletos o mal colocados, incluye URL de vídeo, pestaña, modo de reproducción y estado de interfaz experimental. Para bullet comments, añade servicio y ajuste modificado. «Faltan comentarios» exige el servicio: las API de comentarios y los bullet/danmaku comments no son intercambiables.

## Subtítulos

Incluye URL, idioma, pista seleccionada, sesión y tipo: subtítulos normales o traducción automática. Estas funciones no tienen los mismos requisitos upstream: en YouTube la traducción automática requiere una sesión de YouTube activa. Un control de traducción desactivado/en gris puede ser normal sin iniciar sesión.

Usa uno de estos diagnósticos: «no se lista pista original», «se lista pista original pero no se muestra», «traducción automática no disponible sin sesión» o «traducción automática incorrecta con sesión». El último necesita idiomas origen/destino; ninguno necesita cookies ni credenciales.

![Entrada de subtítulos del reproductor](/screenshots/pipepipe-player-captions-5.2.3-api36.png)

La entrada Subtítulos configura la presentación de captions del reproductor. No
hace disponible por sí sola la traducción automática. La issue cerrada
[#2627](https://github.com/InfinityLoop1308/PipePipe/issues/2627) confirmó que
un control de traducción automática en gris significaba que la persona no había
iniciado sesión en YouTube.
