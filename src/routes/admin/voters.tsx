import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  DEFAULT_FILTERS,
  DISTRICTS,
  VoterFilters,
  type Filters,
} from "@/components/admin/voter-filters";
import { exportVoterList, readVoters } from "@/lib/voters.functions";

export const Route = createFileRoute("/admin/voters")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Voter targeting · Campaign admin" },
      { name: "description", content: "District voter lists ranked by turnout and household impact." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Voter targeting · Campaign admin" },
      {
        property: "og:description",
        content: "District voter lists ranked by turnout and household impact.",
      },
    ],
  }),
  component: () => (
    <AdminShell>
      <VotersTab />
    </AdminShell>
  ),
});

const PAGE_SIZE = 50;

function VotersTab() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState(false);

  const query = useQuery({
    queryKey: ["voters", filters, page],
    queryFn: () => readVoters({ data: { filters, page, pageSize: PAGE_SIZE } }),
  });

  const rows = query.data?.rows ?? [];
  const total = query.data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  async function download() {
    setBusy(true);
    try {
      const result = await exportVoterList({ data: { filters } });
      if (!result.csv) {
        toast.error("No voters match those filters.");
        return;
      }
      const url = URL.createObjectURL(new Blob([result.csv], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `voters-${filters.district ?? "all"}-${filters.order}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${result.rows} voters exported.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-extrabold">Voter targeting</h1>
        <button
          type="button"
          onClick={() => void download()}
          disabled={busy}
          className="rounded-md bg-primary px-4 py-2 font-display text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Building CSV…" : "Export walk list"}
        </button>
      </div>

      <VoterFilters
        districts={DISTRICTS}
        value={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(0);
        }}
      />

      <p className="text-sm text-muted-foreground">
        {query.isLoading
          ? "Loading…"
          : `${total.toLocaleString("en-US")} voters · ${filters.order === "high" ? "highest" : "lowest"} impact first`}
      </p>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-wide">
            <tr>
              <th className="px-3 py-2">Voter</th>
              <th className="px-3 py-2">Address</th>
              <th className="px-3 py-2">Dist.</th>
              <th className="px-3 py-2">Party</th>
              <th className="px-3 py-2">Turnout</th>
              <th className="px-3 py-2">Household</th>
              <th className="px-3 py-2">Impact</th>
              <th className="px-3 py-2">Flags</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={String(v["id"])} className="border-t border-border">
                <td className="px-3 py-2 font-semibold">
                  {String(v["first_name"] ?? "")} {String(v["last_name"] ?? "")}
                  {v["phone"] ? (
                    <span className="block text-xs font-normal text-muted-foreground">
                      {String(v["phone"])}
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-2">
                  {String(v["street_num"] ?? "")} {String(v["street_name"] ?? "")}
                  {v["apt_unit"] ? ` #${String(v["apt_unit"])}` : ""}
                </td>
                <td className="px-3 py-2">{String(v["district"] ?? "—")}</td>
                <td className="px-3 py-2">{String(v["party"] ?? "—")}</td>
                <td className="px-3 py-2">{Math.round(Number(v["turnout_pct"]) * 100)}%</td>
                <td className="px-3 py-2">{String(v["household_size"])}</td>
                <td className="px-3 py-2 font-mono text-xs">
                  {Number(v["impact_score"]).toFixed(2)}
                </td>
                <td className="px-3 py-2">
                  <span className="flex flex-wrap gap-1">
                    {v["is_matched"] ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
                        Matched
                      </span>
                    ) : null}
                    {v["is_petition_signer"] ? (
                      <span className="rounded-full border border-primary px-2 py-0.5 text-[11px] font-bold text-primary">
                        Petition
                      </span>
                    ) : null}
                  </span>
                </td>
              </tr>
            ))}
            {!query.isLoading && rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">
                  No voters match those filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="rounded-md border border-border px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sm text-muted-foreground">
          Page {page + 1} of {pages}
        </span>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
          disabled={page + 1 >= pages}
          className="rounded-md border border-border px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  );
}