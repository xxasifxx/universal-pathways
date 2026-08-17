import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminSession } from "@/hooks/use-admin-session";
import { supabase } from "@/integrations/supabase/client";
import {
  DRAFT_SECTIONS,
  DRAFT_STATUSES,
  REVIEW_BRIEF,
  STATUS_LABELS,
  type DraftStatus,
} from "@/lib/drafts";

export const Route = createFileRoute("/admin/drafts")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Review room · Campaign" },
      { name: "description", content: "Private drafting area for campaign policy material." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Review room · Campaign" },
      { property: "og:description", content: "Private drafting area for campaign policy material." },
    ],
  }),
  component: () => (
    <AdminShell allow="reviewer">
      <Drafts />
    </AdminShell>
  ),
});

type StatusRow = { draft_key: string; status: string; note: string | null };
type CommentRow = {
  id: string;
  draft_key: string;
  body: string;
  author_email: string | null;
  author_id: string;
  resolved: boolean;
  created_at: string;
};

const STATUS_TONE: Record<string, string> = {
  drafting: "border-border text-foreground/70",
  "in-review": "border-gold bg-gold/15 text-foreground",
  cleared: "border-primary bg-primary/10 text-primary",
  hold: "border-destructive bg-destructive/10 text-destructive",
};

function Drafts() {
  const { session } = useAdminSession();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | DraftStatus>("all");
  const [openKey, setOpenKey] = useState<string | null>(null);

  const statuses = useQuery({
    queryKey: ["draft-status"],
    queryFn: async () => {
      const { data, error } = await supabase.from("draft_status").select("draft_key,status,note");
      if (error) throw error;
      return (data ?? []) as StatusRow[];
    },
  });

  const comments = useQuery({
    queryKey: ["draft-comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("draft_comments")
        .select("id,draft_key,body,author_email,author_id,resolved,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CommentRow[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ key, status }: { key: string; status: DraftStatus }) => {
      const { error } = await supabase
        .from("draft_status")
        .upsert(
          { draft_key: key, status, updated_by: session?.user.id ?? null },
          { onConflict: "draft_key" },
        );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["draft-status"] }),
    onError: () => toast.error("Could not save that status."),
  });

  const addComment = useMutation({
    mutationFn: async ({ key, body }: { key: string; body: string }) => {
      if (!session) throw new Error("No session");
      const { error } = await supabase.from("draft_comments").insert({
        draft_key: key,
        body,
        author_id: session.user.id,
        author_email: session.user.email ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["draft-comments"] });
      toast.success("Comment saved.");
    },
    onError: () => toast.error("Could not save that comment."),
  });

  const toggleResolved = useMutation({
    mutationFn: async ({ id, resolved }: { id: string; resolved: boolean }) => {
      const { error } = await supabase.from("draft_comments").update({ resolved }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["draft-comments"] }),
  });

  const statusOf = (key: string): DraftStatus =>
    ((statuses.data ?? []).find((r) => r.draft_key === key)?.status as DraftStatus) ?? "drafting";

  const sections = DRAFT_SECTIONS.filter((s) => filter === "all" || statusOf(s.key) === filter);
  const openCount = (key: string) =>
    (comments.data ?? []).filter((c) => c.draft_key === key && !c.resolved).length;

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-border bg-card p-5">
        <h1 className="font-display text-2xl font-extrabold text-primary">Review room</h1>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/85">
          {REVIEW_BRIEF.map((line) => (
            <p key={line.slice(0, 24)}>{line}</p>
          ))}
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["all", ...DRAFT_STATUSES] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
              filter === f ? "border-primary text-primary" : "border-border text-foreground/70"
            }`}
          >
            {f === "all" ? "All" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {sections.map((section) => {
          const status = statusOf(section.key);
          const isOpen = openKey === section.key;
          const sectionComments = (comments.data ?? []).filter((c) => c.draft_key === section.key);
          return (
            <li key={section.key} className="rounded-xl border border-border bg-card">
              <button
                type="button"
                onClick={() => setOpenKey(isOpen ? null : section.key)}
                className="flex w-full flex-col gap-2 p-4 text-left sm:flex-row sm:items-start sm:justify-between"
              >
                <span className="min-w-0">
                  <span className="block text-base font-bold">{section.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{section.context}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  {openCount(section.key) > 0 ? (
                    <span className="rounded-full bg-secondary px-2 py-1 text-xs font-semibold">
                      {openCount(section.key)} open
                    </span>
                  ) : null}
                  {section.kind === "internal" ? (
                    <span className="rounded-full border border-dashed border-border px-2 py-1 text-xs">
                      Not public
                    </span>
                  ) : null}
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-semibold ${STATUS_TONE[status]}`}
                  >
                    {STATUS_LABELS[status]}
                  </span>
                </span>
              </button>

              {isOpen ? (
                <div className="border-t border-border p-4">
                  {section.blocks.map((block) => (
                    <div key={block.heading ?? block.body[0]?.slice(0, 24)} className="mb-4">
                      {block.heading ? (
                        <p className="font-display text-xs uppercase tracking-wide text-primary">
                          {block.heading}
                        </p>
                      ) : null}
                      {block.body.map((para) => (
                        <p key={para.slice(0, 32)} className="mt-2 text-sm leading-relaxed">
                          {para}
                        </p>
                      ))}
                    </div>
                  ))}

                  {section.sources.length ? (
                    <p className="text-xs text-muted-foreground">
                      Sources:{" "}
                      {section.sources.map((s, i) => (
                        <span key={s.href}>
                          {i > 0 ? "; " : null}
                          <a
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary underline underline-offset-4"
                          >
                            {s.label}
                          </a>
                        </span>
                      ))}
                    </p>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {DRAFT_STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus.mutate({ key: section.key, status: s })}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          status === s ? STATUS_TONE[s] : "border-border text-foreground/70"
                        }`}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>

                  <CommentBox
                    onSubmit={(body) => addComment.mutate({ key: section.key, body })}
                    pending={addComment.isPending}
                  />

                  <ul className="mt-4 space-y-2">
                    {sectionComments.map((c) => (
                      <li
                        key={c.id}
                        className={`rounded-lg border p-3 text-sm ${
                          c.resolved ? "border-border bg-secondary/40 text-muted-foreground" : "border-border"
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{c.body}</p>
                        <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span>{c.author_email ?? "reviewer"}</span>
                          <span>{new Date(c.created_at).toLocaleString()}</span>
                          <button
                            type="button"
                            onClick={() => toggleResolved.mutate({ id: c.id, resolved: !c.resolved })}
                            className="font-semibold text-primary underline underline-offset-4"
                          >
                            {c.resolved ? "Reopen" : "Mark handled"}
                          </button>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function CommentBox({
  onSubmit,
  pending,
}: {
  onSubmit: (body: string) => void;
  pending: boolean;
}) {
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const body = value.trim();
        if (body.length < 3) return;
        onSubmit(body);
        setValue("");
      }}
      className="mt-5"
    >
      <label>
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          Leave a note
        </span>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="This sentence reads as a guarantee. Suggest: 'I'd push the board to look at…'"
          className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60"
      >
        {pending ? "Saving…" : "Add note"}
      </button>
    </form>
  );
}