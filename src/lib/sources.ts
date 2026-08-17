/**
 * Where every number on this site comes from, and what I assumed on top of it.
 * Anything not listed here as a published figure is a model, not a fact.
 */

export const BUDGET_YEAR = "2026–2027";

/** The district page where the adopted budget PDF is posted. */
export const BUDGET_PDF_URL =
  "https://www.ebnet.org/departments/financial-services/budget-information/fy2027-user-friendly-budget";

export type Source = {
  id: string;
  label: string;
  detail: string;
  href?: string;
};

export const SOURCES: Source[] = [
  {
    id: "district-budget",
    label: `East Brunswick Public Schools FY2027 User Friendly Budget (${BUDGET_YEAR}), final adoption`,
    detail:
      "Every dollar figure on the dashboard is read out of this 64-page filing, generated May 12, 2026: the $209,216,947 General Fund Grand Total, the individual appropriation lines behind each category, the revenue side, the fund balances, the per-pupil costs, and the tax rates.",
    href: BUDGET_PDF_URL,
  },
  {
    id: "njdoe",
    label: "NJDOE Taxpayers' Guide to Education Spending",
    detail:
      "The state publication the budget filing itself cites for the per-pupil comparison figures, and the place to check East Brunswick against other districts.",
    href: "http://www.nj.gov/education/guide/",
  },
  {
    id: "njdoe-finance",
    label: "NJ Department of Education school finance filings",
    detail:
      "Every New Jersey district files a user-friendly budget and audited financials with the state. If a figure here is off, the state filing is what proves it.",
    href: "https://www.nj.gov/education/finance/fp/",
  },
  {
    id: "sehbp-law",
    label: "P.L. 2020, c.44 — school employee health benefit plans",
    detail:
      "The law setting which plans the School Employees' Health Benefits Program offers and how employee contributions for the Educators and Garden State plans are calculated as a percentage of salary.",
    href: "https://pub.njleg.gov/bills/2020/PL20/44_.HTM",
  },
  {
    id: "sehbp-manual",
    label: "NJ Division of Pensions & Benefits, SHBP/SEHBP employer administration manual",
    detail:
      "The manual describing how a district joins or leaves the state health program by resolution, and how medical, prescription drug, and dental coverage are elected separately.",
    href: "https://www.nj.gov/treasury/pensions/documents/guidebooks/epbam-shbp-sehbp.pdf",
  },
  {
    id: "osc-hif",
    label: "NJ Office of the State Comptroller, September 9, 2025",
    detail:
      "The report finding conflicts of interest and procurement violations in the health insurance funds that serve local governments and school boards, including about $36 million paid by the Schools Health Insurance Fund to one firm and its affiliate from 2021 to 2025.",
    href: "https://www.nj.gov/comptroller/news/2025/20250909.shtml",
  },
  {
    id: "tpaf",
    label: "NJDOE, TPAF and Social Security contributions paid by the State",
    detail:
      "The NJDOE notice citing N.J.S.A. 18A:66-90, under which the State pays the pension contribution for district staff and districts reimburse only the portion tied to federally funded salaries.",
    href: "https://www.nj.gov/education/broadcasts/2025/aug/27/FederalProgramsPensionandSocialSecurityReimbursementtotheStateofNewJerseyforContributionsPaidbytheState.pdf",
  },
  {
    id: "rod-grants",
    label: "NJDOE, grant program for school facilities projects in Regular Operating Districts",
    detail:
      "The state page setting out that districts are eligible for at least 40 percent of approved eligible project costs, with the balance raised locally.",
    href: "https://www.nj.gov/education/facilities/projectapplication/rod.shtml",
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
    label: "Enrollment",
    value: "8,559",
    why: "Students on roll as of the district's 10/15/2026 estimate: 7,193 regular, 1,365 special education, one shared-time. The prior year's actual was 8,393.",
  },
  {
    id: "grouping",
    label: "Category grouping",
    value: "This site's, not the district's",
    why: "The filing lists roughly two dozen appropriation lines. The nine categories on the dashboard are those lines added together, chosen so the subtotals still reconcile to the filing's own \u201cTotal General Current Expense\u201d and \u201cGeneral Fund Grand Total\u201d.",
  },
  {
    id: "levy",
    label: "Share of the budget raised locally",
    value: "76.4%",
    why: "The $159,811,059 local tax levy divided by the $209,216,947 general fund total. Not an assumption: both numbers are printed in the filing. State aid is 19.8% and everything else, including federal money, is under 4%.",
  },
];

/**
 * The single disclaimer shown under the dashboard. It replaces the two that
 * used to sit one after the other, and it describes what was actually done.
 */
export const SOURCE_LINE = `Every figure here was taken from the East Brunswick Public Schools FY2027 User Friendly Budget for ${BUDGET_YEAR}, adopted and filed with the state and generated May 12, 2026. The categories are not the district's; they were built by adding individual appropriation lines from that filing until the subtotals matched the filing's own "Total General Current Expense" of $193,306,720 and "General Fund Grand Total" of $209,216,947. Nothing here was produced by district staff, and where this page and the state filing disagree, the filing is what counts.`;