/** Shapes the gated review pages receive from the server. Text lives server-side. */

export type SourceLink = { label: string; href: string };

export type BudgetSlice = {
  id: string;
  jargon: string;
  plain: string;
  amount: number;
  note: string;
  color: string;
};

export type BudgetPayload = {
  fy: string;
  total: number;
  slices: BudgetSlice[];
  revenue: { id: string; label: string; amount: number; note: string }[];
  movement: { id: string; label: string; from: number; to: number; note: string }[];
  reserves: {
    id: string;
    label: string;
    audited2024: number;
    audited2025: number;
    estimated2026: number;
    estimated2027: number;
  }[];
  perPupil: { id: string; label: string; from: number; to: number }[];
  tax: {
    generalFundLevy: number;
    totalSchoolLevy: number;
    netTaxableValuation: number;
    generalFundRate: number;
    totalRate: number;
    equalizedTotalRate: number;
  };
  enrollment: {
    onRoll2025: number;
    onRoll2026: number;
    regular: number;
    specialEd: number;
    privatePlacements: number;
  };
};

export type PilotPayload = {
  intro: string[];
  split: { id: string; title: string; rows: { label: string; value: number }[] }[];
  steps: { step: string; title: string; text: string }[];
  record: {
    id: string;
    title: string;
    body: string[];
    quote?: { lines: string[]; attribution: string };
    dashed?: boolean;
  }[];
  officials: string[];
  residents: string[];
  actions: string[];
  sources: SourceLink[];
};

export type GrowthPayload = {
  title: string;
  context: string;
  blocks: { heading?: string; body: string[] }[];
  sources: SourceLink[];
};