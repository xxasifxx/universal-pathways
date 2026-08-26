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
    "I grew up in East Brunswick, in a working-class immigrant family, and went through the public schools here. For nearly six years of that I was a special education student — not because I couldn't do the work, but because I was a difficult kid at times, and once the label was there it stayed.",
  long: [
    "I grew up here in East Brunswick, in a working-class immigrant family, and I went through East Brunswick Public Schools from elementary school through graduation.",
    "For close to six years I was a special education student. I wasn't placed there because I couldn't do the work. I was a difficult kid at times, and the placement that followed shaped which classes were open to me and what people expected of me long after the behavior had changed.",
    "I got out of it by learning to advocate for myself, with my parents pushing alongside me. I took independent study to catch up, and I graduated summa cum laude with a degree in psychology before finishing a master's in data science.",
    "Plenty of students don't find that path, and I don't think that's because educators here don't care — I had teachers who went out of their way for me. It's that placement decisions get made early, on thin information, and rarely get revisited.",
    "That's the part of the job I care most about, and it's a large part of why I'm running.",
  ],
} as const;

/**
 * The home page's About block. Four short lines a visitor can read cold,
 * written in the third person because a stranger is meeting him here.
 */
export const ABOUT_SAQEEB = [
  "Muhammad Saqeeb grew up in East Brunswick, the son of working-class immigrants, and went through East Brunswick Public Schools from elementary school through graduation.",
  "He spent close to six years of that as a special education student, worked his way out of the placement, and graduated summa cum laude in psychology before finishing a master's in data science.",
  "He analyzes data for a living, and he has spent the past year at board meetings and in the district's budget filings learning where the money goes.",
  "He is running for the East Brunswick Board of Education, Column #1.",
];

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
  "Data scientist",
  "Reads the district's budget filings",
  "Attends board meetings",
];

/** Core pitch from the campaign mailer. Used on the home page and priorities page. */
export const PITCH = {
  eyebrow: "Muhammad Saqeeb for East Brunswick Board of Education",
  headline: "A Voice for Excellence",
  problem:
    "Healthcare premiums, special education placements, and repairs on aging buildings are rising faster than school revenue. When a board runs out of room in the budget, it trims programs, leaves positions unfilled, and moves costs onto families through activity fees and supply lists. Those decisions get made one line at a time, in meetings most people never see.",
  ask: "A board member should be able to explain where the money goes and push for schools families can afford to be part of.",
  badge: "Column #1",
} as const;

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

export type Priority = {
  id: string;
  number: string;
  title: string;
  summary: string;
  points: string[];
};

/**
 * The public platform: three priorities and the promises under them. The
 * budget lines, mechanisms, and sources behind each promise live in the
 * review room, not here.
 */
export const PRIORITIES: Priority[] = [
  {
    id: "affordable-for-all",
    number: "01",
    title: "Affordable for All",
    summary:
      "Taking part in school shouldn't depend on what a family can pay, and staff shouldn't be priced out of their own health coverage.",
    points: [
      "Universally paid public full-day Pre-K.",
      "Zero fees on student clubs and activities, including arts and sports.",
      "Fully funded schools, so parents aren't paying out of pocket for basic opportunities.",
      "Hire teaching support staff in-house instead of contracting the work out.",
      "Protect special education, mental health, and early intervention when the budget gets tight.",
      "Better language programs for incoming families.",
      "End lunch debt.",
      "Better healthcare for school staff.",
    ],
  },
  {
    id: "students-first",
    number: "02",
    title: "Students First",
    summary:
      "A student should get into the course they're ready for on the strength of what they can do, and be graded on work they actually did.",
    points: [
      "End the rigid matrix and open advanced courses to students who are ready for them.",
      "Allow placement exams, including languages.",
      "Arts and science above grade level by request, with early access to instruments.",
      "A language bridge program for new families.",
      "Grade students on their work, not their homes: more in-school assignments, less homework counted for evaluation.",
      "Teach students to use AI on work that is their own.",
      "Train staff to recognize bias and harassment in any form.",
      "ICE out of schools. Police and SROs out of schools.",
      "Give students a standing seat in mental health and facilities decisions.",
    ],
  },
  {
    id: "reduce-our-costs",
    number: "03",
    title: "Reduce Our Costs",
    summary:
      "Buildings past the point where patching is the cheaper answer cost the district twice. Decide, in public, before the bill arrives.",
    points: [
      "A new high school for ninth through twelfth grade.",
      "Better technology, facilities, and programs in the buildings we keep.",
      "Use state construction grants to build for lower maintenance.",
      "Remove lead and address the temporary classroom units.",
      "Build facilities that can house the programs we want.",
      "Audit the master plan, with public dashboards and community oversight.",
    ],
  },
];

/** Shown under the priorities. The campaign does not publish estimates it cannot source. */
export const COST_STUDY_NOTE =
  "None of these carry a dollar figure, because a number reverse-engineered from a budget filing would not survive scrutiny. Pricing this work takes enrollment projections, a facilities condition assessment, staffing models, and plan-by-plan benefit quotes. Until the district has those, I will tell you which budget line a promise touches and what is still unknown.";

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
  {
    id: "researcher",
    label: "Help review the platform",
    blurb:
      "Read the longer policy drafts before they go public and tell us where they're weak, unsourced, or overconfident. About an hour, from home.",
  },
] as const;

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
