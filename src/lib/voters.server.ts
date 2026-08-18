import type { SupabaseClient } from "@supabase/supabase-js";

/* eslint-disable @typescript-eslint/no-explicit-any */
type DB = SupabaseClient<any, any, any>;

export type VoterFilters = {
  district: number | null;
  matchedOnly: boolean;
  petitionOnly: boolean;
  contactsOnly: boolean;
  hasPhone: boolean;
  minTurnout: number;
  party: string | null;
  search: string | null;
  order: "high" | "low";
};

export const DEFAULT_FILTERS: VoterFilters = {
  district: null,
  matchedOnly: false,
  petitionOnly: false,
  contactsOnly: false,
  hasPhone: false,
  minTurnout: 0,
  party: null,
  search: null,
  order: "high",
};

const VOTER_COLUMNS =
  "id, display_id, first_name, last_name, middle_name, party, status, street_num, street_name, apt_unit, city, zip, district, phone, turnout_pct, household_size, hh_key, is_matched, is_petition_signer, is_personal_contact, contact_name, impact_score, voted_2018, voted_2019, voted_2020, voted_2021, voted_2022, voted_2023, voted_2024, voted_2025";

function applyFilters(query: any, f: VoterFilters) {
  if (f.district !== null) query = query.eq("district", f.district);
  if (f.matchedOnly) query = query.eq("is_matched", true);
  if (f.petitionOnly) query = query.eq("is_petition_signer", true);
  if (f.contactsOnly) query = query.eq("is_personal_contact", true);
  if (f.hasPhone) query = query.neq("phone", "");
  if (f.minTurnout > 0) query = query.gte("turnout_pct", f.minTurnout);
  if (f.party) query = query.eq("party", f.party);
  if (f.search) query = query.or(`last_name.ilike.%${f.search}%,street_name.ilike.%${f.search}%`);
  return query;
}

export async function listVoters(
  supabase: DB,
  filters: VoterFilters,
  page: number,
  pageSize: number,
) {
  const from = page * pageSize;
  let query = supabase
    .from("voters")
    .select(VOTER_COLUMNS, { count: "exact" })
    .order("impact_score", { ascending: filters.order === "low" })
    .order("last_name", { ascending: true })
    .range(from, from + pageSize - 1);
  query = applyFilters(query, filters);
  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { rows: (data ?? []) as Record<string, any>[], total: count ?? 0 };
}

export async function exportVoters(supabase: DB, filters: VoterFilters, limit = 20000) {
  let query = supabase
    .from("voters")
    .select(VOTER_COLUMNS)
    .order("impact_score", { ascending: filters.order === "low" })
    .limit(limit);
  query = applyFilters(query, filters);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return ((data ?? []) as Record<string, any>[]).map((v) => ({
    name: `${v["first_name"] ?? ""} ${v["last_name"] ?? ""}`.trim(),
    address: `${v["street_num"] ?? ""} ${v["street_name"] ?? ""}${v["apt_unit"] ? ` #${v["apt_unit"]}` : ""}`.trim(),
    city: v["city"],
    zip: v["zip"],
    district: v["district"],
    party: v["party"],
    phone: v["phone"],
    turnout_pct: Math.round(Number(v["turnout_pct"]) * 100),
    household_size: v["household_size"],
    impact_score: Number(v["impact_score"]).toFixed(3),
    matched: v["is_matched"] ? "yes" : "",
    petition_signer: v["is_petition_signer"] ? "yes" : "",
    personal_contact: v["is_personal_contact"] ? "yes" : "",
    contact_name: v["contact_name"] ?? "",
  }));
}

/** Households that satisfy the same voter filters, with per-household counts. */
export async function listHouseholds(supabase: DB, filters: VoterFilters, limit = 4000) {
  let query = supabase
    .from("voters")
    .select("hh_key, is_matched, turnout_pct, impact_score")
    .not("hh_key", "is", null)
    .limit(60000);
  query = applyFilters(query, filters);
  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const agg = new Map<
    string,
    { hh_key: string; count: number; matched: number; turnout: number; impact: number }
  >();
  for (const row of (data ?? []) as Record<string, any>[]) {
    const key = String(row["hh_key"]);
    const entry = agg.get(key) ?? { hh_key: key, count: 0, matched: 0, turnout: 0, impact: 0 };
    entry.count += 1;
    if (row["is_matched"]) entry.matched += 1;
    entry.turnout += Number(row["turnout_pct"] ?? 0);
    entry.impact += Number(row["impact_score"] ?? 0);
    agg.set(key, entry);
  }

  const keys = [...agg.keys()];
  const located: Record<string, any>[] = [];
  for (let i = 0; i < keys.length; i += 500) {
    const { data: rows } = await supabase
      .from("households")
      .select("hh_key, street_num, street_name, city, zip, district, lat, lng")
      .in("hh_key", keys.slice(i, i + 500))
      .not("lat", "is", null);
    located.push(...((rows ?? []) as Record<string, any>[]));
  }

  return located
    .map((h) => {
      const a = agg.get(String(h["hh_key"]))!;
      return {
        hh_key: a.hh_key,
        address: `${h["street_num"] ?? ""} ${h["street_name"] ?? ""}`.trim(),
        city: h["city"] as string,
        zip: h["zip"] as string,
        district: h["district"] as number | null,
        lat: Number(h["lat"]),
        lng: Number(h["lng"]),
        voters: a.count,
        matched: a.matched,
        avg_turnout: a.count ? a.turnout / a.count : 0,
        avg_impact: a.count ? a.impact / a.count : 0,
      };
    })
    .sort((x, y) => y.avg_impact - x.avg_impact)
    .slice(0, limit);
}

export async function householdVoters(supabase: DB, hhKey: string) {
  const { data } = await supabase
    .from("voters")
    .select(VOTER_COLUMNS)
    .eq("hh_key", hhKey)
    .order("impact_score", { ascending: false });
  return (data ?? []) as Record<string, any>[];
}

export async function geocodeProgress(supabase: DB) {
  const counts: Record<string, number> = {};
  for (const status of ["pending", "ok", "failed"]) {
    const { count } = await supabase
      .from("households")
      .select("id", { count: "exact", head: true })
      .eq("geocode_status", status);
    counts[status] = count ?? 0;
  }
  return {
    pending: counts["pending"] ?? 0,
    ok: counts["ok"] ?? 0,
    failed: counts["failed"] ?? 0,
  };
}

type GeocodeResult = { lat: number; lng: number } | null;

async function geocodeOne(address: string): Promise<GeocodeResult> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const mapsKey = process.env["GOOGLE_MAPS_API_KEY"];
  if (!lovableKey || !mapsKey) throw new Error("Google Maps connector is not configured");

  const response = await fetch(
    `https://connector-gateway.lovable.dev/google_maps/maps/api/geocode/json?address=${encodeURIComponent(address)}&components=country:US`,
    {
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": mapsKey,
      },
    },
  );

  if (response.status === 403) {
    const details: Array<{ reason?: string }> =
      (await response.json())?.error?.details ?? [];
    const reason = details.find((d) => d.reason)?.reason;
    if (reason === "API_KEY_HTTP_REFERRER_BLOCKED")
      throw new Error(
        'Google Maps server key is referrer-restricted. Set the server key\'s application restrictions to "None" or "IP addresses".',
      );
    if (reason === "API_KEY_SERVICE_BLOCKED")
      throw new Error(
        "Google Maps server key does not allow the Geocoding API. Add it to the key's allowed-APIs list.",
      );
    throw new Error("Google Maps request was denied (403).");
  }
  if (!response.ok) {
    throw new Error(`Geocoding failed (${response.status}): ${await response.text()}`);
  }

  const body = (await response.json()) as {
    status: string;
    results?: Array<{ geometry?: { location?: { lat: number; lng: number } } }>;
  };
  if (body.status === "OVER_QUERY_LIMIT") throw new Error("Google Maps quota exceeded");
  const loc = body.results?.[0]?.geometry?.location;
  return loc ? { lat: loc.lat, lng: loc.lng } : null;
}

/**
 * Server-side geocoding path. Only works with an unrestricted Maps server key;
 * the Lovable-managed key is referrer-restricted, so the admin UI geocodes in
 * the browser and posts coordinates back instead.
 */
export async function geocodeBatch(supabase: DB, batchSize: number) {
  const { data: rows } = await supabase
    .from("households")
    .select("id, street_num, street_name, city, zip")
    .eq("geocode_status", "pending")
    .limit(batchSize);

  const pending = (rows ?? []) as Record<string, any>[];
  let ok = 0;
  let failed = 0;

  for (const h of pending) {
    const address = `${h["street_num"] ?? ""} ${h["street_name"] ?? ""}, ${h["city"] ?? "East Brunswick"}, NJ ${h["zip"] ?? ""}`;
    try {
      const point = await geocodeOne(address);
      if (point) {
        await supabase
          .from("households")
          .update({ lat: point.lat, lng: point.lng, geocode_status: "ok", geocode_error: null })
          .eq("id", h["id"]);
        ok += 1;
      } else {
        await supabase
          .from("households")
          .update({ geocode_status: "failed", geocode_error: "No result" })
          .eq("id", h["id"]);
        failed += 1;
      }
    } catch (error) {
      // A key/quota problem affects every row — stop instead of burning the queue.
      throw error instanceof Error ? error : new Error("Geocoding failed");
    }
  }

  return { processed: pending.length, ok, failed };
}

/**
 * Free, keyless bulk geocoding via the US Census Bureau batch endpoint.
 * Handles up to ~1,000 addresses per request and needs no API key, so it is the
 * primary path for mapping the whole voter file. Households the Census cannot
 * match are marked failed with a reason and can still be walked by street order.
 */
export async function censusGeocodeBatch(supabase: DB, batchSize: number, retryFailed = false) {
  const query = supabase
    .from("households")
    .select("id, street_num, street_name, city, zip")
    .limit(batchSize);
  const { data: rows } = retryFailed
    ? await query.eq("geocode_status", "failed")
    : await query.eq("geocode_status", "pending");

  const pending = (rows ?? []) as Array<Record<string, any>>;
  if (pending.length === 0) return { processed: 0, ok: 0, failed: 0 };

  const csv = pending
    .map((h) => {
      const street = `${h["street_num"] ?? ""} ${h["street_name"] ?? ""}`.trim();
      const city = (h["city"] as string | null) ?? "East Brunswick";
      const zip = (h["zip"] as string | null) ?? "08816";
      return `${h["id"]},"${street}","${city}",NJ,${zip}`;
    })
    .join("\n");

  const form = new FormData();
  form.append("benchmark", "Public_AR_Current");
  form.append("addressFile", new Blob([csv], { type: "text/csv" }), "addresses.csv");

  const response = await fetch(
    "https://geocoding.geo.census.gov/geocoder/locations/addressbatch",
    { method: "POST", body: form },
  );
  if (!response.ok) {
    throw new Error(`Census geocoder failed (${response.status})`);
  }
  const text = await response.text();

  let ok = 0;
  let failed = 0;
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    const cells = line.match(/"([^"]*)"/g)?.map((c) => c.slice(1, -1)) ?? [];
    const id = cells[0];
    if (!id) continue;
    const status = cells[2];
    const coords = cells[5];
    if (status === "Match" && coords?.includes(",")) {
      const [lngText, latText] = coords.split(",");
      const lng = Number(lngText);
      const lat = Number(latText);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        await supabase
          .from("households")
          .update({ lat, lng, geocode_status: "ok", geocode_error: null })
          .eq("id", id);
        ok += 1;
        continue;
      }
    }
    await supabase
      .from("households")
      .update({ geocode_status: "failed", geocode_error: status || "No Census match" })
      .eq("id", id);
    failed += 1;
  }

  return { processed: pending.length, ok, failed };
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]!);
  const escape = (value: unknown) => {
    const s = value === null || value === undefined ? "" : String(value);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join(
    "\n",
  );
}