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
                    text: "Getting Started",
                    items: [
                        {
                            text: "Introduction",
                            link: "/user-guide/introduction",
                        },
                        {
                            text: "Installation",
                            link: "/user-guide/installation",
                        },
                    ],
                },
                {
                    text: "Core Concepts",
                    items: [
                        {
                            text: "Core Features",
                            link: "/user-guide/core-features",
                        },
                        {
                            text: "Playback Gestures",
                            link: "/user-guide/playback-gestures",
                        },
                        {
                            text: "Backup and Restore",
                            link: "/user-guide/backup-and-restore",
                        },
                    ],
                },
                {
                    text: "Settings",
                    items: [
                        {
                            text: "Player Settings",
                            link: "/user-guide/settings-player",
                        },
                        {
                            text: "Behavior Settings",
                            link: "/user-guide/settings-behavior",
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

        lastUpdated: {
            text: "Last Updated",
        },

        docFooter: {
            prev: "Previous page",
            next: "Next page",
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
