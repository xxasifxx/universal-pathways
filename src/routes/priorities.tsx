import { createFileRoute, Link } from "@tanstack/react-router";

import { CANDIDATE_STATEMENT, PRIORITIES } from "@/lib/campaign";

const TITLE = "Priorities | Muhammad Saqeeb for East Brunswick Schools";
const DESCRIPTION =
  "Muhammad Saqeeb's six priorities for East Brunswick schools: full-day Pre-K, the 9–12 high school capital project, no activity fees, healthcare for students and staff, special education, and responsible AI.";

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
          <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-primary-foreground/90">
            {CANDIDATE_STATEMENT.map((para) => (
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

              <div className="max-w-2xl space-y-4 text-lg leading-relaxed">
                {p.paragraphs.map((para) => (
                  <p key={para.slice(0, 32)}>{para}</p>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

    </>
  );
}
