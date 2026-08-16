import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { BudgetDashboard } from "@/components/budget-dashboard";
import {
  BudgetMovement,
  BudgetPerPupil,
  BudgetReserves,
  BudgetRevenue,
} from "@/components/budget-insights";

const TITLE = "District Dashboard — East Brunswick School Budget FY2027";
const DESCRIPTION =
  "Where East Brunswick's $209 million school budget goes in 2026-27, read line by line out of the district's adopted state filing.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://saqeeb.org/dashboard" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://saqeeb.org/dashboard" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <>
      <section className="border-b border-border py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary">District dashboard</p>
          <h1 className="mt-3 max-w-4xl text-4xl leading-[1.05] sm:text-6xl">
            Where the money goes
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            East Brunswick adopted a $209,216,947 general fund budget for 2026-27. Everything below
            comes out of the district's own state filing: what it spends, who pays for it, which
            lines are growing, and how much is left in reserve. The categories are grouped from
            individual appropriation lines and reconcile to the filing's own subtotals.
          </p>
        </div>
      </section>
      <BudgetDashboard />
      <BudgetRevenue />
      <BudgetMovement />
      <BudgetReserves />
      <BudgetPerPupil />

      <section className="border-t border-border py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="eyebrow text-primary">Transparency</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">
            A real dashboard should show more than spending
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Budget lines tell you where dollars went. They do not tell you what happened to the tax
            base underneath them. When a redevelopment site moves onto a payment in lieu of taxes,
            the improvements stop being taxed the ordinary way, and the school district's share of
            that value goes with them.
          </p>
          <Link
            to="/pilot"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-4 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Read the PILOT explainer
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
