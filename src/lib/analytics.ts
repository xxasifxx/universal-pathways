import { getFingerprintSync, resolveFingerprint } from "./fingerprint";
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

export function logSignal(payload: SignalPayload): void {
  if (typeof window === "undefined") return;
  if (isTrackingDisabled()) return;
  if (NON_PERSISTED.has(payload.event)) return;

  void resolveFingerprint();

  beacon("/api/public/log-signal", {
    ...payload,
    path: payload.path ?? window.location.pathname,
    anon_id: getAnonId(),
    session_id: getSessionId(),
    fp_hash: getFingerprintSync(),
    referrer: document.referrer || null,
    utm: readUtm(),
    user_agent: navigator.userAgent,
  });
}