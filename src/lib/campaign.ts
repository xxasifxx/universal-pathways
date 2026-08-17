/**
 * Campaign-wide constants and content data.
 */

export const CANDIDATE_NAME = "Muhammad Saqeeb";
export const OFFICE = "East Brunswick Board of Education";
export const CONTACT_EMAIL = "ask@saqeeb.org";
export const REGISTRATION_DEADLINE = "October 13th";

/**
 * Saqeeb's own account of why he is running, in the first person. The short
 * form runs on the home page; the long form opens the priorities page so what
 * follows it reads as something he lived rather than an opinion from nowhere.
 */
export const CANDIDATE_STORY = {
  short:
    "I was one of the kids this district sorted. I grew up in East Brunswick in a working-class immigrant family and went through the public schools as a Special Education student — not because I couldn't do the work, but because I was a difficult kid at times, and the label stayed with me for nearly six years.",
  long: [
    "I was one of the kids this district sorted.",
    "I grew up here in East Brunswick, in a working-class immigrant family, and went through East Brunswick Public Schools as a Special Education student. I wasn't placed there because I couldn't do the work. I was a difficult kid at times, and instead of always understanding what was behind that, I was placed into a system that followed me for nearly six years. Once that label was there, it began shaping which opportunities were available to me and which decisions were made about my education.",
    "Eventually I found my way forward by learning to advocate for myself, alongside my immigrant parents. I pursued independent study to get ahead, challenged the expectations that had been set for me, and graduated summa cum laude with a degree in Psychology before earning my Master's in Data Science.",
    "Not every student finds that path. I don't believe that's because educators don't care. I believe it's because systems can sometimes make decisions about children before we fully understand who they are, what they need, or what they're capable of becoming.",
    "That experience stayed with me, and it's a large part of why I'm running.",
  ],
} as const;

/** The first candidates' debate. Referenced publicly as a date, nothing more. */
export const DEBATE = {
  date: "September 30",
  note: "The first candidates' debate is on September 30. I'll have answered a lot of this in front of people by then, and what I think will be sharper for it. If there's something you want me to address, send it and I'll take it with me.",
} as const;

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
    text: "Pre-K, activities, and staff health coverage that families and employees can afford.",
  },
  {
    id: "students-first",
    title: "Students First",
    text: "Fair access to the courses a student is ready for, whatever their transcript says.",
  },
  {
    id: "reduce-our-costs",
    title: "Reduce Our Costs",
    text: "Facilities decisions that stop the district paying twice for buildings past their life.",
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
  ebGrading: {
    label: "EB Board Policy 2624, Grading System",
    href: "https://www.straussesmay.com/seportal/Public/DistrictPolicy.aspx?PolicyID=2624&id=84d05e65e6894462a30f3195857be2c5",
  },
  ebGifted: {
    label: "EB Board Policy 2464, Gifted and Talented Students",
    href: "https://www.straussesmay.com/seportal/Public/DistrictPolicy.aspx?PolicyID=2464&id=84d05e65e6894462a30f3195857be2c5",
  },
  ebStudentReps: {
    label: "EB Board Policy 0143.2, Student Representatives to the Board",
    href: "https://www.straussesmay.com/seportal/Public/DistrictPolicy.aspx?PolicyID=0143.2&id=84d05e65e6894462a30f3195857be2c5",
  },
  ebPlacement: {
    label: "EBPS course sequences and placement",
    href: "https://www.ebnet.org/academics/courseguide2425/course-sequences-and-placement",
  },
  giftedAct: {
    label: "NJDOE, Strengthening Gifted and Talented Education Act",
    href: "https://www.nj.gov/education/standards/programs/gifted/legislation.shtml",
  },
  njAi: {
    label: "NJDOE Office of Innovation, artificial intelligence in education",
    href: "https://www.nj.gov/education/innovation/ai/index.shtml",
  },
  hibTraining: {
    label: "NJDOE, mandated professional development on prevention",
    href: "https://www.nj.gov/education/profdev/requirements/topics/prevention.shtml",
  },
  schoolPoliceMoa: {
    label: "NJDOE, education and law enforcement memorandum of agreement",
    href: "https://www.nj.gov/education/safety/sandp/schoolsafety/moa.shtml",
  },
  immigrantTrust: {
    label: "State of New Jersey, Immigrant Trust Directive",
    href: "https://www.nj.gov/knowyourrights/immigrant-trust-directive/",
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
          leverKind: "budget",
          lever: "Nothing in the general fund today",
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
          leverKind: "budget",
          lever: "Athletics, cocurricular activities, miscellaneous revenue",
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
        detail: {
          leverKind: "practice",
          lever: "Supply lists, activity fees, and trip costs, none of them itemized",
          mechanism: [
            "What families pay out of pocket does not appear as a line anywhere. Classroom supply lists, activity fees, trip costs, and instrument rental are decided school by school and program by program, and the money mostly never touches the district's books, so a budget filing cannot show it.",
            "The first step is an inventory: what each school asks families to buy or pay in a year, collected once and published. Until that exists, nobody on the board can say how much of a family's school year is being paid for privately.",
          ],
          openQuestion:
            "The total households actually spend. That is a survey and a document request, not a figure anyone can pull out of the budget.",
        },
      },
      {
        text: "Hire teaching support staff in-house, not outside providers.",
        detail: {
          leverKind: "budget",
          lever: "Student support services, out-of-district tuition",
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
        detail: {
          leverKind: "budget",
          lever: "Student support services, $23.2 million",
          mechanism: [
            "Student support services run $23.2 million, with $5.0 million in extraordinary services and $3.7 million in speech, occupational, and physical therapy. The district counts 1,365 students in special education and 57 in private placements out of 8,559 on roll.",
            "Protecting this means treating it as the last place to look for savings when the budget gets tight, and saying that out loud during the adoption vote rather than after the reductions are made.",
          ],
          openQuestion:
            "Caseloads and wait times. The filing prints totals, not how long a family waits for an evaluation or how many students one counselor carries.",
          sources: [SRC.budget],
        },
      },
      {
        text: "Better language programs for incoming families.",
        detail: {
          leverKind: "budget",
          lever: "Bilingual education, inside instruction",
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
          leverKind: "budget",
          lever: "Outside the general fund",
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
          leverKind: "budget",
          lever: "Personal services — employee benefits, $40,357,120",
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
      {
        text: "End the rigid matrix and expand fair access to advanced courses.",
        detail: {
          leverKind: "practice",
          lever: "Course placement criteria, published in the course guide",
          mechanism: [
            "The placement rules are not in state law and they are not in a board policy. They live in the district's course placement criteria, published alongside the course guide, where a prior-year grade sets whether a student stays on a track or moves up one. Because they are administrative, the board can direct that they be revised without waiting for Trenton.",
            "The district's own gifted and talented policy already asks for more than a single cutoff. It directs an ongoing K-12 identification process using multiple measures, and says the process must consider all students, including English language learners and students with an IEP or 504 plan.",
          ],
          openQuestion:
            "How many students clear or miss each cutoff, and how that breaks down by school, income, and language background. The district has the data and does not publish it.",
          sources: [SRC.ebPlacement, SRC.ebGifted, SRC.giftedAct],
        },
      },
      {
        text: "Allow placement exams, including languages.",
        detail: {
          leverKind: "practice",
          lever: "Placement criteria and the world language sequence",
          mechanism: [
            "A placement exam is an alternative route into a course for a student whose transcript does not describe what they can do: a child who learned a language at home, or who covered material at another school. Adding one is a change to the placement criteria and a scheduling question about who administers it and when.",
            "The board's role is to ask for the option to exist and to require that it be advertised to families rather than granted case by case to whoever knows to ask.",
          ],
          openQuestion:
            "Which subjects already allow a challenge exam today. That is an administrative practice, not a published rule.",
          sources: [SRC.ebPlacement],
        },
      },
      {
        text: "Arts and science above grade level by request, with early access to instruments.",
        detail: {
          leverKind: "policy",
          lever: "Board Policy 2464, instructional adaptation",
          mechanism: [
            "Policy 2464 already defines an instructional adaptation as teaching a student \"at the instructional level of the student, not just the student's grade level,\" and directs the Superintendent to ensure those adaptations are designed. The 2019 state law it implements requires districts to identify gifted students in every grade from kindergarten up and to provide the services.",
            "So the promise is not a new authority. It is asking that the policy already on the books produce a scheduling answer for a fourth grader ready for older science, and an instrument in a younger student's hands.",
          ],
          openQuestion:
            "How many students receive an above-grade placement now, in which buildings, and whether the answer is the same across the elementary schools.",
          sources: [SRC.ebGifted, SRC.giftedAct],
        },
      },
      {
        text: "Language bridge program for new families.",
        detail: {
          leverKind: "budget",
          lever: "Bilingual education, $1.5 million",
          mechanism: [
            "Bilingual education is budgeted at $1.5 million inside the $73.0 million instruction total. A bridge program is the part that sits around it: the first weeks for a family that has just arrived, translated material, and someone whose job is to make sure a new student is placed correctly rather than parked.",
          ],
          openQuestion:
            "How many students arrive mid-year needing language support, and what the current caseload per teacher is.",
          sources: [SRC.budget],
        },
      },
      {
        text: "Grade students on their work, not their homes: more in-school assignments and performance, less homework for evaluation.",
        detail: {
          leverKind: "policy",
          lever: "Board Policy 2624, Grading System",
          mechanism: [
            "This one is unusually concrete, because the board has already written most of it. Policy 2624, last edited in September 2025, caps homework completion at no more than ten percent of a grade, says grades must reflect proficiency against the state standards and the district's own objectives, and gives a student who thinks a grade is unjust an appeal to the principal and then to the assistant superintendent.",
            "The policy also assigns the Superintendent responsibility for the procedures that put it into practice at each level. That is where the difference between the written rule and a student's actual experience lives, and it is a fair thing for a board member to ask about in public.",
          ],
          openQuestion:
            "Whether the ten percent cap is being applied consistently across schools and departments. Nothing published tracks that.",
          sources: [SRC.ebGrading],
        },
      },
      {
        text: "Responsible AI literacy for creative, independent projects and critical thinking.",
        detail: {
          leverKind: "policy",
          lever: "Local curriculum and acceptable use, with state guidance only",
          mechanism: [
            "New Jersey has not mandated anything here. The Department of Education's innovation office publishes guidance on AI terms and classroom use, and leaves the decisions to districts, which means East Brunswick's rules are whatever the board and administration adopt.",
            "Two things follow. Teachers need to know what is allowed before they are asked to enforce it, and students should be taught to use these tools on work that is theirs rather than only being told when using them counts as cheating.",
          ],
          openQuestion:
            "What East Brunswick's current rule actually is, building by building, and whether staff have had training on it.",
          sources: [SRC.njAi],
        },
      },
      {
        text: "Train staff and administration to spot racism, sexism, Islamophobia, and antisemitism.",
        detail: {
          leverKind: "state-rule",
          lever: "Mandated HIB training, and what the state does not require",
          mechanism: [
            "Training on harassment, intimidation, and bullying is a state-mandated professional development topic, so East Brunswick already does some of this and has to.",
            "Training specifically on recognizing bias against a religion or an ethnicity is not separately mandated. A district that wants it adds it, pays for it out of professional development, and decides who has to attend. In a district where families come from as many places as they do here, that is worth choosing to do rather than waiting to be told.",
          ],
          openQuestion:
            "What training staff currently receive beyond the state minimum, and how incidents are reported back to the board.",
          sources: [SRC.hibTraining],
        },
      },
      {
        text: "ICE out of schools. Police/SROs out of schools.",
        detail: {
          leverKind: "policy",
          lever: "The district's agreement with local law enforcement",
          mechanism: [
            "There are two separate things here. Immigration enforcement is governed by the state's Immigrant Trust Directive, which limits how New Jersey law enforcement may assist federal immigration authorities and bars stopping or detaining someone solely on immigration status. A district's part is knowing the rule, telling families it exists, and having a written answer ready before someone shows up at a school office.",
            "Police presence is more local. Every district has a memorandum of agreement with its municipal police department, required by state regulation and built on a state model, and that agreement is what defines when officers come into a building and what happens when they do. It is signed by the district and the police, which means it can be read in public, questioned, and renegotiated.",
          ],
          openQuestion:
            "What East Brunswick's current agreement says. It is a public document and this campaign has not been able to obtain the signed version.",
          sources: [SRC.immigrantTrust, SRC.schoolPoliceMoa],
        },
      },
      {
        text: "Student oversight of mental health and facilities.",
        detail: {
          leverKind: "policy",
          lever: "Board Bylaw 0143.2, student representatives to the board",
          mechanism: [
            "The board already seats at least one nonvoting student representative from grades nine to twelve, chosen by the student body, serving a one-year term. The bylaw gives that student three duties: attend meetings, bring student concerns to the board, and report back monthly to the student council.",
            "Extending that into the two areas students actually experience first, counseling and the condition of the buildings, means giving them a standing place in those discussions instead of a report at the end. That is a bylaw and committee change the board makes on its own.",
          ],
          openQuestion:
            "Whether one representative for the whole district is enough, and how students are picked in practice.",
          sources: [SRC.ebStudentReps],
        },
      },
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
          leverKind: "budget",
          lever: "Outside the general fund, on the tax bill as debt service",
          mechanism: [
            "The board reviewed the options in public on June 4. Moving the temporary classroom units from Churchill to the high school campus was put at about $11 million and could not happen before September 2027. A ninth-grade academy attached to the high school was put at roughly $45 to $49 million in construction alone, before soft costs, fees, and contingencies. A new high school was discussed at $325 to $350 million in hard costs, and a district official said a project that size cannot come out of the operating budget: it needs a bond referendum.",
            "None of that runs through the $209,216,947 general fund the dashboard breaks down. It reaches voters as a referendum and then appears on tax bills as debt service.",
          ],
          openQuestion:
            "Which option the district picks, and what the state's share of it would be. Those are decisions ahead of the board, not figures printed anywhere yet.",
          sources: [SRC.ninthGrade, SRC.budget],
        },
      },
      {
        text: "State-of-the-art schools with better technology, facilities, and programs.",
        detail: {
          leverKind: "budget",
          lever: "Operations and maintenance, $21.1 million, and capital outlay, $8.4 million",
          mechanism: [
            "Maintenance runs $21.1 million a year and is down 3.9%, while capital outlay is down 28.3% in two years. When the repair budget and the replacement budget both shrink, the work does not disappear; it moves to next year at a higher price.",
            "The choice in front of the board is whether to keep patching buildings that are past the point where patching is the cheaper answer, or to put a plan in front of voters.",
          ],
          openQuestion:
            "What each building needs and when. That is a facilities condition assessment, and the district has not published one.",
          sources: [SRC.budget],
        },
      },
      {
        text: "Use state construction bonds to build better, more sustainable facilities with lower maintenance.",
        detail: {
          leverKind: "budget",
          lever: "Capital outlay $8.4 million, capital reserve $256,697",
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
          leverKind: "budget",
          lever: "Operations and maintenance, $21.1 million",
          mechanism: [
            "Operations and maintenance runs $21.1 million a year, down 3.9%, and part of it is repair work on buildings well past the point where repair is the cheaper answer. Board members went through the high school's aging infrastructure on June 4: cafeteria and gym limits, classroom conditions, roof and plumbing issues.",
          ],
          openQuestion:
            "The condition and remediation cost building by building, and how much of the maintenance line a replacement would actually retire. That is a facilities study, and this campaign is not going to invent the number.",
          sources: [SRC.budget, SRC.ninthGrade],
        },
      },
      {
        text: "Build facilities that can house excellence in programs.",
        detail: {
          leverKind: "practice",
          lever: "Program requirements written into the design",
          mechanism: [
            "Board members walked through the high school's limits in public on June 4: cafeteria and gym capacity, classroom conditions, roof and plumbing. Those constraints decide which programs can exist, so a design brief that starts from the programs the district wants produces a different building than one that starts from a square footage target.",
            "The board's leverage is at the beginning, in what the architect is asked for, not at the end when it is voting on a finished plan.",
          ],
          openQuestion:
            "Which programs are being turned away or capped today for lack of space. Nobody has published that list.",
          sources: [SRC.ninthGrade],
        },
      },
      {
        text: "Audit the master plan, with public dashboards and community oversight.",
        detail: {
          leverKind: "practice",
          lever: "What the district publishes, and how",
          mechanism: [
            "Everything on this website was built from documents that are already public: the adopted budget filing, the district's own budget slides, board meeting coverage. It took a lot of reading, which is the point. A resident who wants to know what the district spends on out-of-district placements should not have to reverse-engineer it from a 64-page PDF.",
            "Publishing the same numbers in a form people can actually read costs the district almost nothing and is entirely within the board's control.",
          ],
          openQuestion:
            "Nothing, really. This one is a decision rather than a study.",
          sources: [SRC.budget],
        },
      },
    ],
  },
];

/** Shown under the priorities. The campaign does not publish estimates it cannot source. */
export const COST_STUDY_NOTE =
  "I'm not going to put a dollar figure next to any of this. A number reverse-engineered from a public budget filing sounds authoritative and isn't, and it invites an argument about arithmetic nobody can check. Costing these properly takes enrollment projections, a facilities condition assessment, staffing models, and plan-by-plan benefit pricing — professional work, done by people who do it for a living. Until that exists, what you'll get from me is the budget line involved and an honest note about what isn't known yet.";

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

/** The research ask is deliberate: reviewers vet unpublished platform drafts. */
export const RESEARCHER_OPTION = {
  id: "researcher",
  label: "Help review the platform (research)",
  blurb:
    "Read the longer policy drafts before they go public and tell us where they're weak, unsourced, or overconfident. An hour, from your couch.",
} as const;

/**
 * Questions Saqeeb is preparing for ahead of the first debate. Working
 * material — imported by the private drafting area only, never by a public
 * route.
 */
export const DEBATE_QUESTIONS = [
  "What specific steps would you take to reduce healthcare costs for East Brunswick teachers and staff without shifting those costs onto employees?",
  "Do you support universal full-day Pre-K in East Brunswick? If so, how would you implement and fund it?",
  "When the district faces budget pressure, what programs and services should be protected from cuts, and where should the Board look for savings first?",
  "What would you do to improve teacher recruitment and retention in East Brunswick?",
  "What is your position on outsourcing school services versus employing staff directly through the district?",
  "What should East Brunswick's long-term facilities plan look like, including the future of the high school?",
  "Should families have to pay participation fees for athletics, clubs, arts, or other school activities?",
  "How would you improve special education while controlling rising costs?",
  "How much discretion should teachers have over instruction, grading, homework, and classroom practices?",
  "What responsibility does a Board member have to advocate in Trenton for additional school funding or statewide policy changes?",
  "What specific changes would you make to ensure teachers and staff have a stronger voice in district decision-making?",
  "How should the district balance competitive employee compensation with concerns about property taxes and affordability?",
  "What investments in early intervention would you prioritize to reduce the need for more costly services later?",
  "How should the Board evaluate whether outside contracts and consultants are providing taxpayers and educators good value?",
  "What would you do to make advanced courses and educational opportunities more accessible to students who may not fit traditional placement criteria?",
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
