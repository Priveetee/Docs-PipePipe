# SABR dans l'extracteur

SABR est le protocole de delivery à base de session de YouTube. Le protocole *lui-même*, le pourquoi, UMP, BotGuard, l'attestation, c'est le [Guide SABR](/fr/developer-guide/introduction). Cette section est la **carte côté extracteur** : les ~47 classes de `services/youtube/sabr`, ce que fait chacune, et comment une session de lecture est pilotée de bout en bout. On suppose que tu as lu le guide.

## Où ça se situe

Quand YouTube renvoie des formats SABR, l'extracteur de flux les fait remonter avec `DeliveryMethod.SABR` (voir [Flux et delivery](./streams-and-delivery)). Contrairement au progressif ou au DASH, il n'y a pas d'URL par-format à passer au lecteur. Les octets vivent derrière un seul endpoint, `serverAbrStreamingUrl`, qui ne parle que la danse requête/réponse SABR : tu POSTes un `VideoPlaybackAbrRequest` binaire, tu reçois un body UMP, tu le décodes, tu avances, tu répètes.

Le partage des rôles :

- **L'extracteur possède le protocole.** Il probe la réponse du lecteur, ouvre la session, construit chaque requête binaire, la POSTe, décode l'UMP, suit l'état bufferisé par-track, réassemble les segments, et borne chaque mode de défaillance.
- **Le client possède le rythme et l'écran.** Son pump décide *quand* redemander, met en cache les segments, alimente le décodeur, pilote les seeks, et fournit la seule chose que l'extracteur ne peut pas produire : un jeton PO (minté dans une WebView).

L'extracteur ne forge jamais de jeton et ne décode jamais un pixel.

## À lire dans cet ordre

1. **[Démarrer une session](./sabr-probe)** — le probe : réponse du lecteur, `serverAbrStreamingUrl`, les client profiles, les formats.
2. **[La requête](./sabr-request)** — le proto `VideoPlaybackAbrRequest`, champ par champ, et le wire format.
3. **[UMP et décodage](./sabr-decoding)** — le cadrage UMP, la table complète des part-types, la réponse décodée.
4. **[Média, segments et l'index](./sabr-media)** — comment des octets média deviennent des segments jouables, et comment un temps se mappe à un numéro de segment.
5. **[Le modèle buffered et le seek](./sabr-buffered)** — le modèle contigu-vs-max qui évite la starvation, et comment marche le seek.
6. **[Le driver de session](./sabr-session)** — la boucle de pump, le cache, l'éviction, et chaque retry borné.
7. **[Référence des control parts](./sabr-control-parts)** — chaque instruction serveur et son effet.

## Carte des classes

| Domaine | Classes |
| --- | --- |
| Cycle de vie de session | `YoutubeSabrProbe`, `YoutubeSabrProbeResult`, `YoutubeSabrInfo`, `YoutubeSabrSession`, `YoutubeSabrStreamState`, `YoutubeSabrClientProfile` |
| Formats | `YoutubeSabrFormat`, `SabrSelectableFormats`, `SabrFormatSelectionConfig`, `SabrFormatInitializationMetadata` |
| Requête | `YoutubeSabrRequestBuilder`, `SabrSegmentRequest`, `SabrRequestIdentifier`, `SabrColdStartPoToken`, `SabrProto`, `SabrRequestDumper` |
| UMP + décodage | `UmpReader`, `UmpPart`, `SabrResponseDecoder`, `SabrDecodedResponse` |
| Média + segments | `SabrMediaHeader`, `SabrMediaSegment`, `SabrMediaSegmentCollector`, `SabrSegmentIndex`, `SabrMp4SegmentIndexParser`, `SabrWebmSegmentIndexParser`, `SabrOnesieData`, `SabrOnesieHeader`, `SabrOnesieInnertubeResponse` |
| Control parts | `SabrNextRequestPolicy`, `SabrStreamProtectionStatus`, `SabrRedirect`, `SabrSeek`, `SabrReloadPlayerResponse`, `SabrPlaybackStartPolicy`, `SabrContextSendingPolicy`, `SabrContextUpdate`, `SabrContextValue`, `SabrRequestCancellationPolicy`, `SabrPrewarmConnection`, `SabrLiveMetadata`, `SabrError`, `SabrSnackbarMessage` |
| État bufferisé | `SabrBufferedRange`, `SabrPlaybackCookie` |
| Jetons | `SabrPoTokenProvider` |
| Erreurs | `SabrProtocolException` |

## La frontière

L'extracteur comprend et pilote le protocole ; il ne forge pas de jeton et ne fait pas le rendu du média. Pour le protocole lui-même, les shapes de requête et réponse, le modèle de session, BotGuard et l'attestation, lis le [Guide SABR](/fr/developer-guide/introduction).
