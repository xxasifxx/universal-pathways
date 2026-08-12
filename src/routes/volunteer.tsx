import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { VolunteerForm } from "@/components/volunteer-form";
import { CONTACT_EMAIL, HELP_OPTIONS } from "@/lib/campaign";
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
  const [preset, setPreset] = useState<string[]>([]);

  function choose(label: string) {
    setPreset([label]);
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <section className="border-b border-border py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary">Get involved</p>
          <h1 className="mt-3 text-4xl leading-[1.05] sm:text-6xl">{t("volunteer.title")}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t("volunteer.intro")}
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {HELP_OPTIONS.map((opt) => (
              <li key={opt.id}>
                <button
                  type="button"
                  onClick={() => choose(opt.label)}
                  className="flex h-full w-full flex-col items-start rounded-xl border border-border bg-card p-6 text-left transition-colors hover:border-primary"
                >
                  <span className="font-display text-xl font-extrabold text-primary">
                    {opt.label}
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {opt.blurb}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Sign up
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div id="signup" className="mx-auto max-w-2xl scroll-mt-20 px-4 sm:px-6">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-extrabold">Sign up to help</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Check what you want to do — each one asks only for what we need to follow up.
            </p>
            <div className="mt-6">
              <VolunteerForm defaultHelp={preset} />
            </div>
          </div>
          <p className="mt-6 text-center text-base text-muted-foreground">
            Questions? Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
