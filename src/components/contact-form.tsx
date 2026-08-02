import { useState } from "react";
import { toast } from "sonner";

import { CONTACT_ROLES } from "@/lib/campaign";
import { getFingerprintSync } from "@/lib/fingerprint";
import { useI18n } from "@/lib/i18n";
import { submitContact } from "@/lib/submissions.functions";
import { getAnonId } from "@/lib/visitor";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const { t } = useI18n();
  const [role, setRole] = useState<(typeof CONTACT_ROLES)[number]>("Parent");
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const inputClass =
    "mt-1.5 w-full rounded-md border border-input bg-card px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:border-primary";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      role,
      message: String(form.get("message") ?? "").trim(),
    };

    const next: Errors = {};
    if (!values.name) next.name = "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
      next.email = "Please enter a valid email.";
    if (!values.message) next.message = "Please write a message.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    try {
      await submitContact({
        data: { ...values, anonId: getAnonId(), fpHash: getFingerprintSync() },
      });
      setDone(true);
      toast.success(t("form.success.contact"));
    } catch {
      toast.error(t("form.error"));
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <p
        role="status"
        className="rounded-xl border border-[var(--solution)] bg-[color-mix(in_oklab,var(--solution)_12%,var(--card))] p-6 text-base font-semibold text-[var(--solution)]"
      >
        {t("form.success.contact")}
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-sm font-semibold">{t("form.name")}</span>
          <input
            name="name"
            maxLength={100}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={inputClass}
          />
          {errors.name ? (
            <span id="contact-name-error" role="alert" className="mt-1 block text-sm text-destructive">
              {errors.name}
            </span>
          ) : null}
        </label>
        <label>
          <span className="text-sm font-semibold">{t("form.email")}</span>
          <input
            name="email"
            type="email"
            maxLength={255}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={inputClass}
          />
          {errors.email ? (
            <span id="contact-email-error" role="alert" className="mt-1 block text-sm text-destructive">
              {errors.email}
            </span>
          ) : null}
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">{t("form.role")}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {CONTACT_ROLES.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={role === r}
              onClick={() => setRole(r)}
              className={cn(
                "min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                role === r
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </fieldset>

      <label>
        <span className="text-sm font-semibold">{t("form.message")}</span>
        <textarea
          name="message"
          rows={7}
          maxLength={2000}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          placeholder="What happened, and at which school?"
          className={inputClass}
        />
        {errors.message ? (
          <span id="contact-message-error" role="alert" className="mt-1 block text-sm text-destructive">
            {errors.message}
          </span>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-primary px-5 py-3 font-display text-base font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? t("form.submitting") : t("form.submit.contact")}
      </button>
    </form>
  );
}