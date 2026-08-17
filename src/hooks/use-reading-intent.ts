import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { logSignal } from "@/lib/analytics";
import { isTrackingDisabled } from "@/lib/tracking-consent";

const PAGES_KEY = "lv_reading_pages";
const THRESHOLD = 100;
const MIN_SESSION_MS = 20_000;

/** Routes where a nudge would be noise rather than help. */
const EXCLUDED = ["/volunteer", "/admin", "/donate"];

type Score = { value: number; reached: boolean };

function countedPages(path: string): number {
  try {
    const raw = window.sessionStorage.getItem(PAGES_KEY);
    const list = new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
    list.add(path);
    window.sessionStorage.setItem(PAGES_KEY, JSON.stringify([...list]));
    return list.size;
  } catch {
    return 1;
  }
}

/**
 * Derives a "this person is actually reading" score from behaviour we already
 * watch: active time, scroll depth, opened disclosures, and pages visited.
 * No extra network traffic — it only reports once, when the bar is crossed.
 */
export function useReadingIntent(): Score {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [score, setScore] = useState<Score>({ value: 0, reached: false });
  const reached = useRef(false);
  const started = useRef(Date.now());

  useEffect(() => {
    if (isTrackingDisabled()) return;
    if (EXCLUDED.some((p) => pathname.startsWith(p))) return;

    let activeMs = 0;
    let lastTick = Date.now();
    let maxScroll = 0;
    let expands = 0;
    const pages = countedPages(pathname);
    let cancelled = false;

    const compute = () => {
      // Roughly: a minute of attentive reading, or half that plus real depth.
      const timePts = Math.min(60, (activeMs / 1000) * 1.2);
      const scrollPts = maxScroll >= 75 ? 30 : maxScroll >= 50 ? 18 : maxScroll >= 25 ? 8 : 0;
      const expandPts = Math.min(30, expands * 12);
      const pagePts = Math.min(20, Math.max(0, pages - 1) * 12);
      const value = Math.round(timePts + scrollPts + expandPts + pagePts);

      if (cancelled) return;
      const hit =
        !reached.current && value >= THRESHOLD && Date.now() - started.current >= MIN_SESSION_MS;
      if (hit) {
        reached.current = true;
        logSignal({
          event: "reading_intent_reached",
          path: pathname,
          meta: { score: value, scroll_pct: maxScroll, expands, pages },
        });
      }
      setScore({ value, reached: reached.current });
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const pct =
        scrollable <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      if (pct > maxScroll) {
        maxScroll = pct;
        compute();
      }
    };

    const onToggle = (e: Event) => {
      const target = e.target;
      if (target instanceof HTMLDetailsElement && target.open) {
        expands += 1;
        compute();
      }
    };

    const interval = window.setInterval(() => {
      const now = Date.now();
      if (document.visibilityState === "visible") activeMs += now - lastTick;
      lastTick = now;
      compute();
    }, 2000);

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("toggle", onToggle, true);
    onScroll();

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("toggle", onToggle, true);
    };
  }, [pathname]);

  return score;
}
