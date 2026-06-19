# Los servicios de un vistazo

YouTube tiene [su propia página](./youtube-service). Los otros seis servicios son más pequeños, pero cada uno tiene una particularidad que conviene conocer antes de abrir su código. Todos implementan el mismo contrato `StreamingService`; lo que cambia es cómo obtienen los datos y qué soportan.

## SoundCloud (id 1)

Audio y comentarios. Habla con la API REST `api-v2.soundcloud.com`. El detalle: no hay una clave de API fija, el `client_id` se extrae en tiempo de ejecución del propio JavaScript del frontend de SoundCloud (una coincidencia `,client_id:"..."` en un script de `sndcdn.com`) y se añade a cada llamada. Las listas de éxitos son un kiosco; también tiene sugerencias e importación de suscripciones. Sin vídeo.

## BiliBili (id 5)

Vídeo, comentarios, bullet comments y SponsorBlock, el servicio más complejo. Las URLs de flujo vienen del JSON de `api.bilibili.com`, pero la mayoría de las llamadas deben ir **firmadas con WBI**: obtiene una tabla de permutación rotativa de `/x/web-interface/nav`, construye una clave mixin y sella las peticiones con `w_rid` + `wts`. También fabrica un conjunto de cookies/tickets (`buvid3/4`, `b_lsid`, `bili_ticket`, ...). Los bullet comments (danmaku) llegan de dos formas: un volcado binario comprimido con zlib para el VOD, y un stream WebSocket `DANMU_MSG` para el directo. El contenido premium usa un endpoint PGC aparte. Los flujos adaptativos (DASH) llevan rangos de bytes por flujo (init + index), parseados desde el `SegmentBase` `Initialization` / `indexRange` en las pistas de audio y vídeo, así que cada una se reproduce como su propia representación DASH. Cuenta con que las partes de firma y de la tabla necesitarán mantenimiento.

## NicoNico (id 6)

Vídeo y bullet comments (los comentarios ordinarios están deshabilitados). Híbrido: extrae de la página de visionado un bloque JSON `script#embedded-data`, y luego llama a `nvapi.nicovideo.jp` con cabeceras `X-Frontend-Id`. La reproducción es una negociación: POST a `.../access-rights/hls` con las resoluciones y el audio que quieres, recibes a cambio una URL HLS cifrada (respuestas gzip). Varias clases de contenido están restringidas tras inicio de sesión.

## PeerTube (id 3)

Vídeo y comentarios, y el único federado. No hay un único backend: el servicio se vincula a una **instancia** (por defecto `framatube.org`, configurable por el usuario), y la URL de la instancia *es* la base de la API (`/api/v1/...`). JSON sin más, sin firma. Trending / Most-liked / Recent / Local son kioscos; los channels exponen pestañas `CHANNELS` y `PLAYLISTS`.

## Bandcamp (id 4)

Audio y comentarios. Principalmente scraping de HTML: los datos de álbum y pista vienen de un atributo JSON `data-tralbum` de la página. Dos kioscos: Featured, y el programa semanal Radio, este último a través de una API dedicada `bcweekly` y su propio extractor de stream de radio (seleccionado por URL).

## media.ccc.de (id 2)

Audio y vídeo, sin comentarios. Una API JSON pública y limpia (`api.media.ccc.de/public/events/{id}`). El contenido se organiza en torno a **conferencias**: una conferencia es un channel, y los kioscos son conferences / recent / live. Obtención en dos fases: primero los metadatos del evento, luego la conferencia padre a través de una URL en el evento.

## Referencia rápida

| Servicio | id | Medio | Obtención | A tener en cuenta |
|---|---|---|---|---|
| SoundCloud | 1 | audio, comentarios | api-v2 REST | `client_id` dinámico desde JS |
| media.ccc.de | 2 | audio, vídeo | API JSON pública | centrado en conferencias, sin comentarios |
| PeerTube | 3 | vídeo, comentarios | JSON por instancia | federado, instancia = base de la API |
| Bandcamp | 4 | audio, comentarios | scraping HTML + JSON | bloque `data-tralbum`, programa Radio |
| BiliBili | 5 | vídeo, comentarios, danmaku, SponsorBlock | JSON de api.bilibili.com | firma WBI + cookie/ticket |
| NicoNico | 6 | vídeo, danmaku | HTML + nvapi | restricción de login, POST access-rights HLS |
