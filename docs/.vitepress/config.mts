import { withMermaid } from "vitepress-plugin-mermaid";
import { en } from "./en.mts";
import { fr } from "./fr.mts";
import { es } from "./es.mts";

export default withMermaid({
    title: "PipePipe Wiki",
    base: "/Docs-PipePipe/",

    head: [["link", { rel: "icon", href: "/Docs-PipePipe/pipepipe.png" }]],

    themeConfig: {
        logo: "/pipepipe.png",
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
        es: {
            label: "Español",
            link: "/es/",
            ...es,
        },
    },

    vite: {
        optimizeDeps: { include: ["mermaid"] },
        ssr: { noExternal: ["mermaid"] },
    },
});
