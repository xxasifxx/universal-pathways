import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { BudgetDashboard } from "@/components/budget-dashboard";

const TITLE = "District Dashboard — East Brunswick School Budget";
const DESCRIPTION =
  "Where East Brunswick's $229 million school budget goes, with the accounting language switched off.";

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
            Families deserve clear, accessible information about how our schools spend public
            money. Here is the district budget in plain language.
          </p>
        </div>
      </section>
      <BudgetDashboard />

      <section className="border-t border-border py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="eyebrow text-primary">Transparency</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">
            A real dashboard should show more than spending
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Budget lines tell you where dollars went. They do not tell you what deals changed the
            tax base, what new development costs the district in students, or whether PILOT
            agreements are helping residents or leaving them to foot the bill.
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
