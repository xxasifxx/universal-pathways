import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import heroAsset from "@/assets/saqeeb-portrait.jpg.asset.json";
import { CANDIDATE_NAME, DISTRICT_STATS, PRIORITIES } from "@/lib/campaign";
import { useI18n } from "@/lib/i18n";

const TITLE = "Muhammad Saqeeb for East Brunswick Board of Education";
const DESCRIPTION =
  "A student-first campaign for East Brunswick schools: student voice, mental health and special education, safe and inclusive schools, and transparent leadership.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: CANDIDATE_NAME,
          jobTitle: "Candidate, East Brunswick Board of Education",
          description:
            "East Brunswick Public Schools graduate and community advocate running for the East Brunswick Board of Education.",
          homeLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: "East Brunswick",
              addressRegion: "NJ",
              addressCountry: "US",
            },
          },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-center lg:gap-14">
          <div>
            <p className="eyebrow inline-block rounded-full bg-secondary px-3 py-1.5 text-accent-foreground">
              {t("home.hero.badge")}
            </p>
            <h1 className="mt-5 text-4xl leading-[1.05] sm:text-6xl">
              Students first.
              <span className="block text-primary">Every decision.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t("home.hero.sub")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/priorities"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3.5 font-display text-base font-bold text-gold-foreground transition-opacity hover:opacity-90"
              >
                {t("home.hero.cta.primary")}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                to="/volunteer"
                className="inline-flex items-center rounded-md border-2 border-ink px-6 py-3.5 font-display text-base font-bold text-ink transition-colors hover:bg-ink hover:text-ink-foreground"
              >
                {t("home.hero.cta.secondary")}
              </Link>
            </div>
          </div>

          <figure className="relative">
            <img
              src={heroAsset.url}
              alt="Muhammad Saqeeb, candidate for the East Brunswick Board of Education"
              width={1213}
              height={1140}
              className="w-full rounded-xl border-4 border-ink object-cover shadow-lg"
            />
            <figcaption className="mt-3 text-xs text-muted-foreground">
              Muhammad Saqeeb, East Brunswick Public Schools graduate and candidate for the Board of
              Education.
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-label="District at a glance" className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {DISTRICT_STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl font-black sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-ink-foreground/85">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="priorities-heading" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary">{t("priorities.eyebrow")}</p>
          <h2 id="priorities-heading" className="mt-3 text-3xl sm:text-5xl">
            {t("priorities.title")}
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {PRIORITIES.map((p) => (
              <Link
                key={p.id}
                to="/priorities"
                hash={p.id}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary"
              >
                <span className="flex items-center gap-2 font-display text-sm font-black text-primary">
                  <Check aria-hidden="true" className="size-4" />
                  {p.number}
                </span>
                <h3 className="mt-2 font-display text-xl font-extrabold sm:text-2xl">{p.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">{p.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  Read more about {p.title}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
