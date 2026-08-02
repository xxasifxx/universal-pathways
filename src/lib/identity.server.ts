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
    anon_id: string | null | undefined;
    fp_hash: string | null | undefined;
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

  // A person who gives the same email on another device is the same person:
  // fold those records together so their whole history sits under one name.
  const { data: sameEmail } = await supabase
    .from("visitors")
    .select("id")
    .eq("email", input.email)
    .is("merged_into", null)
    .neq("id", visitorId)
    .limit(10);

  const { mergeVisitors } = await import("./visitors.server");
  for (const row of (sameEmail ?? []) as Array<{ id: string }>) {
    await mergeVisitors(supabase, visitorId, row.id);
  }

  return visitorId;
}