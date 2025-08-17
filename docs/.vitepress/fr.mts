import { defineConfig } from "vitepress";

export const fr = defineConfig({
    lang: "fr-FR",
    description:
        "Le guide non-officiel de PipePipe, par et pour les utilisateurs.",

    themeConfig: {
        nav: [
            { text: "Accueil", link: "/fr/" },
            { text: "Guide Utilisateur", link: "/fr/user-guide/introduction" },
            {
                text: "Guide Développeur",
                link: "/fr/developer-guide/introduction",
            },
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
                    ],
                },
            ],
            "/fr/developer-guide/": [
                {
                    text: "Guide du Développeur",
                    items: [
                        {
                            text: "Introduction",
                            link: "/fr/developer-guide/introduction",
                        },
                    ],
                },
            ],
        },

        search: {
            options: {
                translations: {
                    button: {
                        buttonText: "Rechercher",
                        buttonAriaLabel: "Rechercher",
                    },
                    modal: {
                        results_not_found: "Aucun résultat pour",
                        resetButtonTitle: "Réinitialiser la recherche",
                        footer: {
                            selectText: "pour sélectionner",
                            navigateText: "pour naviguer",
                            closeText: "pour fermer",
                        },
                    },
                },
            },
        },

        lastUpdated: {
            text: "Dernière mise à jour",
        },

        docFooter: {
            prev: "Page précédente",
            next: "Page suivante",
        },

        footer: {
            message: "Publié sous la licence GNU AGPL v3.",
            copyright: "Copyright © 2025-present Tux",
        },

        editLink: {
            pattern:
                "https://github.com/Priveetee/Docs-PipePipe/edit/main/docs/:path",
            text: "Modifier cette page sur GitHub",
        },
    },
});
