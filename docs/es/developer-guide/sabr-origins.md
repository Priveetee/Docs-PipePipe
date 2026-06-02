# Los orígenes de SABR

Un poco de contexto: por qué existe SABR, qué cambió cuando llegó, y dónde se detiene su estudio.

## El problema que creó

Durante mucho tiempo, la reproducción de YouTube era fácil de extraer. Resolvías una URL de medio o un manifiesto y descargabas los bytes. Luego eso empezó a romperse, en oleadas que parecían aleatorias pero no lo eran. Vídeos que antes funcionaban empezaban de repente a fallar con «contenido no soportado», a veces todo un lote de golpe, a veces solo para algunas cuentas o regiones.

Algunos reportes representativos:

- [#2330 — Content Not Yet Supported (SABR) after 5.1.0](https://github.com/InfinityLoop1308/PipePipe/issues/2330)
- [#2272 — «This content is not yet supported» cuando se envía un enlace de YouTube](https://github.com/InfinityLoop1308/PipePipe/issues/2272)
- [#2318 — la mayoría de los vídeos no se reproducen, al azar](https://github.com/InfinityLoop1308/PipePipe/issues/2318)

La causa no era un analizador caprichoso. Era YouTube moviendo la entrega del medio a SABR y, para cada vez más vídeos, dejando de proporcionar por completo URLs de medio clásicas utilizables. Cuando no hay nada que resolver, el modelo de extracción antiguo no tiene nada que descargar, y lo único honesto que puede reportar es «no soportado». El arreglo no es un parche, es entender un protocolo nuevo.

## Qué cambió SABR

SABR no es una descarga, es una conversación. El cliente abre una sesión y sigue dialogando con el servidor: envía su estado de reproducción actual, el servidor responde con medio en pequeños trozos más instrucciones para la siguiente petición, y esto se repite hasta que termina la reproducción. [El protocolo SABR](./sabr-protocol) cubre los detalles.

El lado del protocolo está, a estas alturas, bastante bien entendido e implementado abiertamente. La parte más difícil es la capa de protección: en algunos vídeos el servidor deja de enviar medio hasta que el cliente demuestra su identidad con un Proof of Origin token válido. Ahí es donde se concentra la mayor parte de la dificultad, y se trata en [Dentro de BotGuard](./sabr-botguard) y [Atestación](./sabr-attestation).

## Dónde se detiene el análisis

La pregunta obvia, una vez entendida la atestación, es si el token puede acuñarse completamente sin conexión, sin ningún navegador en el circuito. No se puede. El secreto que firma el token vive en el servidor, por diseño. Puedes entender perfectamente cada capa del lado del cliente y ese secreto sigue sin ser tuyo.

Por eso esta documentación se detiene ahí, a propósito. No es un callejón sin salida ni un capítulo que falte. Una integración legítima ejecuta el challenge real, lo envía como un cliente normal, y usa el token que recibe de vuelta. Entender el protocolo es lo que hace sólida la integración; no quita, ni debe quitar, el servidor del circuito.

## Créditos y trabajos previos

Nada de esto salió de la nada. SABR y la atestación que lo rodea ya habían sido cartografiados, abiertamente, por otros proyectos. Esta documentación se apoya en su trabajo, y merecen un vistazo y una estrella:

- [LuanRT/googlevideo](https://github.com/LuanRT/googlevideo) — implementación de referencia del streaming SABR y del parsing UMP.
- [LuanRT/BgUtils](https://github.com/LuanRT/BgUtils) — el flujo de BotGuard y Proof of Origin token.
- [FreeTube](https://github.com/FreeTubeApp/FreeTube) — formas de petición de un cliente real y manejo del token.
- [Piped](https://github.com/TeamPiped/Piped) — formas de petición, manejo de redirecciones y lógica de índice de segmentos.
- [NewPipe / NewPipeExtractor](https://github.com/TeamNewPipe/NewPipeExtractor) — la base de extractor sobre la que se apoya buena parte de esto.
- [Shaka Player](https://github.com/shaka-project/shaka-player) — conceptos de índice de segmentos detrás de los rangos de búfer.
