import { createFileRoute } from "@tanstack/react-router";

import { VolunteerActionMap } from "@/components/volunteer-action-map";
import { useI18n } from "@/lib/i18n";

const TITLE = "Volunteer — Powered by Neighbors";
const DESCRIPTION =
  "Join the canvass, phone bank, or host a yard sign in your East Brunswick school zone.";

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
            No consultants, no direct-mail firm. School board races are won by neighbors who
            knock on the doors of neighbors. Two hours makes a measurable difference.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <VolunteerActionMap />
        </div>
      </section>
    </>
  );
}