import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/admin-shell";
import { exportEngagement } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/export")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Export engagement · Campaign admin" },
      { name: "description", content: "Download campaign site engagement data as CSV." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Export engagement · Campaign admin" },
      { property: "og:description", content: "Download campaign site engagement data as CSV." },
    ],
  }),
  component: () => (
    <AdminShell>
      <ExportTab />
    </AdminShell>
  ),
});

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

function ExportTab() {
  const [from, setFrom] = useState(isoDaysAgo(30));
  const [to, setTo] = useState(isoDaysAgo(0));
  const [path, setPath] = useState("");
  const [grouping, setGrouping] = useState<"visitor_path" | "path">("visitor_path");
  const [busy, setBusy] = useState(false);

  async function download() {
    setBusy(true);
    try {
      const result = await exportEngagement({
        data: {
          from: `${from}T00:00:00.000Z`,
          to: `${to}T23:59:59.999Z`,
          ...(path ? { path } : {}),
          grouping,
        },
      });
      if (!result.csv) {
        toast.error("No data in that range.");
        return;
      }
      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `engagement-${from}-to-${to}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${result.rows} rows exported.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="max-w-lg space-y-4">
      <h1 className="font-display text-xl font-extrabold">Export engagement</h1>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-semibold">
          From
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          To
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-normal"
          />
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Path (optional)
        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="/priorities"
          className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-normal"
        />
      </label>
      <label className="block text-sm font-semibold">
        Group by
        <select
          value={grouping}
          onChange={(e) => setGrouping(e.target.value as "visitor_path" | "path")}
          className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-normal"
        >
          <option value="visitor_path">Visitor × page</option>
          <option value="path">Page</option>
        </select>
      </label>
      <button
        type="button"
        onClick={() => void download()}
        disabled={busy}
        className="rounded-md bg-primary px-4 py-2 font-display text-sm font-bold text-primary-foreground disabled:opacity-60"
      >
        {busy ? "Building CSV…" : "Download CSV"}
      </button>
    </section>
  );
}