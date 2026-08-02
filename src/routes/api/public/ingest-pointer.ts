import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { CORS_HEADERS, clientIp, jsonResponse, upsertVisitor } from "@/lib/visitors.server";

const schema = z.object({
  anon_id: z.string().max(80).optional().nullable(),
  session_id: z.string().max(80).optional().nullable(),
  fp_hash: z.string().max(120).optional().nullable(),
  path: z.string().max(500).optional().nullable(),
  viewport_w: z.number().int().min(0).max(10000),
  viewport_h: z.number().int().min(0).max(10000),
  is_touch: z.boolean().default(false),
  samples: z
    .array(
      z.object({
        x: z.number().min(-5).max(105),
        y: z.number().min(-5).max(105),
        t: z.number().int().min(0),
      }),
    )
    .min(1)
    .max(400),
});

export const Route = createFileRoute("/api/public/ingest-pointer")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS_HEADERS }),
      POST: async ({ request }) => {
        try {
          const raw = await request.text();
          if (raw.length > 256 * 1024) return jsonResponse({ ok: false }, 413);
          const parsed = schema.safeParse(JSON.parse(raw));
          if (!parsed.success) return jsonResponse({ ok: false, error: "invalid" }, 400);
          const data = parsed.data;

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

          await supabaseAdmin.from("pointer_samples").insert({
            visitor_id: visitorId,
            session_id: data.session_id ?? null,
            path: data.path ?? null,
            viewport_w: data.viewport_w,
            viewport_h: data.viewport_h,
            is_touch: data.is_touch,
            samples: data.samples,
            sample_count: data.samples.length,
          });

          return jsonResponse({ ok: true });
        } catch {
          return jsonResponse({ ok: false }, 200);
        }
      },
    },
  },
});