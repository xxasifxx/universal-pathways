import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const filterSchema = z.object({
  district: z.number().int().min(1).max(60).nullable().default(null),
  matchedOnly: z.boolean().default(false),
  petitionOnly: z.boolean().default(false),
  hasPhone: z.boolean().default(false),
  minTurnout: z.number().min(0).max(1).default(0),
  party: z.string().max(60).nullable().default(null),
  search: z.string().max(80).nullable().default(null),
  order: z.enum(["high", "low"]).default("high"),
});

export type VoterFilterInput = z.input<typeof filterSchema>;

export const readVoters = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { filters: VoterFilterInput; page?: number; pageSize?: number }) =>
    z
      .object({
        filters: filterSchema,
        page: z.number().int().min(0).max(2000).default(0),
        pageSize: z.number().int().min(10).max(200).default(50),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { listVoters } = await import("./voters.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return listVoters(supabaseAdmin, data.filters, data.page, data.pageSize);
  });

export const readHouseholdMap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { filters: VoterFilterInput }) =>
    z.object({ filters: filterSchema }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { listHouseholds } = await import("./voters.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return listHouseholds(supabaseAdmin, data.filters);
  });

export const readHouseholdVoters = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { hhKey: string }) =>
    z.object({ hhKey: z.string().min(1).max(200) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { householdVoters } = await import("./voters.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return householdVoters(supabaseAdmin, data.hhKey);
  });

export const exportVoterList = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { filters: VoterFilterInput }) =>
    z.object({ filters: filterSchema }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { exportVoters, toCsv } = await import("./voters.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rows = await exportVoters(supabaseAdmin, data.filters);
    return { csv: toCsv(rows), rows: rows.length };
  });

export const readGeocodeProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { geocodeProgress } = await import("./voters.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return geocodeProgress(supabaseAdmin);
  });

export const runGeocodeBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { batchSize?: number }) =>
    z.object({ batchSize: z.number().int().min(1).max(100).default(40) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { geocodeBatch, geocodeProgress } = await import("./voters.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const result = await geocodeBatch(supabaseAdmin, data.batchSize);
    const progress = await geocodeProgress(supabaseAdmin);
    return { ...result, progress };
  });

export const readPendingHouseholds = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { limit?: number }) =>
    z.object({ limit: z.number().int().min(1).max(200).default(50) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("households")
      .select("id, street_num, street_name, city, zip")
      .eq("geocode_status", "pending")
      .limit(data.limit);
    return (rows ?? []) as Array<{
      id: string;
      street_num: string | null;
      street_name: string | null;
      city: string | null;
      zip: string | null;
    }>;
  });

export const saveGeocodes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      results: Array<{ id: string; lat?: number; lng?: number; error?: string }>;
    }) =>
      z
        .object({
          results: z
            .array(
              z.object({
                id: z.string().uuid(),
                lat: z.number().min(-90).max(90).optional(),
                lng: z.number().min(-180).max(180).optional(),
                error: z.string().max(200).optional(),
              }),
            )
            .max(200),
        })
        .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    await assertAdmin(context.supabase, context.userId);
    const { geocodeProgress } = await import("./voters.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    for (const row of data.results) {
      const patch =
        row.lat !== undefined && row.lng !== undefined
          ? { lat: row.lat, lng: row.lng, geocode_status: "ok", geocode_error: null }
          : { geocode_status: "failed", geocode_error: row.error ?? "No result" };
      await supabaseAdmin.from("households").update(patch).eq("id", row.id);
    }
    return { saved: data.results.length, progress: await geocodeProgress(supabaseAdmin) };
  });