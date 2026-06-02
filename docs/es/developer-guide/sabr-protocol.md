# El protocolo SABR

Una sesión SABR es un ida y vuelta. El cliente describe quién es y en qué punto está la reproducción, el servidor responde con medio e instrucciones, y el cliente usa esas instrucciones para pedir el siguiente trozo. Esta página recorre la petición, la respuesta y el estado que une a ambas.

## La petición

Cada llamada envía un objeto de petición que le indica tres cosas al servidor. Quién pregunta, qué formatos quiere el cliente, y en qué punto está la reproducción ahora mismo.

En la práctica, esto significa que la petición transporta los formatos de audio y vídeo seleccionados, los rangos ya almacenados en búfer para cada uno, el tiempo de reproducción actual, y un token de continuidad que la respuesta anterior devolvió. Cuando entra en juego la protección, también transporta los datos de atestación en el contexto del cliente.

La primera petición de una sesión es un arranque en frío. Todavía no reclama ningún rango de búfer, así que el servidor responde con los metadatos de inicialización de los formatos y el primer medio, incluidos los segmentos de init que preparan cada pista. Las peticiones siguientes son continuaciones: transportan el estado creciente, los rangos de búfer y el token de continuidad, para que el servidor solo envíe lo que viene a continuación. Equivocarse en esta distinción, por ejemplo enviar un estado con forma de continuación en la primera llamada, hace que el servidor se salte la inicialización y la sesión nunca arranca limpiamente.

![Arranque en frío frente a continuación](/diagrams/coldstart-vs-followup.png)

## La respuesta es UMP

El servidor no responde con un archivo plano. Responde con un cuerpo UMP, que es un flujo de partes tipadas precedidas por su longitud. Cada parte tiene un tipo, y el cliente las lee en orden, manejando los tipos que entiende y saltándose el resto.

![Anatomía de una respuesta UMP](/diagrams/ump-anatomy.png)

Las partes se agrupan a grandes rasgos en tres familias. Los descriptores ponen el escenario: los metadatos de inicialización por formato y la lista de formatos seleccionables. El medio es la carga útil en sí, y llega como una pequeña secuencia: una cabecera que describe un segmento por venir, los bytes del segmento, y luego un marcador de fin. Las instrucciones guían la siguiente ronda: la política de la siguiente petición le indica al cliente hasta dónde leer por adelantado y le devuelve el token de continuidad que debe reenviar, y el estado de protección del flujo dice si el flujo sigue abierto o ha sido bloqueado.

Una misma respuesta normalmente mezcla las tres. El cliente recorre las partes, recogiendo el medio sobre la marcha y registrando las instrucciones para que la siguiente petición tenga la forma correcta.

## Ensamblar el medio

Las partes de medio no llegan como un archivo terminado. Cada formato seleccionado, uno para el audio y uno para el vídeo, llega como un segmento de init seguido de una serie de segmentos de medio. El segmento de init prepara la pista, los segmentos de medio llevan el audio o el vídeo reales, y juntos reconstruyen una pista continua para ese formato.

![Ensamblar segmentos en pistas](/diagrams/media-assembly.png)

El cliente lo hace para ambos formatos en paralelo y entrega las dos pistas reconstruidas al reproductor. Como los bytes vienen de partes de medio y no de un archivo plano, es el contenedor de cada segmento lo que le dice al cliente y al decodificador cómo interpretarlo, y por eso el segmento de init importa tanto. Piérdelo, o ensambla los segmentos en desorden, y la pista no se puede decodificar aunque haya llegado cada byte.

## El estado de sesión

La razón por la que SABR se siente diferente de un extractor clásico es este estado. El cliente mantiene un pequeño modelo en memoria a través de las peticiones. Un número de petición, el token de continuidad, los rangos almacenados en búfer por formato, y el tiempo de reproducción actual.

![Una sesión SABR](/diagrams/sabr-session.png)

Devolver el token y reportar rangos de búfer exactos es lo que permite que las peticiones siguientes avancen limpiamente. Si te equivocas en eso, la sesión se bloquea o entra en bucle.

## La frontera de protección

Para algunos vídeos y algunos formatos, a partir de cierto punto, el servidor deja de enviar medio. En su lugar, devuelve respuestas que solo contienen política. El estado de protección del flujo cambia a un estado protegido, se incluye un valor de backoff, y ya no hay ninguna parte de medio en absoluto.

El estado pasa por tres valores. El estado 1 es abierto, el medio fluye con normalidad. El estado 2 es la frontera, el punto donde la atestación está a punto de ser exigida. El estado 3 es protegido, el servidor solo devuelve política y nada de medio. Reintentar en estado 3 no cambia nada por sí solo. Presentar un Proof of Origin token válido en el contexto de la petición es lo que devuelve la sesión al estado 1, y el medio vuelve a fluir.

![El flujo de los estados de protección](/diagrams/protection-states.png)

Esto no es un fallo de tu analizador ni de tu petición. Es un estado de protección real. Esa parte se trata en [Dentro de BotGuard](./sabr-botguard) y [Atestación](./sabr-attestation).
