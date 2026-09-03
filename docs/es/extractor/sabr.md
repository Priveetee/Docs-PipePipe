# SABR en el extractor

SABR es el protocolo de entrega de YouTube basado en sesiones. El protocolo,
su motivación, UMP, BotGuard y la atestación se describen en la [guía de
SABR](/es/developer-guide/introduction). Esta página muestra el paquete actual
`services/youtube/sabr` de PipePipeExtractor y separa extracción, peticiones,
decodificación y ensamblaje de medios.

## Dónde encaja

Cuando la respuesta del player MWEB contiene formatos SABR,
`YoutubeStreamExtractor.buildSabrStreams()` los expone con
`DeliveryMethod.SABR`. No hay una URL de medios por formato. El flujo lleva
`serverAbrStreamingUrl` como referencia común, mientras el cliente selecciona
formatos y conduce la sesión con `YoutubeSabrRequest`.

La división actual es:

- `YoutubeStreamExtractor` analiza `streamingData`, resuelve en un solo lote los
  parámetros JavaScript `n` y las firmas, y crea `YoutubeSabrInfo` y los
  metadatos de los flujos SABR;
- `YoutubeSabrSession` y `YoutubeSabrRequestHelper` codifican y envían cada
  transacción, siguen redirecciones y políticas, conservan cookies, contextos y
  metadatos de directo, y aplican recuperación limitada;
- `SabrStreamingResponseReader` y `SabrMediaSegmentCollector` decodifican la
  envoltura UMP y ensamblan segmentos terminados, con un archivo de spool
  opcional para segmentos grandes sin compresión;
- la capa de aplicación consume los segmentos y proporciona un PO token cuando
  YouTube lo solicita. El extractor no acuña ese token ni renderiza medios.

En PipePipeClient, `SabrSessionHelper` valida los metadatos del extractor y crea
la sesión, `SabrMediaBridge` convierte las peticiones de segmentos de Media3 en
peticiones preparation/playback, y `SabrRequestCoordinator` serializa reintentos,
backoff y recuperación de atestación. Las descargas reutilizan la misma sesión
mediante `SabrDownloader` y después remultiplexan los archivos de audio/vídeo.
El proveedor DOM local suministra el PO token; no es una segunda implementación
de SABR.

## Orden recomendado

1. **[Iniciar una sesión](./sabr-probe)** — análisis de la respuesta del player,
   `YoutubeSabrInfo`, creación de peticiones y estado entre llamadas.
2. **[La petición](./sabr-request)** — `VideoPlaybackAbrRequest`, formatos
   preferidos y seleccionados, rangos almacenados y wire format protobuf.
3. **[UMP y decodificación](./sabr-decoding)** — framing, identificadores de
   partes y el `YoutubeSabrResponse` producido por el decodificador.
4. **[Medios, segmentos e índice](./sabr-media)** — headers, payloads
   comprimidos, ensamblaje y líneas temporales de inicialización.
5. **[El driver de sesión](./sabr-session)** — semántica de una transacción,
   redirecciones, backoff, atestación y límites de recuperación.
6. **[Referencia de control parts](./sabr-control-parts)** — partes de control
   que reconoce `SabrResponseDecoder`.

## Mapa actual de clases

| Área | Clases actuales |
| --- | --- |
| Respuesta del player | `YoutubeStreamExtractor`, `YoutubeSabrInfo`, `YoutubeSabrInfo.Format` |
| Sesión y peticiones | `YoutubeSabrSession`, `YoutubeSabrRequest`, `YoutubeSabrRequest.Track`, `YoutubeSabrRequestHelper` |
| Respuesta y UMP | `YoutubeSabrResponse`, `SabrResponseDecoder`, `SabrStreamingResponseReader`, `UmpReader`, `SabrProto` |
| Ensamblaje de medios | `SabrMediaSegment`, `SabrMediaSegmentCollector`, `SabrMediaHeader`, `SabrFormatInitializationMetadata` |
| Líneas temporales | `YoutubeSabrFormatTimeline`, `SabrSegmentIndex`, `SabrMp4SegmentIndexParser`, `SabrWebmSegmentIndexParser` |
| Diagnóstico | `YoutubeSabrSessionDiagnostics`, `YoutubeSabrSession.TraceSnapshot` |
| Errores | `SabrProtocolException`, `SabrRecoverableException`, `SabrAttestationException` |

El mapa solo enumera clases que existen en el código actual de
PipePipeExtractor. La documentación antigua citaba clases de probe, perfiles y
estado de flujo que ya no forman parte de este paquete.

## La frontera

El extractor sabe describir y conducir una transacción SABR, pero no convierte la
respuesta en audio o vídeo decodificados. Para las formas de las peticiones y
respuestas, BotGuard y la atestación, continúa con la [guía de
SABR](/es/developer-guide/introduction).
