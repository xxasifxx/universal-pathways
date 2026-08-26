import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight } from "lucide-react";

import { BudgetDashboard } from "@/components/budget-dashboard";
import { BudgetMovement, BudgetPerPupil, BudgetReserves, BudgetRevenue } from "@/components/budget-insights";
import { ReviewNotes } from "@/components/review-notes";
import { getReviewPage } from "@/lib/review-gate.functions";

export const Route = createFileRoute("/review/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "District budget — review room" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ReviewDashboard,
});

function ReviewDashboard() {
  const fetchPage = useServerFn(getReviewPage);
  const query = useQuery({
    queryKey: ["review-page", "budget"],
    queryFn: () => fetchPage({ data: { page: "budget" } }),
  });

  if (query.isLoading) {
    return <p className="mx-auto max-w-5xl px-4 py-16 text-sm text-muted-foreground">Loading…</p>;
  }
  const data = query.data;
  if (!data || data.locked || !("budget" in data) || !data.budget) return null;
  const budget = data.budget;

  return (
    <>
      <section className="border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary">Research — not public</p>
          <h1 className="mt-3 max-w-4xl text-4xl leading-[1.05] sm:text-6xl">Where the money goes</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            East Brunswick adopted a $209,216,947 general fund budget for {budget.fy}. The figures below come
            from the district's state filing. Individual appropriation lines were grouped into categories that
            match the filing's subtotals.
          </p>
          <Link
            to="/review/pilot"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4"
          >
            Read the PILOT explainer
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>
      <BudgetDashboard budget={budget} />
      <BudgetRevenue budget={budget} />
      <BudgetMovement budget={budget} />
      <BudgetReserves budget={budget} />
      <BudgetPerPupil budget={budget} />
      <ReviewNotes
        draftKey="page:budget"
        comments={data.comments}
        queryKey={["review-page", "budget"]}
      />
    </>
  );
}