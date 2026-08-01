/**
 * Campaign-wide constants and content data.
 * Swap DONATE_URL for the live ActBlue page when it's ready.
 */

export const CANDIDATE_NAME = "Muhammad Saqeeb";
export const OFFICE = "East Brunswick Board of Education";
export const DONATE_URL = "https://secure.actblue.com/";
export const CONTACT_EMAIL = "hello@saqeebforeb.org";
export const REGISTRATION_DEADLINE = "October 13th";

/** Mock breakdown of the district's $229M operating budget. */
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
    note: "Real expertise, walled off in one program. I want the same dollars writing plans for any kid who needs one.",
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
    note: "Principals, directors, and the central office where placement decisions actually get made.",
    color: "var(--color-chart-6)",
  },
];

export type Priority = {
  id: string;
  title: string;
  short: string;
  body: string[];
};

export const PRIORITIES: Priority[] = [
  {
    id: "pathways",
    title: "Universal Pathways",
    short:
      "End the caste system. Personalized learning plans belong in general education, not in a silo.",
    body: [
      "East Brunswick already knows how to write an individualized plan — it does it thousands of times a year inside Special Education. The problem is that we treat individualization as a legal obligation for some students instead of a design principle for all of them.",
      "Universal Individualization means the district stops asking \"which bucket does this kid belong in?\" and starts asking \"what does this kid need this semester?\" A student who needs reading support in September and an accelerated math placement in January should get both, without a classification following them for six years.",
      "This is not a spending increase. It is the same $34M of Special Education expertise, plus the counselors already on payroll, deployed as a district-wide capability instead of a separate track.",
    ],
  },
  {
    id: "agency",
    title: "Empowered Students",
    short:
      "The right to fail. Students self-select into rigorous coursework. High expectations, high support.",
    body: [
      "Right now, a student can be blocked from an AP or honors course by an administrative gate — a prior classification, a prerequisite grade, a counselor's judgment call. The stated reason is protecting the student. The actual effect is protecting the district's passing metrics.",
      "Students and families should be able to opt into rigor. If a student wants the harder class and understands the risk, that is their decision to make. The district's job is to surround that choice with support: tutoring, check-ins, and a real path to recover from a bad marking period.",
      "Removing the gate does not mean removing the safety net. It means the safety net stops being a wall.",
    ],
  },
  {
    id: "staff",
    title: "Better Paid, Better Supported Staff",
    short:
      "Teachers are not the problem. Understaffed rooms and unfunded mandates are.",
    body: [
      "Every conversation about student outcomes in East Brunswick eventually lands on the same thing: there are not enough adults in the building. A teacher managing thirty students across five ability levels with no aide is not failing — they are being set up to fail.",
      "Competitive pay is the retention floor, not the ceiling. The bigger lever is staffing the support roles: aides, counselors, behavioral specialists, and paraprofessionals who make individualization physically possible in a general education classroom.",
      "Any proposal that adds responsibility to a teacher's plate without adding capacity to the room is not a solution. It is a press release.",
    ],
  },
  {
    id: "dashboards",
    title: "Clear Dashboards",
    short:
      "Data for support, not surveillance. Track where resources are needed — not just test scores.",
    body: [
      "The district publishes budgets that are technically public and practically unreadable. \"Instructional Support Services\" is a real line item covering counselors, nurses, and aides. Almost nobody outside the central office knows that.",
      "I will push for a public dashboard that maps resources to need: which buildings are short on aides, where counselor caseloads exceed recommended ratios, where referral rates spike. Not teacher scorecards — resource maps.",
      "Data used to micromanage educators produces defensive reporting. Data used to justify staffing requests produces staff. I have spent my career on the difference.",
    ],
  },
  {
    id: "safe",
    title: "Safe & Inclusive Schools",
    short:
      "Protect vulnerable students, and make district communication reach every immigrant family.",
    body: [
      "East Brunswick students speak more than 90 languages at home. A district notice that only exists in English is not a notice — it is a barrier with a timestamp on it.",
      "I will push for translated, plain-language communication as a baseline requirement for anything time-sensitive: registration, discipline, IEP meetings, budget votes.",
      "Islamophobia, antisemitism, and racism are not abstract policy categories in this district. They show up in hallways and group chats. Protecting students from them requires named procedures and adults who know what to do, not a values statement in a handbook.",
    ],
  },
];

export type JourneyNode = {
  id: string;
  label: string;
  title: string;
  text: string;
};

export const JOURNEY: JourneyNode[] = [
  {
    id: "label",
    label: "01",
    title: "The Behavioral Label",
    text: "Placed in Special Education due to behavioral friction, not academic inability.",
  },
  {
    id: "gate",
    label: "02",
    title: "The Administrative Gate",
    text: "Locked out of advanced classes because bureaucratic policies prioritize passing metrics over a student's right to challenge themselves.",
  },
  {
    id: "insight",
    label: "03",
    title: "The Insight",
    text: "Realized the system bundles kids with behavioral issues and academic needs together to save administrative effort, leaving both groups neglected.",
  },
  {
    id: "bridge",
    label: "04",
    title: "The Bridge",
    text: "Using graduate-level data science and psychology to dismantle this caste system and implement Universal Individualization.",
  },
];

export const FLOW_TRAP = [
  "Placed in the Special Education silo",
  "Socially ostracized from peers",
  "Administratively blocked from AP courses",
  "Stagnant growth",
];

export const FLOW_SOLUTION = [
  "Provided targeted counseling",
  "Retains full academic agency",
  "Self-selects into the advanced track",
  "High engagement & growth",
];

export type Zone = {
  id: string;
  name: string;
  team: string;
  blurb: string;
  /** SVG polygon points for the schematic township map. */
  points: string;
  labelX: number;
  labelY: number;
};

export const ZONES: Zone[] = [
  {
    id: "churchill",
    name: "Churchill",
    team: "Churchill Canvass Team",
    blurb: "Middle-school families in the north end. Heavy door-knock territory.",
    points: "20,18 168,18 168,116 20,116",
    labelX: 94,
    labelY: 67,
  },
  {
    id: "hammarskjold",
    name: "Hammarskjold",
    team: "Hammarskjold Canvass Team",
    blurb: "The other middle school zone — strong turnout in past school elections.",
    points: "172,18 320,18 320,116 172,116",
    labelX: 246,
    labelY: 67,
  },
  {
    id: "warnsdorfer",
    name: "Warnsdorfer",
    team: "Warnsdorfer Neighborhood Crew",
    blurb: "Elementary families near the township line. Great for yard signs.",
    points: "20,120 118,120 118,222 20,222",
    labelX: 69,
    labelY: 171,
  },
  {
    id: "frost",
    name: "Frost",
    team: "Frost Canvass Team",
    blurb: "Dense elementary catchment — best returns per hour of canvassing.",
    points: "122,120 218,120 218,222 122,222",
    labelX: 170,
    labelY: 171,
  },
  {
    id: "irwin",
    name: "Irwin",
    team: "Irwin Phone Bank",
    blurb: "A lot of working parents. Evening phone banking works better than doors here.",
    points: "222,120 320,120 320,222 222,222",
    labelX: 271,
    labelY: 171,
  },
  {
    id: "bowne-munro",
    name: "Bowne-Munro",
    team: "Bowne-Munro Volunteer Squad",
    blurb: "Long-time residents and newer immigrant families side by side. Translation help needed.",
    points: "20,226 320,226 320,300 20,300",
    labelX: 170,
    labelY: 263,
  },
];

export const HELP_OPTIONS = [
  { id: "canvassing", label: "Canvassing" },
  { id: "phone-banking", label: "Phone banking" },
  { id: "data-entry", label: "Data entry" },
  { id: "yard-sign", label: "Host a yard sign" },
  { id: "translation", label: "Translation & outreach" },
] as const;

export const CONTACT_ROLES = ["Parent", "Student", "Teacher", "Resident"] as const;

export const DISTRICT_STATS = [
  { value: "8,100", label: "students" },
  { value: "11", label: "schools" },
  { value: "90+", label: "languages spoken" },
  { value: "$229M", label: "annual budget" },
];