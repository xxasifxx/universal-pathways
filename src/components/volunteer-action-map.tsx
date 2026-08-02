import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { logSignal } from "@/lib/analytics";
import { HELP_OPTIONS, ZONES } from "@/lib/campaign";
import { getFingerprintSync } from "@/lib/fingerprint";
import { useI18n } from "@/lib/i18n";
import { submitVolunteer } from "@/lib/submissions.functions";
import { getAnonId } from "@/lib/visitor";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "email" | "zipCode", string>>;

export function VolunteerActionMap() {
  const { t } = useI18n();
  const [zoneId, setZoneId] = useState<string>(ZONES[0]!.id);
  const [hovered, setHovered] = useState<string | null>(null);
  const [help, setHelp] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const zone = ZONES.find((z) => z.id === zoneId)!;
  const started = useRef(false);
  const submitted = useRef(false);

  function selectZone(id: string) {
    setZoneId(id);
    const picked = ZONES.find((z) => z.id === id);
    logSignal({
      event: "zone_selected",
      service_slug: id,
      service_group: "volunteer-map",
      meta: { zone: picked?.name ?? id, team: picked?.team ?? null },
    });
  }

  function markStarted() {
    if (started.current) return;
    started.current = true;
    logSignal({ event: "form_started", service_group: "volunteer", meta: { form: "volunteer" } });
  }

  // Someone who typed but never sent is a lead we would otherwise never see.
  useEffect(
    () => () => {
      if (started.current && !submitted.current) {
        logSignal({ event: "form_abandon", service_group: "volunteer", meta: { form: "volunteer" } });
      }
    },
    [],
  );

  function toggleHelp(id: string) {
    setHelp((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      zipCode: String(form.get("zipCode") ?? "").trim(),
      mobile: String(form.get("mobile") ?? "").trim(),
      zone: zone.name,
      helpWith: help,
    };

    const next: Errors = {};
    if (!values.name) next.name = "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
      next.email = "Please enter a valid email.";
    if (!/^\d{5}(-\d{4})?$/.test(values.zipCode)) next.zipCode = "Enter a 5-digit zip code.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    try {
      await submitVolunteer({
        data: { ...values, anonId: getAnonId(), fpHash: getFingerprintSync() },
      });
      setDone(true);
      submitted.current = true;
      logSignal({
        event: "form_submitted",
        service_slug: zoneId,
        service_group: "volunteer",
        meta: { form: "volunteer", zone: zone.name, help_with: help },
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

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
      <div>
        <h2 className="font-display text-2xl font-extrabold">{t("volunteer.map.title")}</h2>
        <p className="mt-2 text-base text-muted-foreground">{t("volunteer.map.help")}</p>

        <svg
          viewBox="0 0 340 320"
          role="group"
          aria-label="East Brunswick school zones"
          className="mt-6 w-full"
        >
          {ZONES.map((z) => {
            const selected = z.id === zoneId;
            const lit = selected || hovered === z.id;
            return (
              <g key={z.id}>
                <polygon
                  points={z.points}
                  role="button"
                  tabIndex={0}
                  aria-label={`${z.name} zone — ${z.team}`}
                  aria-pressed={selected}
                  onClick={() => selectZone(z.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      selectZone(z.id);
                    }
                  }}
                  onMouseEnter={() => setHovered(z.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(z.id)}
                  onBlur={() => setHovered(null)}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    fill: lit ? "var(--primary)" : "var(--secondary)",
                    stroke: selected || hovered === z.id ? "var(--ink)" : "var(--border)",
                    strokeWidth: selected ? 3 : hovered === z.id ? 2.5 : 1.5,
                    strokeDasharray: !selected && hovered === z.id ? "5 3" : undefined,
                  }}
                />
                <text
                  x={z.labelX}
                  y={z.labelY}
                  textAnchor="middle"
                  className="pointer-events-none select-none font-display text-[13px] font-bold"
                  style={{ fill: lit ? "var(--primary-foreground)" : "var(--foreground)" }}
                >
                  {z.name}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-2 text-xs text-muted-foreground">
          Rough zone map, not to scale.
        </p>
        <p aria-live="polite" className="sr-only">
          {`${zone.name} zone selected — ${zone.team}`}
        </p>

        <label className="mt-6 block">
          <span className="text-sm font-semibold">{t("volunteer.select")}</span>
          <select
            value={zoneId}
            onChange={(e) => selectZone(e.target.value)}
            className={inputClass}
          >
            {ZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <p className="eyebrow text-primary">{zone.name}</p>
        <h3 className="mt-2 font-display text-2xl font-extrabold">Join the {zone.team}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{zone.blurb}</p>

        {done ? (
          <p
            role="status"
            className="mt-6 rounded-lg border border-[var(--solution)] bg-[color-mix(in_oklab,var(--solution)_12%,var(--card))] p-5 text-base font-semibold text-[var(--solution)]"
          >
            {t("form.success.volunteer")}
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            onInput={markStarted}
            noValidate
            className="mt-6 flex flex-col gap-4"
          >
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
                <input
                  name="mobile"
                  type="tel"
                  maxLength={30}
                  autoComplete="tel"
                  className={inputClass}
                />
              </label>
            </div>

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
                      {opt.label}
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
        )}
      </div>
    </div>
  );
}