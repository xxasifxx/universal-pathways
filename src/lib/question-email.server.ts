/**
 * Delivery of site submissions to the candidate's inbox, plus the matching
 * confirmation back to the person who submitted.
 *
 * Every submission is saved to the campaign inbox before these run, so a mail
 * failure is logged and swallowed by the caller — it never loses a submission.
 */
const NOTIFICATION_EMAIL = "ask@saqeeb.org";

/**
 * Writes the alert-delivery outcome back onto the saved submission so a
 * missed notification is visible in the admin area, not only in server logs.
 */
export async function recordNotifyOutcome(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  table: "contact_messages" | "volunteer_signups",
  id: string | undefined,
  status: string,
) {
  if (!id) return;
  try {
    await supabase
      .from(table)
      .update({ notified_at: new Date().toISOString(), notify_status: status })
      .eq("id", id);
  } catch (error) {
    console.error("could not record notify outcome", error);
  }
}

export async function notifyQuestion(input: {
  name: string;
  email: string;
  message: string;
  id?: string;
}) {
  const { sendTemplateEmail } = await import("./email-templates/send-email");
  const key = input.id ?? `${input.email}-${Date.now()}`;

  const notification = await sendTemplateEmail("question-notification", NOTIFICATION_EMAIL, {
    templateData: { name: input.name, email: input.email, message: input.message },
    idempotencyKey: `question-notification-${key}`,
    replyTo: input.email,
  });

  // Confirmation is best-effort: the candidate must still get the question.
  try {
    await sendTemplateEmail("question-confirmation", input.email, {
      templateData: { name: input.name, message: input.message },
      idempotencyKey: `question-confirmation-${key}`,
      replyTo: "ask@saqeeb.org",
    });
  } catch (error) {
    console.error("question confirmation email failed", error);
  }

  return notification;
}

export async function notifyVolunteer(input: {
  name: string;
  email: string;
  zipCode: string;
  mobile?: string | null;
  zone?: string | null;
  helpWith: string[];
  id?: string;
}) {
  const { sendTemplateEmail } = await import("./email-templates/send-email");
  const key = input.id ?? `${input.email}-${Date.now()}`;
  const templateData = {
    name: input.name,
    email: input.email,
    zipCode: input.zipCode,
    mobile: input.mobile ?? "",
    zone: input.zone ?? "",
    helpWith: input.helpWith,
  };

  const notification = await sendTemplateEmail("volunteer-notification", NOTIFICATION_EMAIL, {
    templateData,
    idempotencyKey: `volunteer-notification-${key}`,
    replyTo: input.email,
  });

  try {
    await sendTemplateEmail("volunteer-confirmation", input.email, {
      templateData: { name: input.name, helpWith: input.helpWith },
      idempotencyKey: `volunteer-confirmation-${key}`,
      replyTo: "ask@saqeeb.org",
    });
  } catch (error) {
    console.error("volunteer confirmation email failed", error);
  }

  return notification;
}

