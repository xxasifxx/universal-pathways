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
        heading: "Enrollment, nine years of it",
        body: [
          "Pulled from the district's own budget filings, which the state posts year by year. On-roll count as of the October snapshot: 8,201 in 2017, 8,416 in 2019, 8,277 in 2020, 8,456 in 2024, 8,393 in 2025, and 8,559 estimated for 2026.",
          "So enrollment is essentially flat across those nine years, moving inside a band of about 350 students with no sustained climb. Whatever the apartments have done so far, they have not produced a visible enrollment surge — and the honest version of this page has to say that out loud before it says anything else.",
          "The NJDOE School Performance Reports give lower totals for the same years (8,175 in 2021-22, 8,217 in 2022-23, 8,197 in 2023-24) because they count on a different basis from the budget filing's on-roll subtotal. Do not mix the two series in one chart. Verify which basis each figure uses before printing it.",
          "Board member Mark Carangelo said in late 2023, in response to a presentation on students per class, that the district was \u201cnot at capacity.\u201d That statement needs a minutes citation with a date before it goes on a public page — right now it comes secondhand.",
        ],
      },
      {
        heading: "What the redevelopment record shows",
        body: [
          "Vermella East Brunswick, on the Route 18 corridor, developed by Russo Development and River Development. Michael Hughes, executive director of the Redevelopment Agency, told the council in October 2022 that the site had been paying about $1 million in taxes and that the agreement was projected to bring the township about $4.5 million. Unit count, bedroom mix, and occupancy date are not in anything we have fetched.",
          "The Golden Triangle site at Route 18 and Tices Lane, a 2011 settlement with Toll Brothers: a concept for roughly 200 to 400 residential units, capped at 10 percent three-bedroom, with a PILOT starting at $550,000 a year and rising as units are completed. Whether that concept was built as described is unverified.",
          "That is the entire published inventory we have. No comprehensive list of multifamily approvals since 2015, no ordinance or resolution numbers, no occupancy dates. A page that implies we know the total number of new units would be inventing it.",
          "Hughes also said flatly that the PILOT program \u201cdoes not impact the funds the school district, the library, the police department or other public services receive from taxes.\u201d That is the township's position on the record, and it is in direct tension with the tax-split figures above. The page should quote him and then set out what the statute actually distributes, rather than resolve the disagreement by assertion.",
        ],
      },
      {
        heading: "Student generation rates",
        body: [
          "The standard New Jersey reference is David Listokin's \u201cWho Lives in New Jersey Housing?\u201d, published by the Rutgers Center for Urban Policy Research in November 2018 and built on 2012\u20132016 American Community Survey microdata. It reports school-age children per unit by structure type, tenure, and bedroom count, separating newer housing built 2000\u20132016 from all housing.",
          "The direction of travel in that study matters more for this page than any single figure: multipliers have fallen substantially. The average four-bedroom single-family detached home went from 1.21 public school children in 1980 to 0.85 in 2016. Rental multifamily rates are lower still, and older multipliers are routinely challenged in planning proceedings for overstating what dense rental buildings actually generate.",
          "We do not yet have the specific per-unit rates by bedroom count transcribed out of that study, and without East Brunswick's bedroom mix there is nothing to apply them to. Both halves are missing, which is exactly why nothing gets multiplied.",
        ],
      },
      {
        heading: "The funding mechanics",
        body: [
          "A payment in lieu of taxes is authorized by the Long Term Tax Exemption Law, N.J.S.A. 40A:20-1 et seq., under redevelopment areas designated through the Local Redevelopment and Housing Law, N.J.S.A. 40A:12A-1 et seq. Under N.J.S.A. 40A:20-12 the redeveloper pays an annual service charge to the municipality instead of ordinary property tax on the improvements.",
          "The statutory distribution of that service charge is the number this whole page turns on, and we have not yet read it out of the statute text itself. Get 40A:20-12 directly from the state before any percentage goes on a public page.",
          "There is a real counterargument to state fairly. Improvements under a long-term exemption are left out of the county equalization tables, so the town's equalized valuation stays lower than it would if those buildings were on the tax roll. Because state equalization aid is calculated against local property wealth, keeping that valuation down protects the district's aid from a reduction it would otherwise take. Whether that protection is worth more or less than the forgone school share of the levy is the actual question, and it is answerable with numbers we do not have yet.",
        ],
      },
      {
        heading: "What is unverified",
        body: [
          "A complete inventory of multifamily approvals since 2015. We have two projects; there are certainly more.",
          "Unit counts, bedroom mixes, and occupancy dates for Vermella and for anything built after it. Without occupancy dates the enrollment series cannot be lined up against the buildings.",
          "Ordinance and resolution numbers for each redevelopment designation and each financial agreement.",
          "The per-unit multipliers from the Rutgers study, transcribed by bedroom count and tenure.",
          "The statutory distribution of the annual service charge, read directly from N.J.S.A. 40A:20-12.",
          "The full terms of each East Brunswick PILOT: length, escalators, and what happens at expiration.",
          "A minutes citation for the Carangelo capacity remark, and any building-level utilization figures.",
          "The 2022 Statistical Forecasting enrollment projection the district commissioned, and any update to it.",
          "How the district's state aid has actually moved as enrollment stayed flat.",
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