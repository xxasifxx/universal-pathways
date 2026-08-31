import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Heart, Instagram, School, Users, HeartPulse } from "lucide-react";

import heroAsset from "@/assets/saqeeb-portrait-2026.jpg.asset.json";
import { AskQuestionForm } from "@/components/ask-question-form";
import { useVolunteerModal } from "@/components/volunteer-modal";
import {
  actblueUrl,
  ABOUT_SAQEEB,
  CANDIDATE_NAME,
  CONTACT_EMAIL,
  DONATION_AMOUNTS,
  FIGHT_FOR,
  PITCH,
  PLATFORM_HIGHLIGHTS,
  REGISTRATION_DEADLINE,
  SOCIAL_LINKS,
  WHY_SAQEEB,
} from "@/lib/campaign";

const TITLE = "A Voice for Excellence | Muhammad Saqeeb for East Brunswick BOE";
const DESCRIPTION =
  "Muhammad Saqeeb is running for the East Brunswick Board of Education, Column #1: public full-day Pre-K, a modern 9-12 high school, and better healthcare for school staff.";

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
            "East Brunswick Public Schools graduate running for the East Brunswick Board of Education, Column #1.",
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

const FIGHT_ICONS = {
  users: Users,
  school: School,
  "heart-pulse": HeartPulse,
} as const;

function Index() {
  const { open: openVolunteer } = useVolunteerModal();
  return (
    <>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <p className="font-display text-lg uppercase tracking-wide text-primary-foreground/80 sm:text-xl">
              {PITCH.eyebrow}
            </p>

            <h1 className="mt-3 text-[2.75rem] uppercase leading-[0.95] [text-wrap:balance] sm:text-6xl lg:text-7xl">
              {PITCH.headline}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border-2 border-gold bg-gold px-4 py-1.5 font-display text-lg font-bold tracking-wide text-gold-foreground sm:text-xl">
                {PITCH.badge}
              </span>
            </div>

            <div className="mt-8 h-1 w-28 bg-gold sm:w-36" />

            <p className="mt-6 font-display text-2xl uppercase leading-[1.05] sm:text-4xl lg:text-5xl">
              Putting Students First
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => openVolunteer({ source: "hero" })}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-6 py-4 font-semibold text-gold-foreground transition-opacity hover:opacity-90"
              >
                Volunteer
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
              <a
                href={actblueUrl("hero", "hero-donate")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-primary-foreground px-6 py-4 font-semibold transition-colors hover:bg-primary-foreground hover:text-primary"
              >
                Donate
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
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

          <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div aria-hidden="true" className="absolute -inset-4 -z-10 rounded-3xl bg-gold/10" />
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

      {/* Saqeeb will fight for */}
      <section aria-labelledby="fight-for-heading" className="bg-primary py-14 text-primary-foreground sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="fight-for-heading" className="text-center text-4xl uppercase leading-[1.05] sm:text-5xl">
            Saqeeb will fight for:
          </h2>
          <ul className="mt-12 grid gap-8 sm:grid-cols-3">
            {FIGHT_FOR.map((item) => {
              const Icon = FIGHT_ICONS[item.icon];
              return (
                <li
                  key={item.id}
                  className="flex flex-col items-center text-center"
                >
                  <span className="grid size-20 place-items-center rounded-full border-2 border-gold bg-gold text-gold-foreground sm:size-24">
                    <Icon aria-hidden="true" className="size-9 sm:size-11" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-bold uppercase leading-tight sm:text-3xl">
                    {item.label}
                  </h3>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Platform highlights */}
      <section aria-labelledby="platform-heading" className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary text-center">Three priorities</p>
          <h2 id="platform-heading" className="mt-3 text-center text-4xl uppercase sm:text-5xl">
            Our platform
          </h2>
          <ul className="mt-12 grid gap-6 sm:grid-cols-3">
            {PLATFORM_HIGHLIGHTS.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-border bg-card p-6 text-center sm:p-8"
              >
                <span className="mx-auto grid size-14 place-items-center rounded-full border-2 border-primary text-primary">
                  <Check aria-hidden="true" className="size-7" />
                </span>
                <h3 className="mt-6 text-2xl uppercase text-primary sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-foreground/90">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link
              to="/priorities"
              className="inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4"
            >
              See every promise under these three
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section aria-labelledby="about-heading" className="bg-secondary py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 id="about-heading" className="text-center text-3xl uppercase text-primary sm:text-4xl">
            About Saqeeb
          </h2>
          <div className="mt-6 space-y-3">
            {ABOUT_SAQEEB.map((line) => (
              <p key={line.slice(0, 24)} className="text-lg leading-relaxed text-foreground/90">
                {line}
              </p>
            ))}
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-center">
            {WHY_SAQEEB.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center">
            <Link
              to="/priorities"
              className="inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4"
            >
              More about why I'm running
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </p>
        </div>
      </section>

      <section id="ask" aria-labelledby="ask-heading" className="scroll-mt-20 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="eyebrow text-primary">Get in touch</p>
          <h2 id="ask-heading" className="mt-3 text-3xl sm:text-4xl">
            Ask Saqeeb a question
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-foreground/90">
            It goes straight to him at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            . He answers personally.
          </p>
          <div className="mt-7 rounded-xl border-t-4 border-gold bg-card p-5 text-left shadow-sm sm:p-7">
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
            Chip in to the campaign
          </h2>
          <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
            {DONATION_AMOUNTS.map((amount) => (
              <li key={amount}>
                <a
                  href={actblueUrl("home-donate", String(amount))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-[5.5rem] items-center justify-center rounded-full bg-primary-foreground px-6 py-3 text-lg font-bold text-primary transition-opacity hover:opacity-90"
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
                className="inline-flex min-w-[5.5rem] items-center justify-center rounded-full bg-primary-foreground px-6 py-3 text-lg font-bold text-primary transition-opacity hover:opacity-90"
              >
                Other
              </a>
            </li>
          </ul>
          <p className="mx-auto mt-8 max-w-xl text-lg">
            Contributions pay for yard signs, printing, and postage.
          </p>
        </div>
      </section>

      {/* Register to vote */}
      <section aria-labelledby="register-heading" className="bg-primary pb-16 sm:pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-2xl bg-ink p-8 text-center text-ink-foreground sm:p-12">
            <h2 id="register-heading" className="text-4xl uppercase leading-[1.05] sm:text-5xl">
              Register to vote by {REGISTRATION_DEADLINE}
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed">
              School board races here can be decided by a few hundred votes.
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
