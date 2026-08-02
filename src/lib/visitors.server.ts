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

/**
 * Resolve (or create) the visitor row for an identity.
 * 1. by anon_id  2. adopt an orphan fp_hash row  3. insert.
 */
export async function upsertVisitor(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  identity: VisitorIdentity,
  incrementSignals = true,
): Promise<string | null> {
  const anonId = identity.anon_id || null;
  const fpHash = identity.fp_hash || null;
  if (!anonId && !fpHash) return null;

  const now = new Date().toISOString();

  if (anonId) {
    const { data: existing } = await supabase
      .from("visitors")
      .select("id, signal_count, fp_hash")
      .eq("anon_id", anonId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("visitors")
        .update({
          last_seen: now,
          last_ip: identity.ip ?? null,
          last_ua: identity.user_agent ?? null,
          fp_hash: existing.fp_hash ?? fpHash,
          signal_count: (existing.signal_count ?? 0) + (incrementSignals ? 1 : 0),
        })
        .eq("id", existing.id);
      return existing.id as string;
    }
  }

  if (fpHash) {
    const { data: orphan } = await supabase
      .from("visitors")
      .select("id, signal_count")
      .eq("fp_hash", fpHash)
      .is("anon_id", null)
      .maybeSingle();

    if (orphan) {
      await supabase
        .from("visitors")
        .update({
          anon_id: anonId,
          last_seen: now,
          last_ip: identity.ip ?? null,
          last_ua: identity.user_agent ?? null,
          signal_count: (orphan.signal_count ?? 0) + (incrementSignals ? 1 : 0),
        })
        .eq("id", orphan.id);
      return orphan.id as string;
    }
  }

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

  return (inserted?.id as string | undefined) ?? null;
}