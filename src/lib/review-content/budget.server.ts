/**
 * Server-only budget data for the gated review workspace.
 *
 * These figures are drawn from the district's adopted FY2027 filing. They are
 * kept in a `.server` module so they reach the browser only through the
 * passcode-gated `getReviewPage` server function, never in a public bundle.
 */
import type { BudgetPayload, BudgetSlice } from "./types";

/**
 * Adopted 2026-27 General Fund Grand Total, from the district's FY2027 User
 * Friendly Budget (Advertised Appropriations, "General Fund Grand Total").
 */
export const BUDGET_TOTAL = 209_216_947;

/** The budget year every figure on the dashboard is drawn from. */
export const BUDGET_FY = "2026\u201327";

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
    note: "Equal to 38.43% of salaries in the 2026-27 proposed budget, up from 30.16% in the filing's 2023-24 actual column. State law sets pension rules and employee contribution schedules. The district chooses its coverage provider and plan design.",
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
    note: "Savings used to reduce the amount raised through the levy.",
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
    note: "Money transferred for East Brunswick students enrolled in charter schools.",
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
    note: "The core classroom line rose 0.2% in two years.",
  },
  {
    id: "capital",
    label: "Capital outlay",
    from: 11_786_254,
    to: 8_447_536,
    note: "Equipment and facilities work, down 28.3% in two years.",
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

export const BUDGET_PAYLOAD: BudgetPayload = {
  fy: BUDGET_FY,
  total: BUDGET_TOTAL,
  slices: BUDGET_SLICES,
  revenue: BUDGET_REVENUE.map((r) => ({ ...r })),
  movement: BUDGET_MOVEMENT.map((r) => ({ ...r })),
  reserves: BUDGET_RESERVES.map((r) => ({ ...r })),
  perPupil: PER_PUPIL.map((r) => ({ ...r })),
  tax: { ...TAX_FACTS },
  enrollment: { ...ENROLLMENT },
};
