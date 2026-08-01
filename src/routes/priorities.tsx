import { createFileRoute } from "@tanstack/react-router";

import { PathwaysVisualizer } from "@/components/pathways-visualizer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PRIORITIES } from "@/lib/campaign";
import { useI18n } from "@/lib/i18n";

const TITLE = "Priorities — Solutions for a Student-First District";
const DESCRIPTION =
  "Universal Individualization, student agency, data for support instead of surveillance, and safe, inclusive East Brunswick schools.";

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
            Solutions for a Student-First District
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Everything here maps back to one idea: East Brunswick already has the expertise to
            individualize learning. It just keeps that expertise locked in a silo.
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
            One student walks into a counselor&apos;s office after a bad week. Press play and
            watch how the two systems diverge from that identical starting point.
          </p>
          <div className="mt-8">
            <PathwaysVisualizer />
          </div>
        </div>
      </section>

      <section aria-labelledby="planks-heading" className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 id="planks-heading" className="text-3xl sm:text-4xl">
            The platform, in detail
          </h2>
          <Accordion type="multiple" className="mt-8">
            {PRIORITIES.map((p, i) => (
              <AccordionItem key={p.id} value={p.id} id={p.id} className="scroll-mt-24">
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