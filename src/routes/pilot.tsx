import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, X } from "lucide-react";

import { CANDIDATE_NAME } from "@/lib/campaign";

const TITLE = "PILOT Deals & East Brunswick School Funding — Saqeeb for BOE";
const DESCRIPTION =
  "What PILOT agreements mean for East Brunswick schools and taxpayers. Plain-language explainer with sources and what the Board of Education can do about it.";

export const Route = createFileRoute("/pilot")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://saqeeb.org/pilot" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://saqeeb.org/pilot" }],
  }),
  component: Pilot,
});

const SOURCES = [
  {
    label: "TAPinto East Brunswick PILOT coverage",
    href: "https://www.tapinto.net/towns/east-brunswick",
  },
  {
    label: "East Brunswick Township Redevelopment Agency meeting minutes",
    href: "https://www.eastbrunswick.org/government/redevelopment-agency",
  },
  {
    label: "East Brunswick Public Schools budget materials",
    href: "https://www.ebnet.org",
  },
];

function Pilot() {
  return (
    <>
      <section className="bg-primary py-14 text-primary-foreground sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="eyebrow text-primary-foreground/75">PILOT deals</p>
          <h1 className="mt-3 text-4xl leading-[1.05] sm:text-6xl">
            What PILOT agreements mean for our schools
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-primary-foreground/90 sm:text-xl">
            A payment in lieu of taxes, or PILOT, lets a developer pay the township a negotiated
            annual amount instead of ordinary property taxes on a redeveloped site. It is a normal
            and legal tool, and East Brunswick has used it. What is worth understanding is where
            that money lands, because a PILOT payment is not a property tax and so it is not split
            with the school district the way property taxes are. The Board of Education has the
            standing to ask, in public, what each agreement does to the tax base the schools
            depend on.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border-2 border-gold bg-gold px-5 py-2.5 font-display text-lg font-bold text-gold-foreground">
            <span>$1.2 million in reported PILOT revenue held in municipal reserve</span>
          </div>
        </div>
      </section>

      <section aria-labelledby="explainer-heading" className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 id="explainer-heading" className="text-3xl sm:text-4xl">
            How a PILOT works, in plain English
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              {
                step: "01",
                title: "A developer builds on township land",
                text: "Instead of paying normal property taxes on the full improved value, the developer negotiates a fixed annual payment with the township.",
              },
              {
                step: "02",
                title: "The township collects the payment",
                text: "The money goes to municipal accounts. Because it is not a normal property tax, it is not shared with the school district in the usual way.",
              },
              {
                step: "03",
                title: "Schools get only the land-value share",
                text: "The district keeps a small portion tied to the underlying land value. The bulk of the redevelopment value stays with the township.",
              },
              {
                step: "04",
                title: "New residents still enroll in our schools",
                text: "Apartments and homes bring more students, but the operating revenue to educate them does not grow proportionally.",
              },
            ].map((item) => (
              <li key={item.step} className="rounded-xl border border-border bg-card p-6">
                <p className="font-display text-3xl text-primary">{item.step}</p>
                <h3 className="mt-2 text-xl">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="compare-heading" className="bg-secondary py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="compare-heading" className="text-center text-3xl sm:text-4xl">
            Two ways to read the same deal
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center leading-relaxed text-muted-foreground">
            Both accounts below are accurate. They disagree about which facts matter most.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-card p-6 sm:p-8">
              <h3 className="flex items-center gap-2 text-2xl">
                <Check aria-hidden="true" className="size-6 text-primary" />
                What township officials say
              </h3>
              <ul className="mt-6 flex flex-col gap-4 text-foreground/90">
                <li className="flex gap-3">
                  <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
                  Schools receive their approved budget through the regular tax levy.
                </li>
                <li className="flex gap-3">
                  <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
                  PILOT money has funded school-related capital work, such as Warnsdorfer
                  improvements.
                </li>
                <li className="flex gap-3">
                  <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
                  PILOTs are a standard redevelopment tool used to attract investment.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-ink p-6 text-ink-foreground sm:p-8">
              <h3 className="flex items-center gap-2 text-2xl">
                <X aria-hidden="true" className="size-6 text-gold" />
                What residents see
              </h3>
              <ul className="mt-6 flex flex-col gap-4 text-ink-foreground/90">
                <li className="flex gap-3">
                  <X aria-hidden="true" className="mt-1 size-5 shrink-0 text-gold" />
                  Capital dollars cannot pay for teachers, aides, counselors, or daily programs.
                </li>
                <li className="flex gap-3">
                  <X aria-hidden="true" className="mt-1 size-5 shrink-0 text-gold" />
                  New development brings more students without matching operating revenue for the
                  district.
                </li>
                <li className="flex gap-3">
                  <X aria-hidden="true" className="mt-1 size-5 shrink-0 text-gold" />
                  Reported PILOT revenue has sat in municipal reserve while families face fees and
                  budget pressure.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="authority-heading" className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="eyebrow text-primary">Board authority</p>
          <h2 id="authority-heading" className="mt-3 text-3xl sm:text-4xl">
            What {CANDIDATE_NAME} will do
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {[
              "Use the board's public authority to demand the operating-revenue impact of every PILOT agreement before it is signed.",
              "Ask how each deal changes the township tax base — and therefore the share residents pay versus what new development contributes.",
              "Push for terms that protect residents from higher taxes and fees, and that invest in the schools that attract families and support future resident income.",
              "Publish plain-language summaries so taxpayers can see what each deal costs the district in real dollars.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary font-display text-sm text-primary-foreground"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-lg leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="sources-heading" className="border-t border-border py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 id="sources-heading" className="text-2xl sm:text-3xl">
            Sources
          </h2>
          <ul className="mt-6 flex flex-col gap-3">
            {SOURCES.map((source) => (
              <li key={source.label}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4"
                >
                  {source.label}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted-foreground">
            Every factual claim on this page is drawn from published reporting or public documents.
            If a source changes or a correction is needed, email{" "}
            <a href="mailto:ask@saqeeb.org" className="font-semibold text-primary underline">
              ask@saqeeb.org
            </a>
            .
          </p>
        </div>
      </section>

      <section className="bg-primary py-14 text-primary-foreground sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl sm:text-4xl">See where the money goes today</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-primary-foreground/90">
            The district's $229 million operating budget, explained without the accounting jargon.
          </p>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-gold px-6 py-4 font-semibold text-gold-foreground transition-opacity hover:opacity-90"
          >
            Open the district dashboard
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
