import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/admin-shell";
import { HouseholdMap, type HouseholdPoint } from "@/components/admin/household-map";
import {
  DEFAULT_FILTERS,
  DISTRICTS,
  VoterFilters,
  type Filters,
} from "@/components/admin/voter-filters";
import {
  readGeocodeProgress,
  readHouseholdMap,
  readHouseholdVoters,
  runGeocodeBatch,
} from "@/lib/voters.functions";

export const Route = createFileRoute("/admin/voter-map")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Household map · Campaign admin" },
      { name: "description", content: "Household bubbles sized by voters and ranked by impact." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Household map · Campaign admin" },
      {
        property: "og:description",
        content: "Household bubbles sized by voters and ranked by impact.",
      },
    ],
  }),
  component: () => (
    <AdminShell>
      <VoterMapTab />
    </AdminShell>
  ),
});

function GeocodePanel() {
  const [running, setRunning] = useState(false);
  const progress = useQuery({ queryKey: ["geocode-progress"], queryFn: () => readGeocodeProgress() });

  async function run() {
    setRunning(true);
    try {
      // Chunked so one click makes visible progress without a long-running request.
      for (let i = 0; i < 10; i += 1) {
        const result = await runGeocodeBatch({ data: { batchSize: 40 } });
        await progress.refetch();
        if (result.processed === 0) break;
      }
      toast.success("Geocoding batch finished.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Geocoding failed");
    } finally {
      setRunning(false);
    }
  }

  const p = progress.data;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
      <p className="text-sm">
        <span className="font-semibold">Address geocoding: </span>
        {p
          ? `${p.ok.toLocaleString("en-US")} mapped · ${p.pending.toLocaleString("en-US")} pending · ${p.failed} failed`
          : "Loading…"}
      </p>
      <button
        type="button"
        onClick={() => void run()}
        disabled={running || (p?.pending ?? 0) === 0}
        className="rounded-md bg-primary px-4 py-2 font-display text-sm font-bold text-primary-foreground disabled:opacity-60"
      >
        {running ? "Geocoding…" : "Geocode next 400 addresses"}
      </button>
    </div>
  );
}

function VoterMapTab() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<HouseholdPoint | null>(null);

  const households = useQuery({
    queryKey: ["household-map", filters],
    queryFn: () => readHouseholdMap({ data: { filters } }),
  });

  const people = useQuery({
    queryKey: ["household-voters", selected?.hh_key],
    queryFn: () => readHouseholdVoters({ data: { hhKey: selected!.hh_key } }),
    enabled: Boolean(selected),
  });

  const onSelect = useCallback((point: HouseholdPoint) => setSelected(point), []);
  const points = households.data ?? [];

  return (
    <section className="space-y-4">
      <h1 className="font-display text-xl font-extrabold">Household map</h1>
      <GeocodePanel />
      <VoterFilters districts={DISTRICTS} value={filters} onChange={setFilters} />
      <p className="text-sm text-muted-foreground">
        {households.isLoading
          ? "Loading households…"
          : `${points.length.toLocaleString("en-US")} mapped households · ${points
              .reduce((sum, p) => sum + p.voters, 0)
              .toLocaleString("en-US")} voters`}
      </p>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <HouseholdMap points={points} onSelect={onSelect} />
        <aside className="rounded-lg border border-border bg-card p-4">
          {selected ? (
            <>
              <h2 className="font-display text-lg font-bold">{selected.address}</h2>
              <p className="text-sm text-muted-foreground">
                {selected.city} {selected.zip} · District {selected.district ?? "—"} ·{" "}
                {selected.voters} voters · {Math.round(selected.avg_turnout * 100)}% avg turnout
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {(people.data ?? []).map((v) => (
                  <li key={String(v["id"])} className="border-t border-border pt-2">
                    <span className="font-semibold">
                      {String(v["first_name"] ?? "")} {String(v["last_name"] ?? "")}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {String(v["party"] ?? "—")} · {Math.round(Number(v["turnout_pct"]) * 100)}%
                      turnout
                      {v["is_matched"] ? " · matched" : ""}
                      {v["phone"] ? ` · ${String(v["phone"])}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a household bubble to see who lives there.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}