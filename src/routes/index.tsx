import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

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
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-16">
          <figure className="w-full max-w-sm">
            <img
              src={heroAsset.url}
              alt="Muhammad Saqeeb, candidate for the East Brunswick Board of Education"
              width={1213}
              height={1140}
              className="w-full rounded-xl border-4 border-ink object-cover shadow-lg"
            />
          </figure>

          <h1 className="mt-8 text-4xl leading-[1.05] sm:text-5xl">
            {t("home.hero.headline")}
            <span className="block text-primary">{t("home.hero.sub")}</span>
          </h1>

          <ul className="mt-7 grid gap-2.5">
            {WHY_SAQEEB.map((snippet) => (
              <li key={snippet} className="text-base leading-relaxed text-foreground/90">
                {snippet}
              </li>
            ))}
          </ul>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-7 font-semibold text-primary underline underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>

          <a
            href="#ask"
            className="mt-7 inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3.5 font-display text-base font-bold text-gold-foreground transition-opacity hover:opacity-90"
          >
            Ask me a question
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
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
