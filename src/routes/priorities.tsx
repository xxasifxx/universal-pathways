import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { PITCH, PRIORITIES } from "@/lib/campaign";
import { useI18n } from "@/lib/i18n";

const TITLE = "Our Platform for East Brunswick Schools";
const DESCRIPTION =
  "Our platform for East Brunswick schools: affordable schools, fair access for students, and lower costs through better facilities and public oversight.";

export const Route = createFileRoute("/priorities")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://saqeeb.org/priorities" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://saqeeb.org/priorities" }],
  }),
  component: Priorities,
});

function Priorities() {
  const { t } = useI18n();

  return (
    <>
      <section className="bg-primary py-14 text-primary-foreground sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1 className="max-w-4xl text-4xl leading-[1.05] sm:text-6xl">
            Our platform for East Brunswick schools
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-primary-foreground/90">
            What we are running on: affordable for all, students first, reduce our costs.
          </p>
        </div>
      </section>

      <nav aria-label="Priorities" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="eyebrow text-primary">{t("priorities.eyebrow")}</p>
          <ul className="mt-4 flex flex-col">
            {PRIORITIES.map((p) => (
              <li key={p.id} className="border-t border-border">
                <Link
                  to="/priorities"
                  hash={p.id}
                  className="flex items-baseline gap-3 py-3 font-display text-base font-extrabold uppercase tracking-wide text-primary hover:underline sm:text-lg"
                >
                  <span className="text-sm">{p.number}</span>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {PRIORITIES.map((p) => (
          <section
            key={p.id}
            id={p.id}
            aria-labelledby={`${p.id}-heading`}
            className="scroll-mt-24 border-b border-border py-12 last:border-b-0 sm:py-16"
          >
            <p className="eyebrow text-primary">Priority {p.number}</p>
            <div className="mt-3 flex items-start gap-4">
              <span
                aria-hidden="true"
                className="mt-1 grid size-10 shrink-0 place-items-center rounded-full border-2 border-primary text-primary"
              >
                <Check className="size-5" />
              </span>
              <h2 id={`${p.id}-heading`} className="text-3xl sm:text-4xl">
                {p.title}
              </h2>
            </div>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed">{p.summary}</p>
            <ul className="mt-6 flex max-w-3xl list-disc flex-col gap-3 pl-5 text-base leading-relaxed text-muted-foreground">
              {p.points.map((point) => (
                <li key={point.slice(0, 32)}>{point}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
