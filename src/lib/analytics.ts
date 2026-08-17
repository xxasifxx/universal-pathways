import { getFingerprintSync, whenFingerprintReady } from "./fingerprint";
import { isTrackingDisabled } from "./tracking-consent";
import { getAnonId, getSessionId } from "./visitor";

export const SIGNAL_EVENTS = [
  "service_dwell",
  "service_expand",
  "services_deep_engagement",
  "service_repeat_visit",
  "cta_call_click",
  "cta_directions_click",
  "page_view",
  "session_start",
  "scroll_depth",
  "time_on_page",
  "page_exit",
  "element_click",
  "cta_hover",
  "rage_click",
  "dead_click",
  "form_field_focus",
  "form_abandon",
  // Campaign outcomes: what a person actually did, not how they moved a mouse.
  "calculator_run",
  "calculator_completed",
  "scenario_adjusted",
  "scenario_copied",
  "budget_mode_toggled",
  "zone_selected",
  "timeline_step_opened",
  "priority_read",
  "form_started",
  "form_submitted",
  "donate_click",
  "reading_intent_reached",
  "volunteer_prompt_shown",
  "volunteer_prompt_dismissed",
  "volunteer_prompt_opened",
  "volunteer_modal_opened",
] as const;

export type SignalEvent = (typeof SIGNAL_EVENTS)[number];

/** cta_hover is aggregated into element_click meta rather than persisted per event. */
const NON_PERSISTED: ReadonlySet<SignalEvent> = new Set<SignalEvent>([]);

export type SignalPayload = {
  event: SignalEvent;
  service_slug?: string | null;
  service_group?: string | null;
  path?: string | null;
  dwell_ms?: number | null;
  meta?: Record<string, unknown> | null;
};

const ATTRIBUTION_KEY = "lv_ads_attribution";

function readUtm(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (stored) return JSON.parse(stored) as Record<string, string>;
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
      if (key.startsWith("utm_") || key === "gclid" || key === "fbclid") utm[key] = value;
    }
    if (Object.keys(utm).length === 0) return null;
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(utm));
    return utm;
  } catch {
    return null;
  }
}

export function beacon(url: string, body: unknown): void {
  const json = JSON.stringify(body);
  try {
    // MUST be text/plain: application/json triggers a preflight sendBeacon cannot complete.
    const blob = new Blob([json], { type: "text/plain;charset=UTF-8" });
    if (navigator.sendBeacon?.(url, blob)) return;
  } catch {
    /* fall through */
  }
  try {
    void fetch(url, {
      method: "POST",
      headers: { "content-type": "text/plain;charset=UTF-8" },
      body: json,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* give up silently */
  }
}

/**
 * Signals emitted before the fingerprint resolves are held briefly and flushed
 * once it lands, so nothing ships without the cross-device join key.
 */
let queue: Array<Record<string, unknown>> = [];
let flushing = false;

function send(body: Record<string, unknown>): void {
  beacon("/api/public/log-signal", { ...body, fp_hash: getFingerprintSync() });
}

function flushSoon(): void {
  if (flushing) return;
  flushing = true;
  void whenFingerprintReady().then(() => {
    const pending = queue;
    queue = [];
    for (const item of pending) send(item);
  });
  // A tab closing mid-wait still gets its data out, fingerprint or not.
  window.addEventListener(
    "pagehide",
    () => {
      const pending = queue;
      queue = [];
      for (const item of pending) send(item);
    },
    { once: true },
  );
}

export function logSignal(payload: SignalPayload): void {
  if (typeof window === "undefined") return;
  if (isTrackingDisabled()) return;
  if (NON_PERSISTED.has(payload.event)) return;

  const body: Record<string, unknown> = {
    ...payload,
    path: payload.path ?? window.location.pathname,
    anon_id: getAnonId(),
    session_id: getSessionId(),
    referrer: document.referrer || null,
    utm: readUtm(),
    user_agent: navigator.userAgent,
  };

  if (getFingerprintSync()) {
    send(body);
    return;
  }
  queue.push(body);
  flushSoon();
}