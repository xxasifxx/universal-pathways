import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { SIGNAL_EVENTS } from "@/lib/analytics";
import { CORS_HEADERS, clientIp, jsonResponse, upsertVisitor } from "@/lib/visitors.server";

const schema = z.object({
  event: z.enum(SIGNAL_EVENTS),
  anon_id: z.string().max(80).optional().nullable(),
  session_id: z.string().max(80).optional().nullable(),
  fp_hash: z.string().max(120).optional().nullable(),
  service_slug: z.string().max(120).optional().nullable(),
  service_group: z.string().max(120).optional().nullable(),
  path: z.string().max(500).optional().nullable(),
  referrer: z.string().max(1000).optional().nullable(),
  utm: z.record(z.string().max(300)).optional().nullable(),
  dwell_ms: z.number().int().min(0).max(86_400_000).optional().nullable(),
  meta: z.record(z.unknown()).optional().nullable(),
  user_agent: z.string().max(500).optional().nullable(),
});

export const Route = createFileRoute("/api/public/log-signal")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS_HEADERS }),
      POST: async ({ request }) => {
        try {
          const raw = await request.text();
          if (raw.length > 64 * 1024) return jsonResponse({ ok: false }, 413);
          const parsed = schema.safeParse(JSON.parse(raw));
          if (!parsed.success) return jsonResponse({ ok: false, error: "invalid" }, 400);
          const data = parsed.data;

          const ip = clientIp(request);
          const ua = data.user_agent ?? request.headers.get("user-agent");

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const visitorId = await upsertVisitor(supabaseAdmin, {
            anon_id: data.anon_id,
            fp_hash: data.fp_hash,
            ip,
            user_agent: ua,
          });

          await supabaseAdmin.from("lead_signals").insert({
            visitor_id: visitorId,
            anon_id: data.anon_id ?? null,
            session_id: data.session_id ?? null,
            event: data.event,
            service_slug: data.service_slug ?? null,
            service_group: data.service_group ?? null,
            path: data.path ?? null,
            referrer: data.referrer ?? null,
            utm: data.utm ?? null,
            dwell_ms: data.dwell_ms ?? null,
            meta: data.meta ?? null,
            ip,
            user_agent: ua,
            fp_hash: data.fp_hash ?? null,
          });

          return jsonResponse({ ok: true, visitor_id: visitorId });
        } catch {
          return jsonResponse({ ok: false }, 200);
        }
      },
    },
  },
});