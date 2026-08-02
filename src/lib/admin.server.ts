import type { SupabaseClient } from "@supabase/supabase-js";

/* eslint-disable @typescript-eslint/no-explicit-any */
type DB = SupabaseClient<any, any, any>;

const SESSION_GAP_MS = 30 * 60 * 1000;

export async function assertAdmin(supabase: DB, userId: string): Promise<void> {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden: admin role required");
}

export type SignalRow = {
  id: string;
  visitor_id: string | null;
  session_id: string | null;
  event: string;
  path: string | null;
  referrer: string | null;
  service_slug: string | null;
  dwell_ms: number | null;
  meta: Record<string, any> | null;
  created_at: string;
};

export type SessionSummary = {
  session_id: string;
  started_at: string;
  ended_at: string;
  span_ms: number;
  active_ms: number;
  pages: string[];
  clicks: number;
  max_scroll_pct: number;
};

/** Group signals into visits by session_id, falling back to a 30-minute gap. */
export function groupSessions(signals: SignalRow[]): SessionSummary[] {
  const sorted = [...signals].sort((a, b) => a.created_at.localeCompare(b.created_at));
  const groups = new Map<string, SignalRow[]>();
  let fallbackKey = "";
  let lastTime = 0;

  for (const s of sorted) {
    const t = Date.parse(s.created_at);
    let key = s.session_id ?? "";
    if (!key) {
      if (!fallbackKey || t - lastTime > SESSION_GAP_MS) fallbackKey = `gap:${s.created_at}`;
      key = fallbackKey;
    }
    lastTime = t;
    const list = groups.get(key);
    if (list) list.push(s);
    else groups.set(key, [s]);
  }

  return [...groups.entries()]
    .map(([session_id, rows]) => {
      const started = rows[0]!.created_at;
      const ended = rows[rows.length - 1]!.created_at;
      const active = rows
        .filter((r) => r.event === "page_exit")
        .reduce((sum, r) => sum + (r.dwell_ms ?? 0), 0);
      const maxScroll = rows.reduce(
        (m, r) => Math.max(m, Number(r.meta?.["max_scroll_pct"] ?? 0)),
        0,
      );
      return {
        session_id,
        started_at: started,
        ended_at: ended,
        span_ms: Math.max(0, Date.parse(ended) - Date.parse(started)),
        active_ms: active,
        pages: [...new Set(rows.map((r) => r.path).filter(Boolean) as string[])],
        clicks: rows.filter((r) => r.event === "element_click").length,
        max_scroll_pct: maxScroll,
      };
    })
    .sort((a, b) => b.started_at.localeCompare(a.started_at));
}

export function engagementScore(input: {
  activeMs: number;
  pages: number;
  clicks: number;
  maxScroll: number;
  rage: number;
}): number {
  const time = Math.min(40, input.activeMs / 1000 / 15);
  const pages = Math.min(20, input.pages * 4);
  const clicks = Math.min(20, input.clicks * 2);
  const scroll = Math.min(20, input.maxScroll / 5);
  return Math.max(0, Math.round(time + pages + clicks + scroll - input.rage * 3));
}

const OUTCOME_EVENTS = new Set([
  "calculator_run",
  "calculator_completed",
  "scenario_adjusted",
  "scenario_copied",
  "zone_selected",
  "timeline_step_opened",
  "priority_read",
  "form_started",
  "form_submitted",
  "form_abandon",
  "donate_click",
]);

function deviceLabel(ua: string | null): string {
  if (!ua) return "unknown device";
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) return "Android";
  if (/Macintosh/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Linux/i.test(ua)) return "Linux";
  return "browser";
}

/** A person, described the way a campaign would describe them. */
export function personLabel(v: Record<string, any>, sessions: number): string {
  if (v["label"]) return String(v["label"]);
  if (v["name"]) return String(v["name"]);
  if (v["email"]) return String(v["email"]);
  if (v["phone"]) return String(v["phone"]);
  const visits = sessions === 1 ? "first visit" : `${sessions} visits`;
  return `${deviceLabel(v["last_ua"] ?? null)} · ${visits}`;
}

export type IntentProfile = {
  stage: "browsing" | "engaged" | "invested" | "ready to ask";
  headline: string;
  topics: { slug: string; label: string; hits: number }[];
  ran_own_numbers: boolean;
  used_board_mode: boolean;
  copied_for_comment: boolean;
  zone: string | null;
  child_profile: { level: string | null; services: string[] } | null;
  forms: { started: number; submitted: number; abandoned: number };
  outcomes: number;
};

/** Turn raw signals into what this person actually cares about. */
export function buildIntentProfile(signals: SignalRow[], identified: boolean): IntentProfile {
  const has = (event: string) => signals.some((s) => s.event === event);
  const count = (event: string) => signals.filter((s) => s.event === event).length;

  const topicHits = new Map<string, { label: string; hits: number }>();
  for (const s of signals) {
    if (!s.service_slug) continue;
    if (!OUTCOME_EVENTS.has(s.event) && s.event !== "service_dwell") continue;
    const label = String(s.meta?.["title"] ?? s.meta?.["zone"] ?? s.service_slug);
    const entry = topicHits.get(s.service_slug) ?? { label, hits: 0 };
    entry.hits += 1;
    topicHits.set(s.service_slug, entry);
  }

  const calc = signals.find((s) => s.event === "calculator_completed" || s.event === "calculator_run");
  const zoneSignal = signals.find((s) => s.event === "zone_selected");

  const forms = {
    started: count("form_started"),
    submitted: count("form_submitted"),
    abandoned: count("form_abandon"),
  };
  const outcomes = signals.filter((s) => OUTCOME_EVENTS.has(s.event)).length;

  let stage: IntentProfile["stage"] = "browsing";
  if (outcomes > 0) stage = "engaged";
  if (has("calculator_completed") || has("scenario_adjusted") || forms.started > 0)
    stage = "invested";
  if (identified || forms.submitted > 0 || has("scenario_copied")) stage = "ready to ask";

  const bits: string[] = [];
  if (has("calculator_completed")) bits.push("priced out their own kid");
  else if (has("calculator_run")) bits.push("opened the per-child calculator");
  if (has("scenario_copied")) bits.push("copied numbers for public comment");
  else if (has("scenario_adjusted")) bits.push("moved the budget levers");
  if (zoneSignal) bits.push(`looked at the ${String(zoneSignal.meta?.["zone"] ?? "map")} zone`);
  if (forms.submitted > 0) bits.push("sent a form");
  else if (forms.abandoned > 0) bits.push("started a form and left");
  const top = [...topicHits.values()].sort((a, b) => b.hits - a.hits)[0];
  if (bits.length === 0 && top) bits.push(`read up on ${top.label}`);

  return {
    stage,
    headline: bits.length > 0 ? bits.join(", ") : "browsed without committing to anything yet",
    topics: [...topicHits.entries()]
      .map(([slug, v]) => ({ slug, label: v.label, hits: v.hits }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 8),
    ran_own_numbers: has("calculator_completed"),
    used_board_mode: has("scenario_adjusted") || has("scenario_copied"),
    copied_for_comment: has("scenario_copied"),
    zone: zoneSignal ? String(zoneSignal.meta?.["zone"] ?? zoneSignal.service_slug ?? "") : null,
    child_profile: calc
      ? {
          level: (calc.meta?.["level"] as string | undefined) ?? null,
          services: (calc.meta?.["services"] as string[] | undefined) ?? [],
        }
      : null,
    forms,
    outcomes,
  };
}

export async function buildVisitorList(supabase: DB, limit = 200, includeStaff = false) {
  let query = supabase
    .from("visitors")
    .select(
      "id, anon_id, fp_hash, name, phone, email, label, is_staff, first_seen, last_seen, last_ip, last_ua, signal_count, identified_at, notes",
    )
    .is("merged_into", null)
    .order("last_seen", { ascending: false })
    .limit(limit);
  if (!includeStaff) query = query.eq("is_staff", false);
  const { data: visitors } = await query;

  const ids = (visitors ?? []).map((v: any) => v.id);
  if (ids.length === 0) return [];

  const { data: signals } = await supabase
    .from("lead_signals")
    .select("id, visitor_id, session_id, event, path, referrer, service_slug, dwell_ms, meta, created_at")
    .in("visitor_id", ids)
    .order("created_at", { ascending: false })
    .limit(20000);

  const byVisitor = new Map<string, SignalRow[]>();
  for (const s of (signals ?? []) as SignalRow[]) {
    if (!s.visitor_id) continue;
    const list = byVisitor.get(s.visitor_id);
    if (list) list.push(s);
    else byVisitor.set(s.visitor_id, [s]);
  }

  return (visitors ?? []).map((v: any) => {
    const rows = byVisitor.get(v.id) ?? [];
    const sessions = groupSessions(rows);
    const activeMs = sessions.reduce((sum, s) => sum + s.active_ms, 0);
    const pages = new Set(rows.map((r) => r.path).filter(Boolean)).size;
    const clicks = rows.filter((r) => r.event === "element_click").length;
    const rage = rows.filter((r) => r.event === "rage_click").length;
    const maxScroll = rows.reduce((m, r) => Math.max(m, Number(r.meta?.["max_scroll_pct"] ?? 0)), 0);
    const intent = buildIntentProfile(rows, Boolean(v.identified_at));
    return {
      ...v,
      display_name: personLabel(v, sessions.length),
      intent,
      session_count: sessions.length,
      active_ms: activeMs,
      page_count: pages,
      click_count: clicks,
      rage_count: rage,
      engagement_score: engagementScore({ activeMs, pages, clicks, maxScroll, rage }),
    };
  }).sort((a: any, b: any) => b.intent.outcomes - a.intent.outcomes || b.engagement_score - a.engagement_score);
}

export async function buildVisitorDetail(supabase: DB, visitorId: string) {
  const { data: visitor } = await supabase
    .from("visitors")
    .select("*")
    .eq("id", visitorId)
    .maybeSingle();

  const { data: raw } = await supabase
    .from("lead_signals")
    .select("id, visitor_id, session_id, event, path, referrer, service_slug, dwell_ms, meta, created_at")
    .eq("visitor_id", visitorId)
    .order("created_at", { ascending: false })
    .limit(5000);

  const signals = (raw ?? []) as SignalRow[];
  const sessions = groupSessions(signals);
  const intent = buildIntentProfile(signals, Boolean((visitor as any)?.identified_at));

  const { data: aliases } = await supabase
    .from("visitor_aliases")
    .select("anon_id, fp_hash, created_at")
    .eq("visitor_id", visitorId);

  const { data: merged } = await supabase
    .from("visitors")
    .select("id, anon_id, fp_hash, last_ua, last_seen")
    .eq("merged_into", visitorId);

  // Per-page breakdown
  const pageMap = new Map<
    string,
    { path: string; active_ms: number; max_scroll_pct: number; clicks: number; rage: number; dead: number }
  >();
  for (const s of signals) {
    const path = s.path ?? "(unknown)";
    const row =
      pageMap.get(path) ??
      { path, active_ms: 0, max_scroll_pct: 0, clicks: 0, rage: 0, dead: 0 };
    if (s.event === "page_exit") {
      row.active_ms += s.dwell_ms ?? 0;
      row.max_scroll_pct = Math.max(row.max_scroll_pct, Number(s.meta?.["max_scroll_pct"] ?? 0));
    }
    if (s.event === "element_click") row.clicks += 1;
    if (s.event === "rage_click") row.rage += 1;
    if (s.event === "dead_click") row.dead += 1;
    pageMap.set(path, row);
  }

  // Hover totals + hover→click conversion
  const hovers = new Map<string, number>();
  const clicksAfterHover = new Map<string, number>();
  const clickTotals = new Map<string, number>();
  for (const s of signals) {
    const label = String(s.meta?.["label"] ?? "").trim();
    if (!label) continue;
    if (s.event === "cta_hover") hovers.set(label, (hovers.get(label) ?? 0) + 1);
    if (s.event === "element_click") {
      clickTotals.set(label, (clickTotals.get(label) ?? 0) + 1);
      if (s.meta?.["hovered_first"]) clicksAfterHover.set(label, (clicksAfterHover.get(label) ?? 0) + 1);
    }
  }
  const hoverConversion = [...hovers.entries()]
    .map(([label, count]) => ({
      label,
      hovers: count,
      clicks: clicksAfterHover.get(label) ?? 0,
      rate: count === 0 ? 0 : Math.round(((clicksAfterHover.get(label) ?? 0) / count) * 100),
    }))
    .sort((a, b) => b.hovers - a.hovers)
    .slice(0, 25);

  const [{ data: volunteer }, { data: contact }] = await Promise.all([
    supabase.from("volunteer_signups").select("*").eq("visitor_id", visitorId),
    supabase.from("contact_messages").select("*").eq("visitor_id", visitorId),
  ]);

  return {
    visitor,
    display_name: personLabel((visitor ?? {}) as Record<string, any>, sessions.length),
    intent,
    aliases: aliases ?? [],
    merged_from: merged ?? [],
    sessions,
    pages: [...pageMap.values()].sort((a, b) => b.active_ms - a.active_ms),
    hovers: [...hovers.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 25),
    hover_conversion: hoverConversion,
    total_active_ms: sessions.reduce((sum, s) => sum + s.active_ms, 0),
    signals: signals.slice(0, 500),
    leads: { volunteer: volunteer ?? [], contact: contact ?? [] },
  };
}

export async function buildHeatmap(
  supabase: DB,
  opts: { path: string; bucket: "mobile" | "desktop"; from?: string | null; to?: string | null },
) {
  let pointerQuery = supabase
    .from("pointer_samples")
    .select("samples, viewport_w, is_touch, created_at")
    .eq("path", opts.path)
    .order("created_at", { ascending: false })
    .limit(1500);
  if (opts.from) pointerQuery = pointerQuery.gte("created_at", opts.from);
  if (opts.to) pointerQuery = pointerQuery.lte("created_at", opts.to);
  const { data: pointerRows } = await pointerQuery;

  const movement: { x: number; y: number }[] = [];
  for (const row of (pointerRows ?? []) as any[]) {
    const isMobile = (row.viewport_w ?? 0) < 768;
    if ((opts.bucket === "mobile") !== isMobile) continue;
    for (const sample of (row.samples ?? []) as any[]) {
      if (typeof sample?.x === "number" && typeof sample?.y === "number") {
        movement.push({ x: sample.x, y: sample.y });
      }
    }
  }

  let clickQuery = supabase
    .from("lead_signals")
    .select("meta, created_at")
    .eq("path", opts.path)
    .in("event", ["element_click", "rage_click"])
    .order("created_at", { ascending: false })
    .limit(5000);
  if (opts.from) clickQuery = clickQuery.gte("created_at", opts.from);
  if (opts.to) clickQuery = clickQuery.lte("created_at", opts.to);
  const { data: clickRows } = await clickQuery;

  const clicks: { x: number; y: number }[] = [];
  for (const row of (clickRows ?? []) as any[]) {
    const x = Number(row.meta?.x);
    const y = Number(row.meta?.y);
    if (Number.isFinite(x) && Number.isFinite(y)) clicks.push({ x, y });
  }

  return { movement: movement.slice(0, 40000), clicks };
}

export async function listPaths(supabase: DB): Promise<string[]> {
  const { data } = await supabase
    .from("lead_signals")
    .select("path")
    .eq("event", "page_view")
    .order("created_at", { ascending: false })
    .limit(3000);
  return [...new Set(((data ?? []) as any[]).map((r) => r.path).filter(Boolean))].sort();
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]!);
  const escape = (value: unknown) => {
    const s = value === null || value === undefined ? "" : String(value);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ].join("\n");
}

export async function buildEngagementExport(
  supabase: DB,
  opts: { from: string; to: string; path?: string | null; grouping: "visitor_path" | "path" },
) {
  let query = supabase
    .from("lead_signals")
    .select("visitor_id, anon_id, session_id, event, path, dwell_ms, meta, created_at")
    .gte("created_at", opts.from)
    .lte("created_at", opts.to)
    .order("created_at", { ascending: false })
    .limit(50000);
  if (opts.path) query = query.eq("path", opts.path);
  const { data } = await query;
  const signals = (data ?? []) as any[];

  const map = new Map<string, Record<string, any>>();
  for (const s of signals) {
    const path = s.path ?? "(unknown)";
    const key = opts.grouping === "path" ? path : `${s.visitor_id ?? s.anon_id ?? "anon"}|${path}`;
    const row =
      map.get(key) ??
      {
        ...(opts.grouping === "visitor_path" ? { visitor_id: s.visitor_id, anon_id: s.anon_id } : {}),
        path,
        page_views: 0,
        active_ms: 0,
        max_scroll_pct: 0,
        clicks: 0,
        rage_clicks: 0,
        dead_clicks: 0,
        sessions: new Set<string>(),
      };
    if (s.event === "page_view") row["page_views"] += 1;
    if (s.event === "page_exit") {
      row["active_ms"] += s.dwell_ms ?? 0;
      row["max_scroll_pct"] = Math.max(row["max_scroll_pct"], Number(s.meta?.max_scroll_pct ?? 0));
    }
    if (s.event === "element_click") row["clicks"] += 1;
    if (s.event === "rage_click") row["rage_clicks"] += 1;
    if (s.event === "dead_click") row["dead_clicks"] += 1;
    if (s.session_id) (row["sessions"] as Set<string>).add(s.session_id);
    map.set(key, row);
  }

  return [...map.values()].map((row) => ({
    ...row,
    sessions: (row["sessions"] as Set<string>).size,
  }));
}