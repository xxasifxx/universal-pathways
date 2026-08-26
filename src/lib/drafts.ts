import { DEBATE_QUESTIONS } from "@/lib/campaign";
import { LEVER_LABELS, PRIORITY_DETAIL } from "@/lib/review-content/priorities.server";

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
  ...PRIORITY_DETAIL.flatMap((priority) =>
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
            { heading: "How it would work", body: [...detail.mechanism] },
            { heading: "Still unknown", body: [detail.openQuestion] },
          ],
          sources: detail.sources ? detail.sources.map((s) => ({ ...s })) : [],
        };
      }),
  ),
  {
    key: "debate:prep-2026-09-30",
    title: "Debate questions",
    kind: "internal",
    context: "Private list for drafting answers before the debate.",
    blocks: [{ heading: "Questions", body: [...DEBATE_QUESTIONS] }],
    sources: [],
  },
  {
    key: "growth:apartments-enrollment",
    title: "Housing growth and school enrollment",
    kind: "internal",
    context:
      "Private draft. Check every claim and flag anything that treats an opinion as a fact.",
    blocks: [
      {
        heading: "The question",
        body: [
          "Housing projections estimate how many students new units may add. They do not show whether young residents will stay in East Brunswick when they have children.",
          "Schools are one factor in that decision. Strong schools may help keep families in town. This is a working argument, not a documented finding about the Route 18 corridor.",
        ],
      },
      {
        heading: "Housing planned through 2035",
        body: [
          "The scale is real and it is on the record. Mayor Cohen's March 28, 2024 press release describes the revised Route 18 South redevelopment plan, running from Ruth Street to Lake Avenue: apartments cut from the 1,280 originally proposed down to 535, plus 218 townhouses marketed as for-sale units, several acres of dedicated public space, and a hotel replacing a planned third township parking garage.",
          "Ahead of that, and larger over time, is the state obligation. Under P.L. 2024, c.2 the Department of Community Affairs calculated East Brunswick's Fourth Round affordable housing numbers at 170 present need and 314 prospective need. The council adopted Resolution 25-63 on January 6, 2025 accepting the 170 and determining a reduced prospective need of 265, and the Superior Court fixed the obligations in April 2025. That obligation runs from 2025 to 2035, it is court-supervised, and the township is meeting part of it by zoning for inclusionary townhouses. No board of education vote touches any of it.",
          "These plans will bring new residents to East Brunswick over the next decade. The district should track enrollment and building capacity as the projects open.",
        ],
      },
      {
        heading: "Enrollment has been flat",
        body: [
          "Pulled from the district's own budget filings, which the state posts year by year. On-roll count as of the October snapshot: 8,201 in 2017, 8,416 in 2019, 8,277 in 2020, 8,456 in 2024, 8,393 in 2025, and 8,559 estimated for 2026.",
          "Enrollment stayed within a band of about 350 students over those nine years. The district's filings do not show a surge from new housing.",
          "Future enrollment remains uncertain. The district should compare enrollment with project occupancy dates as new housing opens.",
          "The NJDOE School Performance Reports give lower totals for the same years (8,175 in 2021-22, 8,217 in 2022-23, 8,197 in 2023-24) because they count on a different basis from the budget filing's on-roll subtotal. Do not mix the two series in one chart. Verify which basis each figure uses before printing it.",
        ],
      },
      {
        heading: "New residents pay school taxes and vote",
        body: [
          "Local property taxes provide 76.4 percent of the $209,216,947 budget, or $159,811,059. Residents of new housing contribute to that levy and vote in district elections.",
          "The draft needs evidence before making claims about how those residents will vote or whether they plan to use the schools.",
        ],
      },
      {
        heading: "Pre-K and family costs",
        body: [
          "Childcare and preschool costs can affect where families live. Public full-day Pre-K would reduce that cost for participating families.",
          "The FY2027 filing lists no preschool appropriation or preschool education aid. The district would need enrollment estimates, space, staffing, transportation plans, and state funding information before setting a program or cost.",
        ],
      },
      {
        heading: "High school options",
        body: [
          "The board has discussed roughly $11 million to move temporary classrooms, $45 to $49 million in construction for a ninth-grade academy, and $325 to $350 million in hard costs for a new high school. A large project would require voter approval through a bond referendum.",
          "The FY2027 filing shows capital outlay down 28.3 percent in two years, maintenance down 3.9 percent, and a projected capital reserve of $256,697. The district needs a published long-term facilities plan.",
        ],
      },
      {
        heading: "What this asks the board to do",
        body: [
          "Study public full-day Pre-K, including demand, space, staffing, transportation, and state aid.",
          "Publish a long-term high school and facilities plan.",
          "Publish annual figures for housing units approved and occupied, enrollment by grade, and capacity by building.",
          "Ask the township to provide the school district with proposed financial agreements before approval when they may affect school enrollment or revenue.",
        ],
      },
      {
        heading: "Still open",
        body: [
          "Occupancy dates for the corridor projects. Without them the enrollment series cannot be lined up against the buildings, which is why this draft does not attempt that comparison.",
          "The statutory distribution of a PILOT service charge under N.J.S.A. 40A:20-12.",
          "The 2022 Statistical Forecasting enrollment projection the district commissioned, and any update to it.",
          "Building-level utilization figures. Districtwide enrollment being flat says nothing about whether a particular elementary school is full.",
          "How the district's state aid has actually moved while enrollment stayed flat.",
        ],
      },
      {
        heading: "Limits of this draft",
        body: [
          "This draft does not project enrollment or multiply per-pupil spending by an estimated student count. The available sources do not support those calculations.",
          "This draft treats the Route 18 apartment count and the state housing obligation as separate processes. It does not combine them into one housing-growth estimate.",
          "The claim that school quality affects who stays in new housing is an opinion. It should remain labeled as one unless research supports it.",
        ],
      },
    ],
    sources: [
      {
        label: "Press Release from the Office of the Mayor, March 28, 2024 (Route 18 plan revisions)",
        href: "https://www.eastbrunswick.org/DocumentCenter/View/8429/Press-Release-from-the-Office-of-the-Mayor-32824",
      },
      {
        label: "Route 18 Corridor Redevelopment Plan, amended November 2023",
        href: "https://www.eastbrunswick.org/DocumentCenter/View/8430/East-Brunswick-Redevelopment-Plan-Amendment---Rt-18-Corridor",
      },
      {
        label: "Township of East Brunswick Resolution 25-63, Fourth Round housing obligations",
        href: "https://www.eastbrunswick.org/DocumentCenter/View/9644/Resolution-25-63---Resolution-Adopting-the-Fourth-Round-of-Affordable-Housing-Obligations",
      },
      {
        label: "Superior Court order fixing East Brunswick's Fourth Round obligations, April 24, 2025",
        href: "https://www.eastbrunswick.org/DocumentCenter/View/10061",
      },
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
      {
        label: "Patch, \u201cRt. 18 Project To Give East Brunswick A \u2018Cohesive Look\u2019: Officials\u201d",
        href: "https://patch.com/new-jersey/eastbrunswick/rt-18-project-give-east-brunswick-cohesive-look-official",
      },
      {
        label: "Patch, \u201cMayor Unveils Golden Triangle Deal\u201d",
        href: "https://patch.com/new-jersey/eastbrunswick/mayor-unveils-golden-triangle-deal",
      },
      {
        label: "Listokin, \u201cWho Lives in New Jersey Housing?\u201d, Rutgers CUPR, November 2018",
        href: "https://waynetownship.com/wp-content/uploads/2021/02/Who%20lives%20in%20New%20Jersey%20Housing%20-%202018.pdf",
      },
      {
        label: "East Brunswick Twp, 2021\u201322 User Friendly Budget (state copy)",
        href: "https://www.nj.gov/education/budget/ufb/2122/reports/23/UFB22_1170.pdf",
      },
      {
        label: "East Brunswick Twp, 2019\u201320 User Friendly Budget (state copy)",
        href: "https://www.nj.gov/education/budget/ufb/1920/reports/23/UFB20_1170.pdf",
      },
      {
        label: "East Brunswick Public Schools Annual Comprehensive Financial Report",
        href: "https://www.nj.gov/education/finance/fp/acfr/search/25/1170.pdf",
      },
    ],
  },
];

export const REVIEW_BRIEF = [
  "Check each claim against its source.",
  "Flag promises that one board member could not deliver alone and passages that need more context.",
  "Add relevant local history that is missing from the public record.",
];