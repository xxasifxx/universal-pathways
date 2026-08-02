import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { logSignal } from "@/lib/analytics";
import { isTrackingDisabled } from "@/lib/tracking-consent";

const SCROLL_MARKS = [25, 50, 75, 90];
const TIME_MARKS = [30, 60, 120, 300];

export function usePageEngagement() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const state = useRef({
    activeMs: 0,
    lastTick: Date.now(),
    maxScroll: 0,
    scrollFired: new Set<number>(),
    timeFired: new Set<number>(),
    exited: false,
  });

  useEffect(() => {
    if (isTrackingDisabled()) return;

    const s = {
      activeMs: 0,
      lastTick: Date.now(),
      maxScroll: 0,
      scrollFired: new Set<number>(),
      timeFired: new Set<number>(),
      exited: false,
    };
    state.current = s;

    const accumulate = () => {
      const now = Date.now();
      if (document.visibilityState === "visible") s.activeMs += now - s.lastTick;
      s.lastTick = now;
    };

    const measureScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const pct =
        scrollable <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      if (pct > s.maxScroll) s.maxScroll = pct;
      for (const mark of SCROLL_MARKS) {
        if (s.maxScroll >= mark && !s.scrollFired.has(mark)) {
          s.scrollFired.add(mark);
          logSignal({ event: "scroll_depth", path: pathname, meta: { depth_pct: mark } });
        }
      }
    };

    const tick = () => {
      accumulate();
      const seconds = Math.round(s.activeMs / 1000);
      for (const mark of TIME_MARKS) {
        if (seconds >= mark && !s.timeFired.has(mark)) {
          s.timeFired.add(mark);
          logSignal({
            event: "time_on_page",
            path: pathname,
            dwell_ms: s.activeMs,
            meta: { seconds: mark },
          });
        }
      }
    };

    const exit = () => {
      if (s.exited) return;
      s.exited = true;
      accumulate();
      logSignal({
        event: "page_exit",
        path: pathname,
        dwell_ms: s.activeMs,
        meta: { max_scroll_pct: s.maxScroll },
      });
    };

    const onVisibility = () => {
      accumulate();
      if (document.visibilityState === "hidden") exit();
    };

    measureScroll();
    const interval = window.setInterval(tick, 5000);
    window.addEventListener("scroll", measureScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", exit);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("scroll", measureScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", exit);
      exit();
    };
  }, [pathname]);
}