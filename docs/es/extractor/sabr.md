# SABR en el extractor

SABR es el protocolo de delivery basado en sesión de YouTube. El protocolo *en sí*, el porqué, UMP, BotGuard, la atestación, es la [Guía SABR](/es/developer-guide/introduction). Esta sección es el **mapa del lado del extractor**: las ~47 clases de `services/youtube/sabr`, qué hace cada una, y cómo se conduce una sesión de reproducción de principio a fin. Se asume que leíste la guía.

## Dónde encaja

Cuando YouTube devuelve formatos SABR, el extractor de flujo los expone con `DeliveryMethod.SABR` (ver [Flujos y delivery](./streams-and-delivery)). A diferencia de progressive o DASH, no hay una URL por-formato que entregar al player. Los bytes viven detrás de un endpoint, `serverAbrStreamingUrl`, que solo habla el baile petición/respuesta de SABR: POSTeas un `VideoPlaybackAbrRequest` binario, recibes un body UMP, lo decodificas, avanzas, repites.

El reparto de tareas:

- **El extractor posee el protocolo.** Hace el probe de la respuesta del player, abre la sesión, construye cada petición binaria, la POSTea, decodifica el UMP, sigue el estado bufferizado por-track, reensambla los segmentos, y acota cada modo de fallo.
- **El cliente posee el ritmo y la pantalla.** Su pump decide *cuándo* pedir más, cachea los segmentos, alimenta el decodificador, conduce los seeks, y suministra lo único que el extractor no puede producir: un PO token (minteado en una WebView).

El extractor nunca forja un token y nunca decodifica un píxel.

## Leer en este orden

1. **[Iniciar una sesión](./sabr-probe)** — el probe: respuesta del player, `serverAbrStreamingUrl`, los client profiles, los formatos.
2. **[La petición](./sabr-request)** — el proto `VideoPlaybackAbrRequest`, campo por campo, y el wire format.
3. **[UMP y decodificación](./sabr-decoding)** — el framing UMP, la tabla completa de part-types, la respuesta decodificada.
4. **[Medio, segmentos e índice](./sabr-media)** — cómo los bytes de medio se vuelven segmentos reproducibles, y cómo un tiempo se mapea a un número de segmento.
5. **[El modelo buffered y el seek](./sabr-buffered)** — el modelo contiguo-vs-max que evita la starvation, y cómo funciona el seek.
6. **[El driver de sesión](./sabr-session)** — el bucle de pump, la caché, la evicción, y cada retry acotado.
7. **[Referencia de control parts](./sabr-control-parts)** — cada instrucción del servidor y su efecto.

## Mapa de clases

| Área | Clases |
| --- | --- |
| Ciclo de vida de la sesión | `YoutubeSabrProbe`, `YoutubeSabrProbeResult`, `YoutubeSabrInfo`, `YoutubeSabrSession`, `YoutubeSabrStreamState`, `YoutubeSabrClientProfile` |
| Formatos | `YoutubeSabrFormat`, `SabrSelectableFormats`, `SabrFormatSelectionConfig`, `SabrFormatInitializationMetadata` |
| Petición | `YoutubeSabrRequestBuilder`, `SabrSegmentRequest`, `SabrRequestIdentifier`, `SabrColdStartPoToken`, `SabrProto`, `SabrRequestDumper` |
| UMP + decodificación | `UmpReader`, `UmpPart`, `SabrResponseDecoder`, `SabrDecodedResponse` |
| Medio + segmentos | `SabrMediaHeader`, `SabrMediaSegment`, `SabrMediaSegmentCollector`, `SabrSegmentIndex`, `SabrMp4SegmentIndexParser`, `SabrWebmSegmentIndexParser`, `SabrOnesieData`, `SabrOnesieHeader`, `SabrOnesieInnertubeResponse` |
| Control parts | `SabrNextRequestPolicy`, `SabrStreamProtectionStatus`, `SabrRedirect`, `SabrSeek`, `SabrReloadPlayerResponse`, `SabrPlaybackStartPolicy`, `SabrContextSendingPolicy`, `SabrContextUpdate`, `SabrContextValue`, `SabrRequestCancellationPolicy`, `SabrPrewarmConnection`, `SabrLiveMetadata`, `SabrError`, `SabrSnackbarMessage` |
| Estado de buffer | `SabrBufferedRange`, `SabrPlaybackCookie` |
| Tokens | `SabrPoTokenProvider` |
| Errores | `SabrProtocolException` |

## La frontera

El extractor entiende y conduce el protocolo; no forja tokens y no renderiza el medio. Para el protocolo en sí, las shapes de petición y respuesta, el modelo de sesión, BotGuard y la atestación, lee la [Guía SABR](/es/developer-guide/introduction).
