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
            "Athletics is budgeted at $1.3 million and cocurricular activities at $0.4 million. Extracurricular cost per pupil has gone from $233 in the FY2027 filing's 2023-24 actual column to $273 in its 2026-27 proposed column. Participation fees are revenue, so dropping them means either finding the money elsewhere in the budget or shrinking what the program spends.",
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
            "Benefits are 38.43% of salaries in the adopted budget, up from 30.16% in the same filing's 2023-24 actual column, and the district's own budget update names health premiums as its largest cost driver this year: a 22% increase, $7,934,618.",
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
      "Students should be able to take the courses they are ready for and earn grades based on their own work.",
    points: [
      {
        text: "Use more than one measure to place students in advanced courses.",
        detail: {
          leverKind: "practice",
          lever: "Course placement criteria, published in the course guide",
          mechanism: [
            "The district publishes placement criteria with its course guide. A prior-year grade can determine whether a student stays on a track or moves up. The board can direct the administration to revise these criteria.",
            "The gifted and talented policy already requires multiple measures. It also covers English language learners and students with an IEP or 504 plan.",
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
            "A placement exam can show skills that a transcript misses. This may apply to a student who learned a language at home or studied the material at another school.",
            "The district would need to decide which exams to offer, who would administer them, and when. Families should receive the same information about the option.",
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
            "The district can use this policy to place a fourth grader in a higher-level science class or give a younger student access to an instrument.",
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
            "Bilingual education is budgeted at $1.5 million inside the $73.0 million instruction total. A bridge program would help newly arrived families during their first weeks, provide translated material, and help place students correctly.",
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
            "Policy 2624, last edited in September 2025, caps homework completion at ten percent of a grade. It says grades must reflect proficiency under state standards and district objectives. Students can appeal a grade to the principal and then the assistant superintendent.",
            "The Superintendent sets the procedures used in each school. The board can ask whether schools follow the policy consistently.",
          ],
          openQuestion:
            "Whether the ten percent cap is being applied consistently across schools and departments. Nothing published tracks that.",
          sources: [SRC.ebGrading],
        },
      },
      {
        text: "Teach students how to use AI responsibly on their own work.",
        detail: {
          leverKind: "policy",
          lever: "Local curriculum and acceptable use, with state guidance only",
          mechanism: [
            "New Jersey publishes guidance on classroom AI use but leaves local rules to each district.",
            "Teachers need clear rules. Students also need instruction on using AI without passing off generated work as their own.",
          ],
          openQuestion:
            "What East Brunswick's current rule actually is, building by building, and whether staff have had training on it.",
          sources: [SRC.njAi],
        },
      },
      {
        text: "Train staff and administration to spot bias and harassment in any form.",
        detail: {
          leverKind: "state-rule",
          lever: "Mandated HIB training, and what the state does not require",
          mechanism: [
            "New Jersey requires staff training on harassment, intimidation, and bullying.",
            "The district can add broader training on bias and pay for it through professional development funds.",
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
            "The state's Immigrant Trust Directive limits how New Jersey law enforcement may assist federal immigration authorities. It bars stops or detention based only on immigration status. The district should give staff and families written procedures for enforcement requests at schools.",
            "State rules also require the district and municipal police to sign an agreement. That agreement sets the rules for officers entering schools. The district can publish, review, and renegotiate it.",
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
            "The board can give student representatives a regular role in discussions about counseling and school buildings. This would require a bylaw or committee change.",
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
      "Plan building repairs and replacements before they become more expensive.",
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
            "The board must compare the cost of continued repairs with the cost of a replacement plan that would go to voters.",
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
        text: "Design buildings around the programs students need.",
        detail: {
          leverKind: "practice",
          lever: "Program requirements written into the design",
          mechanism: [
            "Board members discussed the high school's cafeteria and gym capacity, classroom conditions, roof, and plumbing on June 4. These limits affect which programs the school can offer.",
            "The board should give the architect program and space requirements before design work begins.",
          ],
          openQuestion:
            "Which programs are being turned away or capped today for lack of space. Nobody has published that list.",
          sources: [SRC.ninthGrade],
        },
      },
      {
        text: "Review the master plan and publish the findings.",
        detail: {
          leverKind: "practice",
          lever: "What the district publishes, and how",
          mechanism: [
            "The adopted budget, district slides, and board meeting records contain the figures used here. Residents should not have to search a 64-page filing to find spending on out-of-district placements.",
            "The district can publish the same figures in searchable tables and short summaries.",
          ],
          openQuestion:
            "Which reports the district will publish and how often it will update them.",
          sources: [SRC.budget],
        },
      },
    ],
  },
];
