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
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  role: z.enum(["Parent", "Student", "Teacher", "Resident"]),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export type VolunteerInput = z.input<typeof volunteerSchema>;
export type ContactInput = z.input<typeof contactSchema>;

export const submitVolunteer = createServerFn({ method: "POST" })
  .inputValidator((input: VolunteerInput) => volunteerSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("volunteer_signups").insert({
      name: data.name,
      email: data.email,
      zip_code: data.zipCode,
      mobile: data.mobile || null,
      zone: data.zone || null,
      help_with: data.helpWith,
    });
    if (error) throw new Error("Could not save signup");
    return { ok: true as const };
  });

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: ContactInput) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      role: data.role,
      message: data.message,
    });
    if (error) throw new Error("Could not save message");
    return { ok: true as const };
  });