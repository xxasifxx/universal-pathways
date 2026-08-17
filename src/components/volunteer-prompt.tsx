import { useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { hasVolunteered, useVolunteerModal } from "@/components/volunteer-modal";
import { useReadingIntent } from "@/hooks/use-reading-intent";
import { logSignal } from "@/lib/analytics";
import { HELP_OPTIONS } from "@/lib/campaign";
import { isTrackingDisabled } from "@/lib/tracking-consent";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "lv_volunteer_prompt";
const SESSION_KEY = "lv_volunteer_prompt_session";
const SUPPRESS_DAYS = 30;

const YARD_SIGN_LABEL =
  HELP_OPTIONS.find((o) => o.id === "yard-sign")?.label ?? "Request a yard sign";

function suppressed(): boolean {
  try {
    if (hasVolunteered()) return true;
    if (window.sessionStorage.getItem(SESSION_KEY) === "1") return true;
    const until = Number(window.localStorage.getItem(DISMISS_KEY) ?? "0");
    return Number.isFinite(until) && Date.now() < until;
  } catch {
    return false;
  }
}

function markSeenThisSession() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

function markDismissed() {
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now() + SUPPRESS_DAYS * 864e5));
  } catch {
    /* ignore */
  }
}

/** A single, quiet nudge for people who are genuinely reading. */
export function VolunteerPrompt() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { reached } = useReadingIntent();
  const { open } = useVolunteerModal();
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!reached) return;
    if (isTrackingDisabled()) return;
    if (suppressed()) return;
    markSeenThisSession();
    setVisible(true);
    logSignal({ event: "volunteer_prompt_shown", path: pathname, service_group: "volunteer" });
  }, [reached, pathname]);

  useEffect(() => {
    if (!visible) return;
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-3 bottom-3 z-40 flex justify-center transition-all duration-300 motion-reduce:transition-none sm:inset-x-auto sm:right-6 sm:bottom-6 sm:justify-end",
        "pb-[env(safe-area-inset-bottom)]",
        entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      )}
    >
      <div className="flex w-full max-w-sm items-center gap-2 rounded-full border border-border bg-card py-2 pl-4 pr-2 shadow-lg">
        <p className="min-w-0 flex-1 text-sm leading-snug text-foreground">
          Want a free yard sign? We&rsquo;ll drop one off.
        </p>
        <button
          type="button"
          onClick={() => {
            logSignal({
              event: "volunteer_prompt_opened",
              path: pathname,
              service_group: "volunteer",
            });
            markDismissed();
            setVisible(false);
            open({ source: "reading-prompt", preset: [YARD_SIGN_LABEL] });
          }}
          className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Yes, please
        </button>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            logSignal({
              event: "volunteer_prompt_dismissed",
              path: pathname,
              service_group: "volunteer",
            });
            markDismissed();
            setVisible(false);
          }}
          className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
}
