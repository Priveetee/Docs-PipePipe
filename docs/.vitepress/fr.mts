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
                    text: "Guide de l'Utilisateur",
                    items: [
                        {
                            text: "Introduction",
                            link: "/fr/user-guide/introduction",
                        },
                        {
                            text: "Fonctionnalités Clés",
                            link: "/fr/user-guide/core-features",
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
