/**
 * Campaign-wide constants and content data.
 */

export const CANDIDATE_NAME = "Muhammad Saqeeb";
export const OFFICE = "East Brunswick Board of Education";
export const CONTACT_EMAIL = "ask@saqeeb.org";
export const REGISTRATION_DEADLINE = "October 13th";

/**
 * Contributions go straight to the campaign bank account — no ActBlue, no
 * processor cut. Replace the placeholder values below with the real committee
 * banking details before the Donate page goes live.
 */
export const DONATION = {
  committeeName: "Saqeeb for East Brunswick BOE",
  /** NJ ELEC individual limit per election for a school board candidate committee. */
  maxIndividual: 3000,
  /** Contributions at or above this amount require occupation and employer on the report. */
  reportingThreshold: 300,
  bank: {
    name: "REPLACE — bank name",
    accountName: "Saqeeb for East Brunswick BOE",
    routingNumber: "REPLACE — routing number",
    accountNumber: "REPLACE — account number",
  },
  zelle: "REPLACE — Zelle email or phone",
  checkPayableTo: "Saqeeb for East Brunswick BOE",
  mailingAddress: ["REPLACE — street address", "East Brunswick, NJ 08816"],
} as const;

export const DONATION_AMOUNTS = [25, 50, 100, 250, 500, 1000];

export const DONATION_METHODS = [
  {
    id: "bank_transfer",
    label: "Bank transfer (ACH)",
    hint: "We'll email you the account and routing numbers.",
  },
  { id: "zelle", label: "Zelle", hint: "Fastest — no fees on either side." },
  { id: "check", label: "Check by mail", hint: "Made payable to the committee." },
] as const;

/** Campaign social profiles. Set a URL to null to hide that link. */
export const SOCIAL_LINKS: { id: string; label: string; url: string | null }[] = [
  { id: "facebook", label: "Facebook", url: null },
  { id: "instagram", label: "Instagram", url: null },
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
    note: "Support staff. When people tell me their kid's school feels short-handed, this is usually the line they're describing.",
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
    note: "Contractually locked, so anyone campaigning on finding savings here is wasting your time.",
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
    note: "Principals, directors, and the central office where most policy decisions actually get made.",
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
    id: "students-first",
    number: "01",
    title: "Students First",
    summary:
      "Students should have a real voice in the decisions that shape their education, and fair access to the courses that open doors.",
    points: [
      "Create meaningful student advisory committees and regular opportunities for students to speak before major Board decisions.",
      "Review rigid placement systems, including the district matrix, and expand fair access to advanced and higher-level courses.",
      "Review homework, grading, and assessment policies so grades better reflect learning, creativity, effort, and critical thinking.",
      "Prepare students for an AI-driven future by teaching responsible AI use, digital literacy, and independent thinking.",
    ],
  },
  {
    id: "mental-health",
    number: "02",
    title: "Mental Health, Special Education & Early Learning",
    summary:
      "The staff who support students day to day are not an add-on. They are what makes everything else work.",
    points: [
      "Maintain and strengthen school psychologists, counselors, social workers, and other essential mental health staff.",
      "Protect and improve special education staffing, services, early intervention, and communication with families.",
      "Recognize that special education professionals strengthen the entire school community by supporting students, classrooms, educators, and families.",
      "Protect the Early Learning Program and work to keep it affordable by supporting it through the school budget rather than placing excessive costs on families.",
    ],
  },
  {
    id: "safe-inclusive",
    number: "03",
    title: "Safe, Inclusive & Welcoming Schools",
    summary:
      "Every student deserves to feel safe, respected, and represented in East Brunswick schools.",
    points: [
      "Keep schools safe from bullying, discrimination, hate incidents, and routine immigration enforcement.",
      "Build meaningful cultural and religious inclusion by creating more opportunities for students to learn from East Brunswick's diverse communities.",
      "Expand inclusive cafeteria choices, including dependable halal and kosher meal options.",
    ],
  },
  {
    id: "transparent-leadership",
    number: "04",
    title: "Transparent, Responsible & Community-Focused Leadership",
    summary:
      "Public money and public decisions should be understandable to the public paying for them.",
    points: [
      "Make budgets, contracts, policy changes, and major Board decisions easier for residents to understand.",
      "Hold consultants, vendors, and private contractors accountable for cost, quality, and measurable results.",
      "Improve communication and participation for parents, educators, immigrant families, and multilingual communities.",
    ],
  },
  {
    id: "facilities",
    number: "05",
    title: "Strong Facilities & Long-Term Investment",
    summary:
      "Buildings are a generational decision. They deserve an honest conversation about value and cost.",
    points: [
      "Carefully evaluate every school facilities proposal based on long-term educational value, total cost, enrollment needs, and the burden placed on taxpayers.",
      "Recognize that a new high school may provide greater long-term value than repeated temporary fixes, while being honest that residents may be asked to fund much of the project, and work with state legislators to secure stronger state funding for new school facilities.",
    ],
  },
];

export const HELP_OPTIONS = [
  { id: "yard-sign", label: "Request a yard sign" },
  { id: "canvassing", label: "Canvassing" },
  { id: "phone-banking", label: "Phone banking" },
  { id: "events", label: "Events & tabling" },
  { id: "translation", label: "Translation & outreach" },
] as const;

export const DISTRICT_STATS = [
  { value: "8,100", label: "students" },
  { value: "11", label: "schools" },
  { value: "90+", label: "languages spoken" },
  { value: "$229M", label: "annual budget" },
];
