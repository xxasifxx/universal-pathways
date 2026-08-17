/**
 * Campaign-wide constants and content data.
 */

export const CANDIDATE_NAME = "Muhammad Saqeeb";
export const OFFICE = "East Brunswick Board of Education";
export const CONTACT_EMAIL = "ask@saqeeb.org";
export const REGISTRATION_DEADLINE = "October 13th";

/** Secure contribution page managed by ActBlue. */
export const ACTBLUE_DONATION_URL = "https://secure.actblue.com/donate/saqeebforeb";

/** Campaign identifier used for UTM tagging in GA4. */
export const UTM_CAMPAIGN = "saqeeb2026";


/**
 * Build an ActBlue link tagged with UTM parameters so GA4 (and ActBlue's own
 * refcode reporting) can attribute the contribution to the page it came from.
 *
 * @param medium  where the link lives (e.g. "header", "footer", "home-donate")
 * @param content optional detail (e.g. the preset amount clicked)
 */
export function actblueUrl(medium: string, content?: string): string {
  const params = new URLSearchParams({
    utm_source: "saqeeb.org",
    utm_medium: medium,
    utm_campaign: UTM_CAMPAIGN,
  });
  if (content) params.set("utm_content", content);
  params.set("refcode", content ? `${medium}-${content}` : medium);
  return `${ACTBLUE_DONATION_URL}?${params.toString()}`;
}

export const DONATION = {
  committeeName: "Friends Of Saqeeb",
  /** NJ ELEC individual limit per election for a school board candidate committee. */
  maxIndividual: 3000,
  /** Contributions at or above this amount require occupation and employer on the report. */
  reportingThreshold: 300,
} as const;

export const DONATION_AMOUNTS = [5, 10, 25, 50, 100, 250];

/** Campaign social profiles. Set a URL to null to hide that link. */
export const SOCIAL_LINKS: { id: string; label: string; url: string | null }[] = [
  { id: "facebook", label: "Facebook", url: null },
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/saqeeb4eb" },
  { id: "x", label: "X", url: null },
  { id: "linkedin", label: "LinkedIn", url: null },
];

/** Short snippets about Saqeeb — shown at the top of the home page. */
export const WHY_SAQEEB = [
  "Raised in East Brunswick, working-class immigrant family",
  "East Brunswick Public Schools graduate",
  "Community organizer",
  "Data scientist",
  "Brings students, parents, and educators into the decisions",
];

/** Core pitch from the campaign mailer. Used on the home page and priorities page. */
export const PITCH = {
  eyebrow: "Muhammad Saqeeb for East Brunswick Board of Education",
  headline: "A Voice for Excellence",
  problem:
    "Healthcare premiums, special education costs, and repairs on aging buildings are all rising faster than school revenue, and East Brunswick is no exception. When a board runs out of room in the budget, the usual response is to trim programs, leave positions unfilled, and move costs onto families through activity fees and supply lists. Those decisions are made a line at a time, in meetings most people never see, and they add up to a school system that quietly asks parents to pay for things it used to provide.",
  ask: "A board member should be able to explain where the money goes and push for schools families can afford to be part of.",
  badge: "Column #1",
} as const;

/** One-line intro under the portrait on the home page. */
export const INTRO_LINE =
  "Muhammad Saqeeb is running to bring new leadership, transparency, and a student-first perspective to the East Brunswick Board of Education.";

/** Card list shown under the intro. */
export const CREDENTIALS = [
  "Excellence in Community Leadership and Transparency",
  "Advocate for Struggling Students",
  "Supporter of Early Learning Education",
  "Innovative and Future-Oriented",
];

/** The three things Saqeeb will fight for — matching the campaign flyer. */
export const FIGHT_FOR: { id: string; label: string; icon: "users" | "school" | "heart-pulse" }[] = [
  { id: "public-pre-k", label: "Public full-day Pre-K", icon: "users" },
  { id: "modern-high-school", label: "Modern 9-12 high school", icon: "school" },
  { id: "better-healthcare", label: "Better healthcare for school staff", icon: "heart-pulse" },
];

/** Short platform highlights shown with checkmarks on the home page. */
export const PLATFORM_HIGHLIGHTS = [
  {
    id: "affordable-for-all",
    title: "Affordable for All",
    text: "Public full-day Pre-K for every family, no fees to join a club or a team, no student carrying lunch debt, and health coverage that staff can afford to use.",
  },
  {
    id: "students-first",
    title: "Students First",
    text: "Open up advanced courses to the students ready for them, support families arriving with a new language, and grade students on work they do in school.",
  },
  {
    id: "reduce-our-costs",
    title: "Reduce Our Costs",
    text: "Build a 9-12 high school with state construction funding, so the district spends less each year patching buildings that are past their useful life.",
  },
];

/**
 * Adopted 2026-27 General Fund Grand Total, from the district's FY2027 User
 * Friendly Budget (Advertised Appropriations, "General Fund Grand Total").
 */
export const BUDGET_TOTAL = 209_216_947;

/** The budget year every figure on the dashboard is drawn from. */
export const BUDGET_FY = "2026\u201327";

export type BudgetSlice = {
  id: string;
  jargon: string;
  plain: string;
  amount: number;
  note: string;
  color: string;
};

export const BUDGET_SLICES: BudgetSlice[] = [
  {
    id: "instruction",
    jargon: "Instruction — All Programs",
    plain: "Teaching, in every program",
    amount: 73_035_382,
    note: "Regular programs $49.6M, special education $17.7M, basic skills $2.4M, bilingual $1.5M, athletics $1.3M, cocurricular $0.4M, alternative education $0.1M. Salaries in these lines, but not the benefits that go with them.",
    color: "var(--color-chart-1)",
  },
  {
    id: "benefits",
    jargon: "Personal Services — Employee Benefits",
    plain: "Health insurance & pensions",
    amount: 40_357_120,
    note: "Equal to 38.43% of salaries in the 2026-27 proposed budget, up from 30.16% in 2023-24 actuals. The pension side and the employee contribution schedule are set in Trenton. What the district chooses is where it buys coverage and how the plans are built, which is where a board still has room to move.",
    color: "var(--color-chart-2)",
  },
  {
    id: "support",
    jargon: "Undistributed — Student Support Services",
    plain: "Counselors, nurses & child study teams",
    amount: 23_152_279,
    note: "Extraordinary services $5.0M, guidance $4.4M, speech/OT/PT $3.7M, child study teams $3.6M, improvement of instruction $3.0M, health services $1.6M, library $1.1M, staff training $0.4M, attendance and social work $0.3M.",
    color: "var(--color-chart-3)",
  },
  {
    id: "ops",
    jargon: "Undistributed — Operation & Maintenance of Plant",
    plain: "Keeping the buildings running",
    amount: 21_131_868,
    note: "Heat, light, roofs, and custodial staff. Down 3.9% from last year's revised figure, while capital outlay fell too.",
    color: "var(--color-chart-4)",
  },
  {
    id: "transportation",
    jargon: "Undistributed — Student Transportation",
    plain: "Buses",
    amount: 16_278_808,
    note: "Up 8.8% over two years. The district shares transportation services with the Union County Educational Services Commission and fuels its vehicles through the township.",
    color: "var(--color-chart-5)",
  },
  {
    id: "admin",
    jargon: "Undistributed — Administration & Central Services",
    plain: "Principals & central office",
    amount: 12_738_760,
    note: "School administration $5.3M, central services $3.1M, administrative technology $2.4M, general administration $1.9M. Works out to $1,929 per pupil.",
    color: "var(--color-chart-6)",
  },
  {
    id: "charter",
    jargon: "Transfer of Funds to Charter Schools",
    plain: "Money sent to charter schools",
    amount: 7_462_691,
    note: "Paid out for East Brunswick students enrolled in charter schools. Up 26.7% in two years, the second-fastest growing line in the budget.",
    color: "var(--color-chart-1)",
  },
  {
    id: "tuition",
    jargon: "Undistributed — Instruction (Tuition)",
    plain: "Out-of-district placements",
    amount: 6_612_503,
    note: "Tuition paid to other districts and to private special education schools. Up 54.5% in two years, the fastest growing line in the budget.",
    color: "var(--color-chart-3)",
  },
  {
    id: "capital",
    jargon: "Capital Outlay",
    plain: "Buildings & equipment",
    amount: 8_447_536,
    note: "Facilities work $8.1M, equipment $0.4M. Down 28.3% from two years ago, while the capital reserve fell from $3.1M to an estimated $257,000.",
    color: "var(--color-chart-5)",
  },
];

/**
 * General fund revenue, 2026-27 proposed. Sums to the same $209,216,947 as the
 * appropriations side.
 */
export const BUDGET_REVENUE = [
  {
    id: "levy",
    label: "Local property tax levy",
    amount: 159_811_059,
    note: "Raised from East Brunswick property owners. Up 6.5% in one year and 10.2% over two.",
  },
  {
    id: "state",
    label: "State aid",
    amount: 41_368_043,
    note: "Equalization aid $23.3M, special education aid $10.4M, transportation aid $4.1M, extraordinary aid $1.8M, security aid $1.7M. Down 1.3% over two years.",
  },
  {
    id: "fund-balance",
    label: "Budgeted fund balance",
    amount: 2_322_500,
    note: "Savings spent to close the gap rather than raise the levy further.",
  },
  {
    id: "transfers",
    label: "Transfers from other funds",
    amount: 2_537_290,
    note: "Money moved in from other district funds.",
  },
  {
    id: "tuition-received",
    label: "Tuition received",
    amount: 619_104,
    note: "Paid to East Brunswick by other districts for the 28 students it receives.",
  },
  {
    id: "misc",
    label: "Miscellaneous revenue",
    amount: 2_455_107,
    note: "Unrestricted local revenue: rentals, fees, interest, and similar.",
  },
  {
    id: "federal",
    label: "Federal Medicaid reimbursement",
    amount: 103_844,
    note: "The whole of the general fund's federal revenue.",
  },
] as const;

/** Two-year movement, 2024-25 actual to 2026-27 proposed. */
export const BUDGET_MOVEMENT = [
  {
    id: "tuition",
    label: "Out-of-district tuition",
    from: 4_279_674,
    to: 6_612_503,
    note: "Placements the district is required to pay for when it cannot serve a student in house.",
  },
  {
    id: "charter",
    label: "Charter school transfer",
    from: 5_891_347,
    to: 7_462_691,
    note: "Leaves the district with the student, whether or not the remaining costs fall with them.",
  },
  {
    id: "benefits",
    label: "Employee benefits",
    from: 35_885_245,
    to: 40_357_120,
    note: "Premiums and pension contributions, now 38.43% of salaries.",
  },
  {
    id: "transportation",
    label: "Student transportation",
    from: 14_962_589,
    to: 16_278_808,
    note: "Routes, contracts, and fuel.",
  },
  {
    id: "ops",
    label: "Operations and maintenance",
    from: 20_389_108,
    to: 21_131_868,
    note: "Utilities, repairs, and custodial staff across the district's buildings.",
  },
  {
    id: "instruction",
    label: "Regular programs — instruction",
    from: 49_537_094,
    to: 49_628_954,
    note: "The core classroom line. Flat in dollars, which is a cut once prices move.",
  },
  {
    id: "capital",
    label: "Capital outlay",
    from: 11_786_254,
    to: 8_447_536,
    note: "Equipment and facilities work, cut to make room elsewhere.",
  },
] as const;

/** Fund balances, from the Advertised Recapitulation of Balances page. */
export const BUDGET_RESERVES = [
  {
    id: "operating",
    label: "Unrestricted operating fund balance",
    audited2024: 7_982_530,
    audited2025: 7_098_724,
    estimated2026: 6_314_555,
    estimated2027: 3_992_055,
  },
  {
    id: "capital",
    label: "Capital reserve",
    audited2024: 3_093_267,
    audited2025: 602_898,
    estimated2026: 256_697,
    estimated2027: 256_697,
  },
  {
    id: "legal",
    label: "Legal reserve",
    audited2024: 4_084_826,
    audited2025: 1_614_073,
    estimated2026: 0,
    estimated2027: 0,
  },
] as const;

/** Advertised Per Pupil Cost Calculations, 2023-24 actual through 2026-27 proposed. */
export const PER_PUPIL = [
  { id: "total", label: "Total comparative cost per pupil", from: 19_096, to: 20_731 },
  { id: "classroom", label: "Classroom instruction", from: 10_961, to: 11_882 },
  { id: "support", label: "Support services", from: 3_285, to: 3_695 },
  { id: "ops", label: "Operations and maintenance", from: 2_678, to: 2_819 },
  { id: "admin", label: "Administration", from: 1_845, to: 1_929 },
  { id: "extracurricular", label: "Extracurricular", from: 233, to: 273 },
] as const;

/** Estimated Tax Rates page, 2026-27. */
export const TAX_FACTS = {
  generalFundLevy: 154_957_615,
  totalSchoolLevy: 159_983_631,
  netTaxableValuation: 1_934_304_750,
  generalFundRate: 8.011,
  totalRate: 8.2709,
  equalizedTotalRate: 1.4424,
} as const;

/** Enrollment on roll, from the Advertised Enrollments page. */
export const ENROLLMENT = {
  onRoll2025: 8_393,
  onRoll2026: 8_559,
  regular: 7_193,
  specialEd: 1_365,
  privatePlacements: 57,
} as const;

/** A source that was fetched and read while writing the copy it supports. */
export type PromiseSource = { label: string; href: string };

/**
 * Not every promise is a money promise. Some move an appropriation, some move
 * a board policy, some run into a rule set in Trenton, and some are just how
 * the district has always done it. `leverKind` says which, so a reader can see
 * at a glance what kind of decision they are voting for.
 */
export type LeverKind = "budget" | "policy" | "state-rule" | "practice";

export const LEVER_LABELS: Record<LeverKind, string> = {
  budget: "Budget line",
  policy: "Board policy",
  "state-rule": "State rule",
  practice: "District practice",
};

/**
 * What sits behind a single promise: which lever it pulls, how the change
 * actually happens, and what nobody can answer yet. No cost estimate is
 * claimed anywhere; the published budget does not contain the figures a real
 * costing would need.
 */
export type PromiseDetail = {
  /** Which kind of decision this is. */
  leverKind: LeverKind;
  /** The specific line, policy, or rule this promise moves. */
  lever: string;
  /** How the thing actually works, in plain sentences. */
  mechanism: string[];
  /** What is not answered anywhere public, and would have to be studied or asked. */
  openQuestion: string;
  sources?: PromiseSource[];
};

export type PriorityPoint = {
  text: string;
  detail?: PromiseDetail;
};

export type Priority = {
  id: string;
  number: string;
  title: string;
  summary: string;
  points: PriorityPoint[];
};

const SRC = {
  budget: {
    label: "EBPS FY2027 User Friendly Budget",
    href: "https://www.ebnet.org/departments/financial-services/budget-information/fy2027-user-friendly-budget",
  },
  districtSlide: {
    label: "EBPS 2026-27 budget update, key cost drivers",
    href: "https://resources.finalsite.net/images/v1777405230/ebnetorg/zslvknbaz9utdrzk6lhg/BudgetInformationforWebsite4152026page3.pdf",
  },
  ch44: {
    label: "P.L. 2020, c.44",
    href: "https://pub.njleg.gov/bills/2020/PL20/44_.HTM",
  },
  epbam: {
    label: "NJ Pensions & Benefits, SHBP/SEHBP employer manual",
    href: "https://www.nj.gov/treasury/pensions/documents/guidebooks/epbam-shbp-sehbp.pdf",
  },
  osc: {
    label: "NJ State Comptroller, September 9, 2025",
    href: "https://www.nj.gov/comptroller/news/2025/20250909.shtml",
  },
  tpaf: {
    label: "NJDOE, TPAF contributions paid by the State",
    href: "https://www.nj.gov/education/broadcasts/2025/aug/27/FederalProgramsPensionandSocialSecurityReimbursementtotheStateofNewJerseyforContributionsPaidbytheState.pdf",
  },
  rod: {
    label: "NJDOE, facilities grants for Regular Operating Districts",
    href: "https://www.nj.gov/education/facilities/projectapplication/rod.shtml",
  },
  ninthGrade: {
    label: "Eyes on EB, June 4 board meeting on ninth grade and facilities",
    href: "https://eyesoneb.com/what-should-east-brunswick-do-about-ninth-grade-board-reviews-multi-million-dollar-options/",
  },
} as const;

export const PRIORITIES: Priority[] = [
  {
    id: "affordable-for-all",
    number: "01",
    title: "Affordable for All",
    summary:
      "Every student should be able to take part, get support, and learn without families paying for basic opportunities.",
    points: [
      {
        text: "Universally paid public full-day Pre-K.",
        detail: {
          budgetLine: "Nothing in the general fund today",
          mechanism: [
            "The adopted 2026-27 budget carries no preschool appropriation and no preschool education aid in its state aid list. Enrollment is counted from kindergarten up, at 8,559 students on roll. A district that wants full-day Pre-K applies to the state for preschool education aid and builds the program around what it gets.",
          ],
          openQuestion:
            "How many three- and four-year-olds would enroll, what per-child rate the district would qualify for, and what rooms, staff, and buses a full-day program needs. None of that is in a budget filing.",
          sources: [SRC.budget],
        },
      },
      {
        text: "Zero fees on student clubs & activities, including arts & sports.",
        detail: {
          budgetLine: "Athletics, cocurricular activities, miscellaneous revenue",
          mechanism: [
            "Athletics is budgeted at $1.3 million and cocurricular activities at $0.4 million. Extracurricular cost per pupil has gone from $233 in 2023-24 to $273 in 2026-27. Participation fees are revenue, so dropping them means either finding the money elsewhere in the budget or shrinking what the program spends.",
          ],
          openQuestion:
            "How much families actually pay. Fee income is not broken out anywhere in the filing; it sits inside $2,455,107 of miscellaneous revenue with rentals, interest, and other local receipts.",
          sources: [SRC.budget],
        },
      },
      {
        text: "Fully funded schools so parents aren’t paying out of pocket for basic opportunities.",
      },
      {
        text: "Hire teaching support staff in-house, not outside providers.",
        detail: {
          budgetLine: "Student support services, out-of-district tuition",
          mechanism: [
            "Student support services total $23.2 million, including $5.0 million in extraordinary services and $3.7 million in speech, occupational, and physical therapy. Out-of-district tuition is the fastest-growing line in the whole budget, up 54.5% in two years to $6.6 million, and the district's own budget update lists out-of-district placements and contracted services as a $2,027,781 increase for this year.",
          ],
          openQuestion:
            "How much of this work is contracted out today rather than staffed in-house, and what a district position costs against the agency rate once benefits are counted.",
          sources: [SRC.budget, SRC.districtSlide],
        },
      },
      {
        text: "Protect and improve special education, mental health, and early intervention.",
      },
      {
        text: "Better language programs for incoming families.",
        detail: {
          budgetLine: "Bilingual education, inside instruction",
          mechanism: [
            "Bilingual education is budgeted at $1.5 million within the $73.0 million instruction total.",
          ],
          openQuestion:
            "How many students arrive each year needing language support, and what a bridge program adds on top of the existing bilingual staffing.",
          sources: [SRC.budget],
        },
      },
      {
        text: "End lunch debt.",
        detail: {
          budgetLine: "Outside the general fund",
          mechanism: [
            "Food service runs as its own enterprise fund, so it does not appear in the $209,216,947 general fund the dashboard breaks down. Clearing meal balances is a board decision about that fund, not a line item competing with classroom spending.",
          ],
          openQuestion:
            "The current unpaid balance, how many students carry one, and how many already qualify for free or reduced-price meals.",
          sources: [SRC.budget],
        },
      },
      {
        text: "Better healthcare for school staff, through the choices the district actually makes.",
        detail: {
          budgetLine: "Personal services — employee benefits, $40,357,120",
          mechanism: [
            "Benefits are 38.43% of salaries in the adopted budget, up from 30.16% in 2023-24, and the district's own budget update names health premiums as its largest cost driver this year: a 22% increase, $7,934,618.",
            "A district joins the state School Employees' Health Benefits Program by resolution and can leave the same way. It can buy the medical plan alone, in which case it has to offer a stand-alone prescription drug plan, and it adds or drops dental by separate resolution. The pharmacy contract, the administrator, and the broker are things a board signs.",
            "Two pieces are not the board's. State law fixes the plan menu — the Educators plan, NJ Direct 10 and 15, and the Garden State plan — and sets employee contributions for the Educators and Garden State plans as a percentage of salary. And the State, not the district, pays the pension contribution for teaching staff; the district reimburses only the share of a salary paid with federal money.",
            "What is left is worth reading carefully. In September 2025 the State Comptroller found that one for-profit firm had effectively taken over contracting at the health insurance funds serving hundreds of local governments and school boards, and that the Schools Health Insurance Fund paid that firm and its affiliate about $36 million from 2021 to 2025 without the required conflict disclosures. Saqeeb wants renewals, broker arrangements, and priced alternatives read out at a public meeting before the vote.",
          ],
          openQuestion:
            "What each option would actually cost here. The filing prints one benefits total. It does not price the state program against a private or pooled alternative, and it does not separate the pharmacy benefit.",
          sources: [SRC.budget, SRC.districtSlide, SRC.ch44, SRC.epbam, SRC.tpaf, SRC.osc],
        },
      },
    ],
  },
  {
    id: "students-first",
    number: "02",
    title: "Students First",
    summary:
      "Fair access to the courses a student is ready for, work that means something, and a school where they are safe.",
    points: [
      { text: "End the rigid matrix and expand fair access to advanced courses." },
      { text: "Allow placement exams, including languages." },
      { text: "Arts and science above grade level by request, with early access to instruments." },
      { text: "Language bridge program for new families." },
      {
        text: "Grade students on their work, not their homes: more in-school assignments and performance, less homework for evaluation.",
      },
      { text: "Responsible AI literacy for creative, independent projects and critical thinking." },
      { text: "Train staff and administration to spot racism, sexism, Islamophobia, and antisemitism." },
      { text: "ICE out of schools. Police/SROs out of schools." },
      { text: "Student oversight of mental health and facilities." },
    ],
  },
  {
    id: "reduce-our-costs",
    number: "03",
    title: "Reduce Our Costs",
    summary:
      "Invest in better schools and use public oversight to make long-term facilities decisions responsibly.",
    points: [
      {
        text: "A new high school for 9th through 12th.",
        detail: {
          budgetLine: "Outside the general fund, on the tax bill as debt service",
          mechanism: [
            "The board reviewed the options in public on June 4. Moving the temporary classroom units from Churchill to the high school campus was put at about $11 million and could not happen before September 2027. A ninth-grade academy attached to the high school was put at roughly $45 to $49 million in construction alone, before soft costs, fees, and contingencies. A new high school was discussed at $325 to $350 million in hard costs, and a district official said a project that size cannot come out of the operating budget: it needs a bond referendum.",
            "None of that runs through the $209,216,947 general fund the dashboard breaks down. It reaches voters as a referendum and then appears on tax bills as debt service.",
          ],
          openQuestion:
            "Which option the district picks, and what the state's share of it would be. Those are decisions ahead of the board, not figures printed anywhere yet.",
          sources: [SRC.ninthGrade, SRC.budget],
        },
      },
      { text: "State-of-the-art schools with better technology, facilities, and programs." },
      {
        text: "Use state construction bonds to build better, more sustainable facilities with lower maintenance.",
        detail: {
          budgetLine: "Capital outlay $8.4 million, capital reserve $256,697",
          mechanism: [
            "East Brunswick is what the state calls a Regular Operating District. A project goes to the Department of Education for eligibility review and then to the voters, and the state's share comes back as debt service aid on the bonds or as a grant. Under the current grant program a district is eligible for at least 40 percent of approved eligible project costs, set by its own aid percentage, and has to show local funding for the rest.",
            "Paying out of pocket is no longer realistic here. Capital outlay is down 28.3% in two years and the capital reserve is projected at $256,697, against $3.1 million not long ago.",
          ],
          openQuestion:
            "East Brunswick's own aid percentage, and therefore the state share of any specific project. That comes out of the eligibility review, not the budget filing.",
          sources: [SRC.rod, SRC.budget],
        },
      },
      {
        text: "Remove lead and address TMAs.",
        detail: {
          budgetLine: "Operations and maintenance, $21.1 million",
          mechanism: [
            "Operations and maintenance runs $21.1 million a year, down 3.9%, and part of it is repair work on buildings well past the point where repair is the cheaper answer. Board members went through the high school's aging infrastructure on June 4: cafeteria and gym limits, classroom conditions, roof and plumbing issues.",
          ],
          openQuestion:
            "The condition and remediation cost building by building, and how much of the maintenance line a replacement would actually retire. That is a facilities study, and this campaign is not going to invent the number.",
          sources: [SRC.budget, SRC.ninthGrade],
        },
      },
      { text: "Build facilities that can house excellence in programs." },
      { text: "Audit the master plan, with public dashboards and community oversight." },
    ],
  },
];

/** Shown under the priorities. The campaign does not publish estimates it cannot source. */
export const COST_STUDY_NOTE =
  "This campaign is not going to put a dollar figure on any of these promises. A number that sounds authoritative and was reverse-engineered from a public budget filing is worse than no number, because it invites a debate about arithmetic nobody can check. Costing this properly means enrollment projections, facilities condition assessments, staffing models, and plan-by-plan benefit pricing, which is professional work and it is not free. Donations to this campaign are what pay for it, and whatever is produced will be published in full, including the parts that are inconvenient.";

export const HELP_OPTIONS = [
  {
    id: "yard-sign",
    label: "Request a yard sign",
    blurb: "We drop one off at your house. Free, and we pick it up after the election.",
  },
  {
    id: "canvassing",
    label: "Join a canvassing day",
    blurb: "Weekend door-knocking, about two hours. We pair you with someone experienced.",
  },
  {
    id: "phone-text",
    label: "Phone or text bank",
    blurb: "From home, on your own schedule. We send the list and the script.",
  },
] as const;

export const CANVASS_DAYS = [
  "Saturday morning",
  "Saturday afternoon",
  "Sunday morning",
  "Sunday afternoon",
  "Weekday evening",
] as const;

export const CONTACT_TIMES = [
  "Weekday daytime",
  "Weekday evening",
  "Weekends",
] as const;

export const DISTRICT_STATS = [
  { value: "8,559", label: "students" },
  { value: "11", label: "schools" },
  { value: "90+", label: "languages spoken" },
  { value: "$209M", label: "annual budget" },
];
