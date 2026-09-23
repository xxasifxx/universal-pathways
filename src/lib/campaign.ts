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
    "Plenty of students don't find that path. I had teachers who went out of their way for me. The problem is that placements can be made early, with little information, and then stay in place for years.",
    "I want the board to pay attention to those decisions. That is a large part of why I'm running.",
  ],
} as const;

/** Saqeeb's own statement, verbatim. Runs on the priorities page. */
export const CANDIDATE_STATEMENT = [
  "I'm running for the East Brunswick Board of Education because I care about everyone in our community, and I want to ensure our schools are putting students first. When I eventually have children, I want to ensure that they and any of their friends do not have to face the level of alienation that I felt when I was a student in East Brunswick.",
  "I live here. I started at Memorial Elementary School and graduated from East Brunswick High School.",
  "All I know is East Brunswick.",
  "I was a student who struggled to communicate, took special education classes, and had speech therapy. I know how isolating school can feel sometimes, especially for students who may not feel connected to their peers or their school community. I know how much it means for someone to listen and speak for those who are still developing their own voice.",
  "When schools become an environment that builds relationships across cultures, it raises their confidence, empathy, and willingness to challenge what they don't know. Our schools should best equip our students with material conditions they are coming into this age of AI technology where they need to differentiate between truths and lies more critically.",
  "I've been involved in bringing youth voices forward. I've worked directly with student clubs to help conduct toy drives for other schools in need because I believe every one of our students deserves an opportunity. I have advocated for students locally and worked to build diverse connections.",
  "Every student should feel that they are seen, supported, respected, and given the opportunity to succeed.",
  "That is why I would focus on students' mental health, school climate, and making sure every student feels like they belong. We need to build an environment that encourages the social and emotional well-being of each student and listens empathetically to each student.",
  "Even our technology policies must come back to the root issue: empathy.",
  "At the same time, putting students first means recognizing the financial pressures facing both our school district and our community.",
  "I was a college student during the COVID-19 pandemic, and I, like many other community members, have felt the rising cost of inflation and its impact on housing, childcare, our communities' physical and mental health, and the nearly unaffordable healthcare premiums we are currently facing statewide.",
  "Families are already dealing with rising costs for housing, childcare, healthcare, and everyday necessities. At the same time, the district must continue providing high-quality education while managing increasing operational costs.",
  "As a Board of Education member, I would try my best to work with the team to find innovative solutions to help reduce the impact of these costs on our school community. I believe the Board must continue looking for responsible ways to control costs, protect essential programs and sports, and make sure taxpayer dollars are being used effectively.",
  "Finally, I would make it a priority to listen to students, parents, teachers, and residents and improve communication so people understand what the Board is doing and why.",
  "My experience in East Brunswick taught me how important it is for students to feel supported and connected. I know how much it matters for someone to listen when a student is still developing their voice.",
  "I want students from all backgrounds and needs to feel that East Brunswick is their home for generations.",
];

/**
 * The home page's About block. Written in the first person because Saqeeb
 * is introducing himself directly to a visitor meeting him for the first time.
 */
export const ABOUT_SAQEEB = [
  "I started at Memorial in special needs and remedial classes before graduating EBHS class of 2016 with honors and APs. I went to Rowan University to study Psychology, graduating summa cum laude and earning my degree partially through independent study. Recently I earned my Master's degree in Data Science at NJIT.",
  "I have been involved with several South Asian community advocacy groups, including briefly serving as a youth director with a local non profit. I lead civic advocacy efforts locally and across New Jersey to serve all individuals regardless of race, religion, or nationality.",
  "I'm a proud chachu. That means uncle in Urdu.",
  "I support our family business right here in East Brunswick, and I believe in getting to know your neighbors.",
  "In my spare time you will see me at the gym, at a cafe, at local community events, listening.",
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
    text: "Students take the courses they are ready for, even if one grade doesn't fit.",
  },
  {
    id: "reduce-our-costs",
    title: "Reduce Our Costs",
    text: "Compare repair costs against replacement before the repairs cost more.",
  },
];

export type Priority = {
  id: string;
  number: string;
  title: string;
  sections: { label: "What" | "Why" | "How" | "Result"; text: string }[];
  sources: { label: string; href: string }[];
};

export const PRIORITIES_TITLE = "A Five-Year Plan for Better Schools at Lower Cost";
export const PRIORITIES_INTRO =
  "As funding gets cut, the solution to budget constraints starts with replacing inefficient programs with better-quality, cost-reducing ones, expanding access and opportunities for students while saving money. Here's how we will do it:";

/** The seven sourced priorities from the candidate's reference sheet. */
export const PRIORITIES: Priority[] = [
  {
    id: "full-day-pre-k",
    number: "01",
    title: "Free, Universal Full-Day Pre-K",
    sections: [
      { label: "What", text: "Expand towards free full-day preschool for all East Brunswick’s estimated 824 preschool-age children, with the State requiring districts to work toward serving at least 90%, or about 742 children, through district classrooms, Head Start, and qualified providers." },
      { label: "Why", text: "A local full-time private preschool costs about $1,280/month. At that price, preschool for all 824 children represents about $10.55M/year in family costs." },
      { label: "How", text: "Have the Board direct the district to apply for NJ Preschool Expansion Aid. NJDOE calculates the preschool universe as 2× first-grade enrollment; East Brunswick reported 412 first-graders, producing an 824-child universe, and State rules call for plans to reach at least 90%. At Middlesex County’s $16,806 district-seat planning rate, 742 seats equal about $12.47M. Using the illustrative 40% State-share assumption, about $4.99M would come from PEA, with existing preschool spending and Head Start/provider configurations reducing the remaining local cost. North Brunswick already uses district, private-provider, and Head Start classrooms for free full-day preschool." },
      { label: "Result", text: "Hundreds more children get full-day early education regardless of family income, enter kindergarten better prepared, and families no longer have to choose between preschool and thousands of dollars in annual childcare costs. Up to $10.55M/year in private family preschool costs is displaced, with an upper-end local planning estimate of about $337/year on the average assessed home before additional offsets." },
    ],
    sources: [
      { label: "Winnie", href: "https://winnie.com/place/crossroads-early-learning-center-east-brunswick" },
      { label: "NJDOE PEA Notice", href: "https://www.nj.gov/education/earlychildhood/preschool/docs/2026-2027PreschoolExpansionNoticeOfFundingOpportunity.pdf" },
      { label: "NJ Preschool Regulations", href: "https://www.state.nj.us/education/code/current/title6a/chap13a.pdf" },
    ],
  },
  {
    id: "affordable-for-all",
    number: "02",
    title: "Affordable School Supplies, Clubs & Activities for All",
    sections: [
      { label: "What", text: "Eliminate participation fees, reduce required school-supply costs, and end student lunch debt." },
      { label: "Why", text: "Families already pay taxes for public schools but are still charged for activities, supplies, meals, and private enrichment." },
      { label: "How", text: "Have the Board replace approximately $359,000 in annual participation-fee revenue, centrally purchase basic supplies only where bulk pricing beats family retail costs, and maximize State/federal meal assistance before covering remaining lunch debt. Monroe already provides grades 7–12 athletics and co-curricular activities without a participation fee." },
      { label: "Result", text: "No student is priced out of sports, clubs, music, or activities because their family cannot afford the fee; families also face fewer school-supply and meal costs. $0 participation fees would cost about $18/year on the average assessed home if the entire $359,000 were replaced through the levy, before savings elsewhere." },
    ],
    sources: [
      { label: "Monroe Student Handbook", href: "https://www.monroe.k12.nj.us/cms/lib/NJ01000268/Centricity/domain/113/site_shortcuts/23-2024/2023-2024%20MTHS%20Student%20Handbook%20%205-23-24.pdf" },
      { label: "East Brunswick Budget", href: "https://www.ebnet.org/departments/financial-services/budget-information/2026-2027-budget-info" },
    ],
  },
  {
    id: "expand-special-education",
    number: "03",
    title: "Expand Special Education in East Brunswick",
    sections: [
      { label: "What", text: "Bring more specialized programs and services into East Brunswick where the district can provide them effectively." },
      { label: "Why", text: "East Brunswick budgets about $6.61M/year for outside special-education tuition, before transportation." },
      { label: "How", text: "Direct the superintendent to compare every potential in-district program against avoided tuition + avoided transportation + potential tuition revenue from neighboring districts. Build programs only where serving students locally produces better service and a stronger financial result. We'll do this in phases: first identify which needs can be met locally with our current space, then determine which programs require hiring specialists to fit within existing space, and in the long term, build new facilities to house those programs in-house." },
      { label: "Result", text: "More students receive specialized instruction, therapies, and support inside their own school district, closer to their families and peers, with less time spent traveling to outside placements. At the same time, bringing appropriate placements in-house can reduce the district’s $6.61M+ outside-placement bill and potentially generate tuition revenue from neighboring districts." },
    ],
    sources: [{ label: "East Brunswick Budget", href: "https://www.ebnet.org/departments/financial-services/budget-information/2026-2027-budget-info" }],
  },
  {
    id: "healthcare-costs-care",
    number: "04",
    title: "Lower Healthcare Costs + Expand Care",
    sections: [
      { label: "What", text: "Combine employee health-cost reform with expanded student and staff medical, mental-health, dental, and prescription access." },
      { label: "Why", text: "East Brunswick employee benefits cost about $40.36M/year. Even small percentage reductions therefore produce substantial savings." },
      { label: "How", text: "Direct the administration to pursue FQHC, hospital, or community-provider partnerships; bill eligible care through Medicaid/private insurance; and competitively review insurance, pharmacy, PBM, rebate, and prescription contracts. South Brunswick already separately procures both operation of a district health center and brokerage for health and prescription benefits." },
      { label: "Result", text: "Students get mental-health and healthcare services closer to where they already go to school, while staff gain easier access to care and lower-cost treatment options. Problems can be addressed earlier instead of families having to navigate outside providers on their own. The goal is $0 net new recurring tax cost, while a 3–5% reduction in benefits costs would save roughly $1.21M–$2.02M/year." },
    ],
    sources: [
      { label: "South Brunswick RFPs", href: "https://www.sbschools.org/page/content-rfps-and-bids" },
      { label: "NJ Department of Health – FQHCs", href: "https://www.nj.gov/health/fhs/fqhc/" },
      { label: "East Brunswick Budget", href: "https://www.ebnet.org/departments/financial-services/budget-information/2026-2027-budget-info" },
    ],
  },
  {
    id: "new-high-school",
    number: "05",
    title: "Build the New 9–12 High School",
    sections: [
      { label: "What", text: "Build a permanent 9–12 high school instead of continuing to layer temporary fixes onto the existing building." },
      { label: "Why", text: "Preliminary estimates put major work on the existing high school at $300M+, existing school plus temporary-capacity changes around $323M, existing school plus a Ninth Grade Academy around $386M, and a new four-grade high school around $385M–$425M." },
      { label: "How", text: "Have the Board develop one permanent proposal, maximize available State construction/debt-service aid, match borrowing against retiring debt, and publish the real homeowner tax impact before any referendum." },
      { label: "Result", text: "Students and staff get a safer, healthier, modern school with enough space for grades 9–12, modern labs and classrooms, and fewer temporary or overcrowded learning environments. It also gives taxpayers one permanent facilities solution instead of repeatedly paying for partial fixes. No homeowner tax figure should be promised until State aid, financing, retiring debt, and eligible costs are known." },
    ],
    sources: [{ label: "Patch", href: "https://patch.com/new-jersey/eastbrunswick/amp/34695585/east-brunswick-weighs-300m-in-repairs-vs-425m-new-building" }],
  },
  {
    id: "responsible-ai",
    number: "06",
    title: "Responsible AI + Technology",
    sections: [
      { label: "What", text: "Keep generative AI out of assigned Pre-K–8 work except approved accommodations, while teaching responsible AI research in grades 9–12." },
      { label: "Why", text: "Students need to develop reading, writing, research, and critical-thinking skills before relying on AI-generated work." },
      { label: "How", text: "Have the Board establish grade-level rules and integrate source verification, hallucinations, citations, deepfakes, bias, and privacy into existing curriculum and professional development." },
      { label: "Result", text: "Younger students develop their own reading, writing, creativity, and reasoning first; older students graduate knowing how to research with AI, detect false information and deepfakes, verify sources, and use the technology responsibly. No major new recurring expenditure is required." },
    ],
    sources: [{ label: "East Brunswick Public Schools", href: "https://www.ebnet.org/" }],
  },
  {
    id: "hib-inclusivity",
    number: "07",
    title: "HIB + Inclusivity Built Around East Brunswick",
    sections: [
      { label: "What", text: "Make anti-bullying and inclusion policy reflect East Brunswick’s actual students, demographics, languages, and reported incidents." },
      { label: "Why", text: "Generic training cannot address discrimination effectively if it does not reflect the problems students are actually reporting." },
      { label: "How", text: "Strengthen Board policy and use HIB reports, demographic data, climate surveys, and student/family feedback to update training annually while improving consistency in investigations." },
      { label: "Result", text: "Students have a clearer, more reliable process when they report bullying or discrimination, staff receive training based on problems actually occurring in East Brunswick, and the district gets measurable data showing which student communities feel safe, included, or underserved. This can largely use existing HIB and professional-development resources." },
    ],
    sources: [{ label: "East Brunswick Public Schools", href: "https://www.ebnet.org/" }],
  },
];


/** Shown under the priorities. The campaign does not publish estimates it cannot source. */
export const COST_STUDY_NOTE =
  "The district has not published enough information to price these plans. Reliable estimates need enrollment projections, a building condition report, staffing plans, and health-plan quotes.";

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
      "Read draft proposals and flag weak claims or missing sources. About an hour, from home.",
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
