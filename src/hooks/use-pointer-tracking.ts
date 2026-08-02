import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { beacon } from "@/lib/analytics";
import { getFingerprintSync } from "@/lib/fingerprint";
import { isTrackingDisabled } from "@/lib/tracking-consent";
import { getAnonId, getSessionId } from "@/lib/visitor";

const SAMPLE_INTERVAL_MS = 100; // ~10 Hz
const MAX_BATCH = 200;

type Sample = { x: number; y: number; t: number };

export function usePointerTracking() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const pathRef = useRef(pathname);

  useEffect(() => {
    if (isTrackingDisabled()) return;

    let batch: Sample[] = [];
    let batchStart = Date.now();
    let last = 0;
    let isTouch = false;
    let pending: { x: number; y: number } | null = null;

    const flush = (path: string) => {
      if (batch.length === 0) return;
      const samples = batch;
      batch = [];
      batchStart = Date.now();
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
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) record(t.clientX, t.clientY, true);
    };
    const onHide = () => {
      if (pending) record(pending.x, pending.y, isTouch);
      flush(pathRef.current);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onHide);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onHide);
      flush(pathRef.current);
    };
  }, []);

  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);
}