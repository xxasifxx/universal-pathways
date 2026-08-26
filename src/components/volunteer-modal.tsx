import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { VolunteerForm } from "@/components/volunteer-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { logSignal } from "@/lib/analytics";

const SIGNED_UP_KEY = "lv_volunteer_signed_up";

export function hasVolunteered(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SIGNED_UP_KEY) === "1";
  } catch {
    return false;
  }
}

type Ctx = {
  open: (options?: { preset?: string[]; source?: string }) => void;
  close: () => void;
  isOpen: boolean;
};

const VolunteerModalContext = createContext<Ctx | null>(null);

export function useVolunteerModal(): Ctx {
  const ctx = useContext(VolunteerModalContext);
  if (!ctx) throw new Error("useVolunteerModal must be used inside <VolunteerModalProvider>");
  return ctx;
}

export function VolunteerModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preset, setPreset] = useState<string[]>([]);

  const open = useCallback((options?: { preset?: string[]; source?: string }) => {
    setPreset(options?.preset ?? []);
    setIsOpen(true);
    logSignal({
      event: "volunteer_modal_opened",
      service_group: "volunteer",
      meta: { source: options?.source ?? "unknown" },
    });
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  function onSubmitted() {
    try {
      window.localStorage.setItem(SIGNED_UP_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  return (
    <VolunteerModalContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-extrabold">
              Sign up to help
            </DialogTitle>
            <DialogDescription>
              Choose how you want to help. We will ask for the details we need.
            </DialogDescription>
          </DialogHeader>
          <VolunteerForm defaultHelp={preset} onSubmitted={onSubmitted} />
        </DialogContent>
      </Dialog>
    </VolunteerModalContext.Provider>
  );
}
