import { createFileRoute, Link } from "@tanstack/react-router";

import {
  CANDIDATE_STATEMENT,
  PRIORITIES,
  PRIORITIES_INTRO,
  PRIORITIES_TITLE,
} from "@/lib/campaign";

const TITLE = "Priorities | Muhammad Saqeeb for East Brunswick Schools";
const DESCRIPTION =
  "Muhammad Saqeeb's sourced five-year plan for better East Brunswick schools at lower cost.";

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
          <p className="eyebrow text-primary-foreground/70">Muhammad Saqeeb</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-[1.05] sm:text-5xl">Why I'm running</h1>
          <div className="mt-8 max-w-3xl space-y-7 font-sans text-lg leading-8 text-primary-foreground/90 sm:text-xl sm:leading-9">
            {CANDIDATE_STATEMENT.map((para, index) => {
              const emphasized = index === 2 || index === 6 || index === 8 || index === 14;
              return (
                <p
                  key={para.slice(0, 32)}
                  className={
                    emphasized
                      ? "max-w-2xl border-l-4 border-gold pl-5 font-display text-3xl leading-tight text-primary-foreground sm:text-4xl"
                      : "max-w-[68ch]"
                  }
                >
                  {para}
                </p>
              );
            })}
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-secondary py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-muted-foreground">Our platform</p>
          <h2 className="mt-3 max-w-4xl text-4xl leading-tight sm:text-5xl">{PRIORITIES_TITLE}</h2>
          <p className="mt-5 max-w-3xl font-sans text-lg italic leading-8 text-foreground/80">
            {PRIORITIES_INTRO}
          </p>
        </div>
      </section>

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
              </div>

              <div className="max-w-3xl space-y-7 font-sans text-lg leading-8">
                {p.sections.map((section) => (
                  <div key={section.label} className="grid gap-1 sm:grid-cols-[5rem_1fr] sm:gap-5">
                    <h3 className="font-display text-xl text-primary sm:text-2xl">{section.label}</h3>
                    <p>{section.text}</p>
                  </div>
                ))}
                <div className="border-t border-border pt-5">
                  <h3 className="font-display text-xl text-primary">Sources</h3>
                  <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-base">
                    {p.sources.map((source) => (
                      <li key={`${source.label}-${source.href}`}>
                        <a
                          href={source.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
                        >
                          {source.label}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

    </>
  );
}
