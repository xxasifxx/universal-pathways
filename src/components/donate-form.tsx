import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { logSignal } from "@/lib/analytics";
import { DONATION, DONATION_AMOUNTS, DONATION_METHODS } from "@/lib/campaign";
import { getFingerprintSync } from "@/lib/fingerprint";
import { submitContribution } from "@/lib/submissions.functions";
import { getAnonId } from "@/lib/visitor";
import { cn } from "@/lib/utils";

type Field =
  | "name"
  | "email"
  | "addressLine1"
  | "city"
  | "state"
  | "zipCode"
  | "occupation"
  | "employer"
  | "amount"
  | "certify";
type Errors = Partial<Record<Field, string>>;

const inputClass =
  "mt-1.5 w-full rounded-md border border-input bg-card px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:border-primary";

function FieldError({ id, message }: { id: string; message?: string | undefined }) {
  if (!message) return null;
  return (
    <span id={id} role="alert" className="mt-1 block text-sm text-destructive">
      {message}
    </span>
  );
}

export function DonateForm() {
  const [amount, setAmount] = useState<number | null>(100);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<string>(DONATION_METHODS[0].id);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ amount: number; method: string } | null>(null);

  const started = useRef(false);
  const statusRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (done) statusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [done]);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    logSignal({ event: "form_started", service_group: "donate", meta: { form: "donate" } });
  }

  const effectiveAmount = custom.trim() ? Number(custom) : amount;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (key: string) => String(form.get(key) ?? "").trim();
    const values = {
      name: get("name"),
      email: get("email"),
      phone: get("phone"),
      addressLine1: get("addressLine1"),
      city: get("city"),
      state: get("state"),
      occupation: get("occupation"),
      employer: get("employer"),
      zipCode: get("zipCode"),
      note: get("note"),
    };
    const certified = form.get("certify") === "on";

    const next: Errors = {};
    if (!values.name) next.name = "Please enter your full name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
      next.email = "Please enter a valid email.";
    if (!values.addressLine1) next.addressLine1 = "Street address is required for reporting.";
    if (!values.city) next.city = "City is required.";
    if (!values.state) next.state = "State is required.";
    if (!/^\d{5}(-\d{4})?$/.test(values.zipCode)) next.zipCode = "Enter a valid zip code.";
    if (!values.occupation) next.occupation = "Occupation is required for reporting.";
    if (!values.employer) next.employer = "Employer is required (or 'Self' / 'Retired').";
    if (!effectiveAmount || effectiveAmount <= 0) next.amount = "Choose or enter an amount.";
    else if (effectiveAmount > DONATION.maxIndividual)
      next.amount = `The legal limit is $${DONATION.maxIndividual.toLocaleString()} per person.`;
    if (!certified) next.certify = "Please confirm both statements to continue.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setPending(true);
    try {
      await submitContribution({
        data: {
          ...values,
          amount: effectiveAmount as number,
          method: method as "bank_transfer" | "check",
          certifiesOwnFunds: true,
          certifiesUsPerson: true,
          anonId: getAnonId(),
          fpHash: getFingerprintSync(),
        },
      });
      setDone({ amount: effectiveAmount as number, method });
      logSignal({
        event: "form_submitted",
        service_group: "donate",
        meta: { form: "donate", amount: effectiveAmount, method },
      });
      toast.success("Thank you — instructions are on the way.");
    } catch {
      toast.error("Something went wrong. Please try again or email us.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-lg border-2 border-primary bg-card p-6"
      >
        <p className="font-display text-2xl tracking-wide text-primary">
          Thank you — ${done.amount.toLocaleString()} pledged.
        </p>
        <p className="mt-2 text-base leading-relaxed text-foreground/90">
          Check your inbox. We just emailed you exactly how to send it, and we already have
          everything the campaign needs for its ELEC report.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} onInput={markStarted} noValidate className="flex flex-col gap-6">
      <fieldset>
        <legend className="text-sm font-semibold">Amount</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {DONATION_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={!custom.trim() && amount === value}
              onClick={() => {
                setAmount(value);
                setCustom("");
                markStarted();
              }}
              className={cn(
                "rounded-md border px-4 py-2.5 font-display text-lg tracking-wide transition-colors",
                !custom.trim() && amount === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-card text-foreground hover:border-primary",
              )}
            >
              ${value}
            </button>
          ))}
        </div>
        <label className="mt-3 block">
          <span className="text-sm font-semibold">Other amount</span>
          <input
            name="customAmount"
            inputMode="decimal"
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^\d.]/g, ""))}
            placeholder={`Up to $${DONATION.maxIndividual.toLocaleString()}`}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? "donate-amount-error" : undefined}
            className={inputClass}
          />
          <FieldError id="donate-amount-error" message={errors.amount} />
        </label>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold">How you&apos;ll send it</legend>
        <div className="mt-2 flex flex-col gap-2">
          {DONATION_METHODS.map((option) => (
            <label
              key={option.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors",
                method === option.id ? "border-primary bg-secondary" : "border-input bg-card",
              )}
            >
              <input
                type="radio"
                name="method"
                value={option.id}
                checked={method === option.id}
                onChange={() => setMethod(option.id)}
                className="mt-1 size-4 accent-[var(--color-primary)]"
              />
              <span>
                <span className="block text-base font-semibold text-foreground">{option.label}</span>
                <span className="block text-sm text-muted-foreground">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-sm font-semibold">Full name</span>
          <input name="name" maxLength={100} autoComplete="name" aria-invalid={Boolean(errors.name)} className={inputClass} />
          <FieldError id="donate-name-error" message={errors.name} />
        </label>
        <label>
          <span className="text-sm font-semibold">Email</span>
          <input name="email" type="email" maxLength={255} autoComplete="email" aria-invalid={Boolean(errors.email)} className={inputClass} />
          <FieldError id="donate-email-error" message={errors.email} />
        </label>
        <label>
          <span className="text-sm font-semibold">Phone (optional)</span>
          <input name="phone" maxLength={30} autoComplete="tel" className={inputClass} />
        </label>
        <label>
          <span className="text-sm font-semibold">Street address</span>
          <input name="addressLine1" maxLength={160} autoComplete="address-line1" aria-invalid={Boolean(errors.addressLine1)} className={inputClass} />
          <FieldError id="donate-address-error" message={errors.addressLine1} />
        </label>
        <label>
          <span className="text-sm font-semibold">City</span>
          <input name="city" maxLength={80} defaultValue="East Brunswick" autoComplete="address-level2" aria-invalid={Boolean(errors.city)} className={inputClass} />
          <FieldError id="donate-city-error" message={errors.city} />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label>
            <span className="text-sm font-semibold">State</span>
            <input name="state" maxLength={30} defaultValue="NJ" autoComplete="address-level1" aria-invalid={Boolean(errors.state)} className={inputClass} />
            <FieldError id="donate-state-error" message={errors.state} />
          </label>
          <label>
            <span className="text-sm font-semibold">Zip</span>
            <input name="zipCode" inputMode="numeric" maxLength={10} autoComplete="postal-code" aria-invalid={Boolean(errors.zipCode)} className={inputClass} />
            <FieldError id="donate-zip-error" message={errors.zipCode} />
          </label>
        </div>
        <label>
          <span className="text-sm font-semibold">Occupation</span>
          <input name="occupation" maxLength={120} autoComplete="organization-title" aria-invalid={Boolean(errors.occupation)} className={inputClass} />
          <FieldError id="donate-occupation-error" message={errors.occupation} />
        </label>
        <label>
          <span className="text-sm font-semibold">Employer</span>
          <input name="employer" maxLength={160} autoComplete="organization" placeholder="Or 'Self' / 'Retired'" aria-invalid={Boolean(errors.employer)} className={inputClass} />
          <FieldError id="donate-employer-error" message={errors.employer} />
        </label>
      </div>

      <label>
        <span className="text-sm font-semibold">Anything you want Muhammad to know (optional)</span>
        <textarea name="note" rows={3} maxLength={500} className={inputClass} />
      </label>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name="certify"
          className="mt-1 size-4 accent-[var(--color-primary)]"
          aria-invalid={Boolean(errors.certify)}
        />
        <span className="text-sm leading-relaxed text-muted-foreground">
          I confirm this contribution is from my own funds, not reimbursed by anyone else, and
          that I am a US citizen or lawfully admitted permanent resident.
          <FieldError id="donate-certify-error" message={errors.certify} />
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-5 py-3.5 font-display text-lg tracking-wide text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Get sending instructions"}
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        NJ law requires the campaign to report the name, address, occupation and employer of
        anyone giving more than ${DONATION.reportingThreshold}. Contributions to a candidate
        committee are not tax deductible.
      </p>
    </form>
  );
}