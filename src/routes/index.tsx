import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import heroAsset from "@/assets/saqeeb-portrait.jpg.asset.json";
import { AskQuestionForm } from "@/components/ask-question-form";
import {
  CANDIDATE_NAME,
  CONTACT_EMAIL,
  SOCIAL_LINKS,
  WHY_SAQEEB,
} from "@/lib/campaign";
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
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <figure className="order-1 lg:order-none">
            <img
              src={heroAsset.url}
              alt="Muhammad Saqeeb, candidate for the East Brunswick Board of Education"
              width={1213}
              height={1140}
              className="w-full rounded-xl border-4 border-ink object-cover shadow-lg"
            />
          </figure>

          <div className="order-2 lg:order-none">
            <p className="eyebrow inline-block rounded-full bg-secondary px-3 py-1.5 text-accent-foreground">
              {t("home.hero.badge")}
            </p>
            <h1 className="mt-5 text-4xl leading-[1.05] sm:text-5xl">
              Hi, I&apos;m Muhammad Saqeeb.
              <span className="block text-primary">
                Here&apos;s why I&apos;m running.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/90">
              {t("home.hero.sub")}
            </p>
            <ul className="mt-6 grid gap-2.5">
              {WHY_SAQEEB.map((reason) => (
                <li key={reason} className="flex gap-2.5 text-base leading-relaxed">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#ask"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3.5 font-display text-base font-bold text-gold-foreground transition-opacity hover:opacity-90"
              >
                Ask me a question
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
              <Link
                to="/volunteer"
                className="inline-flex items-center rounded-md border-2 border-ink px-6 py-3.5 font-display text-base font-bold text-ink transition-colors hover:bg-ink hover:text-ink-foreground"
              >
                {t("home.hero.cta.secondary")}
              </Link>
            </div>
            {SOCIAL_LINKS.some((s) => s.url) ? (
              <div className="mt-8">
                <p className="eyebrow text-muted-foreground">{t("home.hero.social")}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SOCIAL_LINKS.filter((s) => s.url).map((s) => (
                    <a
                      key={s.id}
                      href={s.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border-2 border-ink px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-ink-foreground"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section id="ask" aria-labelledby="ask-heading" className="scroll-mt-20 bg-secondary py-14 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 id="ask-heading" className="text-3xl sm:text-4xl">
            Ask Muhammad a question
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground/90">
            It goes straight to him at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            . He answers personally.
          </p>
          <div className="mt-7 rounded-xl border border-border bg-background p-5 sm:p-7">
            <AskQuestionForm />
          </div>
        </div>
      </section>

      <section aria-label="More" className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 sm:px-6">
          <Link to="/priorities" className="font-display text-lg tracking-wide text-primary underline underline-offset-4">
            Priorities
          </Link>
          <Link to="/dashboard" className="font-display text-lg tracking-wide text-primary underline underline-offset-4">
            District dashboard
          </Link>
          <Link to="/volunteer" className="font-display text-lg tracking-wide text-primary underline underline-offset-4">
            Volunteer
          </Link>
          {SOCIAL_LINKS.filter((s) => s.url).map((s) => (
            <a
              key={s.id}
              href={s.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-lg tracking-wide text-primary underline underline-offset-4"
            >
              {s.label}
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
