import { DEBATE_QUESTIONS, LEVER_LABELS, PRIORITIES } from "@/lib/campaign";

/**
 * The review room's material. Everything here is generated from the same
 * campaign data the public pages use, so a reviewer is reading the real text
 * rather than a copy that drifts. Drafts that are not on the public site yet
 * (debate prep) are listed alongside it.
 */
export type DraftBlock = { heading?: string; body: string[] };

export type DraftSection = {
  /** Stable key used for status rows and comments. Do not renumber. */
  key: string;
  title: string;
  kind: "published" | "internal";
  context: string;
  blocks: DraftBlock[];
  sources: { label: string; href: string }[];
};

export const DRAFT_STATUSES = ["drafting", "in-review", "cleared", "hold"] as const;
export type DraftStatus = (typeof DRAFT_STATUSES)[number];

export const STATUS_LABELS: Record<DraftStatus, string> = {
  drafting: "Drafting",
  "in-review": "In review",
  cleared: "Cleared",
  hold: "Hold — do not publish",
};

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export const DRAFT_SECTIONS: DraftSection[] = [
  ...PRIORITIES.flatMap((priority) =>
    priority.points
      .filter((point) => point.detail)
      .map((point) => {
        const detail = point.detail!;
        return {
          key: `priority:${priority.id}:${slug(point.text)}`,
          title: point.text,
          kind: "published" as const,
          context: `${priority.title} · ${LEVER_LABELS[detail.leverKind]} · ${detail.lever}`,
          blocks: [
            { heading: "Mechanism", body: [...detail.mechanism] },
            { heading: "What nobody can answer yet", body: [detail.openQuestion] },
          ],
          sources: detail.sources ? detail.sources.map((s) => ({ ...s })) : [],
        };
      }),
  ),
  {
    key: "debate:prep-2026-09-30",
    title: "Debate preparation — questions to be ready for",
    kind: "internal",
    context: "Not published anywhere. Working answers get drafted against these.",
    blocks: [{ heading: "Questions", body: [...DEBATE_QUESTIONS] }],
    sources: [],
  },
];

export const REVIEW_BRIEF = [
  "Read these the way an opponent would. The pages are long and detailed, and detail is exactly what gets clipped out of context.",
  "Flag three things: a claim that isn't carried by its source, a sentence that could be quoted back as a promise Saqeeb can't keep on a nine-member board, and anything a competing campaign could lift wholesale.",
  "If you know the local history behind a number, say so. Most of this was reconstructed from public filings, and a person who sat through the meetings knows things the filings don't record.",
];