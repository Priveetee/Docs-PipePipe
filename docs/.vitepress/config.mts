import { defineConfig } from "vitepress";
import { en } from "./en.mts";
import { fr } from "./fr.mts";

export default defineConfig({
    title: "PipePipe Wiki",
    base: "/Docs-PipePipe/",

    themeConfig: {
        search: {
            provider: "local",
        },
        socialLinks: [
            {
                icon: "github",
                link: "https://github.com/InfinityLoop1308/PipePipe",
            },
        ],
    },

    locales: {
        root: {
            label: "English",
            ...en,
        },
        fr: {
            label: "Français",
            link: "/fr/",
            ...fr,
        },
    },
});
