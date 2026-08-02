import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import { logSignal } from "@/lib/analytics";
import { isTrackingDisabled } from "@/lib/tracking-consent";

const SEEN_KEY = "lv_seen_sections";
const DWELL_MS = 2500;
const DEEP_ENGAGEMENT_COUNT = 4;

function readSeen(): Set<string> {
  try {
    return new Set(JSON.parse(window.localStorage.getItem(SEEN_KEY) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

function writeSeen(seen: Set<string>) {
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
  } catch {
    /* ignore */
  }
}

/**
 * Campaign equivalent of the PRD's service intent: watches priority planks,
 * calculator panels, and donate/volunteer CTAs.
 */
export function useCampaignIntent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (isTrackingDisabled()) return;
    if (typeof IntersectionObserver === "undefined") return;

    const timers = new Map<Element, number>();
    const fired = new Set<string>();
    let deepFired = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target;
          const slug = el.getAttribute("data-intent") ?? el.id;
          if (!slug) continue;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const timer = window.setTimeout(() => {
              if (fired.has(slug)) return;
              fired.add(slug);
              logSignal({
                event: "service_dwell",
                service_slug: slug,
                service_group: el.getAttribute("data-intent-group"),
                path: pathname,
                dwell_ms: DWELL_MS,
              });
              const seen = readSeen();
              if (seen.has(slug)) {
                logSignal({ event: "service_repeat_visit", service_slug: slug, path: pathname });
              }
              seen.add(slug);
              writeSeen(seen);
              if (!deepFired && fired.size >= DEEP_ENGAGEMENT_COUNT) {
                deepFired = true;
                logSignal({
                  event: "services_deep_engagement",
                  path: pathname,
                  meta: { sections: [...fired] },
                });
              }
            }, DWELL_MS);
            timers.set(el, timer);
          } else {
            const timer = timers.get(el);
            if (timer) window.clearTimeout(timer);
            timers.delete(el);
          }
        }
      },
      { threshold: [0.5] },
    );

    const scan = () => {
      document.querySelectorAll("[data-intent]").forEach((el) => observer.observe(el));
    };
    const raf = window.requestAnimationFrame(scan);

    const onExpand = (e: Event) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const el = target.closest("[data-intent]");
      if (!el) return;
      const slug = el.getAttribute("data-intent") ?? el.id;
      if (!slug) return;
      logSignal({ event: "service_expand", service_slug: slug, path: pathname });
    };
    document.addEventListener("click", onExpand, true);

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      document.removeEventListener("click", onExpand, true);
    };
  }, [pathname]);
}