import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAdminSession } from "@/hooks/use-admin-session";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Campaign admin sign in" },
      { name: "description", content: "Sign in to the campaign analytics dashboard." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Campaign admin sign in" },
      { property: "og:description", content: "Sign in to the campaign analytics dashboard." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session && isAdmin) {
      const next = window.sessionStorage.getItem("lv_admin_next") ?? "/admin/intent";
      window.sessionStorage.removeItem("lv_admin_next");
      void navigate({ to: next, replace: true });
    }
  }, [loading, session, isAdmin, navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
  }

  async function reset() {
    if (!email) return toast.error("Enter your email first.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Check your email for a reset link.");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="font-display text-2xl font-extrabold text-foreground">Campaign admin</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Staff only. This dashboard shows visitor activity on the site.
      </p>

      <form onSubmit={signIn} className="mt-6 space-y-3">
        <div>
          <label htmlFor="admin-email" className="block text-sm font-semibold">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="block text-sm font-semibold">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md bg-primary px-4 py-2 font-display text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => void reset()}
        className="mt-3 text-sm font-medium text-primary underline underline-offset-4"
      >
        Email me a password reset link
      </button>

      {session && !isAdmin && !loading ? (
        <p role="alert" className="mt-6 rounded-md border border-border bg-card p-3 text-sm">
          You're signed in, but this account doesn't have admin access.
        </p>
      ) : null}
    </div>
  );
}