import { defineConfig } from "vitepress";

export const fr = defineConfig({
    lang: "fr-FR",
    description:
        "Le guide non-officiel de PipePipe, par et pour les utilisateurs.",

    themeConfig: {
        nav: [
            { text: "Accueil", link: "/fr/" },
            { text: "Guide", link: "/fr/guide/getting-started" },
        ],

        sidebar: {
            "/fr/guide/": [
                {
                    text: "Guide de l'Utilisateur",
                    items: [
                        {
                            text: "Premiers Pas",
                            link: "/fr/guide/getting-started",
                        },
                        {
                            text: "Fonctionnalités Clés",
                            link: "/fr/guide/core-features",
                        },
                    ],
                },
            ],
        },

        footer: {
            message: "Publié sous la licence GNU AGPL v3.",
            copyright: "Copyright © 2025-present Priveetee",
        },

        editLink: {
            pattern:
                "https://github.com/Priveetee/Docs-PipePipe/edit/main/docs/:path",
            text: "Modifier cette page sur GitHub",
        },
    },
});
