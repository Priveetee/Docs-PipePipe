# Le driver de session

Partie de [SABR dans l'extracteur](./sabr). `YoutubeSabrSession` est la machine à états qui transforme le protocole en un flux de segments jouables. Il possède les formats audio + vidéo choisis, le `YoutubeSabrStreamState`, le cache de segments, les compteurs, et un `SabrPoTokenProvider` optionnel.

## Un round

![Un round SABR](/diagrams/sabr-extractor-round.png)

Le POST brut est `fetchNextResponse` : la requête 0 est le cold start (`YoutubeSabrProbe.probeFirstMediaResponse`), les suivantes sont des follow-ups portant l'état. Chaque résultat est checké pour un redirect (compté, plafonné, puis l'URL de streaming est swappée) et `requestNumber` est incrémenté.

## Deux boucles de pilotage

- **`pumpOnce(localization)`** est l'avance lenient pilotée serveur : une requête, ingest, collect, cache, applique la policy, renvoie les segments arrivés (possiblement aucun). Le client l'appelle en boucle pour rester bufferisé en avance. Un seul round `status=3` ou policy-only n'est *pas* fatal ici, le watchdog de stall du client est le vrai give-up.
- **`fetchSegment(request, localization)`** est le chemin strict pour "j'ai besoin exactement de ce segment" : cache hit renvoie immédiatement, sinon il boucle jusqu'à `MAX_REQUESTS_PER_SEGMENT`, tolère un nombre borné de rounds policy-only, gère reload/protection/redirect, jusqu'à ce que la cible soit en cache ou throw.

### `pumpOnce`, pas à pas

1. `fetchNextResponse` (POST, gestion redirect, `requestNumber++`).
2. Si `getIntegrityIssues()` non-vide → throw.
3. `streamState.ingest(decoded)` (cookie, ranges, policy, live, contextes).
4. `SabrMediaSegmentCollector.collect(decoded)`.
5. Pour chaque segment : ingest dans l'état, met en cache ; si nouveau et pas init, append à `cacheOrder` et ajoute à `cachedBytes`.
6. `evictCacheIfNeeded()`.
7. Si un `SabrError` est présent → throw.
8. Si reload demandé → `maybeReload` ; succès → renvoie vide (le pump rappellera), sinon throw.
9. Si `isProtectedNoMediaResponse()` (status 3) → jeton PO best-effort, pas de throw.
10. Si des segments sont arrivés → reset des compteurs redirect et token-refresh (une réponse porteuse de média prouve que le jeton marche et que les hops CDN sont normaux, donc les longues sessions ne sont pas plafonnées).
11. Si un backoff a été demandé → sleep.

## Constantes (les bornes)

Chaque mode de défaillance est borné :

| Constante | Valeur | But |
| --- | --- | --- |
| `MAX_REQUESTS_PER_SEGMENT` | 16 | tentatives pour obtenir un segment précis |
| `MAX_POLICY_ONLY_RESPONSES_PER_SEGMENT` | 3 | rounds sans média consécutifs tolérés par segment |
| `MAX_REDIRECTS_PER_SESSION` | 3 | hops de redirect CDN (reset sur réponse média et sur reload) |
| `MAX_RELOADS_PER_SESSION` | 2 | reloads de réponse-lecteur demandés serveur |
| `MAX_PO_TOKEN_REFRESHES` | 2 | re-mints forcés de jeton avant d'abandonner |
| `MAX_BACKOFF_MS` | 30 000 | clamp sur le backoff serveur honoré |
| `MAX_CACHE_BYTES` | 32 Mio | budget cache d'octets média (~50 s de 4K) |
| `MIN_CACHED_SEGMENTS` | 6 | l'éviction ne descend jamais en dessous |
| `EVICT_BEHIND_MS` | 10 000 | back-buffer gardé derrière la tête de lecture |

## Le cache

Une `ConcurrentHashMap<String, SabrMediaSegment>` keyée `itag + ":" + ("init" | sequenceNumber)`, plus un `ArrayDeque` de clés de segments média dans l'ordre d'insertion et un `cachedBytes` courant. **Les segments init sont cachés mais jamais comptés ni évincés** (ils sont minuscules et toujours nécessaires). `getCachedSegment(request)` est un lookup sans effet de bord que le reader du client tape en premier. Le comptage d'octets est maintenu par `pumpOnce` (le chemin `fetchSegment` cache sans toucher au comptage).

### Éviction

`evictCacheIfNeeded()` tourne à chaque round (même quand byte-throttlé, sinon le throttle ne relâche jamais et la lecture freeze). Tant que `cachedBytes > MAX_CACHE_BYTES` **et** `cacheOrder.size() > MIN_CACHED_SEGMENTS`, il regarde le plus vieux segment et :

- si sa fin temporelle est `> playHeadMs - EVICT_BEHIND_MS`, il est dans le back-buffer ou en avance sur la tête → **stop** (le cache a le droit de dépasser le budget plutôt que d'évincer quelque chose d'encore utile) ;
- sinon le jette et soustrait ses octets.

`playHeadMs` est fourni par le client via `setPlayHeadMs`, c'est ce qui rend l'éviction consciente de la tête de lecture plutôt qu'aveuglément FIFO. (Le seek, qui vit aussi en partie ici via `prepareForRewind`, est couvert dans [le modèle buffered](./sabr-buffered).)

## Résilience

Dans une session, le driver contient chaque façon dont un serveur peut mal se comporter : redirects bornés, reloads bornés, rounds policy-only bornés, un clamp de backoff à 30 s, et re-mints de jeton bornés. Les budgets redirect et token-refresh **se reset sur tout round porteur de média**, donc une longue session saine n'est jamais tuée par des hops accumulés. Tout input malformé throw `SabrProtocolException`.

**Reload** (`maybeReload`) gère `SabrReloadPlayerResponse` : il re-fetche un `YoutubeSabrInfo` frais (nouveau `serverAbrStreamingUrl`), reset le compteur de redirect, mais **garde `requestNumber > 0`** pour que la requête suivante soit un follow-up portant le player time et les buffered ranges courants, il reprend sur place plutôt que de repartir de zéro.

## Protection et jetons

Une réponse `status=3` sans média signifie que le serveur veut un jeton PO lié au contenu avant de lâcher du média. `applyPoTokenForProtectedResponse` essaie d'abord le jeton caché (`maybeApplyPoToken(false)`) ; s'il est déjà en place et toujours rejeté, et que le budget de refresh le permet, il compte un refresh et force un mint frais (`maybeApplyPoToken(true)`) — un force-refresh déclenche un mint WebView d'environ 45 s. Le jeton vient du client via `SabrPoTokenProvider.getPoToken(info, streamState, forceRefresh)` ; l'extracteur ne fait que demander, cacher (dans `StreamState`), et réessayer. Le mint, c'est [l'histoire de l'attestation](/fr/developer-guide/sabr-attestation).

## Live

La session expose `isLive()`, `getLiveHeadSequenceNumber()`, et `isAtLiveEdge()` à partir du `SabrLiveMetadata` que l'état ingère (séquence du live edge à une marge de 2 segments, plus l'état DVR). C'est la fondation sur laquelle la lecture live se construit, côté client.

---

Suite : [Référence des control parts](./sabr-control-parts).
