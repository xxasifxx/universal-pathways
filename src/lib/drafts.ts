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
    title: "Growth, and what decides who stays",
    kind: "internal",
    context:
      "Not published anywhere. An argument, not a finding — read it for whether it holds up, and for anything a reader could fairly call unfair to the township.",
    blocks: [
      {
        heading: "The question, put the right way round",
        body: [
          "The usual version of this argument treats new housing as an input and children as the output: count the bedrooms, apply a multiplier, brace for the students. That is a planner's question, and it is the smaller one.",
          "A two-bedroom apartment on Route 18 has no fixed demographic destiny. The people in it are mostly young, and within a few years they decide whether to have children here or somewhere else. They make that decision by looking at the schools. Whether the corridor matures into family neighborhoods or sorts toward seniors and short-stay renters is downstream of how good East Brunswick's schools are believed to be. The housing does not determine the schools. The schools determine what the housing becomes.",
        ],
      },
      {
        heading: "A decade of arrivals, at the age when people choose a town",
        body: [
          "The scale is real and it is on the record. Mayor Cohen's March 28, 2024 press release describes the revised Route 18 South redevelopment plan, running from Ruth Street to Lake Avenue: apartments cut from the 1,280 originally proposed down to 535, plus 218 townhouses marketed as for-sale units, several acres of dedicated public space, and a hotel replacing a planned third township parking garage.",
          "Ahead of that, and larger over time, is the state obligation. Under P.L. 2024, c.2 the Department of Community Affairs calculated East Brunswick's Fourth Round affordable housing numbers at 170 present need and 314 prospective need. The council adopted Resolution 25-63 on January 6, 2025 accepting the 170 and determining a reduced prospective need of 265, and the Superior Court fixed the obligations in April 2025. That obligation runs from 2025 to 2035, it is court-supervised, and the township is meeting part of it by zoning for inclusionary townhouses. No board of education vote touches any of it.",
          "The number of units is not the point of citing all this. The point is that a decade of arrivals is being seated in town at exactly the life stage where schools are the deciding factor.",
        ],
      },
      {
        heading: "Enrollment has been flat, and that is the honest starting point",
        body: [
          "Pulled from the district's own budget filings, which the state posts year by year. On-roll count as of the October snapshot: 8,201 in 2017, 8,416 in 2019, 8,277 in 2020, 8,456 in 2024, 8,393 in 2025, and 8,559 estimated for 2026.",
          "So enrollment is essentially flat across those nine years, inside a band of about 350 students with no sustained climb. Whatever the apartments have done so far, they have not produced a surge, and this page says that before it says anything else. Anyone arguing that new housing is about to flood the schools is arguing against nine years of the district's own filings.",
          "Flat enrollment is not the same as settled. It means the current households are the ones already committed to the town. What the next decade of arrivals does is unwritten, and the district has more influence over it than anyone else does.",
          "The NJDOE School Performance Reports give lower totals for the same years (8,175 in 2021-22, 8,217 in 2022-23, 8,197 in 2023-24) because they count on a different basis from the budget filing's on-roll subtotal. Do not mix the two series in one chart. Verify which basis each figure uses before printing it.",
        ],
      },
      {
        heading: "They pay the levy, and they vote",
        body: [
          "76.4 percent of a $209,216,947 budget is raised locally, a $159,811,059 tax levy. People moving into new housing pay into that and vote in district elections. Whether they vote as residents invested in a school system they intend to use, or as residents paying for something they have written off, depends on what they conclude in their first few years here.",
          "A district that is merely adequate does not lose a referendum in one dramatic night. It loses slowly, to ambivalence: a majority with no particular stake declining to fund more than the minimum, which makes the district worth less to the next cohort, which makes the ambivalent majority larger. That is a slow process and it is very hard to reverse once it starts, because the households who would have argued the other way moved to a town that had already made the case.",
          "Excellence is what has held this together. East Brunswick puts this much of its levy into schools because that reputation is the reason people move here and stay. It is not a possession; it has to be re-earned with every arriving cohort.",
        ],
      },
      {
        heading: "Pre-K is where the decision actually gets made",
        body: [
          "A family decides where to raise children when the first one is two or three years old, before kindergarten, at the point where they are comparing towns and pricing childcare. By the time a district can show a parent its elementary schools, the choice has usually been made somewhere else.",
          "Universal full-day public Pre-K is the one thing a board can offer that arrives in time to matter, and it is a real cost difference for exactly the households deciding whether a two-bedroom here becomes a three-bedroom here. The FY2027 filing carries no preschool appropriation and no preschool education aid, so today the answer East Brunswick gives those families is that they are on their own for two years.",
        ],
      },
      {
        heading: "The high school decision gets read the same way",
        body: [
          "Nobody touring the district reads capital tables. They read whether the town is building for the next twenty years or patching for the next one. The options in front of the board — roughly $11 million to move classrooms, $45 to $49 million for a ninth-grade academy, $325 to $350 million for a high school — are capacity decisions, but they are also the town's answer to what kind of district this intends to be, and any of them goes to voters as a referendum.",
          "The quieter answer is already in the filing: capital outlay down 28.3 percent in two years, maintenance down 3.9 percent, and a capital reserve projected at $256,697. The housing plan runs on a twenty-year horizon. The school capital plan currently runs on about one.",
        ],
      },
      {
        heading: "What this asks the board to do",
        body: [
          "Nothing here is a new promise. It is the reason behind the ones already made.",
          "Public full-day Pre-K, because it is the earliest and cheapest point at which a family decides to stay.",
          "Decide the high school on a twenty-year horizon, because the housing plan already runs on one.",
          "Audit the master plan and publish the dashboard: units approved and occupied, enrollment by grade, capacity by building, once a year, so the argument is about facts instead of impressions.",
          "Put a board voice on the record before financial agreements are signed, so school impact is raised while terms are still open.",
        ],
      },
      {
        heading: "Still open",
        body: [
          "Occupancy dates for the corridor projects. Without them the enrollment series cannot be lined up against the buildings, which is why nothing here tries to.",
          "The statutory distribution of a PILOT service charge, read directly out of N.J.S.A. 40A:20-12 rather than from how officials describe it.",
          "The 2022 Statistical Forecasting enrollment projection the district commissioned, and any update to it.",
          "Building-level utilization figures. Districtwide enrollment being flat says nothing about whether a particular elementary school is full.",
          "How the district's state aid has actually moved while enrollment stayed flat.",
        ],
      },
      {
        heading: "Rules held while writing this",
        body: [
          "No projected enrollment, no multiplier arithmetic, no per-pupil cost multiplied out into a total. Every one of those produces a frightening number no source supports.",
          "Nobody is the villain. The township negotiated 745 apartments out of the original plan and is complying with a state mandate it did not write.",
          "The central claim — that school quality shapes who eventually lives in new housing — is a judgment, not a finding, and it reads as one. The figures around it are sourced; the argument is argued.",
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
  "Read these the way an opponent would. The pages are long and detailed, and detail is exactly what gets clipped out of context.",
  "Flag three things: a claim that isn't carried by its source, a sentence that could be quoted back as a promise Saqeeb can't keep on a nine-member board, and anything a competing campaign could lift wholesale.",
  "If you know the local history behind a number, say so. Most of this was reconstructed from public filings, and a person who sat through the meetings knows things the filings don't record.",
];