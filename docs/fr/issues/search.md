# Recherche et découverte

La recherche est une opération d'extracteur, pas de lecture. Une correction de lecture ou de WebView ne doit pas être supposée corriger une recherche vide.

La recherche comporte des symptômes distincts : erreur de requête ; résultat vide pour une requête publique ordinaire ; résultat attendu manquant ; résultat dans une langue/pays inattendu ; filtre, onglet ou continuation incorrect. Les deux derniers peuvent être des données de service/localisation, pas un échec d'envoi de la requête.

## Avant de signaler

Testez une requête publique simple et notez :

- le service recherché (YouTube, BiliBili, NicoNico ou autre) ;
- la requête exacte et un résultat attendu ;
- le pays de contenu par défaut ;
- l'endpoint YouTube pour une recherche YouTube ;
- connexion, interface expérimentale et VPN/proxy.

Joignez le rapport généré si PipePipe en propose un. Si cela ne marche que parfois, donnez l'heure et précisez vide, hors sujet ou partiellement manquant. Pour un élément manquant, ajoutez son URL publique et dites si ouvrir directement chaîne/page fonctionne. Pour une langue inattendue, ajoutez langues de l'app et d'Android. Pour un filtre/onglet, notez le filtre et s'il a changé avant ou après la requête.

## Une requête, une comparaison

N'utilisez pas une longue requête privée ni une tendance mouvante. Prenez une expression publique courte, copiez-la telle quelle et nommez un résultat public attendu. Si vous comparez endpoint ou réseau, ne changez qu'une variable en gardant service/requête/pays.

## Garder un rapport séparé

N'ajoutez pas un problème de recherche à une issue de lecture ou WebView. Le mainteneur doit examiner une requête et une réponse différentes.

## Modèle de rapport recherche

```text
Service et requête exacte :
Résultat public attendu (URL si possible) :
Résultat observé (vide / manquant / faux / erreur) :
Version PipePipe / Android :
Pays de contenu / langue app / langue Android :
Endpoint YouTube, connexion, UI expérimentale, VPN/proxy :
Heure du test et rapport généré :
```
