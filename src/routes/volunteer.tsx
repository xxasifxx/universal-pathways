import { createFileRoute } from "@tanstack/react-router";

import { VolunteerForm } from "@/components/volunteer-form";
import { CONTACT_EMAIL } from "@/lib/campaign";
import { useI18n } from "@/lib/i18n";

const TITLE = "Volunteer or Request a Yard Sign";
const DESCRIPTION =
  "Sign up to help our campaign in East Brunswick, or request a yard sign for your street.";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Volunteer,
});

function Volunteer() {
  const { t } = useI18n();

  return (
    <>
      <section className="border-b border-border py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary">Get involved</p>
          <h1 className="mt-3 text-4xl leading-[1.05] sm:text-6xl">{t("volunteer.title")}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            School board races here are decided by a few hundred votes. Volunteer a couple of hours,
            or just put a sign on your lawn — both help.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-start">
          <div>
            <h2 className="font-display text-2xl font-extrabold">Request a yard sign</h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
              Fill in the form and check <strong>Request a yard sign</strong>. Include your street
              address and a volunteer will drop one off. Signs are free, and we&apos;ll pick them up
              after the election if you&apos;d like.
            </p>
            <p className="mt-6 text-base text-muted-foreground">
              Questions? Email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-extrabold">Sign up</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              One form for volunteering and sign requests.
            </p>
            <div className="mt-6">
              <VolunteerForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
