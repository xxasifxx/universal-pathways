import { isTrackingDisabled } from "./tracking-consent";

const CACHE_KEY = "lv_fp_hash";
let cached: string | null = null;
let pending: Promise<string | null> | null = null;

export function getFingerprintSync(): string | null {
  if (cached) return cached;
  if (typeof window === "undefined") return null;
  try {
    cached = window.sessionStorage.getItem(CACHE_KEY);
  } catch {
    cached = null;
  }
  return cached;
}

/** Lazy, off the critical path. Signals sent before it resolves still join by anon_id. */
export function resolveFingerprint(): Promise<string | null> {
  if (typeof window === "undefined" || isTrackingDisabled()) return Promise.resolve(null);
  const existing = getFingerprintSync();
  if (existing) return Promise.resolve(existing);
  if (pending) return pending;

  pending = (async () => {
    try {
      const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
      const agent = await FingerprintJS.load();
      const result = await agent.get();
      cached = result.visitorId;
      try {
        window.sessionStorage.setItem(CACHE_KEY, cached);
      } catch {
        /* ignore */
      }
      return cached;
    } catch {
      return null;
    }
  })();

  return pending;
}