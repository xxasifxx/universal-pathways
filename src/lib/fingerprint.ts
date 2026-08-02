import { isTrackingDisabled } from "./tracking-consent";

/** localStorage, not sessionStorage: the fingerprint must survive tab closes so a
 *  device that loses its anon_id can still be re-joined to the same person. */
const CACHE_KEY = "lv_fp_hash";
const LEGACY_KEY = "lv_fp_hash";

let cached: string | null = null;
let pending: Promise<string | null> | null = null;

export function getFingerprintSync(): string | null {
  if (cached) return cached;
  if (typeof window === "undefined") return null;
  try {
    cached = window.localStorage.getItem(CACHE_KEY) ?? window.sessionStorage.getItem(LEGACY_KEY);
  } catch {
    cached = null;
  }
  return cached;
}

/** Resolves once per device and is then read synchronously forever after. */
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
        window.localStorage.setItem(CACHE_KEY, cached);
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

/**
 * Await the fingerprint, but never block a signal for long. Callers flush their
 * queue when this settles so the very first events of a visit carry the join key.
 */
export function whenFingerprintReady(timeoutMs = 2500): Promise<string | null> {
  const existing = getFingerprintSync();
  if (existing) return Promise.resolve(existing);
  return Promise.race([
    resolveFingerprint(),
    new Promise<string | null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
  ]);
}