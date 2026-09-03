# SABR dans l'extracteur

SABR est le protocole de livraison YouTube basé sur des sessions. Le protocole
lui-même, ses raisons d'être, UMP, BotGuard et l'attestation sont décrits dans
le [guide SABR](/fr/developer-guide/introduction). Cette page cartographie le
package actuel `services/youtube/sabr` de PipePipeExtractor et explique la
frontière entre extraction, requêtes, décodage et assemblage média.

## Où il se situe

Quand la réponse player MWEB contient des formats SABR,
`YoutubeStreamExtractor.buildSabrStreams()` les expose avec
`DeliveryMethod.SABR`. Il n'y a pas d'URL média par format. Le flux porte
`serverAbrStreamingUrl` comme référence commune, tandis que le client choisit
les formats et pilote la session avec `YoutubeSabrRequest`.

La répartition actuelle est la suivante :

- `YoutubeStreamExtractor` parse `streamingData`, résout en un seul lot les
  paramètres JavaScript `n` et les signatures, puis crée `YoutubeSabrInfo` et
  les métadonnées de flux SABR ;
- `YoutubeSabrSession` et `YoutubeSabrRequestHelper` encodent et envoient chaque
  transaction, suivent les redirections et politiques, conservent cookies,
  contextes et métadonnées live, et appliquent la récupération bornée ;
- `SabrStreamingResponseReader` et `SabrMediaSegmentCollector` décodent
  l'enveloppe UMP et assemblent les segments média terminés, avec un fichier de
  spool optionnel pour les gros segments non compressés ;
- la couche applicative consomme les segments terminés et fournit un jeton PO
  quand YouTube le demande. L'extracteur ne crée pas ce jeton et ne décode pas
  les médias.

Dans PipePipeClient, `SabrSessionHelper` valide les métadonnées de l'extracteur
et crée la session, `SabrMediaBridge` transforme les demandes de segments Media3
en requêtes preparation/playback, et `SabrRequestCoordinator` sérialise les
retries, le backoff et la récupération d'attestation. Les téléchargements
réutilisent la même session via `SabrDownloader`, puis remuxent les fichiers
audio/vidéo collectés. Le provider DOM local fournit le jeton PO ; ce n'est pas
une seconde implémentation de SABR.

## Ordre de lecture

1. **[Démarrer une session](./sabr-probe)** — parsing de la réponse player,
   `YoutubeSabrInfo`, création des requêtes et état conservé entre les appels.
2. **[La requête](./sabr-request)** — `VideoPlaybackAbrRequest`, formats
   préférés et sélectionnés, plages bufferisées et wire format protobuf.
3. **[UMP et décodage](./sabr-decoding)** — framing, identifiants de parts et
   `YoutubeSabrResponse` produit par le décodeur.
4. **[Médias, segments et index](./sabr-media)** — headers, payloads compressés,
   assemblage et timelines d'initialisation.
5. **[Le driver de session](./sabr-session)** — sémantique d'une transaction,
   redirections, backoff, attestation et limites de récupération.
6. **[Référence des control parts](./sabr-control-parts)** — parts de contrôle
   reconnues par `SabrResponseDecoder`.

## Cartographie actuelle des classes

| Domaine | Classes actuelles |
| --- | --- |
| Réponse player | `YoutubeStreamExtractor`, `YoutubeSabrInfo`, `YoutubeSabrInfo.Format` |
| Session et requêtes | `YoutubeSabrSession`, `YoutubeSabrRequest`, `YoutubeSabrRequest.Track`, `YoutubeSabrRequestHelper` |
| Réponse et UMP | `YoutubeSabrResponse`, `SabrResponseDecoder`, `SabrStreamingResponseReader`, `UmpReader`, `SabrProto` |
| Assemblage média | `SabrMediaSegment`, `SabrMediaSegmentCollector`, `SabrMediaHeader`, `SabrFormatInitializationMetadata` |
| Timelines | `YoutubeSabrFormatTimeline`, `SabrSegmentIndex`, `SabrMp4SegmentIndexParser`, `SabrWebmSegmentIndexParser` |
| Diagnostic | `YoutubeSabrSessionDiagnostics`, `YoutubeSabrSession.TraceSnapshot` |
| Erreurs | `SabrProtocolException`, `SabrRecoverableException`, `SabrAttestationException` |

La cartographie ne liste volontairement que les classes présentes dans le code
actuel de PipePipeExtractor. L'ancienne documentation citait des classes de
probe, de profil et d'état de flux qui ne font plus partie de ce package.

## La frontière

L'extracteur sait décrire et piloter une transaction SABR, mais il ne transforme
pas la réponse en audio ou vidéo décodés. Pour les formes des requêtes et
réponses, BotGuard et l'attestation, continuez avec le [guide
SABR](/fr/developer-guide/introduction).
