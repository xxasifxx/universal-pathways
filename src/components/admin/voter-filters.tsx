import type { VoterFilterInput } from "@/lib/voters.functions";

export type Filters = Required<{
  district: number | null;
  matchedOnly: boolean;
  petitionOnly: boolean;
  contactsOnly: boolean;
  hasPhone: boolean;
  minTurnout: number;
  party: string | null;
  search: string | null;
  order: "high" | "low";
}>;

export const DEFAULT_FILTERS: Filters = {
  district: null,
  matchedOnly: false,
  petitionOnly: false,
  contactsOnly: false,
  hasPhone: false,
  minTurnout: 0,
  party: null,
  search: null,
  order: "high",
};

export function toInput(filters: Filters): VoterFilterInput {
  return filters;
}

const TURNOUT_STEPS = [0, 0.25, 0.5, 0.75, 1];
const PARTIES = ["Democratic", "Republican", "Unaffiliated", "Libertarian", "Green Party"];

const field =
  "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-normal";

export function VoterFilters({
  districts,
  value,
  onChange,
}: {
  districts: number[];
  value: Filters;
  onChange: (next: Filters) => void;
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch });

  return (
    <div className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-sm font-semibold">
        District
        <select
          value={value.district ?? ""}
          onChange={(e) => set({ district: e.target.value ? Number(e.target.value) : null })}
          className={field}
        >
          <option value="">All districts</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              District {d}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-semibold">
        Impact order
        <select
          value={value.order}
          onChange={(e) => set({ order: e.target.value as "high" | "low" })}
          className={field}
        >
          <option value="high">Highest impact first</option>
          <option value="low">Lowest impact first</option>
        </select>
      </label>

      <label className="text-sm font-semibold">
        Minimum turnout
        <select
          value={String(value.minTurnout)}
          onChange={(e) => set({ minTurnout: Number(e.target.value) })}
          className={field}
        >
          {TURNOUT_STEPS.map((t) => (
            <option key={t} value={t}>
              {t === 0 ? "Any turnout" : `${Math.round(t * 100)}%+`}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-semibold">
        Party
        <select
          value={value.party ?? ""}
          onChange={(e) => set({ party: e.target.value || null })}
          className={field}
        >
          <option value="">All parties</option>
          {PARTIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-semibold sm:col-span-2">
        Search name or street
        <input
          value={value.search ?? ""}
          onChange={(e) => set({ search: e.target.value || null })}
          placeholder="Patel, Cranbury Rd…"
          className={field}
        />
      </label>

      <fieldset className="flex flex-wrap items-end gap-4 text-sm font-semibold sm:col-span-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.matchedOnly}
            onChange={(e) => set({ matchedOnly: e.target.checked })}
            className="size-4 accent-primary"
          />
          Matched voters only
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.petitionOnly}
            onChange={(e) => set({ petitionOnly: e.target.checked })}
            className="size-4 accent-primary"
          />
          Petition signers
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.contactsOnly}
            onChange={(e) => set({ contactsOnly: e.target.checked })}
            className="size-4 accent-primary"
          />
          My contacts only
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.hasPhone}
            onChange={(e) => set({ hasPhone: e.target.checked })}
            className="size-4 accent-primary"
          />
          Has phone
        </label>
        <button
          type="button"
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold"
        >
          Reset
        </button>
      </fieldset>
    </div>
  );
}

export const DISTRICTS = Array.from({ length: 40 }, (_, i) => i + 1);