import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { beacon } from "@/lib/analytics";
import { getFingerprintSync } from "@/lib/fingerprint";
import { isTrackingDisabled } from "@/lib/tracking-consent";
import { getAnonId, getSessionId } from "@/lib/visitor";

const SAMPLE_INTERVAL_MS = 250; // ~4 Hz — enough for heatmaps, a quarter of the writes
const MAX_BATCH = 120;
const FLUSH_INTERVAL_MS = 15000;
const MAX_SAMPLES_PER_PAGE = 600; // hard cap so one long session can't flood ingest

type Sample = { x: number; y: number; t: number };

export function usePointerTracking() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const pathRef = useRef(pathname);
  const flushRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isTrackingDisabled()) return;

    let batch: Sample[] = [];
    let batchStart = Date.now();
    let last = 0;
    let isTouch = false;
    let pending: { x: number; y: number } | null = null;
    let sentThisPage = 0;

    const flush = (path: string) => {
      if (batch.length === 0) return;
      const samples = batch;
      batch = [];
      batchStart = Date.now();
      sentThisPage += samples.length;
      beacon("/api/public/ingest-pointer", {
        anon_id: getAnonId(),
        session_id: getSessionId(),
        fp_hash: getFingerprintSync(),
        path,
        viewport_w: window.innerWidth,
        viewport_h: window.innerHeight,
        is_touch: isTouch,
        samples,
      });
    };

    const record = (clientX: number, clientY: number, touch: boolean) => {
      if (sentThisPage + batch.length >= MAX_SAMPLES_PER_PAGE) return;
      const now = Date.now();
      if (now - last < SAMPLE_INTERVAL_MS) {
        pending = { x: clientX, y: clientY };
        return;
      }
      last = now;
      isTouch = isTouch || touch;
      const doc = document.documentElement;
      // Document percentages, never pixels: pixels are unreplayable at other viewports.
      const x = Math.round((clientX / Math.max(1, doc.clientWidth)) * 1000) / 10;
      const y =
        Math.round(((clientY + window.scrollY) / Math.max(1, doc.scrollHeight)) * 1000) / 10;
      batch.push({ x, y, t: now - batchStart });
      pending = null;
      if (batch.length >= MAX_BATCH) flush(pathRef.current);
    };

    const onPointerMove = (e: PointerEvent) => record(e.clientX, e.clientY, e.pointerType === "touch");
    // Touch devices barely fire pointermove; taps are the signal that matters there.
    const onPointerDown = (e: PointerEvent) => {
      last = 0;
      record(e.clientX, e.clientY, e.pointerType === "touch");
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) record(t.clientX, t.clientY, true);
    };
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) {
        last = 0;
        record(t.clientX, t.clientY, true);
      }
    };
    const onHide = () => {
      if (pending) record(pending.x, pending.y, isTouch);
      flush(pathRef.current);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onHide);
    // Without a timer, an SPA session that never unloads never writes a row.
    const interval = window.setInterval(() => flush(pathRef.current), FLUSH_INTERVAL_MS);
    flushRef.current = () => {
      flush(pathRef.current);
      sentThisPage = 0;
    };

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onHide);
      window.clearInterval(interval);
      flushRef.current = null;
      flush(pathRef.current);
    };
  }, []);

  useEffect(() => {
    // Flush the previous page's samples before the path label changes under them.
    flushRef.current?.();
    pathRef.current = pathname;
  }, [pathname]);
}