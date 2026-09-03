# UMP et décodage

Partie de [SABR dans l'extracteur](./sabr). YouTube enveloppe les réponses SABR
dans UMP (Ultra-Minimal Playback). Les trames UMP ne sont pas du protobuf ; le
payload de la plupart des control parts est du protobuf, résumé ou décodé par
`SabrResponseDecoder`.

## Framing UMP

`UmpReader` lit une suite de parts :

```text
[type: UMP-varint][size: UMP-varint][payload: size bytes] ...
```

`readPayloadsUntil(InputStream, consumer)` lit les parts une par une depuis le
flux réseau. `readAll(byte[])` parse un body déjà en mémoire, utile pour les
petites réponses et les tests. Un EOF propre sur une frontière de part termine
le flux ; un header ou payload tronqué lève `SabrProtocolException`.

Les varints UMP choisissent leur longueur selon les bits de poids fort du
premier octet :

| Premier octet | Octets totaux | Valeur |
| --- | ---: | --- |
| `0x00–0x7F` | 1 | valeur de l'octet |
| `0x80–0xBF` | 2 | `(b0 & 0x3f) + 64·b1` |
| `0xC0–0xDF` | 3 | `(b0 & 0x1f) + 32·(b1 + 256·b2)` |
| `0xE0–0xEF` | 4 | `(b0 & 0x0f) + 16·(b1 + 256·(b2 + 256·b3))` |
| `0xF0–0xFF` | 5 | quatre octets suivants, little-endian |

`UmpReader.UmpPart` expose le type, la taille et le payload. L'accès public aux
données est défensif ; le décodeur streaming utilise le tableau brut en interne
pour éviter de copier les gros payloads média.

## Identifiants de parts

`SabrResponseDecoder` reconnaît ces identifiants. Les control parts riches sont
conservées comme résumés ou octets bruts dans `YoutubeSabrResponse` ; elles ne
sont pas représentées par une classe Java chacune.

| ID | Constante | Traitement actuel |
| ---: | --- | --- |
| 10–12 | `ONESIE_*` | résumé générique |
| 20 | `MEDIA_HEADER` | décodage en `SabrMediaHeader` |
| 21 | `MEDIA` | comptage par id de header |
| 22 | `MEDIA_END` | fermeture d'un id de header |
| 30–34 | config/hints live | résumé générique |
| 35 | `NEXT_REQUEST_POLICY` | policy brute et lecture du backoff au champ 4 |
| 36–38 | métadonnées ustreamer | résumé générique |
| 42 | `FORMAT_INITIALIZATION_METADATA` | décodage des métadonnées générées |
| 43 | `SABR_REDIRECT` | conservation de l'URL de redirection |
| 44 | `SABR_ERROR` | résumé type/code |
| 45 | `SABR_SEEK` | résumé générique |
| 46 | `RELOAD_PLAYER_RESPONSE` | positionne `reloadRequested` |
| 47–51 | contrôles lecture/format | résumé générique |
| 52–56 | contrôles requête | résumé générique |
| 57 | `SABR_CONTEXT_UPDATE` | conservation de la mise à jour brute |
| 58 | `STREAM_PROTECTION_STATUS` | décodage du statut et des retries max |
| 59–65 | contrôles contexte/cache/connexion | résumé ; 65 est le prewarm |
| 66–67 | debug/snackbar | résumé générique |

Les identifiants inconnus sont enregistrés dans le résumé de diagnostic borné.
Les control parts malformées y sont conservées afin de ne pas jeter les médias
valides de la même réponse.

## Les chemins de décodage

`SabrResponseDecoder.decode(byte[])` parse d'abord toutes les parts puis les
dispatche. Le chemin applicatif normal utilise
`SabrStreamingResponseReader.read(InputStream, consumer, startConsumer, spool)` :
il garde les control parts en mémoire et envoie `MEDIA_HEADER`, `MEDIA` et
`MEDIA_END` à `SabrMediaSegmentCollector.Incremental`. Les segments terminés
arrivent dès leur `MEDIA_END`, sans garder un gros body 4K dans le heap.

Les deux chemins comptent les octets média par id de header. Puis
`YoutubeSabrResponse.getIntegrityIssues()` détecte headers dupliqués, média
manquant, longueurs incohérentes, fins manquantes, média sans header et fin sans
header. La session ne réessaie que les cas média incomplet classifiés, dans sa
limite bornée.

## La réponse décodée

`YoutubeSabrResponse` expose le code HTTP et le content type, les parts UMP, les
segments terminés, les métadonnées d'initialisation et live, les mises à jour de
contexte, les indicateurs redirection/erreur/reload, le statut de protection,
le backoff, les compteurs d'octets et des résumés bornés.
`summarizeForDiagnostics()` donne la structure et les tailles, pas le contenu
des jetons PO ou des cookies.

Suite : [Médias, segments et index](./sabr-media).
