# Rangos almacenados y seeks

Parte de [SABR en el extractor](./sabr). El PipePipeExtractor actual no posee
buffer de reproducción ni `YoutubeSabrStreamState`; esas políticas viven en la
capa de aplicación que construye `YoutubeSabrRequest`.

## Lo que proporciona el extractor

`YoutubeSabrRequest.Track` puede llevar dos datos de estado controlados por el
llamador:

- un `YoutubeSabrFormatTimeline`, analizado desde los datos de inicialización;
- `bufferedThrough`, la última secuencia contigua que el llamador quiere declarar.

Cuando ambos están presentes y `bufferedThrough > 0`,
`YoutubeSabrRequestHelper` escribe un `bufferedRange` desde el tiempo cero hasta
el final del timeline de esa secuencia. Los índices empiezan en uno y la
timescale es `1000`. Sin timeline no se emite rango para esa pista.

Es una política conservadora: no se debe anunciar un rango que pase un hueco.
Declarar una secuencia posterior mientras falta un segmento anterior puede hacer
que el servidor lo omita y dejar el lector bloqueado.

## Seeks

Para un seek, la aplicación puede obtener la secuencia con
`YoutubeSabrFormatTimeline.getSequenceAt(timeMs)`, gestionar su propia caché y
crear un nuevo `YoutubeSabrRequest.playback` con el tiempo objetivo y rangos
contiguos honestos. SABR no ofrece una API de caché del cliente en el extractor.

La búsqueda devuelve la secuencia `1` para tiempos no positivos, la primera
entrada cuyo final queda después del tiempo solicitado o una secuencia posterior
a la última si el tiempo supera el índice. Los índices MP4 y WebM se analizan de
los bytes de inicialización; espera un timeline válido antes de declarar una
cobertura precisa.

Siguiente: [El driver de sesión](./sabr-session).
