import { useEffect, useMemo, useRef, useState } from "react";

import { logSignal } from "@/lib/analytics";
import {
  LEVELS,
  PRESET_CHILDREN,
  SCHOOL_TAX_SHARE,
  SERVICES,
  computeChildCost,
  usd0,
  type ChildInput,
  type LevelId,
  type ServiceId,
} from "@/lib/cost-model";
import { cn } from "@/lib/utils";

export function PerChildCalculator({
  child,
  onChange,
}: {
  child: ChildInput;
  onChange: (next: ChildInput) => void;
}) {
  const [taxBill, setTaxBill] = useState("");

  const result = useMemo(() => computeChildCost(child), [child]);

  // One signal per settled configuration: what kind of student this parent has.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      logSignal({
        event: "calculator_run",
        service_slug: child.level,
        service_group: "cost-calculator",
        meta: {
          level: child.level,
          services: child.services,
          modeled_total: Math.round(computeChildCost(child).total),
        },
      });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [child]);

  const completedRef = useRef(false);

  const bill = Number(taxBill.replace(/[^0-9.]/g, ""));
  const billValid = taxBill.trim() !== "" && Number.isFinite(bill) && bill > 0;
  const billError = taxBill.trim() !== "" && !billValid;
  const schoolPortion = billValid ? bill * SCHOOL_TAX_SHARE : 0;

  // Entering a real tax bill is the strongest intent this page can capture.
  useEffect(() => {
    if (!billValid || completedRef.current) return;
    const timer = window.setTimeout(() => {
      completedRef.current = true;
      logSignal({
        event: "calculator_completed",
        service_slug: child.level,
        service_group: "cost-calculator",
        meta: {
          level: child.level,
          services: child.services,
          entered_tax_bill: true,
          school_portion: Math.round(schoolPortion),
        },
      });
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [billValid, schoolPortion, child]);

  const toggleService = (id: ServiceId) => {
    const has = child.services.includes(id);
    onChange({
      ...child,
      services: has ? child.services.filter((s) => s !== id) : [...child.services, id],
    });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
      <div>
        <div>
          <h3 className="font-display text-lg font-extrabold">Start from a student like yours</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {PRESET_CHILDREN.map((p) => {
              const activePreset =
                p.child.level === child.level &&
                p.child.services.length === child.services.length &&
                p.child.services.every((s) => child.services.includes(s));
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={activePreset}
                    onClick={() =>
                      onChange({ level: p.child.level, services: [...p.child.services] })
                    }
                    className={cn(
                      "w-full rounded-lg border p-3.5 text-left transition-colors",
                      activePreset
                        ? "border-primary bg-card"
                        : "border-border bg-card/60 hover:bg-card",
                    )}
                  >
                    <span className="block font-display text-sm font-bold">{p.label}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {p.blurb}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <fieldset className="mt-8">
          <legend className="font-display text-lg font-extrabold">Grade level</legend>
          <div className="mt-3 flex flex-col gap-2">
            {LEVELS.map((l) => (
              <label
                key={l.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors",
                  child.level === l.id ? "border-primary bg-card" : "border-border bg-card/60",
                )}
              >
                <input
                  type="radio"
                  name="level"
                  value={l.id}
                  checked={child.level === l.id}
                  onChange={() => onChange({ ...child, level: l.id as LevelId })}
                  className="mt-1 size-4 accent-[var(--color-primary)]"
                />
                <span>
                  <span className="block font-display text-sm font-bold">{l.label}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{l.note}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="font-display text-lg font-extrabold">What does your child use?</legend>
          <p className="mt-1 text-sm text-muted-foreground">
            Check anything that applies. Leave it blank if none of it does.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {SERVICES.map((s) => (
              <label
                key={s.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors",
                  child.services.includes(s.id)
                    ? "border-primary bg-card"
                    : "border-border bg-card/60",
                )}
              >
                <input
                  type="checkbox"
                  checked={child.services.includes(s.id)}
                  onChange={() => toggleService(s.id)}
                  className="mt-1 size-4 accent-[var(--color-primary)]"
                />
                <span>
                  <span className="block font-display text-sm font-bold">{s.label}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{s.note}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-8">
          <label htmlFor="tax-bill" className="font-display text-lg font-extrabold">
            Your annual property tax bill (optional)
          </label>
          <p id="tax-bill-help" className="mt-1 text-sm text-muted-foreground">
            Used for arithmetic in your browser. It never leaves this page.
          </p>
          <input
            id="tax-bill"
            inputMode="decimal"
            value={taxBill}
            onChange={(e) => setTaxBill(e.target.value)}
            placeholder="9800"
            aria-describedby={billError ? "tax-bill-help tax-bill-error" : "tax-bill-help"}
            aria-invalid={billError || undefined}
            className="mt-3 h-12 w-full max-w-xs rounded-lg border border-border bg-card px-4 text-base text-foreground"
          />
          {billError ? (
            <p
              id="tax-bill-error"
              role="alert"
              className="mt-2 text-sm font-semibold text-destructive"
            >
              Enter a number, like 9800.
            </p>
          ) : null}
        </div>
      </div>

      <div className="lg:sticky lg:top-24">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="eyebrow text-primary">Modeled district spending</p>
          <p
            aria-live="polite"
            className="mt-2 font-display text-4xl font-black tabular-nums sm:text-5xl"
          >
            {usd0.format(Math.round(result.total))}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            per school year, for a student like this one.
          </p>

          <div
            aria-hidden="true"
            className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-muted"
          >
            {result.lines.map((l) => (
              <div
                key={l.id}
                style={{
                  width: `${(l.amount / result.total) * 100}%`,
                  backgroundColor: l.color,
                }}
              />
            ))}
          </div>

          <ul className="mt-4 flex flex-col gap-2.5">
            {result.lines.map((l) => (
              <li key={l.id} className="flex items-baseline justify-between gap-4 text-sm">
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="font-semibold">{l.label}</span>
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {usd0.format(Math.round(l.amount))}
                </span>
              </li>
            ))}
          </ul>

          {billValid ? (
            <div className="mt-6 border-t border-border pt-5">
              <p className="text-sm leading-relaxed" aria-live="polite">
                About{" "}
                <strong className="tabular-nums">{usd0.format(Math.round(schoolPortion))}</strong>{" "}
                of your {usd0.format(Math.round(bill))} tax bill goes to the schools.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                That is less than what the district spends on one student, and it should be. Schools
                are paid for collectively. Your neighbors covered your kid, you cover theirs, and
                the retired couple down the street covers both. The number above is what the
                district spends, not a bill you owe.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}