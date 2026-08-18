import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/* ---------------------------------- field --------------------------------- */

/** Walk-up volunteers: turf link + passcode, no account required. */
export const openTurfWithCode = createServerFn({ method: "POST" })
  .inputValidator((input: { shareToken: string; passcode: string; canvasser: string }) =>
    z
      .object({
        shareToken: z.string().min(4).max(64),
        passcode: z.string().max(120).default(""),
        canvasser: z.string().max(80).default(""),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { passcodeMatches, writeTurfSession, buildTurfBundle } = await import("./canvass.server");

    const { data: turf } = await supabaseAdmin
      .from("turfs")
      .select("id, passcode")
      .eq("share_token", data.shareToken)
      .maybeSingle();
    if (!turf) return { ok: false as const, reason: "unknown" as const };
    if (turf.passcode && !passcodeMatches(data.passcode, turf.passcode)) {
      return { ok: false as const, reason: "passcode" as const };
    }

    await writeTurfSession({ turfId: turf.id, canvasser: data.canvasser.trim() || "volunteer" });
    const bundle = await buildTurfBundle(supabaseAdmin, turf.id);
    return { ok: true as const, bundle };
  });

/** Signed-in volunteers open the turf they were assigned; admins open any turf. */
export const openAssignedTurf = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { turfId: string }) => z.object({ turfId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { writeTurfSession, buildTurfBundle } = await import("./canvass.server");

    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });

    const { data: turf } = await supabaseAdmin
      .from("turfs")
      .select("id, volunteer_id")
      .eq("id", data.turfId)
      .maybeSingle();
    if (!turf) return { ok: false as const, reason: "unknown" as const };

    let name = "volunteer";
    if (!isAdmin) {
      const { data: volunteer } = await supabaseAdmin
        .from("canvass_volunteers")
        .select("id, name")
        .eq("user_id", context.userId)
        .maybeSingle();
      if (!volunteer || volunteer.id !== turf.volunteer_id) {
        return { ok: false as const, reason: "forbidden" as const };
      }
      name = volunteer.name;
    } else {
      name = "organizer";
    }

    await writeTurfSession({ turfId: turf.id, canvasser: name });
    return { ok: true as const, bundle: await buildTurfBundle(supabaseAdmin, turf.id) };
  });

/** Re-open a cached walk: only serves the turf held in the field session. */
export const getTurfBundle = createServerFn({ method: "POST" })
  .inputValidator((input: { turfId: string }) => z.object({ turfId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { readTurfSession, buildTurfBundle } = await import("./canvass.server");
    const session = await readTurfSession();
    if (session.turfId !== data.turfId) return { ok: false as const, reason: "locked" as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return {
      ok: true as const,
      canvasser: session.canvasser ?? "volunteer",
      bundle: await buildTurfBundle(supabaseAdmin, data.turfId),
    };
  });

export const listMyTurfs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });

    let query = supabaseAdmin
      .from("turfs")
      .select("id, name, district, status, door_count, volunteer_id")
      .order("created_at", { ascending: false });

    if (!isAdmin) {
      const { data: volunteer } = await supabaseAdmin
        .from("canvass_volunteers")
        .select("id")
        .eq("user_id", context.userId)
        .maybeSingle();
      if (!volunteer) return { isAdmin: false, turfs: [] };
      query = query.eq("volunteer_id", volunteer.id);
    }

    const { data } = await query.limit(100);
    return { isAdmin: Boolean(isAdmin), turfs: (data ?? []) as Array<Record<string, unknown>> };
  });

/* -------------------------------- organizer -------------------------------- */

export const readCanvassDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { turfDashboard } = await import("./canvass.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return turfDashboard(supabaseAdmin);
  });

export const createTurfs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      district: number | null;
      minTurnout: number;
      matchedOnly: boolean;
      targetSize: number;
      maxTurfs: number;
    }) =>
      z
        .object({
          district: z.number().int().min(1).max(60).nullable().default(null),
          minTurnout: z.number().min(0).max(1).default(0),
          matchedOnly: z.boolean().default(false),
          targetSize: z.number().int().min(10).max(200).default(55),
          maxTurfs: z.number().int().min(1).max(40).default(10),
        })
        .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { autoClusterTurfs } = await import("./canvass.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return autoClusterTurfs(
      supabaseAdmin,
      {
        ...data,
        namePrefix: data.district ? `D${data.district} · ` : "",
      },
      context.userId,
    );
  });

export const updateTurf = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      id: string;
      status?: string;
      volunteerId?: string | null;
      passcode?: string | null;
      maskParty?: boolean;
      allowContactInfo?: boolean;
    }) =>
      z
        .object({
          id: z.string().uuid(),
          status: z.enum(["open", "assigned", "in_progress", "completed"]).optional(),
          volunteerId: z.string().uuid().nullable().optional(),
          passcode: z.string().max(80).nullable().optional(),
          maskParty: z.boolean().optional(),
          allowContactInfo: z.boolean().optional(),
        })
        .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const patch: Record<string, unknown> = {};
    if (data.status !== undefined) patch["status"] = data.status;
    if (data.volunteerId !== undefined) {
      patch["volunteer_id"] = data.volunteerId;
      if (data.status === undefined) patch["status"] = data.volunteerId ? "assigned" : "open";
    }
    if (data.passcode !== undefined) patch["passcode"] = data.passcode || null;
    if (data.maskParty !== undefined) patch["mask_party"] = data.maskParty;
    if (data.allowContactInfo !== undefined) patch["allow_contact_info"] = data.allowContactInfo;

    const { error } = await supabaseAdmin.from("turfs").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteTurf = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("turfs").delete().eq("id", data.id);
    return { ok: true as const };
  });

export const upsertVolunteer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { id?: string; name: string; email?: string; phone?: string; active?: boolean }) =>
      z
        .object({
          id: z.string().uuid().optional(),
          name: z.string().min(2).max(80),
          email: z.string().max(120).optional(),
          phone: z.string().max(40).optional(),
          active: z.boolean().default(true),
        })
        .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const row = {
      ...(data.id ? { id: data.id } : {}),
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      active: data.active,
    };
    const { error } = await supabaseAdmin.from("canvass_volunteers").upsert(row);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const exportCanvassResults = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { toCsv } = await import("./voters.server");

    const { data: visits } = await supabaseAdmin
      .from("canvass_visits")
      .select(
        "id, turf_id, hh_key, outcome, note, visited_at, canvasser_name, turfs(name), canvass_responses(voter_id, support, issues, wants_lawn_sign, volunteer_lead, vote_by_mail, do_not_contact)",
      )
      .order("visited_at", { ascending: false })
      .limit(20000);

    const rows: Record<string, unknown>[] = [];
    for (const v of (visits ?? []) as any[]) {
      const base = {
        turf: v.turfs?.name ?? "",
        household: v.hh_key,
        outcome: v.outcome,
        visited_at: v.visited_at,
        canvasser: v.canvasser_name ?? "",
        note: v.note ?? "",
      };
      const responses = (v.canvass_responses ?? []) as any[];
      if (responses.length === 0) {
        rows.push({ ...base, voter_id: "", support: "", issues: "", lawn_sign: "", volunteer_lead: "", vote_by_mail: "", do_not_contact: "" });
        continue;
      }
      for (const r of responses) {
        rows.push({
          ...base,
          voter_id: r.voter_id,
          support: r.support ?? "",
          issues: (r.issues ?? []).join("; "),
          lawn_sign: r.wants_lawn_sign ? "yes" : "",
          volunteer_lead: r.volunteer_lead ? "yes" : "",
          vote_by_mail: r.vote_by_mail ? "yes" : "",
          do_not_contact: r.do_not_contact ? "yes" : "",
        });
      }
    }

    return { csv: toCsv(rows), rows: rows.length };
  });
