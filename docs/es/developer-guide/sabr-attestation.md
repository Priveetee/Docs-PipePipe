# Atestación

Para devolver medio protegido, SABR necesita un Proof of Origin token en el contexto de la petición. Esta página explica de dónde viene ese token y cómo se comporta el lado del servidor, a un nivel lógico. No describe cómo falsificar uno, lo cual de todos modos no es posible desde el cliente, como explica la última sección.

## El flujo

Obtener un token es una cadena de pasos. El cliente recupera un challenge, lo ejecuta, envía el resultado a Google, recibe un integrity token de vuelta, y acuña un token ligado al vídeo concreto.

![Flujo de atestación](/diagrams/attestation-flow.png)

Todo empieza cuando el cliente recupera un challenge de atestación desde YouTube. Ese challenge se ejecuta dentro de BotGuard, la VM descrita en [Dentro de BotGuard](./sabr-botguard), que mide el entorno y produce un snapshot. El snapshot va hacia un punto de acceso de Google llamado GenerateIT, que lo verifica y devuelve un integrity token. A partir de ese integrity token, el cliente acuña un Proof of Origin token para el vídeo que quiere reproducir, y lo coloca en el contexto de la petición SABR.

## Qué devuelve el servidor

Visto desde fuera, GenerateIT se comporta de unas cuantas formas constantes que conviene conocer cuando construyes sobre él.

Un snapshot válido devuelve un token junto con un tiempo de vida, en torno a doce horas. El mismo snapshot válido puede reutilizarse, la llamada no es de un solo uso. Cuando el snapshot es inválido o está truncado, el punto de acceso no falla con un error HTTP. Devuelve una respuesta degradada sin un token real, así que una integración tiene que comprobar que de verdad recibió un token utilizable en lugar de dar por hecho el éxito a partir del código de estado.

Una consecuencia útil de ese tiempo de vida es que una sola atestación se amortiza entre muchos vídeos. No necesitas ejecutar todo el challenge para cada vídeo. La parte costosa se ejecuta una vez, y a partir de ella el cliente puede acuñar tokens por vídeo mientras el integrity token siga siendo válido.

![Ciclo de vida del token](/diagrams/token-lifecycle.png)

## Por qué esto no puede hacerse sin conexión

Esta es la parte que hay que interiorizar como integrador.

El integrity token se emite en los servidores de Google, usando un secreto que nunca sale de ellos. Ninguna cantidad de reverse engineering del lado del cliente te da ese secreto. Puedes entender cada capa de BotGuard y aun así no poder firmar un token tú mismo, porque la raíz de confianza está en el servidor, por diseño.

Por eso una integración correcta no falsifica nada. Ejecuta el challenge real en un runtime de JavaScript genuino o en una WebView, envía el snapshot a GenerateIT como un cliente normal, y usa el token que recibe de vuelta. Entender el protocolo hace que la integración sea robusta. No quita el servidor del circuito, y no es esa su finalidad.

## Esto seguirá cambiando

SABR y BotGuard son objetivos en movimiento. Es casi seguro que YouTube seguirá cambiándolos con el tiempo, y parte de lo descrito aquí quedará desactualizado a medida que eso ocurra. Cuando pase, esta documentación se actualizará para seguirlo. Considérala una descripción viva de un sistema que todavía evoluciona, no la última palabra.
