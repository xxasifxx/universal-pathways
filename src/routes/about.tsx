import { createFileRoute, Link } from "@tanstack/react-router";

import { JourneyTimeline } from "@/components/journey-timeline";
import { useI18n } from "@/lib/i18n";

const TITLE = "About Muhammad Saqeeb — East Brunswick BOE Candidate";
const DESCRIPTION =
  "I grew up in East Brunswick schools, then spent years reading the district's policies and budgets before deciding to run for the Board of Education.";

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
              Education shaped every stage of my life. My parents came to East Brunswick
              believing its public schools would create opportunities they never had, and they
              were right.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              At the same time, navigating the school system wasn&apos;t always
              straightforward. Understanding placement requirements, graduation pathways, and
              eligibility rules became part of my education, because those decisions
              determined which opportunities were available to me. Plenty of families are
              still doing that work on their own, and most of them are doing it with less
              information than the district already has on hand.
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
            Tap any step to read it. It&apos;s my own path, and most of it looks the same for
            families going through the district today.
          </p>
          <div className="mt-10 max-w-3xl">
            <JourneyTimeline />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl">Why I decided to run</h2>
          <div className="mt-6 flex max-w-3xl flex-col gap-5 text-base leading-relaxed text-muted-foreground">
            <p>
              When hate incidents began affecting students in our schools, paying attention was
              no longer enough. I got involved in the community because I believed every
              student deserves to feel safe, respected, and represented. That is not a
              controversial position. It just has to be somebody&apos;s job to keep saying it
              out loud at the table where decisions get made.
            </p>
            <p>
              Those conversations introduced me to parents, educators, and students whose
              experiences were different from my own but often led to the same conclusion: the
              people most affected by school policies don&apos;t always have the strongest
              voice in creating them. Teachers said it about staffing. Parents said it about
              placement. Students said it about being asked afterward instead of during.
            </p>
            <p>
              That is what ultimately led me to run for the Board of Education. This site is
              the same idea in a different form — the budget, the pathways, and the tradeoffs
              laid out in plain language, so the conversation doesn&apos;t require a decoder.
            </p>
          </div>
          <Link
            to="/priorities"
            className="mt-8 inline-flex rounded-md bg-gold px-6 py-3.5 font-display text-base font-bold text-gold-foreground transition-opacity hover:opacity-90"
          >
            See what I&apos;d change
          </Link>
        </div>
      </section>
    </>
  );
}