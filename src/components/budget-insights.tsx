import type { BudgetPayload } from "@/lib/review-content/types";
import { cn } from "@/lib/utils";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/**
 * Deterministic compact currency. `Intl` compact notation drops a trailing
 * ".0" on some ICU builds and keeps it on others, which shows up as a
 * server/client hydration mismatch ("$15M" vs "$15.0M").
 */
const compact = {
  format(value: number): string {
    const millions = value / 1_000_000;
    const rounded = Math.round(millions * 10) / 10;
    const digits = Number.isInteger(rounded) ? 0 : 1;
    return `$${rounded.toFixed(digits)}M`;
  },
};

function pctChange(from: number, to: number) {
  return ((to - from) / from) * 100;
}

function signed(value: number) {
  return `${value >= 0 ? "+" : "\u2212"}${Math.abs(value).toFixed(1)}%`;
}

/** Revenue side of the general fund: who actually pays for the district. */
export function BudgetRevenue({ budget }: { budget: BudgetPayload }) {
  const { revenue: BUDGET_REVENUE, total: BUDGET_TOTAL } = budget;
  const rows = BUDGET_REVENUE.map((r) => ({
    ...r,
    pct: (r.amount / BUDGET_TOTAL) * 100,
  }));

  return (
    <section aria-labelledby="revenue-heading" className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow text-primary">Revenue</p>
        <h2 id="revenue-heading" className="mt-3 max-w-3xl text-3xl leading-[1.1] sm:text-4xl">
          Where the money comes from
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          East Brunswick property owners fund just over three quarters of the general fund. State
          aid covers about one fifth. The levy rose 10.2% over two years while total state aid fell
          1.3%. Equalization aid fell from $26.5 million to $19.0 million, then rose to $23.3 million.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <li key={row.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg">{row.label}</h3>
                <span className="font-display text-lg font-bold tabular-nums text-primary">
                  {row.pct >= 1 ? `${row.pct.toFixed(1)}%` : "<1%"}
                </span>
              </div>
              <p className="mt-1 font-semibold tabular-nums">{usd.format(row.amount)}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{row.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Two-year movement by line, sorted by growth. */
export function BudgetMovement({ budget }: { budget: BudgetPayload }) {
  const BUDGET_MOVEMENT = budget.movement;
  const rows = [...BUDGET_MOVEMENT]
    .map((r) => ({ ...r, change: pctChange(r.from, r.to) }))
    .sort((a, b) => b.change - a.change);
  const max = Math.max(...rows.map((r) => Math.abs(r.change)));

  return (
    <section aria-labelledby="movement-heading" className="bg-secondary/50 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow text-primary">
          FY2027 filing: 2024-25 actual column to 2026-27 proposed column
        </p>
        <h2 id="movement-heading" className="mt-3 max-w-3xl text-3xl leading-[1.1] sm:text-4xl">
          Changes since 2024-25
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          Both columns come from the FY2027 User Friendly Budget. The 2024-25 column contains the
          filing's prior-year actuals. Over two years, the tax levy rose 10.2% and regular classroom
          instruction rose 0.2%. Benefits, out-of-district placements, and charter transfers account
          for much of the difference. State formula sets charter transfers. The board controls plan
          design, purchasing, and which services the district provides in-house.
        </p>

        <ul className="mt-10 flex flex-col gap-3">
          {rows.map((row) => {
            const up = row.change >= 0;
            return (
              <li key={row.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-lg">{row.label}</h3>
                  <p className="text-sm font-semibold tabular-nums text-muted-foreground">
                    {compact.format(row.from)} <span aria-hidden="true">&rarr;</span>{" "}
                    <span className="sr-only">to</span>
                    {compact.format(row.to)}
                    <span
                      className={cn(
                        "ml-3 font-display text-base",
                        up ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {signed(row.change)}
                    </span>
                  </p>
                </div>
                <div
                  aria-hidden="true"
                  className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className={cn("h-full rounded-full", up ? "bg-primary" : "bg-muted-foreground/40")}
                    style={{ width: `${(Math.abs(row.change) / max) * 100}%` }}
                  />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{row.note}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Fund balances over four years. */
export function BudgetReserves({ budget }: { budget: BudgetPayload }) {
  const BUDGET_RESERVES = budget.reserves;
  return (
    <section aria-labelledby="reserves-heading" className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow text-primary">
          FY2027 filing: recapitulation of balances, all four columns
        </p>
        <h2 id="reserves-heading" className="mt-3 max-w-3xl text-3xl leading-[1.1] sm:text-4xl">
          What is left in the bank
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          The FY2027 filing lists two audited years and two estimated years. The unrestricted
          operating balance is projected to fall by half over three years. The legal reserve is
          projected to reach zero. The capital reserve fell from $3.1 million to an estimated
          $257,000. Reserve funds cannot be spent twice.
        </p>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">
              District fund balances as printed in the FY2027 User Friendly Budget: audited actuals
              through June 2025 and district estimates through June 2027
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-3 pr-4 font-display text-sm font-bold">
                  Fund
                </th>
                <th scope="col" className="py-3 pr-4 text-right font-display text-sm font-bold">
                  6/30/2024 audited
                </th>
                <th scope="col" className="py-3 pr-4 text-right font-display text-sm font-bold">
                  6/30/2025 audited
                </th>
                <th scope="col" className="py-3 pr-4 text-right font-display text-sm font-bold">
                  6/30/2026 est.
                </th>
                <th scope="col" className="py-3 text-right font-display text-sm font-bold">
                  6/30/2027 est.
                </th>
              </tr>
            </thead>
            <tbody>
              {BUDGET_RESERVES.map((row) => (
                <tr key={row.id} className="border-b border-border/60">
                  <th scope="row" className="py-3 pr-4 font-semibold">
                    {row.label}
                  </th>
                  <td className="py-3 pr-4 text-right tabular-nums text-muted-foreground">
                    {usd.format(row.audited2024)}
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-muted-foreground">
                    {usd.format(row.audited2025)}
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-muted-foreground">
                    {usd.format(row.estimated2026)}
                  </td>
                  <td className="py-3 text-right font-semibold tabular-nums">
                    {usd.format(row.estimated2027)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/** Per-pupil costs and the tax rate behind them. */
export function BudgetPerPupil({ budget }: { budget: BudgetPayload }) {
  const { perPupil: PER_PUPIL, tax: TAX_FACTS, enrollment: ENROLLMENT } = budget;
  return (
    <section aria-labelledby="perpupil-heading" className="bg-secondary/50 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:items-start">
          <div>
            <p className="eyebrow text-primary">
              FY2027 filing: per-pupil table, 2023-24 actual to 2026-27 proposed
            </p>
            <h2 id="perpupil-heading" className="mt-3 text-3xl leading-[1.1] sm:text-4xl">
              Cost per student, and what it buys
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              The state calculates a comparative per-pupil cost so districts can be measured
              against each other. East Brunswick's 2026-27 proposed figure is $20,731, up from
              $19,096 in the 2023-24 actual column of the same filing. Classroom instruction
              accounts for $11,882 of that, administration for $1,929. Enrollment on roll is
              estimated at {ENROLLMENT.onRoll2026.toLocaleString()}, up from{" "}
              {ENROLLMENT.onRoll2025.toLocaleString()}, with{" "}
              {ENROLLMENT.specialEd.toLocaleString()} students in special education and{" "}
              {ENROLLMENT.privatePlacements} in private placements.
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              The filing's Advertised Per Pupil Cost Calculations page starts at 2023-24 actual, so
              this table uses an earlier baseline than the two-year comparison above. Each row runs
              from the 2023-24 actual cost to the 2026-27 proposed cost.
            </p>

            <ul className="mt-8 flex flex-col gap-2">
              {PER_PUPIL.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg border border-border bg-card px-4 py-3"
                >
                  <span className="font-semibold">{row.label}</span>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    ${row.from.toLocaleString()} <span aria-hidden="true">&rarr;</span>{" "}
                    <span className="font-semibold text-foreground">
                      ${row.to.toLocaleString()}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-xl">The tax side</h3>
            <dl className="mt-5 flex flex-col gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Total school levy, with debt service</dt>
                <dd className="font-display text-2xl font-bold tabular-nums">
                  {usd.format(TAX_FACTS.totalSchoolLevy)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">
                  Estimated school tax rate, per $100 of net taxable value
                </dt>
                <dd className="font-display text-2xl font-bold tabular-nums">
                  {TAX_FACTS.totalRate.toFixed(4)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Net taxable valuation, as of 10/01/25</dt>
                <dd className="font-semibold tabular-nums">
                  {usd.format(TAX_FACTS.netTaxableValuation)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Equalized total school tax rate</dt>
                <dd className="font-semibold tabular-nums">
                  {TAX_FACTS.equalizedTotalRate.toFixed(4)}
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              The equalized rate is the one to use when comparing East Brunswick to a neighboring
              town, because it corrects for how recently each town reassessed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
