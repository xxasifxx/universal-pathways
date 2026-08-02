import { useEffect } from "react";

import { logSignal } from "@/lib/analytics";
import { isTrackingDisabled } from "@/lib/tracking-consent";

const INTERACTIVE = "a,button,input,select,textarea,summary,label,[role=button],[role=link],[tabindex]";
/** Hover is only meaningful on real controls. `[tabindex]` matched wrappers like
 *  <main>, which produced page-sized "hovers" with the whole page as the label. */
const HOVERABLE = "a[href],button,summary,[role=button],[role=link]";
const MAX_HOVER_AREA_RATIO = 0.4;
const RAGE_WINDOW_MS = 700;
const RAGE_RADIUS_PX = 30;
const RAGE_COUNT = 3;
const HOVER_DWELL_MS = 600;

function labelFor(el: Element): string {
  const tracked = el.getAttribute("data-track") ?? el.closest("[data-track]")?.getAttribute("data-track");
  if (tracked) return tracked;
  const aria = el.getAttribute("aria-label");
  if (aria) return aria;
  const text = (el.textContent ?? "").trim().replace(/\s+/g, " ");
  // A "label" longer than a sentence means we grabbed a container, not a control.
  return text.length > 80 ? "" : text;
}

function isMeaningfulHoverTarget(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  const area = rect.width * rect.height;
  const viewport = Math.max(1, window.innerWidth * window.innerHeight);
  if (area / viewport > MAX_HOVER_AREA_RATIO) return false;
  return labelFor(el).length > 0;
}

function describe(el: Element): Record<string, unknown> {
  const rect = el.getBoundingClientRect();
  return {
    label: labelFor(el),
    tag: el.tagName.toLowerCase(),
    href: el instanceof HTMLAnchorElement ? el.getAttribute("href") : null,
    rect: {
      x: Math.round(rect.left),
      y: Math.round(rect.top + window.scrollY),
      w: Math.round(rect.width),
      h: Math.round(rect.height),
    },
  };
}

function docPercent(clientX: number, clientY: number) {
  const doc = document.documentElement;
  return {
    x: Math.round((clientX / Math.max(1, doc.clientWidth)) * 1000) / 10,
    y: Math.round(((clientY + window.scrollY) / Math.max(1, doc.scrollHeight)) * 1000) / 10,
  };
}

export function useClickTracking() {
  useEffect(() => {
    if (isTrackingDisabled()) return;

    let recent: { x: number; y: number; t: number }[] = [];
    let rageFiredAt = 0;
    const hoverTimers = new WeakMap<Element, number>();
    const hoverStarts = new WeakMap<Element, number>();
    const hoveredLabels = new Set<string>();
    const hoverLogged = new Set<string>();

    const onClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest(INTERACTIVE);
      const el = interactive ?? target;
      const info = describe(el);
      const point = docPercent(e.clientX, e.clientY);
      const label = String(info["label"] ?? "");

      logSignal({
        event: "element_click",
        meta: {
          ...info,
          ...point,
          interactive: Boolean(interactive),
          hovered_first: label ? hoveredLabels.has(label) : false,
        },
      });

      // Rage detection
      const now = Date.now();
      recent = recent.filter((p) => now - p.t < RAGE_WINDOW_MS);
      recent.push({ x: e.clientX, y: e.clientY, t: now });
      const cluster = recent.filter(
        (p) => Math.hypot(p.x - e.clientX, p.y - e.clientY) <= RAGE_RADIUS_PX,
      );
      if (cluster.length >= RAGE_COUNT && now - rageFiredAt > RAGE_WINDOW_MS) {
        rageFiredAt = now;
        logSignal({
          event: "rage_click",
          meta: { ...info, ...point, clicks: cluster.length },
        });
      }

      // Dead click: non-interactive target with no DOM change shortly after
      if (!interactive) {
        const html = document.body.innerHTML.length;
        const url = window.location.href;
        window.setTimeout(() => {
          if (document.body.innerHTML.length === html && window.location.href === url) {
            logSignal({ event: "dead_click", meta: { ...info, ...point } });
          }
        }, 500);
      }
    };

    const onEnter = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const el = target.closest(HOVERABLE);
      if (!el || !isMeaningfulHoverTarget(el)) return;
      hoverStarts.set(el, Date.now());
      const timer = window.setTimeout(() => {
        const label = labelFor(el);
        if (!label) return;
        hoveredLabels.add(label);
        // One hover per control per page: repeats measured nothing but noise.
        const key = `${window.location.pathname}|${label}`;
        if (hoverLogged.has(key)) return;
        hoverLogged.add(key);
        logSignal({
          event: "cta_hover",
          dwell_ms: HOVER_DWELL_MS,
          meta: describe(el),
        });
      }, HOVER_DWELL_MS);
      hoverTimers.set(el, timer);
    };

    const onLeave = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const el = target.closest(HOVERABLE);
      if (!el) return;
      const timer = hoverTimers.get(el);
      if (timer) window.clearTimeout(timer);
      hoverTimers.delete(el);
      hoverStarts.delete(el);
    };

    const onFocusIn = (e: FocusEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (!target.matches("input,textarea,select")) return;
      logSignal({
        event: "form_field_focus",
        meta: { field: target.getAttribute("name") ?? target.getAttribute("id"), ...describe(target) },
      });
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("pointerenter", onEnter, true);
    document.addEventListener("pointerleave", onLeave, true);
    document.addEventListener("focusin", onFocusIn, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerenter", onEnter, true);
      document.removeEventListener("pointerleave", onLeave, true);
      document.removeEventListener("focusin", onFocusIn, true);
    };
  }, []);
}