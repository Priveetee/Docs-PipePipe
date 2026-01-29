import { defineConfig } from "vitepress";

export const fr = defineConfig({
    lang: "fr-FR",
    description: "Le Wiki de PipePipe, par et pour la communauté.",

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
                {
                    text: "Dépannage",
                    items: [
                        {
                            text: "Problèmes Courants",
                            link: "/fr/user-guide/common-issues",
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

        lastUpdated: {
            text: "Dernière mise à jour",
        },

        docFooter: {
            prev: "Page précédente",
            next: "Page suivante",
        },

        footer: {
            message: `Développé par <a href="https://github.com/Priveetee" target="_blank" class="footer-link"><svg class="footer-icon github-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> Priveetee</a> pour le projet open source <a href="https://github.com/InfinityLoop1308/PipePipe" target="_blank" class="footer-link"><img src="/Docs-PipePipe/pipepipe.png" class="footer-icon"> PipePipe</a>`,
            copyright: `Copyright © 2025-${new Date().getFullYear()} Priveetee`,
        },

        editLink: {
            pattern:
                "https://github.com/Priveetee/Docs-PipePipe/edit/main/docs/:path",
            text: "Modifier cette page sur GitHub",
        },
    },
});
