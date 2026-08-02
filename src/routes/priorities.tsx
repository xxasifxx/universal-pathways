import { createFileRoute } from "@tanstack/react-router";

import { PathwaysVisualizer } from "@/components/pathways-visualizer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { logSignal } from "@/lib/analytics";
import { PRIORITIES } from "@/lib/campaign";
import { useI18n } from "@/lib/i18n";

const TITLE = "Priorities — What I'd Change in East Brunswick";
const DESCRIPTION =
  "Individual learning plans without a classification, open access to advanced courses, staffed classrooms, and a budget parents can read.";

export const Route = createFileRoute("/priorities")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Priorities,
});

function Priorities() {
  const { t } = useI18n();

  return (
    <>
      <section className="border-b border-border py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary">{t("priorities.eyebrow")}</p>
          <h1 className="mt-3 max-w-4xl text-4xl leading-[1.05] sm:text-6xl">
            What I&apos;d change
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            All of this comes back to one thing. East Brunswick already knows how to teach kids
            one at a time. It just keeps that skill locked in one department.
          </p>
        </div>
      </section>

      <section aria-labelledby="pathways-heading" className="bg-secondary/50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary">{t("pathways.eyebrow")}</p>
          <h2 id="pathways-heading" className="mt-3 text-3xl sm:text-5xl">
            {t("pathways.title")}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Same kid, same bad week, same counselor&apos;s office. Press play and watch the two
            versions come apart.
          </p>
          <div className="mt-8">
            <PathwaysVisualizer />
          </div>
        </div>
      </section>

      <section aria-labelledby="planks-heading" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="planks-heading" className="text-3xl sm:text-4xl">
            The long version
          </h2>
          <Accordion
            type="multiple"
            className="mt-8 max-w-4xl"
            onValueChange={(open: string[]) => {
              const last = open[open.length - 1];
              if (!last) return;
              const plank = PRIORITIES.find((p) => p.id === last);
              logSignal({
                event: "priority_read",
                service_slug: last,
                service_group: "priorities",
                meta: { title: plank?.title ?? last },
              });
            }}
          >
            {PRIORITIES.map((p, i) => (
              <AccordionItem
                key={p.id}
                value={p.id}
                id={p.id}
                data-intent={p.id}
                data-intent-group="priorities"
                className="scroll-mt-24"
              >
                <AccordionTrigger className="text-left">
                  <span className="flex items-baseline gap-3">
                    <span className="font-display text-sm font-black text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-lg font-extrabold sm:text-xl">
                      {p.title}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4 pb-2 text-base leading-relaxed text-muted-foreground">
                    {p.body.map((para) => (
                      <p key={para.slice(0, 24)}>{para}</p>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}