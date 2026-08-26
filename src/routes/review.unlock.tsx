import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { unlockReview } from "@/lib/review-gate.functions";

export const Route = createFileRoute("/review/unlock")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Review room" },
        { name: "description", content: "Enter a passcode to open the private campaign review pages." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Review room" },
        { property: "og:description", content: "Enter a passcode to open the private campaign review pages." },
    ],
  }),
  component: Unlock,
});

function Unlock() {
  const router = useRouter();
  const unlock = useServerFn(unlockReview);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { ok } = await unlock({ data: { passcode } });
    setBusy(false);
    if (ok) await router.navigate({ to: "/review", replace: true });
    else setError(true);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="font-display text-2xl font-extrabold text-foreground">Review room</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter the passcode you were given. It keeps you signed in on this device for 30 days.
      </p>
      <form onSubmit={(e) => void onSubmit(e)} className="mt-6 space-y-3">
        <label htmlFor="review-passcode" className="block text-sm font-semibold">
          Passcode
        </label>
        <input
          id="review-passcode"
          type="password"
          autoComplete="current-password"
          required
          value={passcode}
          onChange={(e) => {
            setPasscode(e.target.value);
            setError(false);
          }}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md bg-primary px-4 py-2 font-display text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
      {error ? (
        <p role="alert" className="mt-4 text-sm text-destructive">
          That's not it.
        </p>
      ) : null}
    </div>
  );
}
