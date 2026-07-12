import { defineConfig } from "vitepress";

export const fr = defineConfig({
    lang: "fr-FR",
    description: "Le Wiki de PipePipe, par et pour la communauté.",

    themeConfig: {
        nav: [
            { text: "Accueil", link: "/fr/" },
            { text: "Guide Utilisateur", link: "/fr/user-guide/introduction" },
            { text: "Extracteur", link: "/fr/extractor/introduction" },
            {
                text: "Guide SABR",
                link: "/fr/developer-guide/introduction",
            },
            { text: "Dépannage", link: "/fr/issues/" },
        ],

        sidebar: {
            "/fr/user-guide/": [
                {
                    text: "Pour Commencer",
                    items: [
                        {
                            text: "Introduction",
                            link: "/fr/user-guide/introduction",
                        },
                        {
                            text: "Installation",
                            link: "/fr/user-guide/installation",
                        },
                    ],
                },
                {
                    text: "Concepts Clés",
                    items: [
                        {
                            text: "Fonctionnalités Clés",
                            link: "/fr/user-guide/core-features",
                        },
                        {
                            text: "Gestes de Lecture",
                            link: "/fr/user-guide/playback-gestures",
                        },
                        {
                            text: "Sauvegarde et Restauration",
                            link: "/fr/user-guide/backup-and-restore",
                        },
                    ],
                },
                {
                    text: "Paramètres",
                    items: [
                        {
                            text: "Paramètres du Lecteur",
                            link: "/fr/user-guide/settings-player",
                        },
                        {
                            text: "Paramètres de Comportement",
                            link: "/fr/user-guide/settings-behavior",
                        },
                        {
                            text: "Référence des réglages",
                            link: "/fr/user-guide/settings-reference",
                        },
                    ],
                },
                {
                    text: "Dépannage",
                    items: [
                        {
                            text: "Centre de dépannage",
                            link: "/fr/issues/",
                        },
                    ],
                },
            ],
            "/fr/issues/": [
                {
                    text: "Commencer ici",
                    items: [
                        { text: "Vue d'ensemble", link: "/fr/issues/" },
                        { text: "Configuration, mises à jour et sauvegardes", link: "/fr/issues/setup" },
                        { text: "Signaler un problème", link: "/fr/issues/reporting" },
                    ],
                },
                {
                    text: "YouTube",
                    items: [
                        { text: "WebView et lecture protégée", link: "/fr/issues/webview" },
                        { text: "Lecture, réseau et connexion", link: "/fr/issues/youtube-playback" },
                        { text: "Arrière-plan, popup, plein écran et file", link: "/fr/issues/player-modes" },
                        { text: "Téléchargements", link: "/fr/issues/downloads" },
                        { text: "Recherche et découverte", link: "/fr/issues/search" },
                    ],
                },
                {
                    text: "Bibliothèque et découverte",
                    items: [
                        { text: "Playlists, historique et abonnements", link: "/fr/issues/library-and-feeds" },
                        { text: "Filtres, commentaires et sous-titres", link: "/fr/issues/content-controls" },
                    ],
                },
                {
                    text: "Application et appareil",
                    items: [
                        { text: "Comptes et services", link: "/fr/issues/accounts-and-services" },
                        { text: "Interface et langue", link: "/fr/issues/interface-and-language" },
                        { text: "MediaCodec et Android Auto", link: "/fr/issues/android" },
                    ],
                },
            ],
            "/fr/extractor/": [
                {
                    text: "Concepts",
                    items: [
                        { text: "Aperçu", link: "/fr/extractor/introduction" },
                        { text: "Architecture", link: "/fr/extractor/architecture" },
                        { text: "Flux d'extraction", link: "/fr/extractor/extraction-flow" },
                        { text: "Le modèle InfoItem", link: "/fr/extractor/info-model" },
                    ],
                },
                {
                    text: "Briques de base",
                    items: [
                        { text: "Le Downloader", link: "/fr/extractor/the-downloader" },
                        { text: "Gestion des liens", link: "/fr/extractor/link-handling" },
                        { text: "Pagination et continuations", link: "/fr/extractor/paging" },
                        { text: "Recherche et filtres", link: "/fr/extractor/search-and-filters" },
                        { text: "Localisation et dates", link: "/fr/extractor/localization" },
                        { text: "Erreurs et exceptions", link: "/fr/extractor/errors" },
                        { text: "Parsing et utilitaires", link: "/fr/extractor/parsing-utilities" },
                    ],
                },
                {
                    text: "Types d'extracteurs",
                    items: [
                        { text: "Channels, playlists, kiosques", link: "/fr/extractor/list-extractors" },
                        { text: "Abonnements et fils", link: "/fr/extractor/subscriptions-and-feeds" },
                    ],
                },
                {
                    text: "Contenu et média",
                    items: [
                        { text: "Flux et delivery", link: "/fr/extractor/streams-and-delivery" },
                        { text: "Commentaires et bullet comments", link: "/fr/extractor/comments" },
                        { text: "Métadonnées de flux", link: "/fr/extractor/stream-metadata" },
                        { text: "SponsorBlock", link: "/fr/extractor/sponsorblock" },
                    ],
                },
                {
                    text: "Services",
                    items: [
                        { text: "Tour des services", link: "/fr/extractor/services" },
                        { text: "Dans YouTube", link: "/fr/extractor/youtube-service" },
                    ],
                },
                {
                    text: "SABR Extracteur",
                    items: [
                        { text: "Overview", link: "/fr/extractor/sabr" },
                        { text: "Démarrer une session", link: "/fr/extractor/sabr-probe" },
                        { text: "La requête", link: "/fr/extractor/sabr-request" },
                        { text: "UMP et décodage", link: "/fr/extractor/sabr-decoding" },
                        { text: "Média, segments, index", link: "/fr/extractor/sabr-media" },
                        { text: "Buffered ranges et seek", link: "/fr/extractor/sabr-buffered" },
                        { text: "Le driver de session", link: "/fr/extractor/sabr-session" },
                        { text: "Référence des control parts", link: "/fr/extractor/sabr-control-parts" },
                    ],
                },
                {
                    text: "Contribuer",
                    items: [
                        { text: "Ajouter un service", link: "/fr/extractor/adding-a-service" },
                        { text: "Builder l'extracteur", link: "/fr/extractor/building" },
                    ],
                },
            ],
            "/fr/developer-guide/": [
                {
                    text: "Guide SABR",
                    items: [
                        {
                            text: "Introduction",
                            link: "/fr/developer-guide/introduction",
                        },
                        {
                            text: "Les origines de SABR",
                            link: "/fr/developer-guide/sabr-origins",
                        },
                        {
                            text: "Le protocole SABR",
                            link: "/fr/developer-guide/sabr-protocol",
                        },
                        {
                            text: "Dans BotGuard",
                            link: "/fr/developer-guide/sabr-botguard",
                        },
                        {
                            text: "Attestation",
                            link: "/fr/developer-guide/sabr-attestation",
                        },
                    ],
                },
            ],
        },

        lastUpdated: {
            text: "Dernière mise à jour",
        },

        docFooter: {
            prev: "Page précédente",
            next: "Page suivante",
        },

        footer: {
            message: `Développé par <a href="https://github.com/Priveetee" target="_blank" class="footer-link"><svg class="footer-icon github-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> Priveetee</a> pour le projet open source <a href="https://github.com/InfinityLoop1308/PipePipe" target="_blank" class="footer-link"><img src="/Docs-PipePipe/pipepipe.png" class="footer-icon"> PipePipe</a>`,
            copyright: `Copyright © ${new Date().getFullYear()}`,
        },

        editLink: {
            pattern:
                "https://github.com/Priveetee/Docs-PipePipe/edit/main/docs/:path",
            text: "Modifier cette page sur GitHub",
        },
    },
});
