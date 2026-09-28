# SABR

Esta parte de la wiki trata sobre SABR, el protocolo que YouTube usa ahora para entregar el medio, y sobre la atestación que protege los flujos bloqueados.

SABR, abreviatura de Server Adaptive BitRate, es el protocolo de entrega que YouTube usa cada vez más en lugar de las simples URLs de medio. Si desarrollas o mantienes un extractor de YouTube, te concierne, porque cambia el funcionamiento de principio a fin.

La implementación se reparte entre dos repositorios. El
[extractor](https://github.com/InfinityLoop1308/PipePipeExtractor) construye
peticiones específicas de cada servicio e interpreta sus respuestas, incluidos
los datos SABR/UMP. El [cliente Android](https://github.com/InfinityLoop1308/PipePipeClient)
coordina la reproducción, gestiona la sesión SABR y conecta los formatos
analizados con el reproductor multimedia. El repositorio de la aplicación elige
qué revisiones combina en cada build publicado. Para un comportamiento o límite
concreto, consulta el código y el historial de issues: un cambio en el extractor
no siempre basta para cambiar la reproducción. Por ejemplo, la
[issue #2973](https://github.com/InfinityLoop1308/PipePipe/issues/2973) y la
[PR #99 del cliente](https://github.com/InfinityLoop1308/PipePipeClient/pull/99)
documentan un caso de recuento de segmentos con vídeos muy largos; sus páginas
muestran el estado actual. YouTube cambia este flujo: esta guía explica la
arquitectura y enlaza el código vivo para los detalles.

Para empezar a leer el código, mira [`SabrResponseDecoder.java`](https://github.com/InfinityLoop1308/PipePipeExtractor/blob/main/extractor/src/main/java/org/schabi/newpipe/extractor/services/youtube/sabr/protocol/SabrResponseDecoder.java)
y [`YoutubeSabrSession.java`](https://github.com/InfinityLoop1308/PipePipeExtractor/blob/main/extractor/src/main/java/org/schabi/newpipe/extractor/services/youtube/sabr/YoutubeSabrSession.java)
en el extractor, y [`SabrDashMediaSource.java`](https://github.com/InfinityLoop1308/PipePipeClient/blob/dev/app/src/main/java/org/schabi/newpipe/player/datasource/SabrDashMediaSource.java)
en el cliente.
:::

El método antiguo era sobre todo sin estado. Resolvías una URL o un manifiesto y descargabas los bytes. SABR, en cambio, es una conversación. El cliente abre una sesión y sigue dialogando con el servidor, enviando su estado de reproducción actual y recibiendo el medio en pequeños trozos, hasta que termina la reproducción.

![Pipeline SABR](/diagrams/sabr-pipeline.png)

El diagrama de arriba resume toda la historia en una imagen. El cliente lee la configuración de streaming desde la respuesta del player, construye una petición y la envía. El servidor responde con un cuerpo UMP que transporta partes tipadas, algunas de las cuales son medio y otras instrucciones para la siguiente petición. Mientras siga llegando medio, el cliente ensambla el audio y el vídeo. Cuando el servidor decide que el flujo está protegido, deja de enviar medio hasta que el cliente presenta un Proof of Origin token válido.

## Qué cubre esta sección

Esta es una descripción a nivel de desarrollador de cómo funciona SABR, escrita a partir de lo que observamos al estudiarlo. Está repartida en varias páginas.

Para el contexto, por qué YouTube pasó a SABR y dónde se detiene el análisis, consulta [Los orígenes de SABR](./sabr-origins).

El protocolo en sí es la petición, la respuesta UMP y el estado de sesión que el cliente conserva entre llamadas. Eso está en [El protocolo SABR](./sabr-protocol).

El lado de la protección es la parte más difícil. El medio protegido está bloqueado por un sistema de atestación llamado BotGuard. Cómo está construido y por qué resiste el análisis está en [Dentro de BotGuard](./sabr-botguard). Cómo fluye realmente la atestación, y qué es el Proof of Origin token, está en [Atestación](./sabr-attestation).

## Una nota sobre el alcance

Todo se mantiene a un nivel lógico: conceptos, estructura y flujo, no constantes exactas, nombres internos ni disposiciones a nivel de bytes. Esos detalles son específicos de cada versión y frágiles, y no hacen falta para entender cómo funciona SABR. El objetivo es explicar el sistema con suficiente claridad para que la comunidad pueda razonar sobre una integración legítima.
