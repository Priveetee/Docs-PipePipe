# Dentro de BotGuard

Cuando le pides a YouTube un flujo protegido, el servidor no entrega el medio hasta que tu cliente demuestra que se ejecuta en una sesión de navegador genuina. Esa prueba la produce un fragmento de código que Google distribuye, llamado BotGuard. Es la parte más difícil de razonar de toda la historia de SABR, y esta página explica cómo está construido y por qué resiste el análisis, a partir de lo que observamos al estudiarlo.

El objetivo aquí es entender la forma del sistema, no reproducirlo.

## No es un script normal

Lo que el navegador carga es un pequeño intérprete estable. Ese intérprete no contiene la lógica directamente. En su lugar, transporta un programa en una forma compacta y cifrada, y descifra ese programa sobre la marcha mientras se ejecuta. El resultado descifrado tampoco es JavaScript legible. Es bytecode para una pequeña máquina virtual que el propio intérprete implementa.

Así que la lógica real vive varias capas por debajo de todo lo que puedes leer.

![Las capas de BotGuard](/diagrams/botguard-layers.png)

El intérprete lee el bytecode cifrado, lo ejecuta dentro de su propia VM, y la VM acaba produciendo un snapshot. Ese snapshot es lo que el cliente envía a Google para la atestación. Está cifrado a su vez antes de salir, así que incluso la salida es opaca.

## Por qué resiste el análisis

Unas cuantas decisiones de diseño se acumulan y hacen esto mucho más difícil que un script ofuscado corriente.

El bytecode está cifrado, así que no puedes simplemente leer el programa. El intérprete solo lo descifra en el momento de ejecutarlo, en pequeños trozos, nunca como un único bloque legible.

El runtime se regenera. Cada vez que se ejecuta el challenge, la forma ejecutable se reconstruye y los nombres internos cambian de una ejecución a otra. Un punto de interrupción o un hook que funcionó una vez ya no encaja la vez siguiente, porque aquello a lo que apuntaba ya no existe en el mismo sitio.

Hay autoverificación. El snapshot incorpora una medida del código en ejecución, así que si parcheas la fuente para añadir un log o un hook, el snapshot cambia y el servidor lo rechaza. No puedes instrumentarlo discretamente desde dentro.

La VM también mira su entorno. Inspecciona detalles del navegador y del DOM, no solo simples banderas, así que falsificar uno o dos valores no basta. Comprueba que el mundo a su alrededor se comporta como un navegador real.

En conjunto, todo esto hace que la única forma fiable de obtener un resultado válido sea dejar que el challenge real se ejecute en un entorno JavaScript genuino. Leer el código te dice la estructura, pero no te permite atajar la ejecución.

## Qué significa esto si integras SABR

La conclusión práctica es sencilla. Una integración SABR que funciona ejecuta el challenge oficial de BotGuard en un runtime de JavaScript o en una WebView, lo deja producir su snapshot, y usa el token que vuelve. No intenta reconstruir BotGuard ni falsificar su salida, porque el diseño está hecho a propósito para que eso no funcione.

Para lo que el servidor hace con el snapshot, consulta [Atestación](./sabr-attestation).
