/** Client-safe canvassing types and helpers. Shared by the walk deck and the studio. */

export const OUTCOMES = [
  { key: "not_home", label: "Not home" },
  { key: "moved", label: "Moved" },
  { key: "refused", label: "Refused" },
  { key: "inaccessible", label: "No access" },
  { key: "spoke", label: "Spoke to voter" },
] as const;

export type OutcomeKey = (typeof OUTCOMES)[number]["key"];

export const ISSUE_TAGS = [
  "Pre-K",
  "High school",
  "Staff pay",
  "Taxes",
  "Class size",
  "Special ed",
  "Safety",
  "Transparency",
] as const;

export type TurfStatus = "open" | "assigned" | "in_progress" | "completed";

export type FieldVoter = {
  id: string;
  name: string;
  party: string | null;
  propensity: "Super Voter" | "Reliable" | "Occasional" | "New";
  phone: string | null;
};

export type FieldHousehold = {
  hh_key: string;
  sequence: number;
  address: string;
  city: string | null;
  zip: string | null;
  lat: number | null;
  lng: number | null;
  voters: FieldVoter[];
  visited: boolean;
};

export type TurfBundle = {
  turf: {
    id: string;
    name: string;
    district: number | null;
    status: TurfStatus;
    mask_party: boolean;
    allow_contact_info: boolean;
  };
  households: FieldHousehold[];
};

export function propensityFor(turnoutPct: number, hasHistory: boolean): FieldVoter["propensity"] {
  if (!hasHistory) return "New";
  if (turnoutPct >= 0.75) return "Super Voter";
  if (turnoutPct >= 0.4) return "Reliable";
  return "Occasional";
}

/** Native maps handoff: iOS opens Apple Maps, everything else Google Maps. */
export function mapsUrl(lat: number | null, lng: number | null, address: string): string {
  if (lat === null || lng === null) {
    return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  }
  const isApple =
    typeof navigator !== "undefined" && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  return isApple ? `https://maps.apple.com/?q=${lat},${lng}` : `https://maps.google.com/?q=${lat},${lng}`;
}

/**
 * Serpentine walk order: up one side of the street on odd numbers, back down
 * the other side on evens, so nobody crosses the road twice.
 */
export function serpentine<T extends { street_num: string | null; street_name: string | null }>(
  rows: T[],
): T[] {
  const num = (r: T) => Number.parseInt(String(r.street_num ?? "").replace(/\D/g, ""), 10) || 0;
  const odd = rows.filter((r) => num(r) % 2 === 1).sort((a, b) => num(a) - num(b));
  const even = rows.filter((r) => num(r) % 2 === 0).sort((a, b) => num(b) - num(a));
  return [...odd, ...even];
}

export function chunk<T>(rows: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < rows.length; i += size) out.push(rows.slice(i, i + size));
  return out;
}
