import { defineConfig } from "vitepress";

export const en = defineConfig({
    lang: "en-US",
    description: "The PipePipe Wiki, by and for the community.",

    themeConfig: {
        nav: [
            { text: "Home", link: "/" },
            { text: "User Guide", link: "/user-guide/introduction" },
            { text: "Extractor", link: "/extractor/introduction" },
            { text: "SABR Guide", link: "/developer-guide/introduction" },
            { text: "Troubleshooting", link: "/issues/" },
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
                        {
                            text: "Settings Reference",
                            link: "/user-guide/settings-reference",
                        },
                    ],
                },
                {
                    text: "Troubleshooting",
                    items: [
                        {
                            text: "Troubleshooting Centre",
                            link: "/issues/",
                        },
                    ],
                },
            ],
            "/issues/": [
                {
                    text: "Start here",
                    items: [
                        { text: "Overview", link: "/issues/" },
                        { text: "Setup, updates, and backups", link: "/issues/setup" },
                        { text: "Reporting a problem", link: "/issues/reporting" },
                    ],
                },
                {
                    text: "YouTube",
                    items: [
                        { text: "WebView and protected playback", link: "/issues/webview" },
                        { text: "Playback, network, and sign-in", link: "/issues/youtube-playback" },
                        { text: "Background, popup, fullscreen, and queue", link: "/issues/player-modes" },
                        { text: "Downloads", link: "/issues/downloads" },
                        { text: "Search and discovery", link: "/issues/search" },
                    ],
                },
                {
                    text: "Library and discovery",
                    items: [
                        { text: "Playlists, history, and subscriptions", link: "/issues/library-and-feeds" },
                        { text: "Filters, comments, and subtitles", link: "/issues/content-controls" },
                    ],
                },
                {
                    text: "App and device",
                    items: [
                        { text: "Accounts and services", link: "/issues/accounts-and-services" },
                        { text: "Interface and language", link: "/issues/interface-and-language" },
                        { text: "MediaCodec and Android Auto", link: "/issues/android" },
                    ],
                },
            ],
            "/extractor/": [
                {
                    text: "Concepts",
                    items: [
                        {
                            text: "Overview",
                            link: "/extractor/introduction",
                        },
                        {
                            text: "Architecture",
                            link: "/extractor/architecture",
                        },
                        {
                            text: "Extraction flow",
                            link: "/extractor/extraction-flow",
                        },
                        {
                            text: "The InfoItem model",
                            link: "/extractor/info-model",
                        },
                    ],
                },
                {
                    text: "Building blocks",
                    items: [
                        {
                            text: "The Downloader",
                            link: "/extractor/the-downloader",
                        },
                        {
                            text: "Link handling",
                            link: "/extractor/link-handling",
                        },
                        {
                            text: "Paging and continuations",
                            link: "/extractor/paging",
                        },
                        {
                            text: "Search and filters",
                            link: "/extractor/search-and-filters",
                        },
                        {
                            text: "Localization and dates",
                            link: "/extractor/localization",
                        },
                        {
                            text: "Errors and exceptions",
                            link: "/extractor/errors",
                        },
                        {
                            text: "Parsing and utilities",
                            link: "/extractor/parsing-utilities",
                        },
                    ],
                },
                {
                    text: "Extractor types",
                    items: [
                        {
                            text: "Channels, playlists, kiosks",
                            link: "/extractor/list-extractors",
                        },
                        {
                            text: "Subscriptions and feeds",
                            link: "/extractor/subscriptions-and-feeds",
                        },
                    ],
                },
                {
                    text: "Content and media",
                    items: [
                        {
                            text: "Streams and delivery",
                            link: "/extractor/streams-and-delivery",
                        },
                        {
                            text: "Comments and bullet comments",
                            link: "/extractor/comments",
                        },
                        {
                            text: "Stream metadata",
                            link: "/extractor/stream-metadata",
                        },
                        {
                            text: "SponsorBlock",
                            link: "/extractor/sponsorblock",
                        },
                    ],
                },
                {
                    text: "Services",
                    items: [
                        {
                            text: "Services at a glance",
                            link: "/extractor/services",
                        },
                        {
                            text: "Inside YouTube",
                            link: "/extractor/youtube-service",
                        },
                    ],
                },
                {
                    text: "SABR Extractor",
                    items: [
                        { text: "Overview", link: "/extractor/sabr" },
                        { text: "Starting a session", link: "/extractor/sabr-probe" },
                        { text: "The request", link: "/extractor/sabr-request" },
                        { text: "UMP and decoding", link: "/extractor/sabr-decoding" },
                        { text: "Media, segments, index", link: "/extractor/sabr-media" },
                        { text: "Buffered ranges and seeking", link: "/extractor/sabr-buffered" },
                        { text: "The session driver", link: "/extractor/sabr-session" },
                        { text: "Control parts reference", link: "/extractor/sabr-control-parts" },
                    ],
                },
                {
                    text: "Contributing",
                    items: [
                        {
                            text: "Adding a service",
                            link: "/extractor/adding-a-service",
                        },
                        {
                            text: "Building the extractor",
                            link: "/extractor/building",
                        },
                    ],
                },
            ],
            "/developer-guide/": [
                {
                    text: "SABR Guide",
                    items: [
                        {
                            text: "Introduction",
                            link: "/developer-guide/introduction",
                        },
                        {
                            text: "The origins of SABR",
                            link: "/developer-guide/sabr-origins",
                        },
                        {
                            text: "The SABR protocol",
                            link: "/developer-guide/sabr-protocol",
                        },
                        {
                            text: "Inside BotGuard",
                            link: "/developer-guide/sabr-botguard",
                        },
                        {
                            text: "Attestation",
                            link: "/developer-guide/sabr-attestation",
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
            message: `Built by <a href="https://github.com/Priveetee" target="_blank" class="footer-link"><svg class="footer-icon github-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> Priveetee</a> for the open source project <a href="https://github.com/InfinityLoop1308/PipePipe" target="_blank" class="footer-link"><img src="/Docs-PipePipe/pipepipe.png" class="footer-icon"> PipePipe</a>`,
            copyright: `Copyright © ${new Date().getFullYear()}`,
        },

        editLink: {
            pattern:
                "https://github.com/Priveetee/Docs-PipePipe/edit/main/docs/:path",
            text: "Edit this page on GitHub",
        },
    },
});
