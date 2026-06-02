import { defineConfig } from "vitepress";

export const es = defineConfig({
    lang: "es-ES",
    description: "La Wiki de PipePipe, por y para la comunidad.",

    themeConfig: {
        nav: [
            { text: "Inicio", link: "/es/" },
            { text: "Guía de Usuario", link: "/es/user-guide/introduction" },
            {
                text: "Guía SABR",
                link: "/es/developer-guide/introduction",
            },
        ],

        sidebar: {
            "/es/user-guide/": [
                {
                    text: "Primeros Pasos",
                    items: [
                        {
                            text: "Introducción",
                            link: "/es/user-guide/introduction",
                        },
                        {
                            text: "Instalación",
                            link: "/es/user-guide/installation",
                        },
                    ],
                },
                {
                    text: "Conceptos Clave",
                    items: [
                        {
                            text: "Funciones Principales",
                            link: "/es/user-guide/core-features",
                        },
                        {
                            text: "Gestos de Reproducción",
                            link: "/es/user-guide/playback-gestures",
                        },
                        {
                            text: "Copia de Seguridad y Restauración",
                            link: "/es/user-guide/backup-and-restore",
                        },
                    ],
                },
                {
                    text: "Ajustes",
                    items: [
                        {
                            text: "Ajustes del Reproductor",
                            link: "/es/user-guide/settings-player",
                        },
                        {
                            text: "Ajustes de Comportamiento",
                            link: "/es/user-guide/settings-behavior",
                        },
                    ],
                },
                {
                    text: "Solución de Problemas",
                    items: [
                        {
                            text: "Problemas Comunes",
                            link: "/es/user-guide/common-issues",
                        },
                    ],
                },
            ],
            "/es/developer-guide/": [
                {
                    text: "Guía SABR",
                    items: [
                        {
                            text: "Introducción",
                            link: "/es/developer-guide/introduction",
                        },
                        {
                            text: "Los orígenes de SABR",
                            link: "/es/developer-guide/sabr-origins",
                        },
                        {
                            text: "El protocolo SABR",
                            link: "/es/developer-guide/sabr-protocol",
                        },
                        {
                            text: "Dentro de BotGuard",
                            link: "/es/developer-guide/sabr-botguard",
                        },
                        {
                            text: "Atestación",
                            link: "/es/developer-guide/sabr-attestation",
                        },
                    ],
                },
            ],
        },

        lastUpdated: {
            text: "Última actualización",
        },

        docFooter: {
            prev: "Página anterior",
            next: "Página siguiente",
        },

        footer: {
            message: `Creado por <a href="https://github.com/Priveetee" target="_blank" class="footer-link"><svg class="footer-icon github-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> Priveetee</a> para el proyecto de código abierto <a href="https://github.com/InfinityLoop1308/PipePipe" target="_blank" class="footer-link"><img src="/Docs-PipePipe/pipepipe.png" class="footer-icon"> PipePipe</a>`,
            copyright: `Copyright © 2025-${new Date().getFullYear()} Priveetee`,
        },

        editLink: {
            pattern:
                "https://github.com/Priveetee/Docs-PipePipe/edit/main/docs/:path",
            text: "Editar esta página en GitHub",
        },
    },
});
