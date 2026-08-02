import { createFileRoute, Link } from "@tanstack/react-router";

import { BUDGET_SLICES, BUDGET_TOTAL } from "@/lib/campaign";
import { ASSUMPTIONS, BUDGET_YEAR, SOURCES } from "@/lib/sources";

const TITLE = "Where these numbers come from — Saqeeb for East Brunswick";
const DESCRIPTION =
  "Every figure on this site, its source, and the assumptions layered on top: the East Brunswick 2024–2025 adopted operating budget, state finance filings, and modeled per-student math.";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Methodology,
});

function Methodology() {
  return (
    <>
      <section className="border-b border-border py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="eyebrow text-primary">Sources and assumptions</p>
          <h1 className="mt-3 text-4xl leading-[1.05] sm:text-5xl">
            Where these numbers come from
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Every dollar figure on this site traces back to the East Brunswick Public Schools{" "}
            {BUDGET_YEAR} adopted operating budget. It is aggregate public data. It is not district
            per-student data, it was not produced by district staff, and none of it is an official
            district publication. What I&apos;m showing is what a board can direct the
            superintendent and the business office to publish properly.
          </p>
        </div>
      </section>

      <section aria-labelledby="sources" className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 id="sources" className="text-3xl sm:text-4xl">
            Sources
          </h2>
          <ul className="mt-8 flex flex-col gap-6">
            {SOURCES.map((s) => (
              <li key={s.id} className="rounded-lg border border-border bg-card/60 p-5">
                <p className="font-display text-base font-bold">{s.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-sm font-semibold text-primary underline"
                  >
                    {s.href.replace("https://", "")}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="breakdown" className="bg-secondary/50 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 id="breakdown" className="text-3xl sm:text-4xl">
            The budget lines as I&apos;ve grouped them
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The district reports dozens of account lines. I&apos;ve grouped them into six categories
            so they fit in one chart. Grouping is a choice, so here it is in the open, summing to{" "}
            {usd.format(BUDGET_TOTAL)}.
          </p>
          <table className="mt-8 w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              Budget categories used on this site and the amount assigned to each
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2.5 pr-4 font-display font-bold">
                  Reported as
                </th>
                <th scope="col" className="py-2.5 text-right font-display font-bold">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {BUDGET_SLICES.map((s) => (
                <tr key={s.id} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4">
                    <span className="font-semibold">{s.jargon}</span>
                    <span className="block text-muted-foreground">{s.plain}</span>
                  </td>
                  <td className="py-3 text-right font-semibold tabular-nums">
                    {usd.format(s.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="assumptions" className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 id="assumptions" className="text-3xl sm:text-4xl">
            Assumptions, and why I made them
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The calculator has to turn a district-wide total into a figure for one student. That
            takes assumptions. Here is every one of them.
          </p>
          <dl className="mt-8 flex flex-col gap-6">
            {ASSUMPTIONS.map((a) => (
              <div key={a.id} className="rounded-lg border border-border bg-card/60 p-5">
                <dt className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="font-display text-base font-bold">{a.label}</span>
                  <span className="font-semibold tabular-nums text-primary">{a.value}</span>
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.why}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 rounded-lg border border-border bg-card p-5">
            <p className="font-display text-base font-bold">If you find a number that&apos;s wrong</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Tell me and I&apos;ll fix it, publicly, with the correction noted.{" "}
              <Link to="/contact" className="font-semibold text-primary underline">
                Send it here
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}