/**
 * The research behind each promise: the relevant decision, how the change
 * happens, what remains unknown, and the sources read while writing it.
 * Reviewers only — this module is server-side so the text never ships to the
 * public bundle.
 */

export type PromiseSource = { label: string; href: string };

/**
 * Each promise involves a budget item, board policy, state rule, or district
 * practice. `leverKind` records which type applies.
 */
export type LeverKind = "budget" | "policy" | "state-rule" | "practice";

export const LEVER_LABELS: Record<LeverKind, string> = {
  budget: "Budget line",
  policy: "Board policy",
  "state-rule": "State rule",
  practice: "District practice",
};

/**
 * Research for one promise. The published budget does not contain enough
 * information for cost estimates.
 */
export type PromiseDetail = {
  /** Which kind of decision this is. */
  leverKind: LeverKind;
  /** The relevant line, policy, or rule. */
  lever: string;
  /** How the change would work. */
  mechanism: string[];
  /** Information that is not publicly available. */
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

export const PRIORITY_DETAIL: Priority[] = [
  {
    id: "affordable-for-all",
    number: "01",
    title: "Affordable for All",
    summary:
      "Taking part in school shouldn't depend on what a family can pay, and staff shouldn't be priced out of their own health coverage.",
    points: [
      {
        text: "Free full-day Pre-K for every family.",
        detail: {
          leverKind: "budget",
          lever: "Nothing in the general fund today",
          mechanism: [
            "The adopted 2026-27 budget has no preschool appropriation or preschool education aid. The district reports enrollment from kindergarten up, with 8,559 students on roll. To start full-day Pre-K, the district would apply for state preschool aid and set the program's size after funding is known.",
          ],
          openQuestion:
            "How many three- and four-year-olds would enroll, what per-child rate the district would qualify for, and what rooms, staff, and buses a full-day program needs. None of that is in a budget filing.",
          sources: [SRC.budget],
        },
      },
      {
        text: "No fees to join a club, a team, or an arts program.",
        detail: {
          leverKind: "budget",
          lever: "Athletics, cocurricular activities, miscellaneous revenue",
          mechanism: [
            "Athletics is budgeted at $1.3 million and cocurricular activities at $0.4 million. Extracurricular cost per pupil rose from $233 in the filing's 2023-24 actual column to $273 in the 2026-27 proposed column. Ending participation fees would require other revenue or lower program spending.",
          ],
          openQuestion:
            "How much families actually pay. Fee income is not broken out anywhere in the filing; it sits inside $2,455,107 of miscellaneous revenue with rentals, interest, and other local receipts.",
          sources: [SRC.budget],
        },
      },
      {
        text: "Schools funded well enough that parents aren't buying the basics themselves.",
        detail: {
          leverKind: "practice",
          lever: "Supply lists, activity fees, and trip costs, none of them itemized",
          mechanism: [
            "The budget does not show what families pay for supply lists, activities, trips, or instrument rentals. These costs vary by school and program.",
            "The district should collect and publish every required family payment. That is needed before the board can estimate the total cost to families.",
          ],
          openQuestion:
            "The total amount households spend. This would require a survey and district records.",
        },
      },
      {
        text: "Hire teaching support staff in-house instead of contracting the work out.",
        detail: {
          leverKind: "budget",
          lever: "Student support services, out-of-district tuition",
          mechanism: [
            "Student support services total $23.2 million, including $5.0 million in extraordinary services and $3.7 million in speech, occupational, and physical therapy. Out-of-district tuition is the fastest-growing line in the whole budget, up 54.5% in two years to $6.6 million, and the district's own budget update lists out-of-district placements and contracted services as a $2,027,781 increase for this year.",
          ],
          openQuestion:
            "How much work is contracted out, and how agency rates compare with district salaries and benefits.",
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
            "The board can identify these services as a budget priority before voting on reductions.",
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
            "How many students arrive each year needing language support, and what a bridge program would need beyond the bilingual staff already in place.",
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
        text: "Health coverage school staff can afford to use.",
        detail: {
          leverKind: "budget",
          lever: "Personal services — employee benefits, $40,357,120",
          mechanism: [
            "Benefits are 38.43% of salaries in the adopted budget, up from 30.16% in the same filing's 2023-24 actual column, and the district's own budget update names health premiums as its largest cost driver this year: a 22% increase, $7,934,618.",
            "The district can join or leave the School Employees' Health Benefits Program by resolution. If it buys only the medical plan, it must offer a separate prescription plan. Dental coverage requires a separate resolution. The board approves the pharmacy, administration, and broker contracts.",
            "State law sets the available state plans and employee contribution rates for the Educators and Garden State plans. The state pays pension contributions for teaching staff, except for the share of salaries funded by federal money.",
            "In September 2025, the State Comptroller reported contracting and conflict-disclosure problems at health insurance funds serving local governments and school boards. The Schools Health Insurance Fund paid one firm and an affiliate about $36 million from 2021 through 2025. Saqeeb wants the district to publish renewal terms, broker arrangements, and priced alternatives before a vote.",
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
      "Students should be able to take the courses they are ready for and earn grades based on their own work.",
    points: [
      {
        text: "A student ready for an advanced course can take it, even if one grade says otherwise.",
        detail: {
          leverKind: "practice",
          lever: "Course placement criteria, published in the course guide",
          mechanism: [
            "The district publishes placement criteria alongside its course guide. Under those criteria a single prior-year grade can decide whether a student stays on a track or moves up. The board can direct the administration to revise them.",
            "The district's gifted and talented policy already calls for more than one measure, and it applies to English language learners and to students with an IEP or 504 plan. The promise is that placement decisions follow that same approach.",
          ],
          openQuestion:
            "How many students clear or miss each cutoff, and how that breaks down by school, income, and language background. The district has the data and does not publish it.",
          sources: [SRC.ebPlacement, SRC.ebGifted, SRC.giftedAct],
        },
      },
      {
        text: "A student who already knows the material can test into the higher course, including in world languages.",
        detail: {
          leverKind: "practice",
          lever: "Placement criteria and the world language sequence",
          mechanism: [
            "A transcript does not always show what a student can do. A child who learned a language at home, or who covered the material at another school, has no way to demonstrate it if the only evidence considered is a prior grade. A placement exam gives them one.",
            "Setting this up means deciding which subjects offer an exam, who gives it, and when. It also means telling every family the option exists, so it is not limited to those who know to ask.",
          ],
          openQuestion:
            "Which subjects already allow a challenge exam today. That is an administrative practice, not a published rule.",
          sources: [SRC.ebPlacement],
        },
      },
      {
        text: "Arts and science above grade level for students who ask, and instruments earlier.",
        detail: {
          leverKind: "policy",
          lever: "Board Policy 2464, instructional adaptation",
          mechanism: [
            "Policy 2464 defines an instructional adaptation as teaching a student at their instructional level rather than their grade level, and it directs the Superintendent to see that those adaptations are designed. The 2019 state law behind it requires districts to identify and serve gifted students in every grade from kindergarten up.",
            "The authority is already there. What is being asked is that it produce a schedule for a fourth grader ready for older science, and an instrument for a younger student ready to play one.",
          ],
          openQuestion:
            "How many students receive an above-grade placement now, in which buildings, and whether the answer is the same across the elementary schools.",
          sources: [SRC.ebGifted, SRC.giftedAct],
        },
      },
      {
        text: "A language bridge program for families arriving mid-year.",
        detail: {
          leverKind: "budget",
          lever: "Bilingual education, $1.5 million",
          mechanism: [
            "Bilingual education is budgeted at $1.5 million inside the $73.0 million instruction total. A bridge program is what sits around that: support during a new family's first weeks, translated material, and someone responsible for placing the student correctly.",
          ],
          openQuestion:
            "How many students arrive mid-year needing language support, and what the current caseload per teacher is.",
          sources: [SRC.budget],
        },
      },
      {
        text: "Less of a grade riding on homework, more on the work a student does in class.",
        detail: {
          leverKind: "policy",
          lever: "Board Policy 2624, Grading System",
          mechanism: [
            "Policy 2624, last edited in September 2025, caps homework completion at ten percent of a grade and requires that grades reflect proficiency against the state standards and the district's own objectives. A student who believes a grade is unjust can appeal to the principal and then to the assistant superintendent.",
            "The Superintendent sets the procedures that put the policy into practice in each school, which is where the written rule and a student's actual experience can diverge. The board can ask, in public, whether they match.",
          ],
          openQuestion:
            "Whether the ten percent cap is being applied consistently across schools and departments. Nothing published tracks that.",
          sources: [SRC.ebGrading],
        },
      },
      {
        text: "Teach students to use AI on work that is their own.",
        detail: {
          leverKind: "policy",
          lever: "Local curriculum and acceptable use, with state guidance only",
          mechanism: [
            "New Jersey publishes guidance on classroom AI use and leaves the rules to each district, so East Brunswick's rule is whatever the board and administration adopt.",
            "Teachers need to know what is allowed before they are asked to enforce it. Students need to be taught how to use these tools on work that stays theirs, instead of only being told when using them counts as cheating.",
          ],
          openQuestion:
            "What East Brunswick's current rule actually is, building by building, and whether staff have had training on it.",
          sources: [SRC.njAi],
        },
      },
      {
        text: "Train staff to recognize bias and harassment in any form.",
        detail: {
          leverKind: "state-rule",
          lever: "Mandated HIB training, and what the state does not require",
          mechanism: [
            "New Jersey already requires staff training on harassment, intimidation, and bullying, so East Brunswick does some of this by law.",
            "Training on recognizing bias is not separately required. A district that wants it adds it, pays for it out of professional development, and decides who attends.",
          ],
          openQuestion:
            "What training staff currently receive beyond the state minimum, and how incidents are reported back to the board.",
          sources: [SRC.hibTraining],
        },
      },
      {
        text: "ICE out of schools. Police and SROs out of schools.",
        detail: {
          leverKind: "policy",
          lever: "The district's agreement with local law enforcement",
          mechanism: [
            "Immigration enforcement is governed by the state's Immigrant Trust Directive, which limits how New Jersey law enforcement may assist federal immigration authorities and bars stopping or detaining someone solely on immigration status. The district's part is knowing the rule, telling families it exists, and having a written answer ready before anyone shows up at a school office.",
            "Police presence is set locally. Every district signs an agreement with its municipal police department, required by state regulation, and that agreement defines when officers enter a building and what happens when they do. Because it is signed by both sides, it can be read in public, questioned, and renegotiated.",
          ],
          openQuestion:
            "What East Brunswick's current agreement says. It is a public document and this campaign has not been able to obtain the signed version.",
          sources: [SRC.immigrantTrust, SRC.schoolPoliceMoa],
        },
      },
      {
        text: "A standing student seat in mental health and facilities decisions.",
        detail: {
          leverKind: "policy",
          lever: "Board Bylaw 0143.2, student representatives to the board",
          mechanism: [
            "The board already seats at least one nonvoting student representative from grades nine to twelve, chosen by the student body, serving a one-year term. The bylaw gives that student three duties: attend meetings, bring student concerns to the board, and report back monthly to the student council.",
            "Counseling and the condition of the buildings are the two things students feel first, so the ask is a standing place in those discussions instead of a report at the end. That is a bylaw and committee change the board makes on its own.",
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
      "Some buildings now cost more to keep patching than to replace. The board should compare the two in public before the bill arrives.",
    points: [
      {
        text: "A new high school for 9th through 12th.",
        detail: {
          leverKind: "budget",
          lever: "Outside the general fund, on the tax bill as debt service",
          mechanism: [
            "The board reviewed the options on June 4. Moving the temporary classrooms from Churchill to the high school campus was estimated at about $11 million and could not be completed before September 2027. Construction for a ninth-grade academy was estimated at $45 to $49 million before fees and contingencies. Hard costs for a new high school were estimated at $325 to $350 million. A district official said a project of that size would require a bond referendum.",
            "These projects are outside the $209,216,947 general fund shown on the dashboard. Voters would decide a bond referendum, and approved borrowing would appear on tax bills as debt service.",
          ],
          openQuestion:
            "Which option the district picks, and what the state's share of it would be. Those are decisions ahead of the board, not figures printed anywhere yet.",
          sources: [SRC.ninthGrade, SRC.budget],
        },
      },
      {
        text: "Better technology, facilities, and programs in the buildings we keep.",
        detail: {
          leverKind: "budget",
          lever: "Operations and maintenance, $21.1 million, and capital outlay, $8.4 million",
          mechanism: [
            "Maintenance runs $21.1 million a year and is down 3.9%, while capital outlay is down 28.3% in two years. When the repair budget and the replacement budget both shrink, the work does not disappear; it moves to next year at a higher price.",
            "So the comparison the board owes residents is the running cost of repairs against the cost of a replacement plan that would go to voters.",
          ],
          openQuestion:
            "What each building needs and when. That is a facilities condition assessment, and the district has not published one.",
          sources: [SRC.budget],
        },
      },
      {
        text: "Apply for state construction grants, and build so the next twenty years of maintenance cost less.",
        detail: {
          leverKind: "budget",
          lever: "Capital outlay $8.4 million, capital reserve $256,697",
          mechanism: [
            "The state classifies East Brunswick as a Regular Operating District. The Department of Education reviews a project for eligibility before it goes to voters, and state support then comes through debt-service aid or a grant. Under the current grant program a district is eligible for at least 40 percent of approved eligible costs and funds the rest locally.",
            "The local share is the problem. Capital outlay is down 28.3% in two years and the capital reserve is projected at $256,697, down from $3.1 million.",
          ],
          openQuestion:
            "East Brunswick's own aid percentage, and therefore the state share of any specific project. That comes out of the eligibility review, not the budget filing.",
          sources: [SRC.rod, SRC.budget],
        },
      },
      {
        text: "Remove lead and deal with the temporary classroom units.",
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
        text: "Design buildings around the programs we want to offer.",
        detail: {
          leverKind: "practice",
          lever: "Program requirements written into the design",
          mechanism: [
            "On June 4 board members went through the high school's cafeteria and gym capacity, its classroom conditions, the roof, and the plumbing. Those limits decide what the school can offer, not just how it feels to walk through.",
            "Which is why the program and space requirements have to reach the architect before design work starts, rather than being fitted into whatever gets drawn.",
          ],
          openQuestion:
            "Which programs are being turned away or capped today for lack of space. Nobody has published that list.",
          sources: [SRC.ninthGrade],
        },
      },
      {
        text: "Review the master plan and publish what it finds.",
        detail: {
          leverKind: "practice",
          lever: "What the district publishes, and how",
          mechanism: [
            "The figures used here come from the adopted budget, the district's own slides, and board meeting records. Finding spending on out-of-district placements means reading a 64-page filing, which is not a reasonable ask of a resident.",
            "The same numbers can be published as searchable tables with short summaries, which costs the district nothing it has not already paid for.",
          ],
          openQuestion:
            "Which reports the district will publish and how often it will update them.",
          sources: [SRC.budget],
        },
      },
    ],
  },
];
