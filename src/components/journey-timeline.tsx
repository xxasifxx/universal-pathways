import { useState } from "react";

import { JOURNEY } from "@/lib/campaign";
import { cn } from "@/lib/utils";

export function JourneyTimeline() {
  const [open, setOpen] = useState<string>(JOURNEY[0]!.id);

  return (
    <ol className="relative flex flex-col gap-3 border-l-2 border-border pl-6 sm:pl-10">
      {JOURNEY.map((node, i) => {
        const expanded = open === node.id;
        const last = i === JOURNEY.length - 1;
        return (
          <li key={node.id} className="relative">
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
              onClick={() => setOpen(expanded ? "" : node.id)}
              className={cn(
                "w-full rounded-lg border p-5 text-left transition-colors",
                expanded
                  ? "border-primary bg-card"
                  : "border-border bg-card/50 hover:bg-card",
              )}
            >
              <span className="eyebrow text-primary">{node.label}</span>
              <h3 className="mt-1.5 font-display text-xl font-extrabold sm:text-2xl">
                {node.title}
              </h3>
              <div
                className={cn(
                  "grid transition-all duration-300",
                  expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <p className="overflow-hidden text-base leading-relaxed text-muted-foreground">
                  <span className="mt-3 block">{node.text}</span>
                </p>
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}