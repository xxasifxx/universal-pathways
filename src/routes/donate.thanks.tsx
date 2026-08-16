import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Mail } from "lucide-react";

import { CANDIDATE_NAME, CONTACT_EMAIL } from "@/lib/campaign";

const TITLE = "Thank You for Supporting Saqeeb";
const DESCRIPTION =
  "Thank you for supporting our campaign for the East Brunswick Board of Education. Find the next way to get involved.";

export const Route = createFileRoute("/donate/thanks")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DonationThanks,
});

function DonationThanks() {
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <span className="grid size-16 place-items-center rounded-full border-2 border-primary-foreground">
            <Heart aria-hidden="true" className="size-7" />
          </span>
          <p className="eyebrow mt-8 text-primary-foreground/75">Thank you</p>
          <h1 className="mt-3 max-w-3xl text-5xl uppercase leading-[0.95] sm:text-7xl">
            You&apos;re helping move East Brunswick forward.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-primary-foreground/90 sm:text-xl">
            If you just completed your contribution through ActBlue, your receipt will come from
            them by email. Your support gives our grassroots campaign more room to reach students,
            families, and educators across our community.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/volunteer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-6 py-4 font-semibold text-gold-foreground transition-opacity hover:opacity-90"
            >
              Sign up to volunteer
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              to="/"
              hash="ask"
              className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-primary-foreground px-6 py-4 font-semibold transition-colors hover:bg-primary-foreground hover:text-primary"
            >
              Ask Saqeeb a question
              <Mail aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="next-steps-heading" className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="eyebrow text-primary">Keep going</p>
          <h2 id="next-steps-heading" className="mt-3 text-4xl uppercase sm:text-5xl">
            There are a few easy ways to help next.
          </h2>
          <div className="mt-10 grid gap-8 border-t border-border pt-8 sm:grid-cols-3">
            <div>
              <p className="font-display text-3xl text-primary">01</p>
              <h3 className="mt-3 text-2xl uppercase">Volunteer</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Help knock doors, make calls, or get a yard sign for your street. Choose what fits
                your schedule.
              </p>
              <Link
                to="/volunteer"
                className="mt-5 inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4"
              >
                Open the sign-up form
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <div>
              <p className="font-display text-3xl text-primary">02</p>
              <h3 className="mt-3 text-2xl uppercase">Bring a question</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Want to know where Saqeeb stands? Send a question and he will answer personally.
              </p>
              <Link
                to="/"
                hash="ask"
                className="mt-5 inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4"
              >
                Ask Saqeeb
                <Mail aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <div>
              <p className="font-display text-3xl text-primary">03</p>
              <h3 className="mt-3 text-2xl uppercase">Stay connected</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Follow our campaign on Instagram for updates, events, and ways to show up locally.
              </p>
              <a
                href="https://www.instagram.com/saqeeb4eb"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4"
              >
                Follow our campaign
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>

          <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
            Need anything? Email {" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary underline">
              {CONTACT_EMAIL}
            </a>
            {" "}and someone from {CANDIDATE_NAME}&apos;s campaign will get back to you.
          </p>
        </div>
      </section>
    </>
  );
}
