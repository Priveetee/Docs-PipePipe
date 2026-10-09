# Referencia de ajustes

Esta referencia visual complementa las páginas de [Reproductor](./settings-player)
y [Comportamiento](./settings-behavior). Son ejemplos, no una promesa de que tus
pantallas sean idénticas. Las etiquetas pueden cambiar; usa la búsqueda de
ajustes si hace falta.

## Reproductor y gestos

La pantalla Reproductor reúne calidad, formatos, acción de abrir, cambio de app,
autoplay y cola. La pantalla Gestos configura por separado las interacciones del
reproductor.

<div class="screenshot-callout" role="img" aria-label="Ajustes de reproductor con acción abrir preferida y minimizar resaltados">
  <img src="/screenshots/pipepipe-player-5.3.1-beta-api36.png" alt="Ajustes de reproductor en Android 16">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="25" y="1420" width="1030" height="180" rx="28" />
    <path class="callout-arrow" d="M 850 1330 L 850 1400 M 825 1375 L 850 1400 L 875 1375" />
    <circle class="callout-number" cx="990" cy="1450" r="42" /><text x="990" y="1450">1</text>
    <rect class="callout-box" x="25" y="1620" width="1030" height="230" rx="28" />
    <path class="callout-arrow" d="M 850 1535 L 850 1600 M 825 1575 L 850 1600 L 875 1575" />
    <circle class="callout-number" cx="990" cy="1650" r="42" /><text x="990" y="1650">2</text>
  </svg>
</div>

*Captura de referencia: Android 16/API 36. **1** se usa para enlaces externos entregados a PipePipe; **2** controla salir del reproductor principal hacia otra app.*

![Ajustes de gestos](/screenshots/pipepipe-gestures-5.2.3-api36.png)

## Apariencia, contenido y feed

Apariencia cambia tema, cuadrícula y pestañas. Contenido cambia lo mostrado para
vídeos y canales. Feed controla la experiencia del contenido seguido. Son ajustes
de presentación: no arreglan un fallo de extractor o reproducción.

![Ajustes de apariencia](/screenshots/pipepipe-appearance-5.2.3-api36.png)

![Ajustes de contenido](/screenshots/pipepipe-content-5.2.3-api36.png)

![Ajustes de feed](/screenshots/pipepipe-feed-5.2.3-api36.png)

## Datos locales y filtrado

Historial/caché, filtros y SponsorBlock afectan datos o superficies diferentes.
Al diagnosticar un resultado inesperado, cambia una categoría cada vez.

![Ajustes de historial y caché](/screenshots/pipepipe-history-cache-5.2.3-api36.png)

![Ajustes de filtro de contenido](/screenshots/pipepipe-content-filter-5.2.3-api36.png)

![Ajustes de SponsorBlock](/screenshots/pipepipe-sponsorblock-5.2.3-api36.png)

## Avanzado

Avanzado contiene controles de compatibilidad cercanos al reproductor. No cambies
varias opciones a la vez: anota valor inicial, cambia una y vuelve a probar el
mismo vídeo. Para workarounds de decodificador/superficie, consulta
[Reproducción e integración Android](/es/issues/android).

![Ajustes avanzados en Android 16](/screenshots/pipepipe-advanced-5.3.1-beta-api36.png)

### Endpoint de extracción de YouTube

Es el ajuste de Avanzado que decide qué cliente de YouTube consulta PipePipe para
un vídeo. Abre **Ajustes → Avanzado → Endpoint de extracción de YouTube**:

<div class="screenshot-callout" role="img" aria-label="Selector Endpoint de extracción de YouTube con las opciones VisionOS y MWEB (SABR) resaltadas">
  <img src="/screenshots/pipepipe-endpoint-picker-5.4.0-api36.png" alt="Selector Endpoint de extracción de YouTube en Android 16">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="55" y="1050" width="790" height="280" rx="24" />
    <circle class="callout-number" cx="800" cy="1190" r="42" /><text x="800" y="1190">1</text>
  </svg>
</div>

*Captura de referencia: Android 16/API 36 en una instalación anónima. **1** es
el selector con sus dos opciones. Una instalación con sesión iniciada solo
muestra MWEB.*

| Valor | Qué es | Cuándo falla |
| --- | --- | --- |
| **MWEB (SABR)** | La ruta actual basada en sesiones, y la única que reproduce formatos SABR. Una sesión iniciada está limitada a ella. | Necesita `googleapis.com` y `google.com` accesibles para el token proof-of-origin, así que un filtrado DNS la rompe. |
| **VisionOS** | El endpoint por defecto en modo anónimo, mantenido para instalaciones sin sesión. | YouTube está retirando ese cliente: la reproducción puede pararse hacia 0:59 con `Response code: 403`. |

Si un informe muestra `Endpoint: visionos` y la reproducción se detiene hacia
0:59, cambia a **MWEB (SABR)**. El síntoma y las comprobaciones asociadas están
en [Reproducción, red e inicio de sesión](/es/issues/youtube-playback#la-reproduccion-se-detiene-hacia-el-minuto-1-con-un-403).

![Fila Endpoint de extracción de YouTube ajustada a MWEB (SABR) en los ajustes Avanzado en Android 16](/screenshots/pipepipe-advanced-endpoint-5.4.0-api36.png)

*Captura de referencia: la misma fila en la lista Avanzado, aquí ajustada a
MWEB (SABR). Tu valor puede ser distinto; ese es el que hay que anotar en un
informe.*

## Pantallas relacionadas con tareas

- [Descargas](/es/issues/downloads): destino y reintentos.
- [Cuentas y servicios](/es/issues/accounts-and-services): servicios y cookies WebView.
- [Configuración, actualizaciones y copias](/es/issues/setup): preliminares y comprobación manual.
- [Copia de seguridad y restauración](./backup-and-restore): exportar antes de importar.
- [Reproducción, red e inicio de sesión](/es/issues/youtube-playback#el-endpoint-es-evidencia-no-un-boton-magico):
  la elección de endpoint y el caso del 403 a 0:59.
