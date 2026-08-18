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
  {
    id: "ufb-archive-2122",
    label: "East Brunswick Twp advertised enrollments, 2021–22 User Friendly Budget (state copy)",
    detail:
      "The state's own copy of the district filing, which carries the on-roll counts for the earlier years: 8,416 on 10/15/2019 and 8,277 on 10/15/2020. Useful because the current filing only shows two years at a time.",
    href: "https://www.nj.gov/education/budget/ufb/2122/reports/23/UFB22_1170.pdf",
  },
  {
    id: "ufb-archive-1920",
    label: "East Brunswick Twp, 2019–20 User Friendly Budget (state copy)",
    detail: "Carries the 10/13/2017 on-roll count of 8,201, the oldest figure currently sourced here.",
    href: "https://www.nj.gov/education/budget/ufb/1920/reports/23/UFB20_1170.pdf",
  },
  {
    id: "district-acfr",
    label: "East Brunswick Public Schools Annual Comprehensive Financial Report",
    detail:
      "The audited financials filed with the state. Its enrollment table is compiled differently from the budget filing's on-roll count, which is why the two do not match year for year.",
    href: "https://www.nj.gov/education/finance/fp/acfr/search/25/1170.pdf",
  },
  {
    id: "rutgers-multipliers",
    label: "David Listokin, \u201cWho Lives in New Jersey Housing?\u201d, Rutgers CUPR, November 2018",
    detail:
      "The standard New Jersey demographic multiplier study, built on 2012\u20132016 American Community Survey microdata. It reports school-age children per unit by structure type, tenure, and bedroom count, and it documents the long decline in those rates \u2014 the average four-bedroom single-family detached home went from 1.21 public school children in 1980 to 0.85 in 2016.",
    href: "https://waynetownship.com/wp-content/uploads/2021/02/Who%20lives%20in%20New%20Jersey%20Housing%20-%202018.pdf",
  },
  {
    id: "patch-route18",
    label: "Patch, \u201cRt. 18 Project To Give East Brunswick A \u2018Cohesive Look\u2019: Officials\u201d",
    detail:
      "Coverage of the October 2022 council update by Michael Hughes of the East Brunswick Redevelopment Agency, including his statement that the PILOT program does not affect what the school district receives, and the Vermella figures: about $1 million in taxes from the site before, roughly $4.5 million projected to the township afterward.",
    href: "https://patch.com/new-jersey/eastbrunswick/rt-18-project-give-east-brunswick-cohesive-look-official",
  },
  {
    id: "patch-golden-triangle",
    label: "Patch, \u201cMayor Unveils Golden Triangle Deal\u201d",
    detail:
      "The 2011 settlement with Toll Brothers at Route 18 and Tices Lane: a concept for roughly 200 to 400 residential units capped at 10 percent three-bedroom, with a PILOT starting at $550,000 a year and rising as units are completed.",
    href: "https://patch.com/new-jersey/eastbrunswick/mayor-unveils-golden-triangle-deal",
  },
  {
    id: "eb-mayor-press-2024",
    label: "Press Release from the Office of the Mayor, March 28, 2024",
    detail:
      "Mayor Brad Cohen's summary of the revisions to the Route 18 South redevelopment plan presented to the council on March 14, 2024: apartments cut from the original 1,280 proposed to 535, a reduction of 745 units; 218 townhouses marketed as for-sale; several acres dedicated to parks and community use; a hotel with retail and a conference center in place of a planned third township parking garage.",
    href: "https://www.eastbrunswick.org/DocumentCenter/View/8429/Press-Release-from-the-Office-of-the-Mayor-32824",
  },
  {
    id: "eb-rt18-plan-2023",
    label: "Route 18 Corridor Redevelopment Plan, amended November 2023",
    detail:
      "The township's adopted redevelopment plan for the corridor from Ruth Street to Lake Avenue, prepared by DMR Architects, listing the blocks and lots covered and the permitted uses and densities the Vermella project is built under.",
    href: "https://www.eastbrunswick.org/DocumentCenter/View/8430/East-Brunswick-Redevelopment-Plan-Amendment---Rt-18-Corridor",
  },
  {
    id: "eb-resolution-25-63",
    label: "Township of East Brunswick Resolution 25-63, adopted January 6, 2025",
    detail:
      "The resolution adopting the township's Fourth Round affordable housing obligations under P.L. 2024, c.2. It records the state Department of Community Affairs' non-binding calculation of 170 present need and 314 prospective need, the council's acceptance of the 170, and its determination of a reduced prospective need of 265 for 2025 through 2035.",
    href: "https://www.eastbrunswick.org/DocumentCenter/View/9644/Resolution-25-63---Resolution-Adopting-the-Fourth-Round-of-Affordable-Housing-Obligations",
  },
  {
    id: "eb-court-order-2025",
    label:
      "Superior Court of New Jersey, Middlesex County, Docket MID-L-000119-25, filed April 24, 2025",
    detail:
      "The order fixing East Brunswick's present need and prospective need obligations for the Fourth Round housing cycle, following the township's declaratory judgment action under the Fair Housing Act. The obligation is court-supervised and runs through 2035.",
    href: "https://www.eastbrunswick.org/DocumentCenter/View/10061",
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