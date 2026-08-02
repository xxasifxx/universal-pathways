import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: Boolean(data) };
  });

export const readVisitors = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertAdmin, buildVisitorList } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return buildVisitorList(supabaseAdmin);
  });

export const readVisitorDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { visitorId: string }) =>
    z.object({ visitorId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin, buildVisitorDetail } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return buildVisitorDetail(supabaseAdmin, data.visitorId);
  });

export const readSignals = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { event?: string; path?: string; limit?: number }) =>
    z
      .object({
        event: z.string().max(60).optional(),
        path: z.string().max(500).optional(),
        limit: z.number().int().min(1).max(1000).default(200),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin
      .from("lead_signals")
      .select("id, visitor_id, anon_id, session_id, event, path, dwell_ms, meta, created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.event) query = query.eq("event", data.event);
    if (data.path) query = query.eq("path", data.path);
    const { data: rows } = await query;
    return rows ?? [];
  });

export const readHeatmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { path: string; bucket: "mobile" | "desktop"; from?: string; to?: string }) =>
      z
        .object({
          path: z.string().min(1).max(500),
          bucket: z.enum(["mobile", "desktop"]),
          from: z.string().optional(),
          to: z.string().optional(),
        })
        .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin, buildHeatmap } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return buildHeatmap(supabaseAdmin, {
      path: data.path,
      bucket: data.bucket,
      from: data.from ?? null,
      to: data.to ?? null,
    });
  });

export const readPaths = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertAdmin, listPaths } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return listPaths(supabaseAdmin);
  });

export const readReplaySessions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { visitorId: string }) =>
    z.object({ visitorId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("replay_events")
      .select("session_id, seq, path, created_at")
      .eq("visitor_id", data.visitorId)
      .order("created_at", { ascending: false })
      .limit(2000);
    const map = new Map<
      string,
      { session_id: string; chunks: number; started_at: string; paths: string[] }
    >();
    for (const row of (rows ?? []) as Array<Record<string, unknown>>) {
      const id = String(row["session_id"]);
      const entry =
        map.get(id) ??
        { session_id: id, chunks: 0, started_at: String(row["created_at"]), paths: [] };
      entry.chunks += 1;
      if (String(row["created_at"]) < entry.started_at) entry.started_at = String(row["created_at"]);
      const path = row["path"] ? String(row["path"]) : null;
      if (path && !entry.paths.includes(path)) entry.paths.push(path);
      map.set(id, entry);
    }
    return [...map.values()].sort((a, b) => b.started_at.localeCompare(a.started_at));
  });

export const readReplayChunks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { sessionId: string }) =>
    z.object({ sessionId: z.string().min(1).max(80) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("replay_events")
      .select("seq, events")
      .eq("session_id", data.sessionId)
      .order("seq", { ascending: true })
      .limit(500);
    return ((rows ?? []) as Array<Record<string, unknown>>).flatMap(
      (row) => (row["events"] as Record<string, unknown>[]) ?? [],
    );
  });

export const exportEngagement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { from: string; to: string; path?: string; grouping: "visitor_path" | "path" }) =>
      z
        .object({
          from: z.string().min(4),
          to: z.string().min(4),
          path: z.string().max(500).optional(),
          grouping: z.enum(["visitor_path", "path"]).default("visitor_path"),
        })
        .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin, buildEngagementExport, toCsv } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rows = await buildEngagementExport(supabaseAdmin, {
      from: data.from,
      to: data.to,
      path: data.path ?? null,
      grouping: data.grouping,
    });
    return { csv: toCsv(rows), rows: rows.length };
  });