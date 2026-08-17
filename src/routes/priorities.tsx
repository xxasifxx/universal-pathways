import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight } from "lucide-react";

import { actblueUrl, COST_STUDY_NOTE, PITCH, PRIORITIES } from "@/lib/campaign";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();

  return (
    <>
      <section className="bg-primary py-14 text-primary-foreground sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="font-display text-lg uppercase tracking-wide text-primary-foreground/80 sm:text-xl">
            {PITCH.eyebrow}
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl leading-[1.05] sm:text-6xl">
            {PITCH.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-primary-foreground/90">
            {PITCH.problem}
          </p>
          <p className="mt-5 max-w-2xl text-xl font-bold leading-snug text-primary-foreground sm:text-2xl">
            {PITCH.ask}
          </p>
        </div>
      </section>

      <nav aria-label="Priorities" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="eyebrow text-primary">{t("priorities.eyebrow")}</p>
          <ul className="mt-4 flex flex-col">
            {PRIORITIES.map((p) => (
              <li key={p.id} className="border-t border-border">
                <Link
                  to="/priorities"
                  hash={p.id}
                  className="flex items-baseline gap-3 py-3 font-display text-base font-extrabold uppercase tracking-wide text-primary hover:underline sm:text-lg"
                >
                  <span className="text-sm">{p.number}</span>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {PRIORITIES.map((p) => (
          <section
            key={p.id}
            id={p.id}
            aria-labelledby={`${p.id}-heading`}
            className="scroll-mt-24 border-b border-border py-12 last:border-b-0 sm:py-16"
          >
            <p className="eyebrow text-primary">Priority {p.number}</p>
            <div className="mt-3 flex items-start gap-4">
              <span
                aria-hidden="true"
                className="mt-1 grid size-10 shrink-0 place-items-center rounded-full border-2 border-primary text-primary"
              >
                <Check className="size-5" />
              </span>
              <h2 id={`${p.id}-heading`} className="text-3xl sm:text-4xl">
                {p.title}
              </h2>
            </div>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed">{p.summary}</p>
            <ul className="mt-6 flex max-w-3xl flex-col divide-y divide-border border-y border-border">
              {p.points.map((point) => (
                <li key={point.text.slice(0, 40)}>
                  {point.detail ? (
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-start gap-3 py-4 text-base leading-relaxed marker:hidden hover:text-primary">
                        <ChevronRight
                          aria-hidden="true"
                          className="mt-1 size-5 shrink-0 text-primary transition-transform group-open:rotate-90"
                        />
                        <span className="flex-1">{point.text}</span>
                        <span className="mt-0.5 hidden shrink-0 font-display text-xs uppercase tracking-wide text-muted-foreground sm:inline">
                          What this touches
                        </span>
                      </summary>
                      <div className="pb-6 pl-8 pr-1">
                        <p className="font-display text-sm font-bold uppercase tracking-wide text-primary">
                          {point.detail.budgetLine}
                        </p>
                        {point.detail.mechanism.map((para) => (
                          <p key={para.slice(0, 32)} className="mt-3 text-base leading-relaxed">
                            {para}
                          </p>
                        ))}
                        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            What nobody can answer yet:{" "}
                          </span>
                          {point.detail.openQuestion}
                        </p>
                        {point.detail.sources?.length ? (
                          <p className="mt-3 text-sm text-muted-foreground">
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
                    <p className="flex items-start gap-3 py-4 text-base leading-relaxed text-muted-foreground">
                      <span aria-hidden="true" className="mt-1 size-5 shrink-0" />
                      <span className="flex-1">{point.text}</span>
                    </p>
                  )}
                </li>
              ))}
            </ul>
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
