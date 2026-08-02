import { useState } from "react";

import { logSignal } from "@/lib/analytics";
import { JOURNEY } from "@/lib/campaign";
import { cn } from "@/lib/utils";

export function JourneyTimeline() {
  const [open, setOpen] = useState<string>(JOURNEY[0]!.id);

  const headingId = (id: string) => `journey-title-${id}`;

  return (
    <ol className="relative flex flex-col gap-3 border-l-2 border-border pl-6 sm:pl-10">
      {JOURNEY.map((node, i) => {
        const expanded = open === node.id;
        const last = i === JOURNEY.length - 1;
        return (
          <li key={node.id} className="relative" aria-labelledby={headingId(node.id)}>
            <span
              aria-hidden="true"
              className={cn(
                "absolute -left-[calc(1.5rem+9px)] top-5 grid size-4 place-items-center rounded-full border-2 transition-colors sm:-left-[calc(2.5rem+9px)]",
                expanded
                  ? "border-primary bg-primary"
                  : last
                    ? "border-[var(--solution)] bg-background"
                    : "border-border bg-background",
              )}
            />
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={`journey-panel-${node.id}`}
              onClick={() => {
                setOpen(expanded ? "" : node.id);
                if (!expanded) {
                  logSignal({
                    event: "timeline_step_opened",
                    service_slug: node.id,
                    service_group: "student-journey",
                    meta: { title: node.title, step: i + 1 },
                  });
                }
              }}
              className={cn(
                "w-full rounded-lg border p-5 text-left transition-colors",
                expanded
                  ? "border-primary bg-card"
                  : "border-border bg-card/50 hover:bg-card",
              )}
            >
              <span className="eyebrow text-primary">{node.label}</span>
              <span
                id={headingId(node.id)}
                className="mt-1.5 block font-display text-xl font-extrabold sm:text-2xl"
              >
                {node.title}
              </span>
            </button>
            <div
              id={`journey-panel-${node.id}`}
              hidden={!expanded}
              className="rounded-b-lg border-x border-b border-primary bg-card px-5 pb-5 pt-1"
            >
              <p className="text-base leading-relaxed text-muted-foreground">{node.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}