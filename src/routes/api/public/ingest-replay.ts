import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { CORS_HEADERS, clientIp, jsonResponse, upsertVisitor } from "@/lib/visitors.server";

const schema = z.object({
  anon_id: z.string().max(80).optional().nullable(),
  session_id: z.string().min(1).max(80),
  fp_hash: z.string().max(120).optional().nullable(),
  path: z.string().max(500).optional().nullable(),
  seq: z.number().int().min(0).max(100000),
  events: z.array(z.unknown()).min(1),
});

// Per warm instance only. Good enough to blunt accidental floods.
const hits = new Map<string, { count: number; resetAt: number }>();
function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 30;
}

export const Route = createFileRoute("/api/public/ingest-replay")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS_HEADERS }),
      POST: async ({ request }) => {
        try {
          const raw = await request.text();
          if (raw.length > 2 * 1024 * 1024) return jsonResponse({ ok: false }, 413);
          const parsed = schema.safeParse(JSON.parse(raw));
          if (!parsed.success) return jsonResponse({ ok: false, error: "invalid" }, 400);
          const data = parsed.data;

          if (rateLimited(data.session_id)) return jsonResponse({ ok: false }, 429);

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const visitorId = await upsertVisitor(
            supabaseAdmin,
            {
              anon_id: data.anon_id,
              fp_hash: data.fp_hash,
              ip: clientIp(request),
              user_agent: request.headers.get("user-agent"),
            },
            false,
          );

          await supabaseAdmin.from("replay_events").insert({
            visitor_id: visitorId,
            session_id: data.session_id,
            seq: data.seq,
            events: data.events,
            path: data.path ?? null,
          });

          return jsonResponse({ ok: true });
        } catch {
          return jsonResponse({ ok: false }, 200);
        }
      },
    },
  },
});