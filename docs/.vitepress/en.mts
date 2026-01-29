import { defineConfig } from "vitepress";

export const en = defineConfig({
    lang: "en-US",
    description: "The PipePipe Wiki, by and for the community.",

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
                {
                    text: "Troubleshooting",
                    items: [
                        {
                            text: "Common Issues",
                            link: "/user-guide/common-issues",
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
            message: `Built by <a href="https://github.com/Priveetee" target="_blank">Priveetee</a> for <a href="https://github.com/InfinityLoop1308/PipePipe" target="_blank">PipePipe</a>`,
            copyright: `Copyright © 2025-${new Date().getFullYear()} Priveetee`,
        },

        editLink: {
            pattern:
                "https://github.com/Priveetee/Docs-PipePipe/edit/main/docs/:path",
            text: "Edit this page on GitHub",
        },
    },
});
