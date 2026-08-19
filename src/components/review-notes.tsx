import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { postReviewComment, resolveReviewComment, type ReviewComment } from "@/lib/review-gate.functions";

const NAME_KEY = "lv_reviewer_name";

/** Notes panel shared by every research page in the review workspace. */
export function ReviewNotes({
  draftKey,
  comments,
  queryKey,
}: {
  draftKey: string;
  comments: ReviewComment[];
  queryKey: readonly unknown[];
}) {
  const queryClient = useQueryClient();
  const addComment = useServerFn(postReviewComment);
  const resolve = useServerFn(resolveReviewComment);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    setName(window.localStorage.getItem(NAME_KEY) ?? "");
  }, []);

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const post = useMutation({
    mutationFn: (body: string) => addComment({ data: { draftKey, body, reviewerName: name } }),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.reason === "locked" ? "Your access expired — enter the passcode again." : "Couldn't save that.");
        return;
      }
      setValue("");
      void invalidate();
      toast.success("Note saved.");
    },
    onError: () => toast.error("Couldn't save that note."),
  });

  const toggle = useMutation({
    mutationFn: (vars: { id: string; resolved: boolean }) => resolve({ data: vars }),
    onSuccess: () => void invalidate(),
  });

  const open = comments.filter((c) => !c.resolved).length;

  return (
    <section aria-labelledby="notes-heading" className="border-t border-border bg-secondary/40 py-12">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <h2 id="notes-heading" className="font-display text-xl font-extrabold text-primary">
          Notes on this page
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {open > 0 ? `${open} open` : "Nothing open"} — notes are private to the review room.
        </p>

        <label className="mt-5 block">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">Sign your notes as</span>
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

        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            const body = value.trim();
            if (body.length < 3) return;
            post.mutate(body);
          }}
        >
          <label>
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">Leave a note</span>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="This figure needs a source line before anyone quotes it."
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={post.isPending || name.trim().length < 2}
            className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {post.isPending ? "Saving…" : "Add note"}
          </button>
          {name.trim().length < 2 ? (
            <p className="mt-2 text-xs text-muted-foreground">Add a name above first so notes can be attributed.</p>
          ) : null}
        </form>

        <ul className="mt-6 space-y-2">
          {comments.map((c) => (
            <li
              key={c.id}
              className={`rounded-lg border p-3 text-sm ${
                c.resolved ? "border-border bg-secondary/40 text-muted-foreground" : "border-border bg-card"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{c.body}</p>
              <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>{c.reviewer_name}</span>
                <span>{new Date(c.created_at).toLocaleString()}</span>
                <button
                  type="button"
                  onClick={() => toggle.mutate({ id: c.id, resolved: !c.resolved })}
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  {c.resolved ? "Reopen" : "Mark handled"}
                </button>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}