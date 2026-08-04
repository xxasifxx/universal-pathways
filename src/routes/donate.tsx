import { createFileRoute } from "@tanstack/react-router";

import { DonateForm } from "@/components/donate-form";
import { GivebutterEmbed } from "@/components/givebutter-embed";
import { CONTACT_EMAIL, DONATION, GIVEBUTTER_CAMPAIGN } from "@/lib/campaign";

const TITLE = "Donate to Saqeeb for East Brunswick BOE";
const DESCRIPTION =
  "Chip in to the campaign — give by card, or send a zero-fee bank transfer or check straight to the campaign account.";

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
    <>
      <section className="border-b border-border py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary">Chip in</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-[1.05] sm:text-6xl">
            Every dollar goes straight to the campaign.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            This is a school board race, not a national one. Signs, mailers and door hangers are
            most of the budget. Contributions go directly into the campaign bank account — no
            fundraising platform skimming a percentage off the top.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-start">
          <div className="order-2 lg:order-1">
            {GIVEBUTTER_CAMPAIGN ? (
              <div className="mb-10">
                <h2 className="font-display text-2xl font-extrabold">Give by card</h2>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  Card, Apple Pay or Google Pay, processed securely by Givebutter. You stay right
                  here on this page.
                </p>
                <div className="mt-6">
                  <GivebutterEmbed />
                </div>
              </div>
            ) : null}

            <h2 className="font-display text-2xl font-extrabold">
              {GIVEBUTTER_CAMPAIGN ? "Prefer zero fees?" : "Tell us what you're sending"}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Send a bank transfer or a check and no processor takes a cut. Fill this in and
              we&apos;ll email you the details right away — plus the campaign gets the contributor
              information New Jersey requires it to report, so nobody has to chase you for it later.
            </p>
            <div className="mt-6">
              <DonateForm />
            </div>
          </div>

          <aside className="order-1 space-y-6 lg:order-2 lg:sticky lg:top-24">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-display text-xl font-extrabold">Ways to give</h2>
              <dl className="mt-4 space-y-4 text-base">
                {GIVEBUTTER_CAMPAIGN ? (
                  <div>
                    <dt className="font-semibold text-foreground">Card</dt>
                    <dd className="text-muted-foreground">
                      Card, Apple Pay or Google Pay through Givebutter, right on this page.
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="font-semibold text-foreground">Bank transfer</dt>
                  <dd className="text-muted-foreground">
                    Zero fees. We&apos;ll email you the account and routing numbers for{" "}
                    {DONATION.bank.accountName} at {DONATION.bank.name}.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Check</dt>
                  <dd className="text-muted-foreground">
                    Payable to {DONATION.checkPayableTo}, mailed to{" "}
                    {DONATION.mailingAddress.join(", ")}.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-border bg-secondary p-6">
              <h2 className="font-display text-xl font-extrabold">The rules, plainly</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>Maximum ${DONATION.maxIndividual.toLocaleString()} per person, per election.</li>
                <li>No corporate or union money, and nothing from another person&apos;s funds.</li>
                <li>
                  Give more than ${DONATION.reportingThreshold} and your name, address, occupation
                  and employer appear on the campaign&apos;s public ELEC report.
                </li>
                <li>Contributions are not tax deductible.</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Questions about giving?{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}