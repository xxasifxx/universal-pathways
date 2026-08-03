/**
 * Delivery of "ask a question" submissions to the candidate's inbox.
 *
 * Every question is already saved to the campaign inbox before this runs, so a
 * failure here is logged and swallowed by the caller — it never loses a question.
 */
export async function notifyQuestion(input: {
  name: string;
  email: string;
  message: string;
  id?: string;
}) {
  const { sendTemplateEmail } = await import("./email-templates/send-email");
  return sendTemplateEmail("question-notification", "ask@saqeeb.org", {
    templateData: { name: input.name, email: input.email, message: input.message },
    idempotencyKey: `question-notification-${input.id ?? `${input.email}-${Date.now()}`}`,
    replyTo: input.email,
  });
}