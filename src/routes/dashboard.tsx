import { createFileRoute } from "@tanstack/react-router";

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
    ],
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
            Families deserve clear, accessible information about how public money is spent. Here is
            the district budget in plain language.
          </p>
        </div>
      </section>
      <BudgetDashboard />
    </>
  );
}
