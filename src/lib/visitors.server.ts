import type { SupabaseClient } from "@supabase/supabase-js";

export type VisitorIdentity = {
  anon_id: string | null | undefined;
  fp_hash: string | null | undefined;
  ip: string | null | undefined;
  user_agent: string | null | undefined;
};

export function clientIp(request: Request): string | null {
  const headers = request.headers;
  const forwarded = headers.get("x-forwarded-for");
  return (
    headers.get("cf-connecting-ip") ??
    (forwarded ? (forwarded.split(",")[0] ?? "").trim() || null : null) ??
    headers.get("x-real-ip")
  );
}

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Max-Age": "86400",
} as const;

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...CORS_HEADERS },
  });
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type DB = SupabaseClient<any, any, any>;

/** Follow the merge chain to the row that actually owns the history. */
export async function resolveSurvivor(supabase: DB, visitorId: string): Promise<string> {
  let current = visitorId;
  for (let hop = 0; hop < 5; hop += 1) {
    const { data } = await supabase
      .from("visitors")
      .select("merged_into")
      .eq("id", current)
      .maybeSingle();
    const next = (data as { merged_into?: string | null } | null)?.merged_into;
    if (!next || next === current) return current;
    current = next;
  }
  return current;
}

async function rememberAlias(
  supabase: DB,
  visitorId: string,
  anonId: string | null,
  fpHash: string | null,
): Promise<void> {
  if (!anonId && !fpHash) return;
  const { data: existing } = await supabase
    .from("visitor_aliases")
    .select("id, visitor_id")
    .eq(anonId ? "anon_id" : "fp_hash", (anonId ?? fpHash) as string)
    .limit(1);
  if (existing && existing.length > 0) return;
  await supabase.from("visitor_aliases").insert({
    visitor_id: visitorId,
    anon_id: anonId,
    fp_hash: fpHash,
  });
}

/** Merge `loser` into `winner`, moving every child row and alias across. */
export async function mergeVisitors(supabase: DB, winner: string, loser: string): Promise<void> {
  if (winner === loser) return;
  for (const table of [
    "lead_signals",
    "pointer_samples",
    "replay_events",
    "volunteer_signups",
    "contact_messages",
  ]) {
    await supabase.from(table).update({ visitor_id: winner }).eq("visitor_id", loser);
  }
  await supabase.from("visitor_aliases").update({ visitor_id: winner }).eq("visitor_id", loser);

  const [{ data: w }, { data: l }] = await Promise.all([
    supabase.from("visitors").select("*").eq("id", winner).maybeSingle(),
    supabase.from("visitors").select("*").eq("id", loser).maybeSingle(),
  ]);
  const win = (w ?? {}) as Record<string, any>;
  const lose = (l ?? {}) as Record<string, any>;

  await supabase
    .from("visitors")
    .update({
      name: win["name"] ?? lose["name"] ?? null,
      email: win["email"] ?? lose["email"] ?? null,
      phone: win["phone"] ?? lose["phone"] ?? null,
      fp_hash: win["fp_hash"] ?? lose["fp_hash"] ?? null,
      identified_at: win["identified_at"] ?? lose["identified_at"] ?? null,
      is_staff: Boolean(win["is_staff"]) || Boolean(lose["is_staff"]),
      signal_count: (win["signal_count"] ?? 0) + (lose["signal_count"] ?? 0),
      last_seen:
        String(lose["last_seen"] ?? "") > String(win["last_seen"] ?? "")
          ? lose["last_seen"]
          : win["last_seen"],
      first_seen:
        String(lose["first_seen"] ?? "") < String(win["first_seen"] ?? "")
          ? lose["first_seen"]
          : win["first_seen"],
    })
    .eq("id", winner);

  await supabase.from("visitors").update({ merged_into: winner }).eq("id", loser);
}

/**
 * Resolve (or create) the person behind an identity.
 * 1. alias on anon_id  2. alias/visitor on fp_hash (even when it already has an
 * anon_id — a new browser id for a known device is the same human)  3. insert.
 * Every id seen is recorded as an alias so future visits join instead of forking.
 */
export async function upsertVisitor(
  supabase: DB,
  identity: VisitorIdentity,
  incrementSignals = true,
): Promise<string | null> {
  const anonId = identity.anon_id || null;
  const fpHash = identity.fp_hash || null;
  if (!anonId && !fpHash) return null;

  const now = new Date().toISOString();
  let byAnon: string | null = null;
  let byFp: string | null = null;

  if (anonId) {
    const { data } = await supabase
      .from("visitor_aliases")
      .select("visitor_id")
      .eq("anon_id", anonId)
      .limit(1);
    if (data && data.length > 0) byAnon = await resolveSurvivor(supabase, data[0]!.visitor_id);
    if (!byAnon) {
      const { data: legacy } = await supabase
        .from("visitors")
        .select("id")
        .eq("anon_id", anonId)
        .limit(1);
      if (legacy && legacy.length > 0) byAnon = await resolveSurvivor(supabase, legacy[0]!.id);
    }
  }

  if (fpHash) {
    const { data } = await supabase
      .from("visitor_aliases")
      .select("visitor_id")
      .eq("fp_hash", fpHash)
      .limit(5);
    for (const row of data ?? []) {
      byFp = await resolveSurvivor(supabase, (row as { visitor_id: string }).visitor_id);
      if (byFp) break;
    }
    if (!byFp) {
      const { data: legacy } = await supabase
        .from("visitors")
        .select("id")
        .eq("fp_hash", fpHash)
        .is("merged_into", null)
        .order("first_seen", { ascending: true })
        .limit(1);
      if (legacy && legacy.length > 0) byFp = await resolveSurvivor(supabase, legacy[0]!.id);
    }
  }

  let visitorId = byAnon ?? byFp;

  // Same device, two browser ids: fold them into one person instead of forking.
  if (byAnon && byFp && byAnon !== byFp) {
    const { data: rows } = await supabase
      .from("visitors")
      .select("id, first_seen")
      .in("id", [byAnon, byFp]);
    const sorted = [...(rows ?? [])].sort((a: any, b: any) =>
      String(a.first_seen).localeCompare(String(b.first_seen)),
    ) as Array<{ id: string }>;
    const winner = sorted[0]?.id ?? byAnon;
    const loser = winner === byAnon ? byFp : byAnon;
    await mergeVisitors(supabase, winner, loser);
    visitorId = winner;
  }

  if (!visitorId) {
    const { data: inserted } = await supabase
      .from("visitors")
      .insert({
        anon_id: anonId,
        fp_hash: fpHash,
        first_ip: identity.ip ?? null,
        last_ip: identity.ip ?? null,
        first_ua: identity.user_agent ?? null,
        last_ua: identity.user_agent ?? null,
        first_seen: now,
        last_seen: now,
        signal_count: incrementSignals ? 1 : 0,
      })
      .select("id")
      .maybeSingle();
    visitorId = (inserted?.id as string | undefined) ?? null;
    if (!visitorId) return null;
    await rememberAlias(supabase, visitorId, anonId, fpHash);
    return visitorId;
  }

  const { data: current } = await supabase
    .from("visitors")
    .select("signal_count, fp_hash")
    .eq("id", visitorId)
    .maybeSingle();

  await supabase
    .from("visitors")
    .update({
      last_seen: now,
      last_ip: identity.ip ?? null,
      last_ua: identity.user_agent ?? null,
      fp_hash: (current as any)?.fp_hash ?? fpHash,
      signal_count: ((current as any)?.signal_count ?? 0) + (incrementSignals ? 1 : 0),
    })
    .eq("id", visitorId);

  if (anonId) await rememberAlias(supabase, visitorId, anonId, null);
  if (fpHash) await rememberAlias(supabase, visitorId, null, fpHash);

  return visitorId;
}