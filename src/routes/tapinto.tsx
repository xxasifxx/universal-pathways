import { createFileRoute } from "@tanstack/react-router";

import { TAPINTO_QUESTIONS } from "@/lib/tapinto";

const TITLE = "TAPinto Candidate Questionnaire | Muhammad Saqeeb";
const DESCRIPTION =
  "Muhammad Saqeeb answers TAPinto East Brunswick's full Board of Education candidate questionnaire.";

export const Route = createFileRoute("/tapinto")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://saqeeb.org/tapinto" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://saqeeb.org/tapinto" }],
  }),
  component: TapIntoQuestionnaire,
});

function TapIntoQuestionnaire() {
  return (
    <>
      <header className="border-b border-border bg-primary py-14 text-primary-foreground sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-primary-foreground/70">Know Your Candidates</p>
          <h1 className="mt-3 max-w-4xl text-5xl leading-none sm:text-7xl">
            TAPinto East Brunswick Questionnaire
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-lg leading-8 text-primary-foreground/85 sm:text-xl">
            My complete responses on my background, priorities, the school budget, technology,
            and how I would serve on the Board of Education.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <ol className="space-y-14 sm:space-y-20">
          {TAPINTO_QUESTIONS.map((item, index) => (
            <li
              key={item.question}
              className="grid scroll-mt-24 gap-5 border-b border-border pb-14 last:border-b-0 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-8 sm:pb-20"
            >
              <p aria-hidden="true" className="font-display text-6xl leading-none text-gold sm:text-7xl">
                {String(index + 1).padStart(2, "0")}
              </p>
              <article className="min-w-0 max-w-3xl">
                <h2 className="font-sans text-2xl font-black leading-tight text-foreground sm:text-3xl">
                  {item.question}
                </h2>
                <div className="mt-7 space-y-5 font-sans text-lg leading-8 text-foreground/90">
                  {item.answers.map((answer, answerIndex) => (
                    <p
                      key={`${index}-${answerIndex}`}
                      className={
                        answer.length < 80
                          ? "border-l-4 border-primary pl-5 font-display text-3xl leading-tight text-primary"
                          : undefined
                      }
                    >
                      {answer}
                    </p>
                  ))}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}