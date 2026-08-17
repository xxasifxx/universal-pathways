import { createFileRoute, redirect } from "@tanstack/react-router";

/** The review room now lives behind a shared passcode at /review. */
export const Route = createFileRoute("/admin/drafts")({
  beforeLoad: () => {
    throw redirect({ to: "/review" });
  },
});
