import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const volunteerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Enter a valid US zip code"),
  mobile: z.string().trim().max(30).optional().or(z.literal("")),
  zone: z.string().trim().max(60).optional().or(z.literal("")),
  helpWith: z.array(z.string().trim().max(40)).max(10).default([]),
  anonId: z.string().max(80).optional().nullable(),
  fpHash: z.string().max(120).optional().nullable(),
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  role: z.enum(["Parent", "Student", "Teacher", "Resident"]).optional(),
  message: z.string().trim().min(1, "Message is required").max(2000),
  anonId: z.string().max(80).optional().nullable(),
  fpHash: z.string().max(120).optional().nullable(),
});

const contributionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  addressLine1: z.string().trim().min(1, "Street address is required").max(160),
  city: z.string().trim().min(1, "City is required").max(80),
  state: z.string().trim().min(2, "State is required").max(30),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Enter a valid US zip code"),
  occupation: z.string().trim().min(1, "Occupation is required").max(120),
  employer: z.string().trim().min(1, "Employer is required").max(160),
  amount: z.number().positive("Enter an amount").max(3000, "The legal limit is $3,000"),
  method: z.enum(["bank_transfer", "zelle", "check"]),
  certifiesOwnFunds: z.literal(true),
  certifiesUsPerson: z.literal(true),
  note: z.string().trim().max(500).optional().or(z.literal("")),
  anonId: z.string().max(80).optional().nullable(),
  fpHash: z.string().max(120).optional().nullable(),
});

export type VolunteerInput = z.input<typeof volunteerSchema>;
export type ContactInput = z.input<typeof contactSchema>;
export type ContributionInput = z.input<typeof contributionSchema>;

export const submitContribution = createServerFn({ method: "POST" })
  .inputValidator((input: ContributionInput) => contributionSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { attachIdentity } = await import("./identity.server");
    const visitorId = await attachIdentity(supabaseAdmin, {
      anon_id: data.anonId,
      fp_hash: data.fpHash,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
    });

    const { data: inserted, error } = await supabaseAdmin
      .from("contributions")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        address_line1: data.addressLine1,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        occupation: data.occupation,
        employer: data.employer,
        amount_cents: Math.round(data.amount * 100),
        method: data.method,
        certifies_own_funds: data.certifiesOwnFunds,
        certifies_us_person: data.certifiesUsPerson,
        note: data.note || null,
        visitor_id: visitorId,
      })
      .select("id")
      .single();
    if (error) throw new Error("Could not save contribution");

    try {
      const { notifyContribution } = await import("./question-email.server");
      await notifyContribution({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        addressLine1: data.addressLine1,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        occupation: data.occupation,
        employer: data.employer,
        amount: data.amount,
        method: data.method,
        note: data.note || null,
        id: inserted?.id,
      });
    } catch (mailError) {
      // A mail failure must never lose the pledge — it is already saved.
      console.error("contribution email failed", mailError);
    }

    return { ok: true as const };
  });

export const submitVolunteer = createServerFn({ method: "POST" })
  .inputValidator((input: VolunteerInput) => volunteerSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { attachIdentity } = await import("./identity.server");
    const visitorId = await attachIdentity(supabaseAdmin, {
      anon_id: data.anonId,
      fp_hash: data.fpHash,
      name: data.name,
      email: data.email,
      phone: data.mobile || null,
    });
    const { data: inserted, error } = await supabaseAdmin
      .from("volunteer_signups")
      .insert({
        name: data.name,
        email: data.email,
        zip_code: data.zipCode,
        mobile: data.mobile || null,
        zone: data.zone || null,
        help_with: data.helpWith,
        visitor_id: visitorId,
      })
      .select("id")
      .single();
    if (error) throw new Error("Could not save signup");

    try {
      const { notifyVolunteer } = await import("./question-email.server");
      await notifyVolunteer({
        name: data.name,
        email: data.email,
        zipCode: data.zipCode,
        mobile: data.mobile || null,
        zone: data.zone || null,
        helpWith: data.helpWith,
        id: inserted?.id,
      });
    } catch (mailError) {
      // A mail failure must never lose the signup — it is already saved.
      console.error("volunteer email failed", mailError);
    }

    return { ok: true as const };
  });

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: ContactInput) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { attachIdentity } = await import("./identity.server");
    const visitorId = await attachIdentity(supabaseAdmin, {
      anon_id: data.anonId,
      fp_hash: data.fpHash,
      name: data.name,
      email: data.email,
      phone: null,
    });
    const { data: inserted, error } = await supabaseAdmin
      .from("contact_messages")
      .insert({
      name: data.name,
      email: data.email,
      role: data.role ?? "Resident",
      message: data.message,
      visitor_id: visitorId,
      })
      .select("id")
      .single();
    if (error) throw new Error("Could not save message");

    try {
      const { notifyQuestion } = await import("./question-email.server");
      await notifyQuestion({
        name: data.name,
        email: data.email,
        message: data.message,
        id: inserted?.id,
      });
    } catch (mailError) {
      // A mail failure must never lose the question — it is already saved.
      console.error("question email failed", mailError);
    }

    return { ok: true as const };
  });