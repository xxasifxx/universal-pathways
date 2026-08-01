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
      "Individual learning plans shouldn't require a classification first.",
    body: [
      "East Brunswick writes individualized learning plans all the time. It just does it inside Special Education, where federal law requires it, and almost nowhere else. So a kid who needs something specific has to be classified before anyone will write it down.",
      "What I want instead is pretty boring in practice. A student who's behind in reading in September gets reading help in September. If that same student is ready for accelerated math in January, they move in January. Nobody has to carry a label through middle school to make either of those things happen.",
      "This isn't a spending increase. It's the $34.3 million of Special Education expertise we already pay for, plus counselors already on payroll, working across the whole district instead of one track.",
    ],
  },
  {
    id: "agency",
    title: "Empowered Students",
    short:
      "Let students opt into the hard class, and put real support around them when they do.",
    body: [
      "A student can be kept out of an AP or honors course by a prerequisite grade, an old classification, or one counselor's read of whether they're ready. Everyone involved means well. But a district that never lets marginal students try also never has to report that any of them struggled, and that's a convenient thing for the numbers.",
      "If a family wants the harder class and understands what they're signing up for, that should be their call. The district's job starts after the yes: tutoring that's scheduled rather than offered, a check-in halfway through the marking period, and a way back if the first quarter goes badly.",
      "I'm not proposing we take away support. I'm proposing we stop using it as a reason to say no.",
    ],
  },
  {
    id: "staff",
    title: "Better Paid, Better Supported Staff",
    short:
      "Understaffed rooms and unfunded mandates, not the people in front of the kids.",
    body: [
      "Almost every conversation I have about outcomes ends up in the same place: there aren't enough adults in the building. A teacher with twenty-eight kids at five different levels and no aide isn't failing. They're being set up to fail.",
      "Pay matters, and we should stop losing good people to neighboring districts over a few thousand dollars. But the bigger lever is the support roles. Aides and paraprofessionals are what make it physically possible to give one kid something different from the kid next to him.",
      "So my test for any new initiative is simple. Does it add work to a teacher's day? Then it has to add a person to the room, or it isn't ready.",
    ],
  },
  {
    id: "dashboards",
    title: "Clear Dashboards",
    short:
      "Publish where the resources are thin, not scorecards on teachers.",
    body: [
      "The budget is public in the sense that a PDF exists. Ask ten parents what \"Instructional Support Services\" pays for and you'll get ten shrugs, even though it's the line covering their kid's counselor and nurse.",
      "I'd like the district to publish something a parent can actually use: which buildings are short on aides, which counselors are carrying caseloads above the recommended ratio, where referrals are spiking. That's a map of where help is needed. It isn't an evaluation of anybody.",
      "I do this for a living, and the pattern is consistent. Measure people to catch them and the reporting gets defensive. Measure conditions to fix them and you get honest numbers.",
    ],
  },
  {
    id: "safe",
    title: "Safe & Inclusive Schools",
    short:
      "Reach every family in a language they read, and name what we do when hate shows up.",
    body: [
      "More than 90 languages are spoken in the homes of East Brunswick students. An English-only notice with a Friday deadline isn't really a notice for a lot of those families.",
      "Anything with a deadline attached should go out translated and in plain language: registration, discipline letters, IEP meeting invitations, budget votes. Not the whole website. The things that cost you something if you miss them.",
      "On hate, I'd rather be specific than sound noble. Islamophobia and antisemitism both show up here, usually in a group chat before they show up in a hallway. What families ask me for isn't a stronger values statement. It's knowing which adult handles it, how fast, and what the parent hears back.",
    ],
  },
  {
    id: "cost-dashboard",
    title: "A Budget Dashboard for Your Actual Kid",
    short:
      "Show a parent what the district spends on their child, and let them run the numbers while the board is still debating.",
    body: [
      "The budget hearing is the one night a year when parents are told the numbers matter, and it gets held in a language nobody outside the central office speaks. A line moves by 1.4 percent, somebody says the word efficiencies, and the room nods because what else is it going to do.",
      "I want the district to publish a dashboard where a parent picks their kid's grade and the services their kid actually uses and gets a real number back: this is what East Brunswick spends on your child this year, and here's what it buys. Then, when something's on the agenda, the same tool takes the proposed change and shows both halves. What it does to that number, and what it does to the room. Ten fewer aides isn't a percentage. It's about twenty-eight classrooms losing their second adult, and the kids who needed someone sitting beside them notice first.",
      "I built a working version so nobody has to take my word that it's feasible. Mine runs off the published budget, so the figures are modeled. The district has the real per-pupil detail and could do it properly, which is the whole reason to ask.",
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
    title: "The file gets opened",
    text: "I was an angry kid, and I was loud about it. That got me into Special Education. Nobody ever suggested I couldn't do the work.",
  },
  {
    id: "gate",
    label: "02",
    title: "The classes close",
    text: "By high school the file was making my schedule. I asked about advanced courses more than once and got some version of let's be realistic. That was the whole conversation.",
  },
  {
    id: "insight",
    label: "03",
    title: "Figuring out why",
    text: "It took me years to see it wasn't personal. Kids with behavior problems and kids with learning needs get run through one program because that's cheaper to administer. Both groups get a watered-down version of what they came for.",
  },
  {
    id: "bridge",
    label: "04",
    title: "Why I'm running",
    text: "I got out through independent study and ended up doing graduate work in data science and psychology. Now I spend my days finding where systems quietly sort people. I'd like to point that at the district that sorted me.",
  },
];

export const FLOW_TRAP = [
  "Referred, classified, moved out of the general track",
  "Separated from the friends he had in September",
  "Told he isn't eligible for AP",
  "Coasts. Nobody notices.",
];

export const FLOW_SOLUTION = [
  "Gets counseling for the thing that actually happened",
  "Stays in his classes with his friends",
  "Signs up for AP because he wants to",
  "Works harder than he has in two years",
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
    blurb: "Middle-school families in the north end. Lots of doors, close together, which is about the best thing you can ask for.",
    points: "20,18 168,18 168,116 20,116",
    labelX: 94,
    labelY: 67,
  },
  {
    id: "hammarskjold",
    name: "Hammarskjold",
    team: "Hammarskjold Canvass Team",
    blurb: "The other middle school zone. People here actually vote in school elections, which is rarer than it should be.",
    points: "172,18 320,18 320,116 172,116",
    labelX: 246,
    labelY: 67,
  },
  {
    id: "warnsdorfer",
    name: "Warnsdorfer",
    team: "Warnsdorfer Neighborhood Crew",
    blurb: "Elementary families out near the township line.",
    points: "20,120 118,120 118,222 20,222",
    labelX: 69,
    labelY: 171,
  },
  {
    id: "frost",
    name: "Frost",
    team: "Frost Canvass Team",
    blurb: "Dense elementary catchment. You can cover a lot of ground here in two hours.",
    points: "122,120 218,120 218,222 122,222",
    labelX: 170,
    labelY: 171,
  },
  {
    id: "irwin",
    name: "Irwin",
    team: "Irwin Phone Bank",
    blurb: "A lot of parents working second shift. We tried doors here in the spring and mostly talked to nobody, so we're on the phones instead.",
    points: "222,120 320,120 320,222 222,222",
    labelX: 271,
    labelY: 171,
  },
  {
    id: "bowne-munro",
    name: "Bowne-Munro",
    team: "Bowne-Munro Volunteer Squad",
    blurb: "Forty-year residents and families who arrived last year, on the same block. If you speak Gujarati, Spanish, Mandarin or Urdu, this is where you'd help most.",
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