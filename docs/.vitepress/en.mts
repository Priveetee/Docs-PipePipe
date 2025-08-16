import { defineConfig } from "vitepress";

export const en = defineConfig({
    lang: "en-US",
    description: "The unofficial, user-driven guide to PipePipe.",

    themeConfig: {
        nav: [
            { text: "Home", link: "/" },
            { text: "Guide", link: "/guide/getting-started" },
        ],

        sidebar: {
            "/guide/": [
                {
                    text: "User Guide",
                    items: [
                        {
                            text: "Getting Started",
                            link: "/guide/getting-started",
                        },
                        { text: "Core Features", link: "/guide/core-features" },
                    ],
                },
            ],
        },

        footer: {
            message: "Released under the GNU AGPL v3 License.",
            copyright: "Copyright © 2025-present Priveetee",
        },

        editLink: {
            pattern:
                "https://github.com/Priveetee/Docs-PipePipe/edit/main/docs/:path",
            text: "Edit this page on GitHub",
        },
    },
});
