import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import { useAdminSession } from "@/hooks/use-admin-session";
import { supabase } from "@/integrations/supabase/client";
import { isTrackingDisabled, setStaffDevice, setTrackingDisabled } from "@/lib/tracking-consent";

const TABS = [
  { to: "/admin/intent", label: "Intent" },
  { to: "/admin/heatmaps", label: "Heatmaps" },
  { to: "/admin/voters", label: "Voters" },
  { to: "/admin/voter-map", label: "Household map" },
  { to: "/admin/export", label: "Export" },
] as const;

const REVIEWER_TAB = { to: "/admin/drafts", label: "Review room" } as const;

function RecordingToggle() {
  const [off, setOff] = useState(true);
  useEffect(() => setOff(isTrackingDisabled()), []);
  return (
    <button
      type="button"
      onClick={() => {
        const nextOff = !off; // true = suppress, false = record me like a visitor
        setStaffDevice(nextOff);
        setTrackingDisabled(nextOff);
        setOff(nextOff);
      }}
      className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold"
    >
      Recording my activity: {off ? "off (staff)" : "on"}
    </button>
  );
}

export function AdminShell({
  children,
  allow = "admin",
}: {
  children: ReactNode;
  /** "reviewer" also lets accounts holding only the reviewer role through. */
  allow?: "admin" | "reviewer";
}) {
  const { loading, session, isAdmin, isReviewer } = useAdminSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const permitted = allow === "reviewer" ? isReviewer : isAdmin;

  // An admin's own browsing is instrumentation, not audience behaviour.
  useEffect(() => {
    if (isAdmin) setStaffDevice(true);
  }, [isAdmin]);

  useEffect(() => {
    if (!loading && !session) {
      window.sessionStorage.setItem("lv_admin_next", window.location.pathname);
      void navigate({ to: "/admin/login", replace: true });
    }
  }, [loading, session, navigate]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/admin/login", replace: true });
  }

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!session) return null;

  if (!permitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-xl font-extrabold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {allow === "reviewer"
            ? "This account hasn't been given review access yet."
            : "This account doesn't have the admin role."}
        </p>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <header className="sticky top-16 z-20 mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/95 py-3 backdrop-blur">
        <nav aria-label="Admin sections" className="flex flex-wrap gap-1">
          {(isAdmin ? [...TABS, REVIEWER_TAB] : [REVIEWER_TAB]).map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-foreground/75 hover:bg-secondary"
              activeProps={{ className: "bg-secondary text-primary" }}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <RecordingToggle />
          <button
            type="button"
            onClick={() => void signOut()}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold"
          >
            Sign out
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}

export function formatMs(ms: number): string {
  if (!ms) return "0s";
  const total = Math.round(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${s}s`;
  return `${s}s`;
}