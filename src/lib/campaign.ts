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

export type Priority = {
  id: string;
  number: string;
  title: string;
  summary: string;
  points: string[];
  /** Optional longer explanation of how a promise in this section gets done. */
  detail?: {
    heading: string;
    paragraphs: string[];
    /** Only URLs read directly while writing this section. */
    links?: { label: string; href: string }[];
  };
};

export const PRIORITIES: Priority[] = [
  {
    id: "affordable-for-all",
    number: "01",
    title: "Affordable for All",
    summary: "Every student should be able to take part, get support, and learn without families paying for basic opportunities.",
    points: [
      "Universally paid public full-day Pre-K.",
      "Zero fees on student clubs & activities, including arts & sports.",
      "Fully funded schools so parents aren’t paying out of pocket for basic opportunities.",
      "Hire teaching support staff in-house, not outside providers.",
      "Protect and improve special education, mental health, and early intervention.",
      "Better language programs for incoming families.",
      "End lunch debt.",
      "Better healthcare for school staff, through the choices the district actually makes.",
    ],
    detail: {
      heading: "What better healthcare for staff actually means here",
      paragraphs: [
        "Here is how school employee coverage in New Jersey is put together. A district joins the School Employees' Health Benefits Program by passing a resolution, and it can leave the same way. It can buy the medical plan and nothing else, in which case the state's own rules say it has to offer a stand-alone prescription drug plan to everyone eligible, and it can add or drop the dental plans by separate resolution. So the pharmacy side and the dental side are contracts a board signs, not something handed down from Trenton.",
        "The plan menu is set by state law. P.L. 2020, c.44 says the school program offers three plans carrying medical and prescription coverage — the New Jersey Educators Health Plan and NJ Direct 10 and 15 — plus a fourth, the Garden State Health Plan, and it fixes employee contributions for the Educators and Garden State plans as a percentage of salary. That schedule is not a board's to change. Neither is the pension side: under N.J.S.A. 18A:66-90 the State pays the Teachers' Pension and Annuity Fund contribution for district staff, and the district only reimburses the State for the portion of a salary paid out of federal money.",
        "What is left over is real money and it is decided locally. Which program the district buys through, how the plan is designed, who administers it, who brokers it, and what the pharmacy contract says. In September 2025 the State Comptroller reported that one for-profit firm had effectively taken over the contracting of the health insurance funds serving hundreds of local governments and school boards, and that the Schools Health Insurance Fund alone paid that firm and its affiliate roughly $36 million between 2021 and 2025 without the required conflict disclosures. Saqeeb wants those renewals and those broker arrangements read out loud at a public meeting, with the alternatives priced, before the board votes on them. Benefits are $40,357,120 in the adopted budget, 38.43% of salaries and up $4.5 million in two years; a line that size deserves more than a consent-agenda vote.",
      ],
      links: [
        {
          label: "P.L. 2020, c.44 — school employee health plans and contributions",
          href: "https://pub.njleg.gov/bills/2020/PL20/44_.HTM",
        },
        {
          label: "NJ Division of Pensions & Benefits — SHBP/SEHBP employer administration manual",
          href: "https://www.nj.gov/treasury/pensions/documents/guidebooks/epbam-shbp-sehbp.pdf",
        },
        {
          label: "NJ State Comptroller, September 9, 2025 — health insurance funds report",
          href: "https://www.nj.gov/comptroller/news/2025/20250909.shtml",
        },
        {
          label: "NJDOE — TPAF contributions paid by the State (N.J.S.A. 18A:66-90)",
          href: "https://www.nj.gov/education/broadcasts/2025/aug/27/FederalProgramsPensionandSocialSecurityReimbursementtotheStateofNewJerseyforContributionsPaidbytheState.pdf",
        },
      ],
    },
  },
  {
    id: "students-first",
    number: "02",
    title: "Students First",
    summary: "Fair access to the courses a student is ready for, work that means something, and a school where they are safe.",
    points: [
      "End the rigid matrix and expand fair access to advanced courses.",
      "Allow placement exams, including languages.",
      "Arts and science above grade level by request, with early access to instruments.",
      "Language bridge program for new families.",
      "Grade students on their work, not their homes: more in-school assignments and performance, less homework for evaluation.",
      "Responsible AI literacy for creative, independent projects and critical thinking.",
      "Train staff and administration to spot racism, sexism, Islamophobia, and antisemitism.",
      "ICE out of schools. Police/SROs out of schools.",
      "Student oversight of mental health and facilities.",
    ],
  },
  {
    id: "reduce-our-costs",
    number: "03",
    title: "Reduce Our Costs",
    summary: "Invest in better schools and use public oversight to make long-term facilities decisions responsibly.",
    points: [
      "A new high school for 9th through 12th.",
      "State-of-the-art schools with better technology, facilities, and programs.",
      "Use state construction bonds to build better, more sustainable facilities with lower maintenance.",
      "Remove lead and address TMAs.",
      "Build facilities that can house excellence in programs.",
      "Audit the master plan, with public dashboards and community oversight.",
    ],
    detail: {
      heading: "How building gets paid for, and what it changes",
      paragraphs: [
        "Construction does not come out of the operating budget the dashboard breaks down. A district like East Brunswick — a Regular Operating District, in the state's language — puts a project through the Department of Education for eligibility review and then to the voters, and the state's share arrives either as debt service aid on the bonds or as a grant. Under the current grant program the state pays at least 40 percent of approved eligible costs, with the percentage set by the district's own aid percentage, and the district has to show it can cover the rest. That share lands on a tax bill as debt service, outside the $209,216,947 general fund.",
        "Paying for buildings out of pocket is no longer an option here. Capital outlay is down 28.3% in two years and the capital reserve is projected at $256,697, against $3.1 million not long ago. Meanwhile operations and maintenance runs $21.1 million a year, part of it repair work on buildings well past the point where repair is the cheaper answer. Whether a new high school lowers that number, and by how much, is a facilities study question. The budget filing does not contain the figures to answer it, and this campaign is not going to make them up.",
      ],
      links: [
        {
          label: "NJDOE — grant program for school facilities projects in Regular Operating Districts",
          href: "https://www.nj.gov/education/facilities/projectapplication/rod.shtml",
        },
      ],
    },
  },
];

/**
 * What each promise touches in the adopted FY2027 filing, and what the filing
 * does not say. No cost estimate is claimed anywhere here: the published
 * budget does not contain the figures a real costing would need.
 */
export type PromiseCostLens = {
  id: string;
  promise: string;
  /** The line(s) in the dashboard this promise would move. */
  budgetLine: string;
  /** What the filing does show about that line. */
  filingSays: string;
  /** What the filing does not answer, and would have to be studied. */
  filingDoesNotSay: string;
};

export const PROMISE_COST_LENS: PromiseCostLens[] = [
  {
    id: "pre-k",
    promise: "Universally paid public full-day Pre-K",
    budgetLine: "Not in the general fund appropriations",
    filingSays:
      "The FY2027 filing carries no preschool appropriation and no preschool education aid in its state aid list. Enrollment on roll is counted from kindergarten up, at 8,559.",
    filingDoesNotSay:
      "How many three- and four-year-olds would enroll, whether the district would qualify for state preschool education aid at what per-child rate, and what classroom space, staff, and transportation a full-day program would require.",
  },
  {
    id: "activity-fees",
    promise: "Zero fees on clubs, activities, arts, and sports",
    budgetLine: "Athletics, cocurricular, and miscellaneous revenue",
    filingSays:
      "Athletics is budgeted at $1.3 million and cocurricular activities at $0.4 million; extracurricular cost per pupil is $273 in 2026-27, up from $233 in 2023-24.",
    filingDoesNotSay:
      "How much families currently pay in participation fees. Fee income is not broken out; it sits inside $2,455,107 of miscellaneous revenue along with rentals, interest, and other local receipts.",
  },
  {
    id: "lunch-debt",
    promise: "End lunch debt",
    budgetLine: "Outside the general fund",
    filingSays:
      "Food service runs as its own enterprise fund and does not appear in the $209,216,947 general fund the dashboard breaks down.",
    filingDoesNotSay:
      "The current unpaid meal balance, how many students carry one, and how many already qualify for free or reduced-price meals under federal eligibility.",
  },
  {
    id: "support-in-house",
    promise: "Hire teaching support staff in-house rather than through outside providers",
    budgetLine: "Student support services, and out-of-district tuition",
    filingSays:
      "Student support services total $23.2 million, including $5.0 million in extraordinary services and $3.7 million in speech, occupational, and physical therapy. Out-of-district tuition is the fastest growing line in the budget, up 54.5% in two years to $6.6 million.",
    filingDoesNotSay:
      "How much of that work is contracted out today versus staffed in-house, and what an in-house position costs against the equivalent agency rate once benefits are counted.",
  },
  {
    id: "healthcare",
    promise: "Better healthcare for school staff",
    budgetLine: "Personal services — employee benefits",
    filingSays:
      "Benefits are budgeted at $40,357,120, equal to 38.43% of salaries, up from 30.16% in 2023-24 actuals and up $4.5 million in two years.",
    filingDoesNotSay:
      "What each plan option would cost the district. The filing reports one total; it does not price the state program against a private or pooled alternative, and it does not separate the pharmacy benefit.",
  },
  {
    id: "language",
    promise: "Language bridge program for new families",
    budgetLine: "Bilingual education, within instruction",
    filingSays:
      "Bilingual education is budgeted at $1.5 million inside the $73.0 million instruction total.",
    filingDoesNotSay:
      "How many students arrive each year needing language support, and what staffing a bridge program would add on top of the existing bilingual line.",
  },
  {
    id: "facilities",
    promise: "Remove lead, address TMAs, and build a new 9-12 high school",
    budgetLine: "Operations and maintenance, capital outlay, and debt service",
    filingSays:
      "Operations and maintenance is $21.1 million, down 3.9%. Capital outlay is $8.4 million, down 28.3% in two years, and the capital reserve is projected at $256,697. Debt service sits outside the general fund total.",
    filingDoesNotSay:
      "The condition and remediation cost of each building, the scope or price of a high school project, and the state share of debt service such a project would draw. None of that is in a budget filing; it comes out of a facilities study.",
  },
];

/** Shown with the cost lens. The campaign does not publish estimates it cannot source. */
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
