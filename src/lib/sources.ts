/**
 * Where every number on this site comes from, and what I assumed on top of it.
 * Anything not listed here as a published figure is a model, not a fact.
 */

export const BUDGET_YEAR = "2024–2025";

export type Source = {
  id: string;
  label: string;
  detail: string;
  href?: string;
};

export const SOURCES: Source[] = [
  {
    id: "district-budget",
    label: `East Brunswick Public Schools ${BUDGET_YEAR} adopted operating budget`,
    detail:
      "The $229 million total and the six spending categories come from the district's own budget presentation and user-friendly budget filing for the 2024–2025 school year. Board budget materials are posted with the meeting agendas.",
    href: "https://www.ebnet.org",
  },
  {
    id: "njdoe",
    label: "NJ Department of Education school finance filings",
    detail:
      "Every New Jersey district files a user-friendly budget and audited financials with the state. That is the check on anything here: if a category on this site is off, the state filing is what proves it.",
    href: "https://www.nj.gov/education/finance/fp/",
  },
  {
    id: "enrollment",
    label: "District enrollment and building counts",
    detail:
      "Roughly 8,100 students across 11 schools, from the district's published enrollment reporting. Enrollment moves a little every year, so per-student figures move with it.",
    href: "https://www.ebnet.org",
  },
];

export type Assumption = {
  id: string;
  label: string;
  value: string;
  why: string;
};

export const ASSUMPTIONS: Assumption[] = [
  {
    id: "students",
    label: "Students",
    value: "8,100",
    why: "Published district enrollment, rounded to the hundred. Dividing the operating budget by this gives the average per-student figure the calculator starts from.",
  },
  {
    id: "households",
    label: "Households",
    value: "18,400",
    why: "Census household count for East Brunswick Township. Used only to translate a budget change into a typical household tax bill.",
  },
  {
    id: "levy",
    label: "Share of the budget raised locally",
    value: "68%",
    why: "The rest is state aid, federal aid, and other revenue. This is the fraction of any budget change that actually lands on local taxpayers rather than on Trenton.",
  },
  {
    id: "school-share",
    label: "Share of a property tax bill that funds schools",
    value: "54%",
    why: "The remainder funds township and county government. Applied so a scenario shows the school portion of your bill, not the whole bill.",
  },
  {
    id: "grade-weights",
    label: "Grade-level weighting",
    value: "0.88 / 0.98 / 1.15",
    why: "Elementary, middle, and high school don't cost the same. High school carries labs, electives, APs, and athletics; elementary carries larger homerooms and fewer specialists. These multipliers reflect the typical NJ spread, not an East Brunswick-specific study — the district has that data and I want them publishing it.",
  },
  {
    id: "service-addons",
    label: "Service add-on costs",
    value: "Modeled averages",
    why: "Special education, ESL, busing, food service, and athletics add-ons are averages backed out of the matching budget line divided by roughly how many students use that service. An individual student's real cost can be far higher or lower — an out-of-district placement alone can exceed the whole average.",
  },
  {
    id: "levers",
    label: "Board-meeting sliders",
    value: "Unit costs",
    why: "Each slider uses a modeled cost per unit — per teacher, per aide, per route. Treat the direction and the order of magnitude as solid and the decimal places as rough.",
  },
];

/** One-liner used under charts and calculators across the site. */
export const SOURCE_LINE = `Modeled from the East Brunswick Public Schools ${BUDGET_YEAR} adopted operating budget. These are aggregate public figures, not district-supplied per-student data, and nothing here is produced by district staff.`;