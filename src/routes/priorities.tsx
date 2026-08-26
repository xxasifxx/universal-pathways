import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import {
  actblueUrl,
  CANDIDATE_STORY,
  COST_STUDY_NOTE,
  HELP_OPTIONS,
  PRIORITIES,
} from "@/lib/campaign";
import { useVolunteerModal } from "@/components/volunteer-modal";

const TITLE = "Priorities | Muhammad Saqeeb for East Brunswick Schools";
const DESCRIPTION =
  "What Muhammad Saqeeb wants the East Brunswick Board of Education to work on: affordability, fair access for students, and facilities decisions made in public.";

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
  const { open: openVolunteer } = useVolunteerModal();
  return (
    <>
      <header className="border-b border-border bg-primary py-12 text-primary-foreground sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary-foreground/70">Why I'm running</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-[1.05] sm:text-5xl">
            I went through these schools, and I want to fix what they got wrong about me
          </h1>
          <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-primary-foreground/90">
            {CANDIDATE_STORY.long.slice(0, 2).map((para) => (
              <p key={para.slice(0, 32)}>{para}</p>
            ))}
          </div>
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
            className="scroll-mt-20 border-b border-border py-12 last:border-b-0 sm:py-16"
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
                  <li
                    key={point.slice(0, 40)}
                    className="border-l-4 border-gold pl-5 text-lg leading-snug"
                  >
                    {point}
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
              Costs are still unknown
            </h2>
            <p className="mt-4 text-base leading-relaxed">{COST_STUDY_NOTE}</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => openVolunteer({ preset: [HELP_OPTIONS[3].label], source: "priorities-review" })}
                className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-4 font-semibold text-gold-foreground transition-opacity hover:opacity-90"
              >
                Review the draft
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
              <a
                href={actblueUrl("priorities", "cost-study")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border-2 border-primary px-6 py-4 font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Donate
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
