import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { logSignal } from "@/lib/analytics";
import { isTrackingDisabled } from "@/lib/tracking-consent";

const PAGES_KEY = "lv_reading_pages";
const STATE_KEY = "lv_reading_state";
const THRESHOLD = 70;
const MIN_SESSION_MS = 20_000;
/** Below this much of the first screen, the visitor is still at the top. */
const FOLD_RATIO = 0.4;

/** Routes where a nudge would be noise rather than help. */
const EXCLUDED = ["/volunteer", "/admin"];

type Score = { value: number; reached: boolean };

/** Accumulated across the whole visit, not just the current page. */
type SessionState = {
  engagedMs: number;
  expands: number;
  startedAt: number;
  reached: boolean;
  /** Deepest scroll reached on each path this visit. */
  scroll: Record<string, number>;
};

function readState(): SessionState {
  const fallback: SessionState = {
    engagedMs: 0,
    expands: 0,
    startedAt: Date.now(),
    reached: false,
    scroll: {},
  };
  try {
    const raw = window.sessionStorage.getItem(STATE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<SessionState>;
    return {
      engagedMs: Number(parsed.engagedMs) || 0,
      expands: Number(parsed.expands) || 0,
      startedAt: Number(parsed.startedAt) || fallback.startedAt,
      reached: Boolean(parsed.reached),
      scroll:
        parsed.scroll && typeof parsed.scroll === "object" ? { ...parsed.scroll } : {},
    };
  } catch {
    return fallback;
  }
}
/** Depth credit for one page: half of a page read is worth most of it. */
function depthPoints(pct: number): number {
  if (pct >= 70) return 14;
  if (pct >= 45) return 10;
  if (pct >= 20) return 5;
  return 0;
}


function writeState(state: SessionState) {
  try {
    window.sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

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
 * watch. The main input is engaged time — the tab visible and the page scrolled
 * past the first screen — added up across the whole visit, alongside scroll
 * depth per page, opened disclosures, and pages seen. It reports once, when the
 * bar is crossed, so there is no extra network traffic.
 */
export function useReadingIntent(): Score {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [score, setScore] = useState<Score>({ value: 0, reached: false });
  const reached = useRef(false);

  useEffect(() => {
    if (isTrackingDisabled()) return;
    if (EXCLUDED.some((p) => pathname.startsWith(p))) return;

    const session = readState();
    if (session.reached) reached.current = true;
    let engagedMs = session.engagedMs;
    let expands = session.expands;
    const startedAt = session.startedAt;
    const scroll = session.scroll;
    let lastTick = Date.now();
    let maxScroll = scroll[pathname] ?? 0;
    const pages = countedPages(pathname);
    let cancelled = false;

    const snapshot = (): SessionState => ({
      engagedMs,
      expands,
      startedAt,
      reached: reached.current,
      scroll: { ...scroll, [pathname]: maxScroll },
    });

    writeState(snapshot());

    const compute = () => {
      // About half a minute spent down in the content gets there on its own;
      // depth across pages and opened panels shorten it.
      const timePts = Math.min(55, (engagedMs / 1000) * 2);
      const depths = { ...scroll, [pathname]: maxScroll };
      const scrollPts = Math.min(
        30,
        Object.values(depths).reduce((sum, pct) => sum + depthPoints(pct), 0),
      );
      const expandPts = Math.min(18, expands * 6);
      const pagePts = Math.min(24, Math.max(0, pages - 1) * 12);
      const value = Math.round(timePts + scrollPts + expandPts + pagePts);

      if (cancelled) return;
      writeState(snapshot());
      const hit =
        !reached.current && value >= THRESHOLD && Date.now() - startedAt >= MIN_SESSION_MS;
      if (hit) {
        reached.current = true;
        writeState(snapshot());
        logSignal({
          event: "reading_intent_reached",
          path: pathname,
          meta: { score: value, scroll_pct: maxScroll, engaged_ms: engagedMs, expands, pages },
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
      const belowFold = window.scrollY > window.innerHeight * FOLD_RATIO;
      if (document.visibilityState === "visible" && belowFold) engagedMs += now - lastTick;
      lastTick = now;
      compute();
    }, 2000);

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("toggle", onToggle, true);
    onScroll();

    return () => {
      cancelled = true;
      const now = Date.now();
      const belowFold = window.scrollY > window.innerHeight * FOLD_RATIO;
      if (document.visibilityState === "visible" && belowFold) engagedMs += now - lastTick;
      writeState(snapshot());
      window.clearInterval(interval);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("toggle", onToggle, true);
    };
  }, [pathname]);

  return score;
}
