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
  {
    key: "growth:apartments-enrollment",
    title: "Apartment growth and school enrollment — research brief",
    kind: "internal",
    context:
      "Not published anywhere. A public page only gets written after the research comes back and reviewers clear it.",
    blocks: [
      {
        heading: "The question",
        body: [
          "East Brunswick has added a lot of apartments through redevelopment, and apartments attract young families. The claim worth making is that those units are putting students into our schools faster than the revenue that follows them — and that is an empirical question we cannot currently answer. A page on this has to establish four things before it says anything: how many units have been approved and built, how many school-age children units like those actually generate, what district enrollment has actually done over the same years, and what revenue arrives alongside those students. Until each of those has a public source behind it, there is no page.",
        ],
      },
      {
        heading: "What we already have",
        body: [
          "The district adopted a $209,216,947 general fund budget for 2026-27 (FY2027 User Friendly Budget).",
          "Students on roll: 8,559 estimated for 10/15/2026, against 8,393 actual the prior year. That is the only enrollment movement currently sourced on this site, and one year is not a trend.",
          "76.4% of the general fund is raised locally — a $159,811,059 tax levy against the $209,216,947 total. State aid is 19.8%; everything else, federal money included, is under 4%.",
          "Per-pupil cost of $20,731, from the same filing.",
          "Township officials describe an ordinary property tax bill as roughly 65% schools, 20% township, 15% county, and a payment in lieu of taxes as roughly 95% township, 5% county, and none directly to the schools.",
        ],
      },
      {
        heading: "What is unverified",
        body: [
          "Unit counts by project — how many multifamily units have been approved, and how many are actually occupied.",
          "Occupancy dates, so enrollment can be looked at against the buildings rather than asserted alongside them.",
          "Bedroom mix, because student generation depends on it far more than on unit count.",
          "Published student-generation rates for New Jersey multifamily housing that could be applied to that mix.",
          "Whether enrollment growth to date tracks the new buildings or something else entirely.",
          "Which of those buildings sit under a PILOT, and on what terms.",
          "How state aid responds when enrollment rises, under the funding formula as it currently operates.",
        ],
      },
      {
        heading: "Rules for this page",
        body: [
          "No projected enrollment. We do not multiply units by a rate and print the result as a number of children.",
          "No per-student cost multiplied out into a total. That produces a frightening figure that no source supports.",
          "No attributing a trend to a cause the data does not establish. If enrollment rose and apartments opened in the same years, that is what we say.",
          "No opponent framing. The township negotiated these agreements lawfully; the question is what the board should be asking about them.",
          "Where the public record is silent, the page says so, the same way the PILOT explainer does.",
        ],
      },
    ],
    sources: [
      {
        label: "East Brunswick Redevelopment Agency, agenda and minutes archive",
        href: "https://www.eastbrunswick.org/AgendaCenter/Redevelopment-Agency-2",
      },
      {
        label: "East Brunswick Township, all boards and committees agendas and minutes",
        href: "https://www.eastbrunswick.org/AgendaCenter",
      },
      {
        label:
          "TAPinto East Brunswick, \u201cBreak Down Of PILOT Agreements, Explaining How Redevelopment Is Financed\u201d",
        href: "https://www.tapinto.net/towns/east-brunswick/sections/business-and-finance/articles/break-down-of-pilot-agreements-explaining-how-redevelopment-is-financed",
      },
      {
        label: "Eyes on EB, coverage of the PILOT debate",
        href: "https://eyesoneb.com/understanding-the-pilot-debate-in-east-brunswick-after-recent-town-council-discussion/",
      },
      {
        label: "East Brunswick Public Schools FY2027 User Friendly Budget",
        href: "https://www.ebnet.org/departments/financial-services/budget-information/fy2027-user-friendly-budget",
      },
      {
        label: "NJDOE enrollment reporting",
        href: "https://www.nj.gov/education/doedata/enr/",
      },
      {
        label: "NJ Department of Education school finance filings",
        href: "https://www.nj.gov/education/finance/fp/",
      },
    ],
  },
];

export const REVIEW_BRIEF = [
  "Read these the way an opponent would. The pages are long and detailed, and detail is exactly what gets clipped out of context.",
  "Flag three things: a claim that isn't carried by its source, a sentence that could be quoted back as a promise Saqeeb can't keep on a nine-member board, and anything a competing campaign could lift wholesale.",
  "If you know the local history behind a number, say so. Most of this was reconstructed from public filings, and a person who sat through the meetings knows things the filings don't record.",
];