import type { SupabaseClient } from "@supabase/supabase-js";

import { upsertVisitor } from "./visitors.server";

/**
 * Binds a submitted name/email/phone onto the visitor row that produced the
 * anonymous history, so past behaviour becomes attributable to a person.
 */
export async function attachIdentity(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  input: {
    anon_id?: string | null;
    fp_hash?: string | null;
    name: string;
    email: string;
    phone: string | null;
  },
): Promise<string | null> {
  const visitorId = await upsertVisitor(
    supabase,
    {
      anon_id: input.anon_id,
      fp_hash: input.fp_hash,
      ip: null,
      user_agent: null,
    },
    false,
  );
  if (!visitorId) return null;

  await supabase
    .from("visitors")
    .update({
      name: input.name,
      email: input.email,
      phone: input.phone,
      identified_at: new Date().toISOString(),
    })
    .eq("id", visitorId);

  return visitorId;
}