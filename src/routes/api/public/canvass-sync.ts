import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  turfId: z.string().uuid(),
  visits: z
    .array(
      z.object({
        client_id: z.string().min(6).max(80),
        hh_key: z.string().min(1).max(200),
        outcome: z.enum(["not_home", "moved", "refused", "inaccessible", "spoke"]),
        note: z.string().max(1000).nullable().optional(),
        visited_at: z.string().min(10).max(40),
        canvasser_name: z.string().max(80).nullable().optional(),
        responses: z
          .array(
            z.object({
              voter_id: z.string().uuid(),
              support: z.number().int().min(1).max(5).nullable().optional(),
              issues: z.array(z.string().max(40)).max(12).optional(),
              wants_lawn_sign: z.boolean().optional(),
              volunteer_lead: z.boolean().optional(),
              vote_by_mail: z.boolean().optional(),
              do_not_contact: z.boolean().optional(),
            }),
          )
          .max(20)
          .optional(),
      }),
    )
    .min(1)
    .max(100),
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

/**
 * Batch outbox flush. The caller is authenticated by the httpOnly field
 * session cookie, which only names one turf — a volunteer cannot write
 * anywhere else.
 */
export const Route = createFileRoute("/api/public/canvass-sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const parsed = schema.safeParse(await request.json());
          if (!parsed.success) return json({ ok: false, error: "invalid" }, 400);

          const { readTurfSession, ingestVisits } = await import("@/lib/canvass.server");
          const session = await readTurfSession();
          if (!session.turfId || session.turfId !== parsed.data.turfId) {
            return json({ ok: false, error: "unauthorized" }, 401);
          }

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const result = await ingestVisits(
            supabaseAdmin,
            session.turfId,
            parsed.data.visits.map((v) => ({
              client_id: v.client_id,
              hh_key: v.hh_key,
              outcome: v.outcome,
              visited_at: v.visited_at,
              note: v.note ?? null,
              responses: (v.responses ?? []).map((r) => ({
                voter_id: r.voter_id,
                support: r.support ?? null,
                issues: r.issues ?? [],
                wants_lawn_sign: Boolean(r.wants_lawn_sign),
                volunteer_lead: Boolean(r.volunteer_lead),
                vote_by_mail: Boolean(r.vote_by_mail),
                do_not_contact: Boolean(r.do_not_contact),
              })),
              canvasser_name: v.canvasser_name ?? session.canvasser ?? null,
            })),
          );
          return json({ ok: true, ...result });
        } catch {
          return json({ ok: false, error: "server" }, 500);
        }
      },
    },
  },
});
