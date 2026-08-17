import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";

import {
  actblueUrl,
  COST_STUDY_NOTE,
  LEVER_LABELS,
  PRIORITIES,
  type LeverKind,
} from "@/lib/campaign";

const LEVER_TAG: Record<LeverKind, string> = {
  budget: "bg-gold text-gold-foreground",
  policy: "bg-primary text-primary-foreground",
  "state-rule": "border border-primary/40 bg-transparent text-primary",
  practice: "bg-secondary text-secondary-foreground",
};

const TITLE = "Our Platform for East Brunswick Schools";
const DESCRIPTION =
  "Our platform for East Brunswick schools: affordable schools, fair access for students, and lower costs through better facilities and public oversight.";

export const Route = createFileRoute("/priorities")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://saqeeb.org/priorities" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://saqeeb.org/priorities" }],
  }),
  component: Priorities,
});

function Priorities() {
  return (
    <>
      <header className="border-b border-border bg-primary py-12 text-primary-foreground sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary-foreground/70">Our platform</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-[1.05] sm:text-5xl">
            What we would do, and what it takes to do it
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-primary-foreground/90">
            Open any promise to see the lever behind it: the budget line it moves, the board policy
            that would have to change, or the state rule that limits what a district can do on its
            own. Where the answer is not public, the panel says so instead of guessing.
          </p>
        </div>
      </header>

      <nav
        aria-label="Priorities"
        className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur"
      >
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-3 sm:gap-2 sm:px-6">
          {PRIORITIES.map((p) => (
            <li key={p.id}>
              <Link
                to="/priorities"
                hash={p.id}
                className="flex items-baseline gap-2 whitespace-nowrap rounded-full px-3 py-2 font-display text-sm uppercase tracking-wide text-primary hover:bg-secondary sm:text-base"
              >
                <span className="text-xs text-muted-foreground">{p.number}</span>
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {PRIORITIES.map((p) => (
          <section
            key={p.id}
            id={p.id}
            aria-labelledby={`${p.id}-heading`}
            className="scroll-mt-20 py-14 sm:py-20"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <p className="font-display text-5xl leading-none text-gold sm:text-6xl">
                  {p.number}
                </p>
                <h2 id={`${p.id}-heading`} className="mt-3 text-3xl leading-tight sm:text-4xl">
                  {p.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">{p.summary}</p>
              </div>

              <ul className="flex flex-col gap-3">
                {p.points.map((point) => (
                  <li key={point.text.slice(0, 40)}>
                    {point.detail ? (
                      <details className="group rounded-xl border border-border bg-card open:border-primary/40 open:shadow-sm">
                        <summary className="flex cursor-pointer list-none flex-col gap-2 p-5 marker:hidden sm:flex-row sm:items-start sm:gap-4">
                          <span className="flex flex-1 items-start gap-3 text-lg leading-snug">
                            <Plus
                              aria-hidden="true"
                              className="mt-1 size-5 shrink-0 text-primary transition-transform group-open:rotate-45"
                            />
                            {point.text}
                          </span>
                          <span
                            className={`ml-8 w-fit shrink-0 rounded-full px-3 py-1 font-display text-xs uppercase tracking-wide sm:ml-0 sm:mt-1 ${LEVER_TAG[point.detail.leverKind]}`}
                          >
                            {LEVER_LABELS[point.detail.leverKind]}
                          </span>
                        </summary>
                        <div className="border-t border-border px-5 pb-6 pt-5 sm:px-6">
                          <p className="font-display text-sm font-bold uppercase tracking-wide text-primary">
                            {point.detail.lever}
                          </p>
                          {point.detail.mechanism.map((para) => (
                            <p key={para.slice(0, 32)} className="mt-3 text-base leading-relaxed">
                              {para}
                            </p>
                          ))}
                          <p className="mt-4 border-l-4 border-gold pl-4 text-base leading-relaxed text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              What nobody can answer yet:{" "}
                            </span>
                            {point.detail.openQuestion}
                          </p>
                          {point.detail.sources?.length ? (
                            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                              <span className="font-semibold text-foreground">Sources: </span>
                              {point.detail.sources.map((source, i) => (
                                <span key={source.href}>
                                  {i > 0 ? "; " : null}
                                  <a
                                    href={source.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-primary underline underline-offset-4 hover:opacity-80"
                                  >
                                    {source.label}
                                  </a>
                                </span>
                              ))}
                            </p>
                          ) : null}
                        </div>
                      </details>
                    ) : (
                      <p className="rounded-xl border border-dashed border-border px-5 py-4 text-lg leading-snug text-muted-foreground">
                        {point.text}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <section
        id="what-it-costs"
        aria-labelledby="cost-heading"
        className="scroll-mt-24 border-t border-border bg-secondary/50 py-14 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl border-l-4 border-gold pl-5 sm:pl-6">
            <h2 id="cost-heading" className="font-display text-xl uppercase leading-tight text-primary sm:text-2xl">
              Why there is no price tag on this page
            </h2>
            <p className="mt-4 text-base leading-relaxed">{COST_STUDY_NOTE}</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={actblueUrl("priorities", "cost-study")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-4 font-semibold text-gold-foreground transition-opacity hover:opacity-90"
              >
                Fund the study
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-md border-2 border-primary px-6 py-4 font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Check the figures on the dashboard
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
