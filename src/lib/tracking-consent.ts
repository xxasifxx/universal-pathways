import { isHeatmapPreview } from "./preview";

const KEY = "lv_no_track";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]!) : null;
}

/** Single source of truth. Every emitter must check this before sending. */
export function isTrackingDisabled(): boolean {
  if (typeof window === "undefined") return true;
  if (isHeatmapPreview()) return true;
  try {
    const dnt =
      navigator.doNotTrack ??
      (window as unknown as { doNotTrack?: string }).doNotTrack;
    if (dnt === "1" || dnt === "yes") return true;
    if (readCookie(KEY) === "1") return true;
    if (window.localStorage.getItem(KEY) === "1") return true;
  } catch {
    return false;
  }
  return false;
}

export function setTrackingDisabled(disabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (disabled) {
      window.localStorage.setItem(KEY, "1");
      document.cookie = `${KEY}=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    } else {
      window.localStorage.removeItem(KEY);
      document.cookie = `${KEY}=; path=/; max-age=0; SameSite=Lax`;
    }
  } catch {
    /* storage unavailable */
  }
}

/** True when the user explicitly opted out on this device (ignores DNT). */
export function isDeviceOptedOut(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "1" || readCookie(KEY) === "1";
  } catch {
    return false;
  }
}