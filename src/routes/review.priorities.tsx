import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { ReviewNotes } from "@/components/review-notes";
import { getReviewPage } from "@/lib/review-gate.functions";

export const Route = createFileRoute("/review/priorities")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Priorities detail — review room" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ReviewPriorities,
});

function ReviewPriorities() {
  const fetchPage = useServerFn(getReviewPage);
  const query = useQuery({
    queryKey: ["review-page", "priorities"],
    queryFn: () => fetchPage({ data: { page: "priorities" } }),
  });

  if (query.isLoading) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">Loading…</p>;
  }
  const data = query.data;
  if (!data || data.locked || !("priorities" in data) || !data.priorities) return null;

  return (
    <>
      <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="eyebrow text-primary">Research — not public</p>
        <h1 className="mt-3 text-4xl leading-[1.05] sm:text-5xl">Research for each promise</h1>
        <p className="mt-4 rounded-lg border border-dashed border-border p-4 text-sm leading-relaxed text-muted-foreground">
          This page lists the relevant budget lines, policies, source material, and unanswered
          questions.
        </p>

        {data.priorities.map((priority) => (
          <section key={priority.id} className="mt-12">
            <p className="font-display text-4xl leading-none text-gold">{priority.number}</p>
            <h2 className="mt-2 text-3xl leading-tight">{priority.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {priority.summary}
            </p>

            <ul className="mt-6 space-y-4">
              {priority.points.map((point) => (
                <li
                  key={point.text.slice(0, 48)}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <p className="text-lg leading-snug">{point.text}</p>
                  {point.leverLabel ? (
                    <p className="mt-2 font-display text-xs uppercase tracking-wide text-primary">
                      {point.leverLabel}: {point.lever}
                    </p>
                  ) : null}
                  {point.mechanism.map((para) => (
                    <p key={para.slice(0, 32)} className="mt-3 text-base leading-relaxed">
                      {para}
                    </p>
                  ))}
                  {point.openQuestion ? (
                    <p className="mt-4 border-l-4 border-gold pl-4 text-base leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Still unknown:{" "}
                      </span>
                      {point.openQuestion}
                    </p>
                  ) : null}
                  {point.sources.length ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground">Sources: </span>
                      {point.sources.map((source, i) => (
                        <span key={source.href}>
                          {i > 0 ? "; " : null}
                          <a
                            href={source.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary underline underline-offset-4"
                          >
                            {source.label}
                          </a>
                        </span>
                      ))}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </article>
      <ReviewNotes
        draftKey="page:priorities"
        comments={data.comments}
        queryKey={["review-page", "priorities"]}
      />
    </>
  );
}
