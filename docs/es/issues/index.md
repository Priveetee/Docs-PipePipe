# Solución de problemas

Esta sección es el mapa para usuarios de los problemas de PipePipe. Parte del síntoma exacto en vez de cambiar varios ajustes a la vez: cada categoría indica las pruebas que realmente ayudan al diagnóstico.

![Triaje de solución de problemas](/diagrams/issue-triage.png)

## Primeros pasos

1. Compara tu versión instalada con [GitHub Releases](https://github.com/InfinityLoop1308/PipePipe/releases).
2. Repite el problema una vez y anota la hora, la URL o consulta afectada y el endpoint de YouTube seleccionado.
3. Abre la categoría correspondiente. Mantén síntomas distintos en informes distintos.

![Ajustes PipePipe en Android 16](/screenshots/pipepipe-settings-5.3.1-beta-api36.png)

*Captura de referencia: Android 16/API 36. Las categorías y su orden pueden cambiar; sigue el texto y usa la búsqueda de Ajustes si tu pantalla es distinta.*

Las capturas sirven de referencia, pero no garantizan que todos los menús
mantengan la misma disposición. Consulta
[GitHub Releases](https://github.com/InfinityLoop1308/PipePipe/releases) para
ver los cambios recientes y empieza por el síntoma de abajo.

## Encuentra rápido la rama correcta

| Síntoma exacto | Empieza aquí | No supongas |
| --- | --- | --- |
| **WebView unavailable** | [WebView y reproducción protegida](./webview) | Que cambiar endpoint evita la comprobación WebView. |
| Fallan todos los vídeos de YouTube; un host de Google resuelve a `0.0.0.0` o `127.0.0.1` | [Filtrado DNS y reproducción](./youtube-playback#fallan-todos-los-videos-de-youtube-comprueba-el-filtrado-dns) | Que cambiar endpoint, reinstalar o actualizar WebView evita el filtrado DNS. |
| Solo falla uno o unos pocos vídeos de YouTube mientras los demás se reproducen | [Reproducción, red e inicio de sesión](./youtube-playback#falla-un-video-o-unos-pocos-mientras-los-demas-funcionan) | Que WebView, el DNS o toda la instalación están rotos. |
| Un vídeo muy largo falla con `Invalid exact SABR segment count` | [Reproducción, red e inicio de sesión](./youtube-playback) | Que no es compatible solo por su duración, o que cambiar WebView/códec corrige este error de recuento. |
| `AntiBotException`, `Source error`, búfer, seek en directo | [Reproducción, red e inicio de sesión](./youtube-playback) | Que WebView actual o sesión demuestra la causa. |
| Búsqueda vacía/incorrecta | [Búsqueda y descubrimiento](./search) | Que una corrección del reproductor arregla búsqueda. |
| Enlace en reproductor «equivocado» | [Segundo plano, emergente, pantalla completa y cola](./player-modes) | Que la acción preferida controla toques internos. |
| Descarga/fichero parcial | [Descargas](./downloads) | Que solo se usa la SD final. |
| Datos perdidos tras migración | [Configuración, actualizaciones y copias](./setup) | Que importar es una combinación reversible. |

### Configuración e informes

- [Configuración, actualizaciones y copias](./setup): instalación, fuente de
  actualización, importación, exportación y migración segura.
- [Informar de un problema](./reporting): pruebas que hacen reproducible una issue.

### YouTube y reproducción

- [WebView y reproducción protegida](./webview): PipePipe indica que WebView no está disponible, o falta el proveedor del sistema, está bloqueado o es incompatible.
- [Reproducción, red e inicio de sesión](./youtube-playback): filtrado DNS,
  `Source error`, buffering, endpoint o reproducción con sesión.
- [Búsqueda y descubrimiento](./search): resultados vacíos, incorrectos o incompletos.
- [Segundo plano, emergente, pantalla completa y cola](./player-modes): ciclo de
  vida, rotación, imagen en imagen, cola y transiciones de listas.
- [Descargas](./downloads): formato, almacenamiento, archivo parcial y unión.

### Biblioteca y controles de contenido

- [Listas, historial y suscripciones](./library-and-feeds): biblioteca, feed,
  canal, lista, importación y posiciones.
- [Filtros, comentarios y subtítulos](./content-controls): filtrado, comentarios,
  bullet comments y subtítulos.

### Aplicación y dispositivo

- [MediaCodec y Android Auto](./android): alternativas para decodificador/superficie y visibilidad de Android Auto.
- [Cuentas y servicios](./accounts-and-services): sesión, cookies, reCAPTCHA,
  contenido restringido e informes específicos al servicio.
- [Interfaz e idioma](./interface-and-language): UI experimental, diseño,
  compartir, notificaciones, idioma y país de contenido.

::: tip Un síntoma, un informe
WebView, reproducción y búsqueda pueden fallar a la vez después de un cambio de YouTube. Aun así recorren rutas de código distintas. Separarlos ofrece al mantenedor una reproducción útil.
:::
