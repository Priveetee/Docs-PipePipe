# Le driver de session

Partie de [SABR dans l'extracteur](./sabr). `YoutubeSabrSession` conserve l'état
d'une séquence de transactions SABR. Il n'implémente ni le buffer côté client
ni le décodeur média ; il envoie les requêtes, traite les contrôles du protocole
et remet les objets `SabrMediaSegment` terminés à son appelant.

## Une transaction

`requestOnce(request, consumer)` effectue une requête, sauf si la réponse
précédente a demandé d'attendre. Dans ce cas, il renvoie un `RequestResult`
différé et n'envoie aucune requête HTTP. Sinon il :

1. Ajoute un événement de diagnostic borné et poste la requête encodée via
   `YoutubeSabrRequestHelper`.
2. Lit le corps UMP en streaming avec `SabrStreamingResponseReader` ; les
   segments terminés sont remis au `consumer` à `MEDIA_END`.
3. Exige `application/vnd.yt-ump`, enregistre les durées et compteurs d'octets,
   puis incrémente le numéro de requête après lecture de la réponse.
4. Traite les politiques, mises à jour de contexte, métadonnées live et
   redirections.
5. Renvoie le nombre de segments terminés et le backoff demandé par le serveur.

Le numéro de requête commence à zéro. Une redirection n'est acceptée qu'en
HTTPS et si elle reste sur `googlevideo.com` ou un de ses sous-domaines. Une
réponse contenant du média remet le compteur de redirections à zéro.

## Récupération bornée

L'implémentation actuelle garde explicitement ces limites dans la session :

| Limite | Valeur | Effet |
| --- | ---: | --- |
| Redirections dans une session | 3 | Une quatrième redirection est rejetée. |
| Réponses média incomplètes consécutives | 3 | Les longueurs incohérentes ou `MEDIA_END` manquants sont réessayés, puis échouent. |
| Réponses consécutives « attestation en attente / sans média » | 3 | Une attestation qui reste bloquée échoue avec `SabrAttestationException`. |
| Backoff serveur | 30 000 ms | Un backoff `NEXT_REQUEST_POLICY` supérieur est rejeté. |

`SabrRecoverableException` sert pour les médias streamés incomplets et les E/S
de spool qui peuvent être réessayés. Les erreurs de protocole, redirections
invalides, erreurs SABR explicites et exigences d'attestation ne sont pas
avalées. Une part `RELOAD_PLAYER_RESPONSE` est remontée comme erreur de protocole
à l'appelant ; rafraîchir la réponse player reste une décision de la couche
applicative.

## Cookies, contextes et protection

`NEXT_REQUEST_POLICY` peut transporter un cookie de lecture et un délai. La
session conserve ce cookie et l'inclut dans les messages `streamerContext` des
requêtes suivantes. Les mises à jour SABR sont stockées par type ; la politique
d'envoi démarre, arrête ou supprime les types, afin de ne renvoyer que les
valeurs actives.

Quand le serveur signale le statut de protection `2` (attestation en attente),
la session l'enregistre et tolère un nombre borné de réponses sans média. Le
statut `3` est exposé comme erreur d'attestation requise. L'appelant peut fournir
un jeton PO lié au contenu avec `setPoToken` ; la session en conserve une copie
défensive et le request helper l'inclut dans le contexte streamer. Le mint du
jeton reste hors de l'extracteur.

## Métadonnées live et diagnostics

`LIVE_METADATA` met à jour `isLive`, la séquence et l'horodatage du live edge,
ainsi que le flag DVR post-live. Ces valeurs sont disponibles via
`isLive()`, `getLiveHeadSequenceNumber()`, `getLiveHeadTimeMs()` et
`isPostLiveDvr()`.

Les diagnostics sont bornés et les traces détaillées sont opt-in.
`getDiagnosticTrace()` renvoie la chaîne des événements récents ;
`getMemoryDiagnosticSummary()` et `getTraceSnapshot()` exposent les compteurs
de réponses, parts UMP, médias et segments sans écrire les octets des jetons ou
du cookie.

Suite : [Référence des control parts](./sabr-control-parts).
