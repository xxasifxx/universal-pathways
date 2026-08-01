import { createFileRoute, Link } from "@tanstack/react-router";

import { JourneyTimeline } from "@/components/journey-timeline";
import { useI18n } from "@/lib/i18n";

const TITLE = "About Muhammad Saqeeb — From Friction to Systemic Insight";
const DESCRIPTION =
  "A Special Education alumnus of East Brunswick schools, now a data scientist, running to dismantle administrative gatekeeping.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useI18n();

  return (
    <>
      <section className="border-b border-border py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary">About the candidate</p>
          <h1 className="mt-3 max-w-4xl text-4xl leading-[1.05] sm:text-6xl">
            {t("about.title")}
          </h1>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <p className="text-lg leading-relaxed">
              I am a working-class immigrant, a data scientist, a community organizer, and a
              former East Brunswick Public Schools Special Education student. That last one is
              the reason I am running.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              I was not placed in Special Education because I could not do the work. I was placed
              there because I was an angry kid, and behavioral friction was easier to file than to
              understand. Once the file existed, it made decisions for me for years. I got out
              through independent study and, eventually, graduate work in data science and
              psychology. Most kids in that position do not get a second door. That is a design
              problem, and design problems are fixable.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="timeline-heading" className="bg-secondary/50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary">{t("about.timeline.eyebrow")}</p>
          <h2 id="timeline-heading" className="mt-3 text-3xl sm:text-4xl">
            {t("about.timeline.title")}
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Tap any step to read it. This is one student&apos;s path — and it is the same path
            the district still runs kids through today.
          </p>
          <div className="mt-10 max-w-3xl">
            <JourneyTimeline />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl">This is not a campaign against teachers</h2>
          <div className="mt-6 flex max-w-3xl flex-col gap-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Let me be direct about the thing political campaigns usually blur. Nothing that
              happened to me was a teacher&apos;s fault. The teachers in that building were
              managing impossible caseloads with too few aides and no structural way to give
              individual kids individual plans. They were handed a sorting system and asked to
              make it work.
            </p>
            <p>
              Failures at the top come from insufficient solutions, not insufficient effort at the
              bottom. When a district bundles behavioral needs and academic needs into one program
              because it is administratively cheaper, both groups get a worse version of what they
              needed — and the staff get blamed for the outcome.
            </p>
            <p>
              I survived that system from the inside. I want to use what I learned to build the
              bridge: clinical, evidence-based policy that gives educators the capacity they have
              been asking for and gives students the agency they were never offered.
            </p>
          </div>
          <Link
            to="/priorities"
            className="mt-8 inline-flex rounded-md bg-primary px-6 py-3.5 font-display text-base font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            See the solutions
          </Link>
        </div>
      </section>
    </>
  );
}