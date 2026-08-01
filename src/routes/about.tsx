import { createFileRoute, Link } from "@tanstack/react-router";

import { JourneyTimeline } from "@/components/journey-timeline";
import { useI18n } from "@/lib/i18n";

const TITLE = "About Muhammad Saqeeb — East Brunswick BOE Candidate";
const DESCRIPTION =
  "I went through East Brunswick Special Education as a kid. I'm a data scientist now, and I'm running for the school board.";

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
              I grew up here, in a working-class immigrant family, and I went through East
              Brunswick Public Schools as a Special Education student. That last part is why
              I'm running.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              I wasn't placed there because I couldn't do the work. I was an angry kid, and it
              was easier to file that than to sit with it. Then the file stayed, and for about
              six years it made my decisions for me. I got out sideways, through independent
              study and eventually graduate work in data science and psychology. Most kids in
              that spot never find the side door, and I don't think that's anyone's fault so
              much as it's how the thing is built.
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
            Tap any step to read it. It&apos;s my path, but the route hasn&apos;t changed much
            since I walked it.
          </p>
          <div className="mt-10 max-w-3xl">
            <JourneyTimeline />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl">This isn&apos;t a campaign against teachers</h2>
          <div className="mt-6 flex max-w-3xl flex-col gap-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Nothing that happened to me was a teacher&apos;s fault. My case manager at
              Churchill had more students than she could keep straight and no aide in most of
              the rooms she covered. She was handed a sorting system and told to make it work,
              and she did the best anyone could have with it.
            </p>
            <p>
              When a district runs behavioral needs and academic needs through the same program
              because it&apos;s cheaper to administer, both groups end up with something thinner
              than what they came for. Then the staff hear about the results at the next board
              meeting.
            </p>
            <p>
              I want to spend a term giving educators the capacity they&apos;ve been asking for
              at public comment since before I graduated, and giving students the say I never
              got.
            </p>
          </div>
          <Link
            to="/priorities"
            className="mt-8 inline-flex rounded-md bg-primary px-6 py-3.5 font-display text-base font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            See what I&apos;d change
          </Link>
        </div>
      </section>
    </>
  );
}