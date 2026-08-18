import type { SupabaseClient } from "@supabase/supabase-js";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

import { chunk, propensityFor, serpentine, type FieldHousehold, type TurfBundle } from "./canvass";

/* eslint-disable @typescript-eslint/no-explicit-any */
type DB = SupabaseClient<any, any, any>;

export type TurfSession = { turfId?: string; canvasser?: string };

export function turfSessionConfig() {
  return {
    password: process.env["REVIEW_SESSION_SECRET"]!,
    name: "canvass-turf",
    maxAge: 60 * 60 * 24 * 14,
    cookie: {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

export async function readTurfSession(): Promise<TurfSession> {
  const session = await useSession<TurfSession>(turfSessionConfig());
  return session.data ?? {};
}

export async function writeTurfSession(next: TurfSession): Promise<void> {
  const session = await useSession<TurfSession>(turfSessionConfig());
  await session.update(next);
}

export function passcodeMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

const VOTE_YEARS = [
  "voted_2018",
  "voted_2019",
  "voted_2020",
  "voted_2021",
  "voted_2022",
  "voted_2023",
  "voted_2024",
  "voted_2025",
] as const;

/** Everything a volunteer needs for a whole walk, masked to the turf's settings. */
export async function buildTurfBundle(supabase: DB, turfId: string): Promise<TurfBundle | null> {
  const { data: turf } = await supabase
    .from("turfs")
    .select("id, name, district, status, mask_party, allow_contact_info")
    .eq("id", turfId)
    .maybeSingle();
  if (!turf) return null;

  const { data: stops } = await supabase
    .from("turf_households")
    .select("hh_key, sequence, address, city, zip, lat, lng")
    .eq("turf_id", turfId)
    .order("sequence", { ascending: true });

  const keys = (stops ?? []).map((s: any) => String(s.hh_key));
  const residents = new Map<string, any[]>();
  for (let i = 0; i < keys.length; i += 400) {
    const { data: rows } = await supabase
      .from("voters")
      .select(
        `id, first_name, last_name, party, phone, turnout_pct, hh_key, ${VOTE_YEARS.join(", ")}`,
      )
      .in("hh_key", keys.slice(i, i + 400));
    for (const v of (rows ?? []) as any[]) {
      const list = residents.get(String(v.hh_key)) ?? [];
      list.push(v);
      residents.set(String(v.hh_key), list);
    }
  }

  const { data: visits } = await supabase
    .from("canvass_visits")
    .select("hh_key")
    .eq("turf_id", turfId);
  const visited = new Set((visits ?? []).map((v: any) => String(v.hh_key)));

  const households: FieldHousehold[] = (stops ?? []).map((s: any) => ({
    hh_key: String(s.hh_key),
    sequence: Number(s.sequence),
    address: String(s.address ?? ""),
    city: s.city ?? null,
    zip: s.zip ?? null,
    lat: s.lat === null ? null : Number(s.lat),
    lng: s.lng === null ? null : Number(s.lng),
    visited: visited.has(String(s.hh_key)),
    voters: (residents.get(String(s.hh_key)) ?? []).map((v) => ({
      id: String(v.id),
      name: `${v.first_name ?? ""} ${v.last_name ?? ""}`.trim() || "Registered voter",
      party: turf.mask_party ? null : (v.party ?? null),
      propensity: propensityFor(
        Number(v.turnout_pct ?? 0),
        VOTE_YEARS.some((y) => Boolean(v[y])),
      ),
      phone: turf.allow_contact_info ? (v.phone ?? null) : null,
    })),
  }));

  return {
    turf: {
      id: String(turf.id),
      name: String(turf.name),
      district: turf.district ?? null,
      status: turf.status,
      mask_party: Boolean(turf.mask_party),
      allow_contact_info: Boolean(turf.allow_contact_info),
    },
    households,
  };
}

export type IncomingVisit = {
  client_id: string;
  hh_key: string;
  outcome: string;
  note: string | null;
  visited_at: string;
  canvasser_name: string | null;
  responses: Array<{
    voter_id: string;
    support: number | null;
    issues: string[];
    wants_lawn_sign: boolean;
    volunteer_lead: boolean;
    vote_by_mail: boolean;
    do_not_contact: boolean;
  }>;
};

/**
 * Append-only ingestion. Visits dedupe on the client id so a retried batch is
 * harmless; per-voter answers are last-write-wins on the device timestamp.
 */
export async function ingestVisits(
  supabase: DB,
  turfId: string,
  batch: IncomingVisit[],
): Promise<{ accepted: number }> {
  const allowed = new Set<string>();
  const { data: stops } = await supabase
    .from("turf_households")
    .select("hh_key")
    .eq("turf_id", turfId);
  for (const s of (stops ?? []) as any[]) allowed.add(String(s.hh_key));

  let accepted = 0;
  for (const item of batch) {
    if (!allowed.has(item.hh_key)) continue;

    const { data: visit, error } = await supabase
      .from("canvass_visits")
      .upsert(
        {
          client_id: item.client_id,
          turf_id: turfId,
          hh_key: item.hh_key,
          outcome: item.outcome,
          note: item.note ?? null,
          visited_at: item.visited_at,
          canvasser_name: item.canvasser_name ?? null,
        },
        { onConflict: "client_id" },
      )
      .select("id")
      .maybeSingle();
    if (error || !visit) continue;

    const responses = (item.responses ?? []).filter((r) => r.voter_id);
    if (responses.length > 0) {
      await supabase.from("canvass_responses").upsert(
        responses.map((r) => ({
          visit_id: visit.id,
          voter_id: r.voter_id,
          support: r.support ?? null,
          issues: r.issues ?? [],
          wants_lawn_sign: Boolean(r.wants_lawn_sign),
          volunteer_lead: Boolean(r.volunteer_lead),
          vote_by_mail: Boolean(r.vote_by_mail),
          do_not_contact: Boolean(r.do_not_contact),
          recorded_at: item.visited_at,
        })),
        { onConflict: "visit_id,voter_id" },
      );
    }

    accepted += 1;
  }

  if (accepted > 0) {
    await supabase
      .from("turfs")
      .update({ status: "in_progress" })
      .eq("id", turfId)
      .in("status", ["open", "assigned"]);
  }

  return { accepted };
}

export type ClusterOptions = {
  district: number | null;
  minTurnout: number;
  matchedOnly: boolean;
  targetSize: number;
  maxTurfs: number;
  namePrefix: string;
  /** Only include households that already have map pins. Walk order works without them. */
  requireCoords?: boolean;
  /** Restrict to the priority target list. */
  targetListOnly?: boolean;
};

/**
 * Group unassigned households into contiguous street-run turfs.
 * Walk order comes from odd/even house numbers, so turfs can be cut and walked
 * before (or without) geocoding — pins only improve the map view.
 */
export async function autoClusterTurfs(supabase: DB, opts: ClusterOptions, createdBy: string) {
  let query = supabase
    .from("households")
    .select("hh_key, street_num, street_name, city, zip, district, lat, lng, avg_turnout_pct, matched_count")
    .limit(20000);
  if (opts.requireCoords) query = query.not("lat", "is", null);
  if (opts.district !== null) query = query.eq("district", opts.district);
  if (opts.minTurnout > 0) query = query.gte("avg_turnout_pct", opts.minTurnout);
  if (opts.matchedOnly) query = query.gt("matched_count", 0);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const { data: taken } = await supabase.from("turf_households").select("hh_key");
  const used = new Set((taken ?? []).map((t: any) => String(t.hh_key)));

  const pool = ((data ?? []) as any[]).filter((h) => !used.has(String(h.hh_key)));

  const byStreet = new Map<string, any[]>();
  for (const h of pool) {
    const key = `${h.street_name ?? "Unknown"}|${h.city ?? ""}`;
    const list = byStreet.get(key) ?? [];
    list.push(h);
    byStreet.set(key, list);
  }

  const runs: any[][] = [];
  for (const rows of byStreet.values()) runs.push(serpentine(rows));
  runs.sort((a, b) => b.length - a.length);

  // Pack short streets together so no volunteer gets a five-door turf.
  const groups: any[][] = [];
  let current: any[] = [];
  for (const run of runs) {
    if (run.length >= opts.targetSize) {
      for (const piece of chunk(run, opts.targetSize)) groups.push(piece);
      continue;
    }
    if (current.length + run.length > opts.targetSize && current.length > 0) {
      groups.push(current);
      current = [];
    }
    current = [...current, ...run];
  }
  if (current.length > 0) groups.push(current);

  const created: Array<{ id: string; name: string; doors: number }> = [];
  for (const group of groups.slice(0, opts.maxTurfs)) {
    const districts = [...new Set(group.map((h) => h.district).filter((d) => d !== null))];
    const streets = [...new Set(group.map((h) => h.street_name).filter(Boolean))];
    const label = streets.slice(0, 2).join(" / ") || "Mixed streets";
    const name = `${opts.namePrefix}${label}${streets.length > 2 ? ` +${streets.length - 2}` : ""}`;

    const { data: turf, error: turfError } = await supabase
      .from("turfs")
      .insert({
        name: name.slice(0, 120),
        district: districts.length === 1 ? districts[0] : opts.district,
        target_size: opts.targetSize,
        door_count: group.length,
        created_by: createdBy,
      })
      .select("id, name")
      .single();
    if (turfError || !turf) throw new Error(turfError?.message ?? "Could not create turf");

    await supabase.from("turf_households").insert(
      group.map((h, index) => ({
        turf_id: turf.id,
        hh_key: String(h.hh_key),
        sequence: index,
        address: `${h.street_num ?? ""} ${h.street_name ?? ""}`.trim(),
        city: h.city,
        zip: h.zip,
        lat: h.lat,
        lng: h.lng,
      })),
    );

    created.push({ id: turf.id, name: turf.name, doors: group.length });
  }

  return { created, pool: pool.length, groups: groups.length };
}

export async function turfDashboard(supabase: DB) {
  const [{ data: turfs }, { data: visits }, { data: responses }, { data: volunteers }] =
    await Promise.all([
      supabase
        .from("turfs")
        .select("id, name, district, status, target_size, door_count, share_token, passcode, volunteer_id, mask_party, allow_contact_info, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("canvass_visits").select("id, turf_id, outcome, visited_at"),
      supabase
        .from("canvass_responses")
        .select("support, wants_lawn_sign, volunteer_lead, vote_by_mail, do_not_contact, issues"),
      supabase.from("canvass_volunteers").select("id, name, email, phone, active").order("name"),
    ]);

  const visitRows = (visits ?? []) as any[];
  const perTurf = new Map<string, { knocked: number; spoke: number }>();
  for (const v of visitRows) {
    const entry = perTurf.get(String(v.turf_id)) ?? { knocked: 0, spoke: 0 };
    entry.knocked += 1;
    if (v.outcome === "spoke") entry.spoke += 1;
    perTurf.set(String(v.turf_id), entry);
  }

  const responseRows = (responses ?? []) as any[];
  const support = [1, 2, 3, 4, 5].map((level) => ({
    level,
    count: responseRows.filter((r) => Number(r.support) === level).length,
  }));
  const issues = new Map<string, number>();
  for (const r of responseRows) {
    for (const tag of (r.issues ?? []) as string[]) issues.set(tag, (issues.get(tag) ?? 0) + 1);
  }

  return {
    turfs: ((turfs ?? []) as any[]).map((t) => ({
      ...t,
      knocked: perTurf.get(String(t.id))?.knocked ?? 0,
      spoke: perTurf.get(String(t.id))?.spoke ?? 0,
    })),
    volunteers: (volunteers ?? []) as any[],
    totals: {
      knocked: visitRows.length,
      spoke: visitRows.filter((v) => v.outcome === "spoke").length,
      lawn_signs: responseRows.filter((r) => r.wants_lawn_sign).length,
      volunteer_leads: responseRows.filter((r) => r.volunteer_lead).length,
      vote_by_mail: responseRows.filter((r) => r.vote_by_mail).length,
      do_not_contact: responseRows.filter((r) => r.do_not_contact).length,
    },
    support,
    issues: [...issues.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count),
  };
}
