# Solución de problemas

Esta sección es el mapa para usuarios de los problemas de PipePipe. Parte del síntoma exacto en vez de cambiar varios ajustes a la vez: cada categoría indica las pruebas que realmente ayudan al diagnóstico.

![Triaje de solución de problemas](/diagrams/issue-triage.png)

## Primeros pasos

1. Compara tu versión instalada con [GitHub Releases](https://github.com/InfinityLoop1308/PipePipe/releases).
2. Repite el problema una vez y anota la hora, la URL o consulta afectada y el endpoint de YouTube seleccionado.
3. Abre la categoría correspondiente. Mantén síntomas distintos en informes distintos.

![Ajustes PipePipe, 5.2.3 en Android 16](/screenshots/pipepipe-settings-5.2.3-api36.png)

*Captura de referencia: PipePipe 5.2.3 · Android 16/API 36. Las categorías y su orden pueden cambiar.*

## Categorías

## Encuentra rápido la rama correcta

| Síntoma exacto | Empieza aquí | No supongas |
| --- | --- | --- |
| **WebView unavailable** | [WebView y reproducción protegida](./webview) | Que cambiar endpoint evita la comprobación WebView. |
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
- [Reproducción, red e inicio de sesión](./youtube-playback): `AntiBotException`, `Source error`, buffering, endpoint o reproducción con sesión.
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
