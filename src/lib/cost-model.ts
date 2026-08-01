/**
 * Modeled per-child cost engine.
 *
 * Every figure here is derived from the same public $229M operating budget
 * used by the budget dashboard. Nothing comes from district-supplied
 * per-pupil data — only the district has that, which is the whole argument
 * for making them publish it.
 */

import { BUDGET_SLICES, BUDGET_TOTAL } from "./campaign";

export const STUDENT_COUNT = 8_100;
export const HOUSEHOLD_COUNT = 18_400;
/** Share of the operating budget raised through the local property tax levy. */
export const LOCAL_LEVY_SHARE = 0.68;
/** Share of a typical East Brunswick property tax bill that funds the schools. */
export const SCHOOL_TAX_SHARE = 0.54;

export const BASE_PER_PUPIL = BUDGET_TOTAL / STUDENT_COUNT;

/** Human-readable baseline used in disclaimers. */
export const BUDGET_TOTAL_DISPLAY = "$229 million";

export type LevelId = "elementary" | "middle" | "high";

export const LEVELS: { id: LevelId; label: string; note: string; weight: number }[] = [
  {
    id: "elementary",
    label: "Elementary (K–5)",
    note: "Bigger homerooms, one teacher, fewer specialists.",
    weight: 0.88,
  },
  {
    id: "middle",
    label: "Middle (6–8)",
    note: "Churchill or Hammarskjold. More staff per student than elementary.",
    weight: 0.98,
  },
  {
    id: "high",
    label: "High school (9–12)",
    note: "Labs, electives, APs, athletics. The most expensive years by a wide margin.",
    weight: 1.15,
  },
];

/** Which budget line each add-on lands in, so the breakdown stays honest. */
export type ServiceId = "sped" | "esl" | "busing" | "lunch" | "activities";

export const SERVICES: {
  id: ServiceId;
  label: string;
  amount: number;
  slice: string;
  note: string;
}[] = [
  {
    id: "sped",
    label: "Special education services or an IEP",
    amount: 19_400,
    slice: "sped",
    note: "Case management, related services, and in some cases an out-of-district placement.",
  },
  {
    id: "esl",
    label: "ESL or multilingual support",
    amount: 3_600,
    slice: "support",
    note: "ESL staff time and translated communication.",
  },
  {
    id: "busing",
    label: "Rides the bus",
    amount: 1_180,
    slice: "ops",
    note: "Route share, driver time, and fuel.",
  },
  {
    id: "lunch",
    label: "Free or reduced-price lunch",
    amount: 940,
    slice: "ops",
    note: "Mostly federally reimbursed, but the district fronts staffing.",
  },
  {
    id: "activities",
    label: "Athletics, music, or clubs",
    amount: 720,
    slice: "instruction",
    note: "Stipends, transport to games, equipment.",
  },
];

export type ChildInput = {
  level: LevelId;
  services: ServiceId[];
};

export type PresetChild = {
  id: string;
  label: string;
  blurb: string;
  child: ChildInput;
};

export const PRESET_CHILDREN: PresetChild[] = [
  {
    id: "walker",
    label: "4th grader who walks to school",
    blurb: "No bus, no services. About as plain as a student file gets.",
    child: { level: "elementary", services: [] },
  },
  {
    id: "iep",
    label: "7th grader with an IEP and a bus",
    blurb: "The classified track, which is where the district does its best individual work.",
    child: { level: "middle", services: ["sped", "busing"] },
  },
  {
    id: "junior",
    label: "11th grader, three APs and a fall sport",
    blurb: "The most expensive kind of student we have, and nobody calls it a special program.",
    child: { level: "high", services: ["activities", "busing"] },
  },
];

export type CostLine = {
  id: string;
  label: string;
  amount: number;
  color: string;
};

export type CostResult = {
  total: number;
  base: number;
  addOns: number;
  lines: CostLine[];
};

export function computeChildCost(input: ChildInput): CostResult {
  const weight = LEVELS.find((l) => l.id === input.level)?.weight ?? 1;
  const base = BASE_PER_PUPIL * weight;

  const lines: CostLine[] = BUDGET_SLICES.map((s) => ({
    id: s.id,
    label: s.plain,
    amount: base * (s.amount / BUDGET_TOTAL),
    color: s.color,
  }));

  let addOns = 0;
  for (const id of input.services) {
    const svc = SERVICES.find((s) => s.id === id);
    if (!svc) continue;
    addOns += svc.amount;
    const line = lines.find((l) => l.id === svc.slice);
    if (line) line.amount += svc.amount;
  }

  return { total: base + addOns, base, addOns, lines };
}

/* ------------------------------------------------------------------ */
/* Board-meeting scenario lab                                          */
/* ------------------------------------------------------------------ */

export type LeverId = "aides" | "counselors" | "routes" | "pay" | "supplies";

export type Lever = {
  id: LeverId;
  label: string;
  unit: string;
  current: number;
  min: number;
  max: number;
  step: number;
  /** Budget dollars per unit of this lever. */
  costPerUnit: number;
  format: (value: number) => string;
  /** Plain-English read on what a change actually does in the buildings. */
  consequence: (delta: number) => string;
};

/** 1% across-the-board raise against the modeled salary base. */
const PAY_POINT = 1_512_000;

export const LEVERS: Lever[] = [
  {
    id: "aides",
    label: "Classroom aides and paraprofessionals",
    unit: "positions",
    current: 214,
    min: 150,
    max: 300,
    step: 1,
    costPerUnit: 42_000,
    format: (v) => `${v} aides`,
    consequence: (d) =>
      d === 0
        ? "Staffing holds where it is today."
        : d < 0
          ? `About ${Math.round(Math.abs(d) * 2.8)} classrooms lose their second adult. The students who need someone sitting next to them lose that person first.`
          : `Roughly ${Math.round(d * 2.8)} more classrooms get a second adult, which is what makes it physically possible to give one kid something different from the kid beside him.`,
  },
  {
    id: "counselors",
    label: "Counselors and student support staff",
    unit: "positions",
    current: 34,
    min: 20,
    max: 60,
    step: 1,
    costPerUnit: 96_000,
    format: (v) => `${v} counselors (${Math.round(STUDENT_COUNT / v)} students each)`,
    consequence: (d) => {
      const ratio = Math.round(STUDENT_COUNT / (34 + d));
      if (d === 0) return `Caseloads stay near ${ratio} students per counselor.`;
      return d < 0
        ? `Caseloads climb to about ${ratio} students per counselor. At that size the job turns into paperwork and crisis response.`
        : `Caseloads drop to about ${ratio} students per counselor, close to what the professional associations actually recommend.`;
    },
  },
  {
    id: "routes",
    label: "Bus routes",
    unit: "routes",
    current: 62,
    min: 40,
    max: 80,
    step: 1,
    costPerUnit: 78_000,
    format: (v) => `${v} routes`,
    consequence: (d) =>
      d === 0
        ? "Every current stop keeps running."
        : d < 0
          ? `About ${Math.abs(d) * 55} students lose their stop. Families with a car absorb it. Families working a shift that starts before the bell do not.`
          : `About ${d * 55} more students get a ride, which mostly shows up later as better attendance.`,
  },
  {
    id: "pay",
    label: "Across-the-board staff raise",
    unit: "%",
    current: 0,
    min: 0,
    max: 6,
    step: 0.5,
    costPerUnit: PAY_POINT,
    format: (v) => `${v.toFixed(1)}% raise`,
    consequence: (d) =>
      d === 0
        ? "Current contract, no adjustment."
        : `A ${d.toFixed(1)}% raise. We lose good people to neighboring districts over a couple thousand dollars, and replacing a teacher costs more than keeping one.`,
  },
  {
    id: "supplies",
    label: "Supplies and materials per student",
    unit: "$ per student",
    current: 310,
    min: 120,
    max: 600,
    step: 10,
    costPerUnit: STUDENT_COUNT,
    format: (v) => `$${v} per student`,
    consequence: (d) =>
      d === 0
        ? "Materials budget unchanged."
        : d < 0
          ? "The quiet cut. Nobody testifies about it, and then teachers buy it themselves in September."
          : "More of the things a classroom runs out of by March.",
  },
];

export type LeverState = Record<LeverId, number>;

export const BASELINE: LeverState = LEVERS.reduce((acc, l) => {
  acc[l.id] = l.current;
  return acc;
}, {} as LeverState);

export type Preset = {
  id: string;
  label: string;
  blurb: string;
  values: Partial<LeverState>;
};

export const PRESETS: Preset[] = [
  {
    id: "cut-aides",
    label: "Cut 10 classroom aides",
    blurb: "The version of a budget cut that never makes the headline.",
    values: { aides: 204 },
  },
  {
    id: "add-counselors",
    label: "Add 5 counselors",
    blurb: "What most of the parents who email me are actually asking for.",
    values: { counselors: 39 },
  },
  {
    id: "trim-busing",
    label: "Trim busing by one tier",
    blurb: "Six routes off the board. Looks efficient on paper.",
    values: { routes: 56 },
  },
  {
    id: "raise",
    label: "2% across-the-board raise",
    blurb: "Roughly what it takes to stop losing staff to Edison and Old Bridge.",
    values: { pay: 2 },
  },
  {
    id: "flat-fund",
    label: "Flat-fund next year",
    blurb: "No new money means a real cut once costs rise. This is where it lands.",
    values: { aides: 198, supplies: 240 },
  },
];

export type ScenarioResult = {
  budgetDelta: number;
  newTotal: number;
  perChildDelta: number;
  perHouseholdDelta: number;
  changed: { lever: Lever; from: number; to: number; delta: number; dollars: number }[];
};

export function computeScenario(state: LeverState): ScenarioResult {
  let budgetDelta = 0;
  const changed: ScenarioResult["changed"] = [];

  for (const lever of LEVERS) {
    const to = state[lever.id];
    const delta = to - lever.current;
    const dollars = delta * lever.costPerUnit;
    budgetDelta += dollars;
    if (delta !== 0) changed.push({ lever, from: lever.current, to, delta, dollars });
  }

  return {
    budgetDelta,
    newTotal: BUDGET_TOTAL + budgetDelta,
    perChildDelta: budgetDelta / STUDENT_COUNT,
    perHouseholdDelta: (budgetDelta * LOCAL_LEVY_SHARE) / HOUSEHOLD_COUNT,
    changed,
  };
}

export const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function signedUsd(n: number): string {
  const s = usd0.format(Math.abs(Math.round(n)));
  if (Math.round(n) === 0) return s;
  return `${n > 0 ? "+" : "−"}${s}`;
}