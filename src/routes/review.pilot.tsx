import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, X } from "lucide-react";

import { ReviewNotes } from "@/components/review-notes";
import { CANDIDATE_NAME } from "@/lib/campaign";
import { getReviewPage } from "@/lib/review-gate.functions";

export const Route = createFileRoute("/review/pilot")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "PILOT explainer — review room" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ReviewPilot,
});

function ReviewPilot() {
  const fetchPage = useServerFn(getReviewPage);
  const query = useQuery({
    queryKey: ["review-page", "pilot"],
    queryFn: () => fetchPage({ data: { page: "pilot" } }),
  });

  if (query.isLoading) {
    return <p className="mx-auto max-w-4xl px-4 py-16 text-sm text-muted-foreground">Loading…</p>;
  }
  const data = query.data;
  if (!data || data.locked || !("pilot" in data) || !data.pilot) return null;
  const { pilot } = data;

  return (
    <>
      <section className="bg-primary py-12 text-primary-foreground sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="eyebrow text-primary-foreground/75">Research — not public</p>
          <h1 className="mt-3 text-4xl leading-[1.05] sm:text-6xl">
            What PILOT agreements mean for our schools
          </h1>
          {pilot.intro.map((para, i) => (
            <p
              key={para.slice(0, 40)}
              className={`mt-6 max-w-3xl leading-relaxed ${
                i === 0 ? "text-lg text-primary-foreground/90 sm:text-xl" : "text-primary-foreground/80"
              }`}
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      <section aria-labelledby="split-heading" className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="eyebrow text-primary">The split</p>
          <h2 id="split-heading" className="mt-3 text-3xl sm:text-4xl">
            How the revenue is divided
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            TAPinto reported these approximate figures from township officials in January 2026.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {pilot.split.map((group) => (
              <div key={group.id} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-xl">{group.title}</h3>
                <ul className="mt-6 flex flex-col gap-5">
                  {group.rows.map((row) => (
                    <li key={row.label}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-semibold">{row.label}</span>
                        <span className="font-display text-xl font-bold tabular-nums">{row.value}%</span>
                      </div>
                      <div aria-hidden="true" className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${row.value}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="explainer-heading" className="bg-secondary/50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 id="explainer-heading" className="text-3xl sm:text-4xl">
            How a PILOT works
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2">
            {pilot.steps.map((item) => (
              <li key={item.step} className="rounded-xl border border-border bg-card p-6">
                <p className="font-display text-3xl text-primary">{item.step}</p>
                <h3 className="mt-2 text-xl">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="record-heading" className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="eyebrow text-primary">The record</p>
          <h2 id="record-heading" className="mt-3 text-3xl sm:text-4xl">
            East Brunswick records
          </h2>
          <div className="mt-8 flex flex-col gap-6">
            {pilot.record.map((item) => (
              <article
                key={item.id}
                className={
                  item.dashed
                    ? "rounded-xl border border-dashed border-border p-6"
                    : "rounded-xl border border-border bg-card p-6"
                }
              >
                <h3 className="text-xl">{item.title}</h3>
                {item.quote ? (
                  <blockquote className="mt-3 border-l-4 border-primary pl-4 leading-relaxed">
                    {item.quote.lines.map((line) => (
                      <p key={line.slice(0, 30)} className="mt-3 first:mt-0">
                        &ldquo;{line}&rdquo;
                      </p>
                    ))}
                    <footer className="mt-3 text-sm text-muted-foreground">{item.quote.attribution}</footer>
                  </blockquote>
                ) : null}
                {item.body.map((para) => (
                  <p key={para.slice(0, 40)} className="mt-3 leading-relaxed text-muted-foreground">
                    {para}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="compare-heading" className="bg-secondary py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="compare-heading" className="text-center text-3xl sm:text-4xl">
            What each side emphasizes
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center leading-relaxed text-muted-foreground">
            Township officials focus on approved school funding and capital projects. Residents raise questions
            about operating revenue, enrollment, and public access to the agreements.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-card p-6 sm:p-8">
              <h3 className="flex items-center gap-2 text-2xl">
                <Check aria-hidden="true" className="size-6 text-primary" />
                What township officials say
              </h3>
              <ul className="mt-6 flex flex-col gap-4 text-foreground/90">
                {pilot.officials.map((line) => (
                  <li key={line.slice(0, 30)} className="flex gap-3">
                    <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-ink p-6 text-ink-foreground sm:p-8">
              <h3 className="flex items-center gap-2 text-2xl">
                <X aria-hidden="true" className="size-6 text-gold" />
                What residents see
              </h3>
              <ul className="mt-6 flex flex-col gap-4 text-ink-foreground/90">
                {pilot.residents.map((line) => (
                  <li key={line.slice(0, 30)} className="flex gap-3">
                    <X aria-hidden="true" className="mt-1 size-5 shrink-0 text-gold" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="authority-heading" className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="eyebrow text-primary">Board authority</p>
          <h2 id="authority-heading" className="mt-3 text-3xl sm:text-4xl">
            What {CANDIDATE_NAME} will do
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {pilot.actions.map((item, i) => (
              <li key={item.slice(0, 30)} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary font-display text-sm text-primary-foreground"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-lg leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="sources-heading" className="border-t border-border py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 id="sources-heading" className="text-2xl sm:text-3xl">
            Sources
          </h2>
          <ul className="mt-6 flex flex-col gap-3">
            {pilot.sources.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4"
                >
                  {source.label}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ReviewNotes draftKey="page:pilot" comments={data.comments} queryKey={["review-page", "pilot"]} />
    </>
  );
}