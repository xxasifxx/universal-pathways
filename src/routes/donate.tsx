import { createFileRoute } from "@tanstack/react-router";

import { ACTBLUE_DONATION_URL, CONTACT_EMAIL, DONATION } from "@/lib/campaign";

const TITLE = "Donate to Saqeeb for East Brunswick BOE";
const DESCRIPTION =
  "Support Muhammad Saqeeb's campaign for the East Brunswick Board of Education through the secure ActBlue contribution page.";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Donate,
});

function Donate() {
  return (
    <section className="border-b border-border py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="eyebrow text-primary">Support the campaign</p>
        <h1 className="mt-3 max-w-2xl text-4xl leading-[1.05] sm:text-6xl">
          Help build a stronger future for East Brunswick schools.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Contributions support this grassroots campaign for the East Brunswick Board of Education.
          Secure contributions are handled through ActBlue.
        </p>

        <a
          href={ACTBLUE_DONATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 font-display text-lg tracking-wide text-gold-foreground transition-opacity hover:opacity-90"
        >
          Give through ActBlue
        </a>

        <div className="mt-14 border-t border-border pt-8">
          <h2 className="font-display text-2xl font-extrabold">The rules, plainly</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>Maximum ${DONATION.maxIndividual.toLocaleString()} per person, per election.</li>
            <li>No corporate or union money, and nothing from another person&apos;s funds.</li>
            <li>
              Give more than ${DONATION.reportingThreshold} and your name, address, occupation and
              employer appear on the campaign&apos;s public ELEC report.
            </li>
            <li>Contributions are not tax deductible.</li>
          </ul>
          <p className="mt-5 text-sm text-muted-foreground">
            Questions about giving?{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
