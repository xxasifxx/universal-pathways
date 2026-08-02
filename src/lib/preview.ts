/** Heatmap preview iframe detection. The admin heatmap tab renders the live
 *  site with ?heatmap=1 so tracking can suppress itself and avoid recording
 *  its own preview in a loop. */
export function isHeatmapPreview(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).get("heatmap") === "1";
  } catch {
    return false;
  }
}

export const HEATMAP_VIEWPORTS = {
  mobile: { w: 390, h: 844 },
  desktop: { w: 1280, h: 900 },
} as const;

export type ViewportBucket = keyof typeof HEATMAP_VIEWPORTS;

export function bucketForWidth(width: number): ViewportBucket {
  return width < 768 ? "mobile" : "desktop";
}