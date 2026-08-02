import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { BudgetScenarioLab } from "@/components/budget-scenario-lab";
import { PerChildCalculator } from "@/components/per-child-calculator";
import { SourcesNote } from "@/components/sources-note";
import { BUDGET_TOTAL_DISPLAY, STUDENT_COUNT, type ChildInput } from "@/lib/cost-model";
import { BUDGET_YEAR } from "@/lib/sources";

const TITLE = "What does the district spend on my kid? — Saqeeb for East Brunswick";
const DESCRIPTION =
  "Work out what East Brunswick spends on one student, then move the budget lines a board proposal would move and see what it does to your child and your tax bill.";

export const Route = createFileRoute("/cost-calculator")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CostCalculator,
});

function CostCalculator() {
  const [child, setChild] = useState<ChildInput>({ level: "middle", services: [] });

  return (
    <>
      <section className="border-b border-border py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary">Your kid, your money</p>
          <h1 className="mt-3 max-w-4xl text-4xl leading-[1.05] sm:text-6xl">
            What does the district spend on my kid?
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {BUDGET_TOTAL_DISPLAY} divided by {STUDENT_COUNT.toLocaleString()} students is a number
            nobody can use. This turns it into the one you can: what gets spent on a student like
            yours, and what a proposal on the agenda tonight would do to it.
          </p>
          <p className="mt-4 max-w-2xl rounded-lg border border-border bg-card/60 p-4 text-sm leading-relaxed text-muted-foreground">
            Everything here is modeled from the district&apos;s adopted {BUDGET_YEAR} operating
            budget, not from district per-pupil data. Only the district has that, which is exactly
            why I want them publishing this instead of me.{" "}
            <Link to="/priorities" hash="cost-dashboard" className="font-semibold text-primary underline">
              That&apos;s the promise
            </Link>
            .
          </p>
          <SourcesNote className="mt-4 max-w-2xl" />
        </div>
      </section>

      <section aria-labelledby="parent-mode" className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary">Step one</p>
          <h2 id="parent-mode" className="mt-3 text-3xl sm:text-5xl">
            Set up your student
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Nothing you enter is stored or sent anywhere. No name, no school, no account. The math
            runs in your browser and disappears when you close the tab.
          </p>
          <div className="mt-10">
            <PerChildCalculator child={child} onChange={setChild} />
          </div>
        </div>
      </section>

      <section aria-labelledby="board-mode" className="bg-secondary/50 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary">Step two</p>
          <h2 id="board-mode" className="mt-3 text-3xl sm:text-5xl">
            Board meeting mode
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Built to be used on a phone from the back row while someone at the microphone says the
            cut is modest. Load what they proposed, or drag the lines yourself, and watch both
            halves at once: the dollars, and what the dollars do to a classroom.
          </p>
          <div className="mt-10">
            <BudgetScenarioLab child={child} />
          </div>
          <SourcesNote className="mt-8 max-w-2xl" />
        </div>
      </section>
    </>
  );
}