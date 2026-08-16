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
    text: "Public full-day Pre-K for every family, no fees to join a club or a team, and no student carrying lunch debt.",
  },
  {
    id: "students-first",
    title: "Students First",
    text: "Open up advanced courses to the students ready for them, support families arriving with a new language, and grade students on work they do in school.",
  },
  {
    id: "reduce-our-costs",
    title: "Reduce Our Costs",
    text: "Build a 9-12 high school using state construction bonds, so the district spends less on patching buildings that are past their useful life.",
  },
];

/** Breakdown of the district's $229M operating budget. */
export const BUDGET_TOTAL = 229_000_000;

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
    jargon: "Regular Programs — Instruction",
    plain: "Teachers in classrooms",
    amount: 91_400_000,
    note: "Salaries and materials for the people who teach your kids. Roughly 40 cents of every dollar.",
    color: "var(--color-chart-1)",
  },
  {
    id: "support",
    jargon: "Instructional Support Services",
    plain: "Counselors, nurses & classroom aides",
    amount: 37_800_000,
    note: "Support staff. When a school feels short-handed, this is usually the line people are describing.",
    color: "var(--color-chart-2)",
  },
  {
    id: "sped",
    jargon: "Special Education & Related Services",
    plain: "Special Education programs",
    amount: 34_300_000,
    note: "Staffing, services, and early intervention for students who need them, plus out-of-district placements.",
    color: "var(--color-chart-3)",
  },
  {
    id: "benefits",
    jargon: "Employee Benefits & Fixed Charges",
    plain: "Health insurance & pensions",
    amount: 30_900_000,
    note: "Set by contract and by the state pension system, so the board cannot reduce this line on its own.",
    color: "var(--color-chart-4)",
  },
  {
    id: "ops",
    jargon: "Operations & Maintenance of Plant",
    plain: "Keeping the buildings running",
    amount: 18_200_000,
    note: "Heat, light, roofs and custodial staff across 11 buildings, some of them over fifty years old.",
    color: "var(--color-chart-5)",
  },
  {
    id: "admin",
    jargon: "General & School Administration",
    plain: "Principals & central office",
    amount: 16_400_000,
    note: "Principals, directors, and the central office where most policy decisions are made.",
    color: "var(--color-chart-6)",
  },
];

export type Priority = {
  id: string;
  number: string;
  title: string;
  summary: string;
  points: string[];
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
    ],
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
  },
];

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
  { value: "8,100", label: "students" },
  { value: "11", label: "schools" },
  { value: "90+", label: "languages spoken" },
  { value: "$229M", label: "annual budget" },
];
