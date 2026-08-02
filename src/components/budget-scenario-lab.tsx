import { useEffect, useMemo, useState } from "react";

import { logSignal } from "@/lib/analytics";
import {
  BASELINE,
  BUDGET_TOTAL_DISPLAY,
  LEVERS,
  PRESETS,
  computeChildCost,
  computeScenario,
  signedUsd,
  usd0,
  type ChildInput,
  type LeverState,
} from "@/lib/cost-model";
import { cn } from "@/lib/utils";

export function BudgetScenarioLab({ child }: { child: ChildInput }) {
  const [state, setState] = useState<LeverState>({ ...BASELINE });
  const [copied, setCopied] = useState(false);

  const scenario = useMemo(() => computeScenario(state), [state]);
  const childCost = useMemo(() => computeChildCost(child), [child]);

  const dirty = scenario.changed.length > 0;
  const newChildCost = childCost.total + scenario.perChildDelta;

  useEffect(() => {
    if (!dirty) return;
    const timer = window.setTimeout(() => {
      logSignal({
        event: "scenario_adjusted",
        service_group: "board-meeting-mode",
        meta: {
          levers: scenario.changed.map((c) => c.lever.id),
          budget_delta: Math.round(scenario.budgetDelta),
          per_child_delta: Math.round(scenario.perChildDelta),
        },
      });
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [dirty, scenario]);

  const applyPreset = (values: Partial<LeverState>) => {
    setState({ ...BASELINE, ...values });
    setCopied(false);
  };

  const summary = () => {
    const lines = scenario.changed.map(
      (c) => `- ${c.lever.label}: ${c.lever.format(c.from)} to ${c.lever.format(c.to)} (${signedUsd(c.dollars)})`,
    );
    return [
      "East Brunswick budget scenario",
      `Budget change: ${signedUsd(scenario.budgetDelta)} (new total ${usd0.format(Math.round(scenario.newTotal))})`,
      `Per student: ${signedUsd(scenario.perChildDelta)}`,
      `Typical household tax bill: ${signedUsd(scenario.perHouseholdDelta)}`,
      "",
      ...lines,
      "",
      "Modeled from the published operating budget at saqeebforeb.org/cost-calculator.",
    ].join("\n");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary());
      setCopied(true);
      logSignal({
        event: "scenario_copied",
        service_group: "board-meeting-mode",
        meta: {
          levers: scenario.changed.map((c) => c.lever.id),
          budget_delta: Math.round(scenario.budgetDelta),
          per_child_delta: Math.round(scenario.perChildDelta),
        },
      });
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
      <div>
        <h3 className="font-display text-lg font-extrabold">Load a proposal</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {PRESETS.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => applyPreset(p.values)}
                className="h-full w-full rounded-lg border border-border bg-card/60 p-3.5 text-left transition-colors hover:bg-card"
              >
                <span className="block font-display text-sm font-bold">{p.label}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {p.blurb}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <h3 className="mt-10 font-display text-lg font-extrabold">Or move the lines yourself</h3>
        <div className="mt-4 flex flex-col gap-6">
          {LEVERS.map((lever) => {
            const value = state[lever.id];
            const delta = value - lever.current;
            return (
              <div key={lever.id} className="rounded-lg border border-border bg-card/60 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <label
                    htmlFor={`lever-${lever.id}`}
                    className="font-display text-sm font-bold sm:text-base"
                  >
                    {lever.label}
                  </label>
                  <span className="text-sm font-semibold tabular-nums">
                    {lever.format(value)}
                    <span
                      className={cn(
                        "ml-2 tabular-nums",
                        delta === 0 ? "text-muted-foreground" : "text-primary",
                      )}
                    >
                      {signedUsd(delta * lever.costPerUnit)}
                    </span>
                  </span>
                </div>
                <input
                  id={`lever-${lever.id}`}
                  type="range"
                  min={lever.min}
                  max={lever.max}
                  step={lever.step}
                  value={value}
                  aria-describedby={`lever-${lever.id}-note`}
                  aria-valuetext={lever.format(value)}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setState((s) => ({ ...s, [lever.id]: next }));
                    setCopied(false);
                  }}
                  className="mt-4 h-6 w-full accent-[var(--color-primary)]"
                />
                <p
                  id={`lever-${lever.id}-note`}
                  className="mt-2 text-sm leading-relaxed text-muted-foreground"
                >
                  {lever.consequence(delta)}
                </p>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            setState({ ...BASELINE });
            setCopied(false);
          }}
          disabled={!dirty}
          className="mt-6 rounded-md border border-border bg-card px-4 py-2.5 font-display text-sm font-bold transition-colors hover:bg-secondary disabled:opacity-50"
        >
          Reset to this year&apos;s budget
        </button>
      </div>

      <div className="lg:sticky lg:top-24">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="eyebrow text-primary">What this does to your kid</p>
          <p
            aria-live="polite"
            className="mt-2 font-display text-4xl font-black tabular-nums sm:text-5xl"
          >
            {signedUsd(scenario.perChildDelta)}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            per year, on top of the {usd0.format(Math.round(childCost.total))} already spent on the
            student you set up above. New figure: {usd0.format(Math.round(newChildCost))}.
          </p>

          <dl className="mt-6 flex flex-col gap-3 border-t border-border pt-5 text-sm">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">Whole budget</dt>
              <dd className="font-semibold tabular-nums">{signedUsd(scenario.budgetDelta)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">New total</dt>
              <dd className="font-semibold tabular-nums">
                {usd0.format(Math.round(scenario.newTotal))}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">Typical household tax bill</dt>
              <dd className="font-semibold tabular-nums">
                {signedUsd(scenario.perHouseholdDelta)}
              </dd>
            </div>
          </dl>

          <div className="mt-5 border-t border-border pt-5">
            <p className="font-display text-sm font-bold">What actually changes</p>
            {dirty ? (
              <ul className="mt-3 flex flex-col gap-3">
                {scenario.changed.map((c) => (
                  <li key={c.lever.id} className="text-sm leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">{c.lever.label}:</span>{" "}
                    {c.lever.consequence(c.delta)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Nothing yet. Load a proposal or drag a line and this fills in with what it means in
                the buildings, not just what it costs.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={copy}
            disabled={!dirty}
            className="mt-6 w-full rounded-md bg-primary px-4 py-2.5 font-display text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Copy these numbers for public comment
          </button>
          <p aria-live="polite" className="mt-2 min-h-5 text-xs text-muted-foreground">
            {copied ? "Copied. Paste it into your comment or an email to the board." : ""}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Baseline is the {BUDGET_TOTAL_DISPLAY} operating budget. Unit costs are modeled averages,
            so treat the direction as solid and the decimal places as rough.
          </p>
        </div>
      </div>
    </div>
  );
}