import { useEffect } from "react";

import { beacon } from "@/lib/analytics";
import { getFingerprintSync } from "@/lib/fingerprint";
import { isTrackingDisabled } from "@/lib/tracking-consent";
import { getAnonId, getSessionId } from "@/lib/visitor";

const CHUNK_BYTES = 150 * 1024;
const SAMPLE_RATE = 0.25; // record replay for 25% of sessions
const SAMPLE_KEY = "lv_replay_sampled";

function sessionIsSampled(): boolean {
  try {
    const stored = window.sessionStorage.getItem(SAMPLE_KEY);
    if (stored !== null) return stored === "1";
    const sampled = Math.random() < SAMPLE_RATE;
    window.sessionStorage.setItem(SAMPLE_KEY, sampled ? "1" : "0");
    return sampled;
  } catch {
    return false;
  }
}

export function useSessionReplay() {
  useEffect(() => {
    if (isTrackingDisabled()) return;
    if (!sessionIsSampled()) return;

    let stop: (() => void) | undefined;
    let cancelled = false;
    let buffer: unknown[] = [];
    let bytes = 0;
    let seq = 0;
    const hoverTimers = new WeakMap<Element, number>();

    const flush = () => {
      if (buffer.length === 0) return;
      const events = buffer;
      buffer = [];
      bytes = 0;
      beacon("/api/public/ingest-replay", {
        anon_id: getAnonId(),
        session_id: getSessionId(),
        fp_hash: getFingerprintSync(),
        path: window.location.pathname,
        seq: seq++,
        events,
      });
    };

    void (async () => {
      try {
        const rrweb = await import("rrweb");
        if (cancelled) return;

        stop = rrweb.record({
          maskAllInputs: true,
          emit(event) {
            buffer.push(event);
            bytes += JSON.stringify(event).length;
            if (bytes >= CHUNK_BYTES) flush();
          },
        });

        // Hover annotations consumed by the replay player overlay.
        const onEnter = (e: PointerEvent) => {
          const target = e.target;
          if (!(target instanceof Element)) return;
          const el = target.closest("a,button,[role=button],[data-track]");
          if (!el) return;
          const started = Date.now();
          const timer = window.setTimeout(() => {
            const rect = el.getBoundingClientRect();
            rrweb.record.addCustomEvent("lv_hover", {
              label:
                el.getAttribute("data-track") ??
                el.getAttribute("aria-label") ??
                (el.textContent ?? "").trim().slice(0, 60),
              rect: {
                x: Math.round(rect.left),
                y: Math.round(rect.top),
                w: Math.round(rect.width),
                h: Math.round(rect.height),
              },
              dwell_ms: Date.now() - started,
            });
          }, 600);
          hoverTimers.set(el, timer);
        };
        const onLeave = (e: PointerEvent) => {
          const target = e.target;
          if (!(target instanceof Element)) return;
          const el = target.closest("a,button,[role=button],[data-track]");
          if (!el) return;
          const timer = hoverTimers.get(el);
          if (timer) window.clearTimeout(timer);
        };

        document.addEventListener("pointerenter", onEnter, true);
        document.addEventListener("pointerleave", onLeave, true);
        window.addEventListener("pagehide", flush);
        document.addEventListener("visibilitychange", flush);
        const interval = window.setInterval(flush, 10000);

        stop = ((original) => () => {
          original?.();
          document.removeEventListener("pointerenter", onEnter, true);
          document.removeEventListener("pointerleave", onLeave, true);
          window.removeEventListener("pagehide", flush);
          document.removeEventListener("visibilitychange", flush);
          window.clearInterval(interval);
        })(stop);
      } catch {
        /* replay unavailable */
      }
    })();

    return () => {
      cancelled = true;
      stop?.();
      flush();
    };
  }, []);
}