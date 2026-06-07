import DefaultTheme from "vitepress/theme";
import "./style.css";

// Persist scroll position per page and restore it on refresh (F5).
// Normal in-app link navigation keeps VitePress's default (scroll to top).
export default {
    extends: DefaultTheme,
    enhanceApp() {
        if (typeof window === "undefined") {
            return;
        }
        // we restore manually, so stop the browser from fighting us
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }

        const key = () => "vp-scroll:" + location.pathname;
        let restoring = false;
        let saveTimer = 0;

        const save = () => {
            if (restoring) {
                return;
            }
            clearTimeout(saveTimer);
            saveTimer = window.setTimeout(() => {
                try {
                    sessionStorage.setItem(key(), String(window.scrollY));
                } catch (e) {
                    /* sessionStorage unavailable, just skip */
                }
            }, 120);
        };

        window.addEventListener("scroll", save, { passive: true });
        window.addEventListener("beforeunload", () => {
            try {
                sessionStorage.setItem(key(), String(window.scrollY));
            } catch (e) {
                /* ignore */
            }
        });

        const restore = () => {
            if (location.hash) {
                // an anchor in the URL wins, let VitePress jump to it
                return;
            }
            let raw: string | null = null;
            try {
                raw = sessionStorage.getItem(key());
            } catch (e) {
                return;
            }
            if (raw == null) {
                return;
            }
            const y = parseInt(raw, 10);
            if (Number.isNaN(y) || y <= 0) {
                return;
            }

            restoring = true;
            let tries = 0;
            const stop = () => {
                restoring = false;
                ["wheel", "touchstart", "keydown"].forEach((ev) =>
                    window.removeEventListener(ev, stop)
                );
            };
            // if the user starts scrolling themselves, give up immediately
            ["wheel", "touchstart", "keydown"].forEach((ev) =>
                window.addEventListener(ev, stop, { passive: true })
            );

            // re-apply until the page is tall enough (late images/diagrams)
            const tick = () => {
                if (!restoring) {
                    return;
                }
                window.scrollTo(0, y);
                tries += 1;
                if (tries < 25 && Math.abs(window.scrollY - y) > 2) {
                    window.setTimeout(tick, 50);
                } else {
                    stop();
                }
            };
            requestAnimationFrame(tick);
        };

        if (document.readyState === "complete") {
            restore();
        } else {
            window.addEventListener("load", restore);
        }
    },
};
