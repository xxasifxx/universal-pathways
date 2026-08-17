import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { logSignal } from "@/lib/analytics";
import { CANVASS_DAYS, CONTACT_TIMES, HELP_OPTIONS } from "@/lib/campaign";
import { getFingerprintSync } from "@/lib/fingerprint";
import { useI18n } from "@/lib/i18n";
import { submitVolunteer } from "@/lib/submissions.functions";
import { getAnonId } from "@/lib/visitor";
import { cn } from "@/lib/utils";

type Errors = Partial<
  Record<"name" | "email" | "zipCode" | "help" | "address" | "mobile" | "days" | "background", string>
>;

const YARD_SIGN = HELP_OPTIONS[0].label;
const CANVASS = HELP_OPTIONS[1].label;
const PHONE = HELP_OPTIONS[2].label;
const RESEARCH = HELP_OPTIONS[3].label;

const RESEARCH_AREAS = [
  "School budgets or municipal finance",
  "Teaching or school administration",
  "Special education",
  "Law or public policy",
  "Facilities, construction, or planning",
  "Parent of a student in the district",
] as const;

export function VolunteerForm({
  defaultHelp = [] as string[],
  onSubmitted,
}: {
  defaultHelp?: string[];
  onSubmitted?: () => void;
}) {
  const { t } = useI18n();
  const [help, setHelp] = useState<string[]>(defaultHelp);
  const [address, setAddress] = useState("");
  const [placementNotes, setPlacementNotes] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [canDrive, setCanDrive] = useState("");
  const [mobile, setMobile] = useState("");
  const [times, setTimes] = useState<string[]>([]);
  const [channel, setChannel] = useState("Either");
  const [areas, setAreas] = useState<string[]>([]);
  const [background, setBackground] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const started = useRef(false);
  const submitted = useRef(false);
  const statusRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    setHelp((prev) => (prev.length === 0 && defaultHelp.length > 0 ? defaultHelp : prev));
  }, [defaultHelp]);

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

  function toggleIn(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const wantsSign = help.includes(YARD_SIGN);
    const wantsCanvass = help.includes(CANVASS);
    const wantsPhone = help.includes(PHONE);
    const wantsResearch = help.includes(RESEARCH);

    const helpDetails: Record<string, unknown> = {};
    if (wantsSign) {
      helpDetails["yardSign"] = {
        address: address.trim().slice(0, 160),
        placementNotes: placementNotes.trim().slice(0, 300),
      };
    }
    if (wantsCanvass) {
      helpDetails["canvassing"] = { days, canDrive: canDrive || "Not specified" };
    }
    if (wantsPhone) {
      helpDetails["phoneBank"] = { mobile: mobile.trim(), times, channel };
    }
    if (wantsResearch) {
      helpDetails["research"] = { areas, background: background.trim().slice(0, 600) };
    }
    const extra = String(form.get("notes") ?? "").trim().slice(0, 500);
    if (extra) helpDetails["notes"] = extra;

    const values = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      zipCode: String(form.get("zipCode") ?? "").trim(),
      mobile: mobile.trim(),
      zone: address.trim().slice(0, 60),
      helpWith: help,
      helpDetails,
    };

    const next: Errors = {};
    if (!values.name) next.name = "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) next.email = "Please enter a valid email.";
    if (!/^\d{5}(-\d{4})?$/.test(values.zipCode)) next.zipCode = "Enter a 5-digit zip code.";
    if (help.length === 0) next.help = "Please select an option.";
    if (wantsSign && address.trim().length < 5) next.address = "We need a street address to drop the sign off.";
    if (wantsCanvass && days.length === 0) next.days = "Pick at least one day that works.";
    if (wantsPhone && mobile.trim().length < 7) next.mobile = "We need a mobile number for phone or text banking.";
    if (wantsResearch && background.trim().length < 10)
      next.background = "Tell us a line or two about what you'd be reviewing from.";
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
      onSubmitted?.();
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
  const chipClass = (on: boolean) =>
    cn(
      "min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
      on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary",
    );
  const errorClass = "mt-1 block text-sm text-destructive";

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
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">{t("form.help")}</legend>
        {errors.help ? (
          <span role="alert" className={errorClass}>
            {errors.help}
          </span>
        ) : null}
        <div className="mt-3 flex flex-col gap-3">
          {HELP_OPTIONS.map((opt) => {
            const on = help.includes(opt.label);
            return (
              <div
                key={opt.id}
                className={cn(
                  "rounded-lg border p-4 transition-colors",
                  on ? "border-primary bg-secondary" : "border-border bg-background",
                )}
              >
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggleHelp(opt.label)}
                    className="mt-1 size-5 shrink-0 accent-primary"
                  />
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-primary">{opt.label}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{opt.blurb}</span>
                  </span>
                </label>

                {on && opt.id === "yard-sign" ? (
                  <div className="mt-4 grid gap-3 border-t border-border pt-4">
                    <label>
                      <span className="text-sm font-semibold">Street address</span>
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        maxLength={160}
                        autoComplete="street-address"
                        placeholder="12 Cranbury Rd, East Brunswick"
                        aria-invalid={Boolean(errors.address)}
                        className={inputClass}
                      />
                      {errors.address ? (
                        <span role="alert" className={errorClass}>
                          {errors.address}
                        </span>
                      ) : null}
                    </label>
                    <label>
                      <span className="text-sm font-semibold">Placement notes (optional)</span>
                      <input
                        value={placementNotes}
                        onChange={(e) => setPlacementNotes(e.target.value)}
                        maxLength={300}
                        placeholder="Corner of the lawn, near the driveway"
                        className={inputClass}
                      />
                    </label>
                  </div>
                ) : null}

                {on && opt.id === "canvassing" ? (
                  <div className="mt-4 grid gap-4 border-t border-border pt-4">
                    <div>
                      <span className="text-sm font-semibold">Which days work for you?</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {CANVASS_DAYS.map((d) => (
                          <button
                            key={d}
                            type="button"
                            aria-pressed={days.includes(d)}
                            onClick={() => toggleIn(days, setDays, d)}
                            className={chipClass(days.includes(d))}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                      {errors.days ? (
                        <span role="alert" className={errorClass}>
                          {errors.days}
                        </span>
                      ) : null}
                    </div>
                    <div>
                      <span className="text-sm font-semibold">Can you drive to a turf?</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {["Yes", "No"].map((v) => (
                          <button
                            key={v}
                            type="button"
                            aria-pressed={canDrive === v}
                            onClick={() => setCanDrive(v)}
                            className={chipClass(canDrive === v)}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {on && opt.id === "phone-text" ? (
                  <div className="mt-4 grid gap-4 border-t border-border pt-4">
                    <label>
                      <span className="text-sm font-semibold">{t("form.mobile")}</span>
                      <input
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        type="tel"
                        maxLength={30}
                        autoComplete="tel"
                        placeholder="732-555-0134"
                        aria-invalid={Boolean(errors.mobile)}
                        className={inputClass}
                      />
                      {errors.mobile ? (
                        <span role="alert" className={errorClass}>
                          {errors.mobile}
                        </span>
                      ) : null}
                    </label>
                    <div>
                      <span className="text-sm font-semibold">Best times to reach you</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {CONTACT_TIMES.map((v) => (
                          <button
                            key={v}
                            type="button"
                            aria-pressed={times.includes(v)}
                            onClick={() => toggleIn(times, setTimes, v)}
                            className={chipClass(times.includes(v))}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold">Calls or texting?</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {["Calls", "Texting", "Either"].map((v) => (
                          <button
                            key={v}
                            type="button"
                            aria-pressed={channel === v}
                            onClick={() => setChannel(v)}
                            className={chipClass(channel === v)}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </fieldset>

      <label>
        <span className="text-sm font-semibold">Anything else we should know? (optional)</span>
        <textarea name="notes" maxLength={500} rows={3} className={inputClass} />
      </label>

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
