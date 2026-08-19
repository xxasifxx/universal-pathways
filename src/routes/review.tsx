import { createFileRoute, Link, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { checkReviewUnlocked, lockReview } from "@/lib/review-gate.functions";

export const Route = createFileRoute("/review")({
  ssr: false,
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  beforeLoad: async ({ location }) => {
    if (location.pathname.startsWith("/review/unlock")) return;
    const { unlocked } = await checkReviewUnlocked();
    if (!unlocked) throw redirect({ to: "/review/unlock", replace: true });
  },
  component: ReviewLayout,
});

const TABS = [
  { to: "/review", label: "Drafts", exact: true },
  { to: "/review/dashboard", label: "District budget" },
  { to: "/review/pilot", label: "PILOT explainer" },
  { to: "/review/growth", label: "Township growth" },
] as const;

function ReviewLayout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const lock = useServerFn(lockReview);
  const onUnlockPage = router.state.location.pathname.startsWith("/review/unlock");

  return (
    <div className="min-h-screen bg-background">
      {onUnlockPage ? null : (
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
            <span className="font-display text-sm font-extrabold uppercase tracking-wide text-primary">
              Review room
            </span>
            <nav aria-label="Review sections" className="flex flex-wrap gap-1.5">
              {TABS.map((tab) => (
                <Link
                  key={tab.to}
                  to={tab.to}
                  activeOptions={{ exact: "exact" in tab }}
                  activeProps={{ className: "border-primary bg-primary/10 text-primary" }}
                  inactiveProps={{ className: "border-transparent text-foreground/70 hover:bg-secondary" }}
                  className="rounded-full border px-3 py-1.5 text-xs font-semibold"
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              onClick={async () => {
                await lock({});
                queryClient.clear();
                void router.navigate({ to: "/review/unlock", replace: true });
              }}
              className="ml-auto rounded-md border border-border px-3 py-1.5 text-xs font-semibold"
            >
              Lock this device
            </button>
          </div>
        </header>
      )}
      <Outlet />
    </div>
  );
}