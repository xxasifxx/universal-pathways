import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { SourcesNote } from "@/components/sources-note";
import { BUDGET_SLICES, BUDGET_TOTAL } from "@/lib/campaign";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function BudgetDashboard() {
  const { t } = useI18n();
  const [plain, setPlain] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Recharts renders its <svg> asynchronously and marks each sector role="img"
  // with no label. Expose one label on the chart and mute the sectors — the
  // legend beside the chart lists every figure as real text.
  useEffect(() => {
    const root = chartRef.current;
    if (!root) return;
    const apply = () => {
      const svg = root.querySelector("svg");
      if (!svg) return;
      svg.setAttribute("role", "img");
      svg.setAttribute(
        "aria-label",
        "Donut chart of the district budget; every figure is also listed in the breakdown beside this chart.",
      );
      svg.querySelectorAll('[role="img"]').forEach((el) => {
        if (el !== svg) el.setAttribute("role", "presentation");
      });
      root.querySelectorAll("[tabindex]").forEach((el) => el.setAttribute("tabindex", "-1"));
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const data = useMemo(
    () =>
      BUDGET_SLICES.map((s) => ({
        ...s,
        pct: (s.amount / BUDGET_TOTAL) * 100,
      })),
    [],
  );

  const focused = data.find((d) => d.id === active) ?? null;

  return (
    <section aria-labelledby="budget-heading" className="bg-secondary/50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow text-primary">{t("budget.eyebrow")}</p>
        <h2 id="budget-heading" className="mt-3 max-w-3xl text-3xl leading-[1.1] sm:text-5xl">
          {t("budget.title")}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {t("budget.intro")}
        </p>

        <div className="mt-8 inline-flex items-center gap-3 rounded-lg border border-border bg-card p-1.5 pr-4">
          <button
            type="button"
            role="switch"
            aria-checked={plain}
            onClick={() => setPlain((v) => !v)}
            className={cn(
              "relative h-9 w-16 shrink-0 rounded-md transition-colors",
              plain ? "bg-primary" : "bg-muted",
            )}
          >
            <span className="sr-only">{t("budget.toggle")}</span>
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-1 size-7 rounded bg-card shadow-sm transition-transform duration-300",
                plain ? "translate-x-8" : "translate-x-1",
              )}
            />
          </button>
          <span className="font-display text-sm font-bold">{t("budget.toggle")}</span>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start">
          <div className="relative mx-auto w-full max-w-[320px]">
            <div ref={chartRef} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart tabIndex={-1}>
                  <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="plain"
                    innerRadius="62%"
                    outerRadius="98%"
                    paddingAngle={2}
                    stroke="none"
                    isAnimationActive={false}
                    rootTabIndex={-1}
                    onMouseEnter={(_, i) => setActive(data[i]?.id ?? null)}
                    onMouseLeave={() => setActive(null)}
                  >
                    {data.map((s) => (
                      <Cell
                        key={s.id}
                        fill={s.color}
                        opacity={active && active !== s.id ? 0.35 : 1}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-20 text-center">
              {focused ? (
                <>
                  <p className="font-display text-2xl font-black">
                    {focused.pct.toFixed(1)}%
                  </p>
                  <p className="mt-1 text-[11px] font-semibold leading-tight text-muted-foreground">
                    {plain ? focused.plain : focused.jargon}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display text-3xl font-black">$229M</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase leading-tight tracking-wide text-muted-foreground">
                    {t("budget.total")}
                  </p>
                </>
              )}
            </div>
          </div>

          <ul className="flex flex-col gap-2">
            {data.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  aria-pressed={active === s.id}
                  onMouseEnter={() => setActive(s.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(s.id)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive((v) => (v === s.id ? null : s.id))}
                  className={cn(
                    "w-full rounded-lg border p-4 text-left transition-colors",
                    active === s.id
                      ? "border-primary bg-card"
                      : "border-transparent bg-card/60 hover:bg-card",
                  )}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="flex items-center gap-2.5 font-display text-sm font-bold sm:text-base">
                      <span
                        aria-hidden="true"
                        className="size-3 shrink-0 rounded-sm"
                        style={{ backgroundColor: s.color }}
                      />
                      <span
                        key={plain ? "plain" : "jargon"}
                        className="animate-in fade-in slide-in-from-bottom-1 duration-300"
                      >
                        {plain ? s.plain : s.jargon}
                      </span>
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                      {usd.format(s.amount)}
                      <span className="ml-2 text-foreground">{s.pct.toFixed(1)}%</span>
                    </span>
                  </div>
                  <div
                    aria-hidden="true"
                    className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                    />
                  </div>
                  {plain ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground animate-in fade-in duration-500">
                      {s.note}
                    </p>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 max-w-3xl">
          <Link
            to="/cost-calculator"
            className="inline-flex rounded-md bg-gold px-5 py-2.5 font-display text-sm font-bold text-gold-foreground transition-opacity hover:opacity-90"
          >
            Now do it for your own kid
          </Link>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            {t("budget.disclaimer")}
          </p>
          <SourcesNote className="mt-3" />
        </div>
      </div>
    </section>
  );
}