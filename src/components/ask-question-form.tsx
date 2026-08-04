import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { logSignal } from "@/lib/analytics";
import { getFingerprintSync } from "@/lib/fingerprint";
import { useI18n } from "@/lib/i18n";
import { submitContact } from "@/lib/submissions.functions";
import { getAnonId } from "@/lib/visitor";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function AskQuestionForm() {
  const { t } = useI18n();
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const started = useRef(false);
  const submitted = useRef(false);
  const statusRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (done) statusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [done]);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    logSignal({ event: "form_started", service_group: "question", meta: { form: "question" } });
  }

  useEffect(
    () => () => {
      if (started.current && !submitted.current) {
        logSignal({
          event: "form_abandon",
          service_group: "question",
          meta: { form: "question" },
        });
      }
    },
    [],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),
    };

    const next: Errors = {};
    if (!values.name) next.name = "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
      next.email = "Please enter a valid email so he can reply.";
    if (!values.message) next.message = "Please type your question.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setPending(true);
    try {
      await submitContact({
        data: { ...values, anonId: getAnonId(), fpHash: getFingerprintSync() },
      });
      setDone(true);
      submitted.current = true;
      logSignal({
        event: "form_submitted",
        service_group: "question",
        meta: { form: "question" },
      });
      toast.success("Question sent.");
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
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-lg border-2 border-primary bg-card p-6"
      >
        <p className="font-display text-2xl tracking-wide text-primary">Muhammad got your question.</p>
        <p className="mt-2 text-base leading-relaxed text-foreground/90">
          He answers these himself, usually within a couple of days. Check your inbox — the reply
          will come straight from him.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} onInput={markStarted} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-sm font-semibold">{t("form.name")}</span>
          <input
            name="name"
            maxLength={100}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "ask-name-error" : undefined}
            className={inputClass}
          />
          {errors.name ? (
            <span id="ask-name-error" role="alert" className="mt-1 block text-sm text-destructive">
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
            aria-describedby={errors.email ? "ask-email-error" : undefined}
            className={inputClass}
          />
          {errors.email ? (
            <span id="ask-email-error" role="alert" className="mt-1 block text-sm text-destructive">
              {errors.email}
            </span>
          ) : null}
        </label>
      </div>

      <label>
        <span className="text-sm font-semibold">Your question</span>
        <textarea
          name="message"
          rows={5}
          maxLength={2000}
          placeholder="Ask me anything — about the schools, the budget, a specific decision, or why I'm running."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "ask-message-error" : undefined}
          className={inputClass}
        />
        {errors.message ? (
          <span id="ask-message-error" role="alert" className="mt-1 block text-sm text-destructive">
            {errors.message}
          </span>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-md bg-primary px-5 py-3.5 font-display text-lg tracking-wide text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? t("form.submitting") : "Send my question"}
      </button>
    </form>
  );
}