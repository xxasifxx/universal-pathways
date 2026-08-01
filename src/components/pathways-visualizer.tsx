import { useEffect, useRef, useState } from "react";
import { ArrowDown, Play } from "lucide-react";

import { FLOW_SOLUTION, FLOW_TRAP } from "@/lib/campaign";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STEP_MS = 700;

function Flow({
  title,
  steps,
  revealed,
  tone,
}: {
  title: string;
  steps: string[];
  revealed: number;
  tone: "trap" | "solution";
}) {
  const color = tone === "trap" ? "var(--trap)" : "var(--solution)";
  return (
    <div
      className="rounded-xl border-2 p-5 sm:p-6"
      style={{ borderColor: `color-mix(in oklab, ${color} 35%, transparent)` }}
    >
      <h3 className="font-display text-lg font-extrabold" style={{ color }}>
        {title}
      </h3>
      <ol className="mt-4 flex flex-col">
        {steps.map((step, i) => {
          const on = i < revealed;
          return (
            <li key={step}>
              {i > 0 ? (
                <div className="flex justify-start pl-5" aria-hidden="true">
                  <ArrowDown
                    className="size-4 transition-opacity duration-300"
                    style={{ color, opacity: on ? 1 : 0.15 }}
                  />
                </div>
              ) : null}
              <div
                className={cn(
                  "rounded-lg border px-4 py-3 text-sm font-semibold transition-all duration-500",
                  on ? "translate-y-0" : "translate-y-1",
                )}
                style={{
                  borderColor: on ? color : "var(--border)",
                  backgroundColor: on
                    ? `color-mix(in oklab, ${color} 12%, var(--card))`
                    : "var(--card)",
                  color: on ? color : "var(--foreground)",
                }}
              >
                {step}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function PathwaysVisualizer() {
  const { t } = useI18n();
  const [revealed, setRevealed] = useState(0);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const total = Math.max(FLOW_TRAP.length, FLOW_SOLUTION.length);

  useEffect(() => {
    const t = timers;
    return () => {
      t.current.forEach(clearTimeout);
    };
  }, []);

  function run() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRevealed(0);
    setRunning(true);
    for (let i = 1; i <= total; i++) {
      timers.current.push(
        setTimeout(() => {
          setRevealed(i);
          if (i === total) setRunning(false);
        }, i * STEP_MS),
      );
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={run}
        className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 font-display text-sm font-bold text-ink-foreground transition-opacity hover:opacity-90"
      >
        <Play aria-hidden="true" className="size-4" />
        {revealed === 0 ? t("pathways.start") : t("pathways.replay")}
      </button>
      <p aria-live="polite" className="sr-only">
        {running ? `Step ${revealed} of ${total}` : "Both paths shown"}
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Flow title={t("pathways.trap")} steps={FLOW_TRAP} revealed={revealed} tone="trap" />
        <Flow
          title={t("pathways.solution")}
          steps={FLOW_SOLUTION}
          revealed={revealed}
          tone="solution"
        />
      </div>
    </div>
  );
}