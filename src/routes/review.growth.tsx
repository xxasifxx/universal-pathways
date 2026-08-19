import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { ReviewNotes } from "@/components/review-notes";
import { getReviewPage } from "@/lib/review-gate.functions";

export const Route = createFileRoute("/review/growth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Township growth — review room" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ReviewGrowth,
});

function ReviewGrowth() {
  const fetchPage = useServerFn(getReviewPage);
  const query = useQuery({
    queryKey: ["review-page", "growth"],
    queryFn: () => fetchPage({ data: { page: "growth" } }),
  });

  if (query.isLoading) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">Loading…</p>;
  }
  const data = query.data;
  if (!data || data.locked || !("growth" in data) || !data.growth) return null;
  const { growth } = data;

  return (
    <>
      <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="eyebrow text-primary">Research — not public</p>
        <h1 className="mt-3 text-4xl leading-[1.05] sm:text-5xl">{growth.title}</h1>
        <p className="mt-4 rounded-lg border border-dashed border-border p-4 text-sm leading-relaxed text-muted-foreground">
          {growth.context}
        </p>

        {growth.blocks.map((block, i) => (
          <section key={block.heading ?? i} className="mt-10">
            {block.heading ? <h2 className="text-2xl leading-tight sm:text-3xl">{block.heading}</h2> : null}
            {block.body.map((para) => (
              <p key={para.slice(0, 40)} className="mt-4 leading-relaxed text-foreground/90">
                {para}
              </p>
            ))}
          </section>
        ))}

        {growth.sources.length ? (
          <section className="mt-12 border-t border-border pt-8">
            <h2 className="text-xl">Sources</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {growth.sources.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline underline-offset-4"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
      <ReviewNotes draftKey="page:growth" comments={data.comments} queryKey={["review-page", "growth"]} />
    </>
  );
}