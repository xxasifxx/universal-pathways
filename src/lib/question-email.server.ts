/**
 * Delivery of "ask a question" submissions to the candidate's inbox.
 *
 * Every question is already saved to the campaign inbox before this runs, so a
 * failure here is logged and swallowed by the caller — it never loses a question.
 *
 * Email sending activates once the campaign's sender domain is verified; until
 * then this is a no-op and questions are read from the admin area.
 */
export async function notifyQuestion(input: { name: string; email: string; message: string }) {
  console.info(
    `[question] ${input.name} <${input.email}>: ${input.message.slice(0, 120)}`,
  );
  return { sent: false as const, reason: "email_domain_not_configured" as const };
}