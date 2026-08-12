import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Heart, Instagram } from "lucide-react";

import heroAsset from "@/assets/saqeeb-campaign-hero.jpg.asset.json";
import { AskQuestionForm } from "@/components/ask-question-form";
import {
  actblueUrl,
  CANDIDATE_NAME,
  CONTACT_EMAIL,
  CREDENTIALS,
  DONATION_AMOUNTS,
  INTRO_LINE,
  PLATFORM_HIGHLIGHTS,
  REGISTRATION_DEADLINE,
  SOCIAL_LINKS,
} from "@/lib/campaign";

const TITLE = "Muhammad Saqeeb for East Brunswick Board of Education";
const DESCRIPTION =
  "Our campaign platform: affordable schools, fair access for students, and lower costs through better facilities and public oversight.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://saqeeb.org/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://saqeeb.org/" }],
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
  return (
    <>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <h1 className="text-[2.5rem] uppercase leading-[0.95] [text-wrap:balance] sm:text-6xl lg:text-7xl">
              <span className="block">Running for</span>
              <span className="block">East Brunswick Board of Education.</span>
            </h1>

            <div className="mt-8 h-1 w-28 bg-primary-foreground sm:w-36" />

            <p className="mt-6 font-display text-2xl uppercase leading-[1.05] sm:text-4xl lg:text-5xl">
              Fighting to put students first.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:max-w-md">
            <a
              href="#ask"
              className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-primary-foreground px-6 py-4 font-semibold transition-colors hover:bg-primary-foreground hover:text-primary"
            >
              Get Involved
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
            <Link
              to="/volunteer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-foreground px-6 py-4 font-semibold text-primary transition-opacity hover:opacity-90"
            >
              Request a Sign
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            </div>

          {SOCIAL_LINKS.some((s) => s.url) ? (
            <ul className="mt-8 flex flex-wrap gap-3">
              {SOCIAL_LINKS.filter((s) => s.url).map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-12 place-items-center rounded-full border border-primary-foreground/70 text-sm font-semibold transition-colors hover:bg-primary-foreground hover:text-primary"
                  >
                    {s.id === "instagram" ? (
                      <Instagram aria-hidden="true" className="size-5" />
                    ) : (
                      <span aria-hidden="true">{s.label.slice(0, 2)}</span>
                    )}
                    <span className="sr-only">{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          </div>

          <figure className="mx-auto w-full max-w-md lg:max-w-none">
            <img
              src={heroAsset.url}
              alt="Muhammad Saqeeb, candidate for the East Brunswick Board of Education"
              width={1600}
              height={1600}
              loading="eager"
              className="h-auto w-full rounded-xl object-contain"
            />
          </figure>
        </div>
      </section>

      {/* Intro + credentials */}
      <section aria-label="About the candidate" className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-center text-2xl font-bold leading-snug text-primary sm:text-3xl">
            {INTRO_LINE}
          </p>
          <ul className="mt-10 grid gap-5">
            {CREDENTIALS.map((item) => (
              <li
                key={item}
                className="rounded-xl border-l-8 border-primary bg-secondary px-6 py-8"
              >
                <span aria-hidden="true" className="block size-2.5 rounded-full bg-primary" />
                <p className="mt-6 text-xl font-bold leading-snug text-primary">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Platform highlights */}
      <section aria-labelledby="platform-heading" className="pb-14 sm:pb-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 id="platform-heading" className="text-4xl uppercase sm:text-5xl">
            OUR platform
          </h2>
          <ul className="mt-12 grid gap-12">
            {PLATFORM_HIGHLIGHTS.map((item, i) => (
              <li
                key={item.id}
                className={i > 0 ? "border-t border-border pt-12" : undefined}
              >
                <span className="mx-auto grid size-14 place-items-center rounded-full border-2 border-primary text-primary">
                  <Check aria-hidden="true" className="size-7" />
                </span>
                <h3 className="mt-6 text-4xl uppercase text-primary sm:text-6xl">
                  {item.title}
                </h3>
                <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-foreground/90">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
          <Link
            to="/priorities"
            className="mt-12 inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4"
          >
            See all of our promises
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>

      <section id="ask" aria-labelledby="ask-heading" className="scroll-mt-20 bg-secondary py-14 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 id="ask-heading" className="text-3xl sm:text-4xl">
            Ask Muhammad a question
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-foreground/90">
            It goes straight to him at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            . He answers personally.
          </p>
          <div className="mt-7 rounded-xl border border-border bg-background p-5 text-left sm:p-7">
            <AskQuestionForm />
          </div>
        </div>
      </section>

      {/* Donate */}
      <section aria-labelledby="donate-heading" className="bg-primary py-16 text-primary-foreground sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="mx-auto grid size-20 place-items-center rounded-full border-2 border-primary-foreground">
            <Heart aria-hidden="true" className="size-8" />
          </span>
          <h2 id="donate-heading" className="mt-8 text-4xl uppercase leading-[1.05] sm:text-5xl">
            Donate to our grassroots campaign!
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {DONATION_AMOUNTS.map((amount) => (
              <li key={amount}>
                <a
                  href={actblueUrl("home-donate", String(amount))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-full bg-primary-foreground px-6 py-4 text-lg font-bold text-primary transition-opacity hover:opacity-90"
                >
                  ${amount}
                </a>
              </li>
            ))}
            <li>
              <a
                href={actblueUrl("home-donate", "other")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-full bg-primary-foreground px-6 py-4 text-lg font-bold text-primary transition-opacity hover:opacity-90"
              >
                Other Amount
              </a>
            </li>
          </ul>
          <p className="mx-auto mt-8 max-w-xl text-lg">
            Every contribution helps us build a stronger future for East Brunswick schools.
          </p>
        </div>
      </section>

      {/* Register to vote */}
      <section aria-labelledby="register-heading" className="bg-primary pb-16 sm:pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-2xl bg-ink p-8 text-center text-ink-foreground sm:p-12">
            <h2 id="register-heading" className="text-4xl uppercase leading-[1.05] sm:text-5xl">
              Register to vote by {REGISTRATION_DEADLINE}!
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed">
              Every voice matters. Make yours heard and help shape the future of our schools.
            </p>
            <a
              href="https://www.nj.gov/state/elections/voter-registration.shtml"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-gold px-6 py-4 font-semibold text-gold-foreground transition-opacity hover:opacity-90"
            >
              Register Now
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
