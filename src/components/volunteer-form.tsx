import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { logSignal } from "@/lib/analytics";
import { HELP_OPTIONS } from "@/lib/campaign";
import { getFingerprintSync } from "@/lib/fingerprint";
import { useI18n } from "@/lib/i18n";
import { submitVolunteer } from "@/lib/submissions.functions";
import { getAnonId } from "@/lib/visitor";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "email" | "zipCode", string>>;

export function VolunteerForm({ defaultHelp = [] as string[] }) {
  const { t } = useI18n();
  const [help, setHelp] = useState<string[]>(defaultHelp);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const started = useRef(false);
  const submitted = useRef(false);
  const statusRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (done) statusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [done]);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    logSignal({ event: "form_started", service_group: "volunteer", meta: { form: "volunteer" } });
  }

  useEffect(
    () => () => {
      if (started.current && !submitted.current) {
        logSignal({
          event: "form_abandon",
          service_group: "volunteer",
          meta: { form: "volunteer" },
        });
      }
    },
    [],
  );

  function toggleHelp(label: string) {
    setHelp((prev) => (prev.includes(label) ? prev.filter((v) => v !== label) : [...prev, label]));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      zipCode: String(form.get("zipCode") ?? "").trim(),
      mobile: String(form.get("mobile") ?? "").trim(),
      zone: String(form.get("address") ?? "").trim().slice(0, 60),
      helpWith: help,
    };

    const next: Errors = {};
    if (!values.name) next.name = "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) next.email = "Please enter a valid email.";
    if (!/^\d{5}(-\d{4})?$/.test(values.zipCode)) next.zipCode = "Enter a 5-digit zip code.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please fix the highlighted fields.");
      (e.currentTarget.querySelector("[aria-invalid='true']") as HTMLElement | null)?.focus();
      return;
    }

    setPending(true);
    try {
      await submitVolunteer({
        data: { ...values, anonId: getAnonId(), fpHash: getFingerprintSync() },
      });
      setDone(true);
      submitted.current = true;
      logSignal({
        event: "form_submitted",
        service_group: "volunteer",
        meta: { form: "volunteer", help_with: help },
      });
      toast.success(t("form.success.volunteer"));
    } catch {
      toast.error(t("form.error"));
    } finally {
      setPending(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-md border border-input bg-card px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:border-primary";

  if (done) {
    return (
      <p
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-lg border border-primary/40 bg-secondary p-5 text-base font-semibold text-primary"
      >
        {t("form.success.volunteer")}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} onInput={markStarted} noValidate className="flex flex-col gap-4">
      <label>
        <span className="text-sm font-semibold">{t("form.name")}</span>
        <input
          name="name"
          maxLength={100}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "vol-name-error" : undefined}
          className={inputClass}
        />
        {errors.name ? (
          <span id="vol-name-error" role="alert" className="mt-1 block text-sm text-destructive">
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
          aria-describedby={errors.email ? "vol-email-error" : undefined}
          className={inputClass}
        />
        {errors.email ? (
          <span id="vol-email-error" role="alert" className="mt-1 block text-sm text-destructive">
            {errors.email}
          </span>
        ) : null}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-sm font-semibold">{t("form.zip")}</span>
          <input
            name="zipCode"
            inputMode="numeric"
            maxLength={10}
            autoComplete="postal-code"
            placeholder="08816"
            aria-invalid={Boolean(errors.zipCode)}
            aria-describedby={errors.zipCode ? "vol-zip-error" : undefined}
            className={inputClass}
          />
          {errors.zipCode ? (
            <span id="vol-zip-error" role="alert" className="mt-1 block text-sm text-destructive">
              {errors.zipCode}
            </span>
          ) : null}
        </label>
        <label>
          <span className="text-sm font-semibold">{t("form.mobile.optional")}</span>
          <input name="mobile" type="tel" maxLength={30} autoComplete="tel" className={inputClass} />
        </label>
      </div>

      <label>
        <span className="text-sm font-semibold">{t("form.address")}</span>
        <input
          name="address"
          maxLength={60}
          autoComplete="street-address"
          placeholder="Street address for yard sign delivery"
          className={inputClass}
        />
      </label>

      <fieldset>
        <legend className="text-sm font-semibold">{t("form.help")}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {HELP_OPTIONS.map((opt) => {
            const on = help.includes(opt.label);
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleHelp(opt.label)}
                className={cn(
                  "min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary",
                )}
              >
                {opt.id === "sign-up"
                  ? t("volunteer.options.signup")
                  : opt.id === "canvassing"
                    ? t("volunteer.options.canvass")
                    : t("volunteer.options.phone")}
              </button>
            );
          })}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-primary px-5 py-3 font-display text-base font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? t("form.submitting") : t("form.submit.volunteer")}
      </button>
    </form>
  );
}
