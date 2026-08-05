import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password" },
      { name: "description", content: "Choose a new password for your account." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Set a new password" },
      { property: "og:description", content: "Choose a new password for your account." },
    ],
  }),
  component: ResetPassword,
});

type Status = "checking" | "ready" | "invalid" | "done";

function ResetPassword() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || session) setStatus("ready");
    });

    // Give the client a moment to exchange the recovery token in the URL.
    const timer = window.setTimeout(() => {
      void supabase.auth.getSession().then(({ data }) => {
        if (!active) return;
        setStatus((prev) => (prev === "ready" ? prev : data.session ? "ready" : "invalid"));
      });
    }, 1200);

    return () => {
      active = false;
      window.clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("The two passwords don't match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setStatus("done");
    toast.success("Password updated. You're signed in.");
    window.setTimeout(() => void navigate({ to: "/admin/intent", replace: true }), 900);
  }

  async function resend() {
    if (!email) {
      toast.error("Enter your email first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("New link sent — check your email.");
  }

  const inputClass =
    "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm";

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="font-display text-2xl font-extrabold text-foreground">Set a new password</h1>

      {status === "checking" ? (
        <p className="mt-3 text-sm text-muted-foreground">Checking your link…</p>
      ) : null}

      {status === "invalid" ? (
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">
            This password link has expired or was already used. Enter your email and we'll send a
            fresh one.
          </p>
          <label htmlFor="reset-email" className="mt-4 block text-sm font-semibold">
            Email
          </label>
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            maxLength={255}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => void resend()}
            className="mt-3 w-full rounded-md bg-primary px-4 py-2 font-display text-sm font-bold text-primary-foreground"
          >
            Send me a new link
          </button>
        </div>
      ) : null}

      {status === "ready" ? (
        <form onSubmit={save} className="mt-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            Choose a password with at least 8 characters.
          </p>
          <div>
            <label htmlFor="new-password" className="block text-sm font-semibold">
              New password
            </label>
            <input
              id="new-password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-semibold">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={show}
              onChange={(e) => setShow(e.target.checked)}
              className="h-4 w-4"
            />
            Show passwords
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-primary px-4 py-2 font-display text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save password"}
          </button>
        </form>
      ) : null}

      {status === "done" ? (
        <p role="status" className="mt-3 text-sm text-muted-foreground">
          Password updated. Taking you to the dashboard…
        </p>
      ) : null}
    </div>
  );
}