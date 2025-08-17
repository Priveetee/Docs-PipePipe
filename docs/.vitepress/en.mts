import { defineConfig } from "vitepress";

export const en = defineConfig({
    lang: "en-US",
    description: "The unofficial, user-driven guide to PipePipe.",

    themeConfig: {
        nav: [
            { text: "Home", link: "/" },
            { text: "User Guide", link: "/user-guide/introduction" },
            { text: "Developer Guide", link: "/developer-guide/introduction" },
        ],

        sidebar: {
            "/user-guide/": [
                {
                    text: "User Guide",
                    items: [
                        {
                            text: "Introduction",
                            link: "/user-guide/introduction",
                        },
                        {
                            text: "Core Features",
                            link: "/user-guide/core-features",
                        },
                    ],
                },
            ],
            "/developer-guide/": [
                {
                    text: "Developer Guide",
                    items: [
                        {
                            text: "Introduction",
                            link: "/developer-guide/introduction",
                        },
                    ],
                },
            ],
        },

        footer: {
            message: "Released under the GNU AGPL v3 License.",
            copyright: "Copyright © 2025-present Tux",
        },

        editLink: {
            pattern:
                "https://github.com/Priveetee/Docs-PipePipe/edit/main/docs/:path",
            text: "Edit this page on GitHub",
        },
    },
});
