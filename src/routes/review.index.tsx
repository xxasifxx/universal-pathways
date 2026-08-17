import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getReviewContent,
  lockReview,
  postReviewComment,
  resolveReviewComment,
  setReviewStatus,
} from "@/lib/review-gate.functions";

const STATUSES = ["drafting", "in-review", "cleared", "hold"] as const;
type Status = (typeof STATUSES)[number];

const STATUS_LABELS: Record<Status, string> = {
  drafting: "Drafting",
  "in-review": "In review",
  cleared: "Cleared",
  hold: "Hold — do not publish",
};

const STATUS_TONE: Record<string, string> = {
  drafting: "border-border text-foreground/70",
  "in-review": "border-gold bg-gold/15 text-foreground",
  cleared: "border-primary bg-primary/10 text-primary",
  hold: "border-destructive bg-destructive/10 text-destructive",
};

const NAME_KEY = "lv_reviewer_name";

export const Route = createFileRoute("/review/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Review room" },
      { name: "description", content: "Private working area for campaign material." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Review room" },
      { property: "og:description", content: "Private working area for campaign material." },
    ],
  }),
  component: ReviewRoom,
});

function ReviewRoom() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fetchContent = useServerFn(getReviewContent);
  const lock = useServerFn(lockReview);
  const addComment = useServerFn(postReviewComment);
  const saveStatus = useServerFn(setReviewStatus);
  const resolveComment = useServerFn(resolveReviewComment);

  const [name, setName] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Status>("all");

  useEffect(() => {
    setName(window.localStorage.getItem(NAME_KEY) ?? "");
  }, []);

  const content = useQuery({
    queryKey: ["review-content"],
    queryFn: () => fetchContent({}),
  });

  useEffect(() => {
    if (content.data?.locked) void router.navigate({ to: "/review/unlock", replace: true });
  }, [content.data, router]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["review-content"] });

  const comment = useMutation({
    mutationFn: (vars: { draftKey: string; body: string }) =>
      addComment({ data: { ...vars, reviewerName: name } }),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.reason === "locked" ? "Your access expired — enter the passcode again." : "Couldn't save that.");
        return;
      }
      void invalidate();
      toast.success("Note saved.");
    },
    onError: () => toast.error("Couldn't save that note."),
  });

  const status = useMutation({
    mutationFn: (vars: { draftKey: string; status: Status }) =>
      saveStatus({ data: { ...vars, reviewerName: name } }),
    onSuccess: () => void invalidate(),
    onError: () => toast.error("Couldn't save that status."),
  });

  const resolved = useMutation({
    mutationFn: (vars: { id: string; resolved: boolean }) => resolveComment({ data: vars }),
    onSuccess: () => void invalidate(),
  });

  if (content.isLoading) {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-muted-foreground">Loading…</div>;
  }
  if (!content.data || content.data.locked) return null;

  const { brief, sections, statuses, comments } = content.data;
  const statusOf = (key: string): Status =>
    (statuses.find((s) => s.draft_key === key)?.status as Status) ?? "drafting";
  const openCount = (key: string) =>
    comments.filter((c) => c.draft_key === key && !c.resolved).length;
  const visible = sections.filter((s) => filter === "all" || statusOf(s.key) === filter);

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <header className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="font-display text-2xl font-extrabold text-primary">Review room</h1>
          <button
            type="button"
            onClick={async () => {
              await lock({});
              queryClient.clear();
              void router.navigate({ to: "/review/unlock", replace: true });
            }}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold"
          >
            Lock this device
          </button>
        </div>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/85">
          {brief.map((line) => (
            <p key={line.slice(0, 24)}>{line}</p>
          ))}
        </div>
        <label className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            Sign your notes as
          </span>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              window.localStorage.setItem(NAME_KEY, e.target.value);
            }}
            maxLength={80}
            placeholder="Dana — EB teacher"
            className="mt-1.5 w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((f) => (
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
        {visible.map((section) => {
          const current = statusOf(section.key);
          const isOpen = openKey === section.key;
          const sectionComments = comments.filter((c) => c.draft_key === section.key);
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
                  <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${STATUS_TONE[current]}`}>
                    {STATUS_LABELS[current]}
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
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => status.mutate({ draftKey: section.key, status: s })}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          current === s ? STATUS_TONE[s] : "border-border text-foreground/70"
                        }`}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>

                  <CommentBox
                    disabled={name.trim().length < 2}
                    pending={comment.isPending}
                    onSubmit={(body) => comment.mutate({ draftKey: section.key, body })}
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
                          <span>{c.reviewer_name}</span>
                          <span>{new Date(c.created_at).toLocaleString()}</span>
                          <button
                            type="button"
                            onClick={() => resolved.mutate({ id: c.id, resolved: !c.resolved })}
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
  disabled,
}: {
  onSubmit: (body: string) => void;
  pending: boolean;
  disabled: boolean;
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
        disabled={pending || disabled}
        className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60"
      >
        {pending ? "Saving…" : "Add note"}
      </button>
      {disabled ? (
        <p className="mt-2 text-xs text-muted-foreground">Add a name above first so notes can be attributed.</p>
      ) : null}
    </form>
  );
}
