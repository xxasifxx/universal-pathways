import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/admin-shell";
import { HouseholdMap, type HouseholdPoint } from "@/components/admin/household-map";
import {
  createTurfs,
  deleteTurf,
  exportCanvassResults,
  readCanvassDashboard,
  updateTurf,
  upsertVolunteer,
} from "@/lib/canvass.functions";
import { readHouseholdMap } from "@/lib/voters.functions";
import { DEFAULT_FILTERS } from "@/components/admin/voter-filters";

export const Route = createFileRoute("/admin/canvass")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Canvass studio · Campaign admin" },
      { name: "description", content: "Cut turfs, assign volunteers, and watch door knocks land." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Canvass studio · Campaign admin" },
      {
        property: "og:description",
        content: "Cut turfs, assign volunteers, and watch door knocks land.",
      },
    ],
  }),
  component: () => (
    <AdminShell>
      <CanvassStudio />
    </AdminShell>
  ),
});

const DISTRICTS = Array.from({ length: 24 }, (_, i) => i + 1);
const field = "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm";

function CanvassStudio() {
  const queryClient = useQueryClient();
  const [district, setDistrict] = useState<number | null>(null);
  const [minTurnout, setMinTurnout] = useState(0);
  const [matchedOnly, setMatchedOnly] = useState(false);
  const [targetSize, setTargetSize] = useState(55);
  const [maxTurfs, setMaxTurfs] = useState(8);
  const [volunteerName, setVolunteerName] = useState("");
  const [volunteerEmail, setVolunteerEmail] = useState("");

  const dashboard = useQuery({
    queryKey: ["canvass-dashboard"],
    queryFn: () => readCanvassDashboard(),
  });

  const map = useQuery({
    queryKey: ["canvass-pool", district, minTurnout, matchedOnly],
    queryFn: () =>
      readHouseholdMap({
        data: { filters: { ...DEFAULT_FILTERS, district, minTurnout, matchedOnly } },
      }),
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["canvass-dashboard"] });
  };

  const cut = useMutation({
    mutationFn: () =>
      createTurfs({ data: { district, minTurnout, matchedOnly, targetSize, maxTurfs } }),
    onSuccess: (result) => {
      toast.success(`Created ${result.created.length} turfs from ${result.pool} households`);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const patch = useMutation({
    mutationFn: (input: Parameters<typeof updateTurf>[0]["data"]) => updateTurf({ data: input }),
    onSuccess: invalidate,
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteTurf({ data: { id } }),
    onSuccess: invalidate,
  });

  const addVolunteer = useMutation({
    mutationFn: () =>
      upsertVolunteer({ data: { name: volunteerName, email: volunteerEmail, active: true } }),
    onSuccess: () => {
      setVolunteerName("");
      setVolunteerEmail("");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  async function exportCsv() {
    const { csv, rows } = await exportCanvassResults();
    if (rows === 0) {
      toast.info("No door knocks recorded yet");
      return;
    }
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "canvass-results.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const totals = dashboard.data?.totals;
  const turfs = dashboard.data?.turfs ?? [];
  const volunteers = dashboard.data?.volunteers ?? [];
  const contactRate =
    totals && totals.knocked > 0 ? Math.round((totals.spoke / totals.knocked) * 100) : 0;

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Doors knocked", value: totals?.knocked ?? 0 },
          { label: "Conversations", value: totals?.spoke ?? 0 },
          { label: "Contact rate", value: `${contactRate}%` },
          { label: "Lawn signs", value: totals?.lawn_signs ?? 0 },
          { label: "Volunteer leads", value: totals?.volunteer_leads ?? 0 },
          { label: "Do not contact", value: totals?.do_not_contact ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">{stat.label}</p>
            <p className="font-display text-2xl font-extrabold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="font-display text-lg font-extrabold">Cut new turfs</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Filter the household pool, pick a door count, and the studio groups contiguous street runs
          into walkable turfs. Households already inside a turf are skipped.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-sm font-semibold">
            District
            <select
              value={district ?? ""}
              onChange={(e) => setDistrict(e.target.value ? Number(e.target.value) : null)}
              className={field}
            >
              <option value="">All districts</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  District {d}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Minimum household turnout
            <select
              value={minTurnout}
              onChange={(e) => setMinTurnout(Number(e.target.value))}
              className={field}
            >
              {[0, 0.25, 0.5, 0.75].map((v) => (
                <option key={v} value={v}>
                  {Math.round(v * 100)}%+
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Doors per turf
            <input
              type="number"
              min={10}
              max={200}
              value={targetSize}
              onChange={(e) => setTargetSize(Number(e.target.value))}
              className={field}
            />
          </label>
          <label className="text-sm font-semibold">
            Turfs to create
            <input
              type="number"
              min={1}
              max={40}
              value={maxTurfs}
              onChange={(e) => setMaxTurfs(Number(e.target.value))}
              className={field}
            />
          </label>
          <label className="flex items-end gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={matchedOnly}
              onChange={(e) => setMatchedOnly(e.target.checked)}
            />
            Matched households only
          </label>
        </div>
        <button
          type="button"
          onClick={() => cut.mutate()}
          disabled={cut.isPending}
          className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          {cut.isPending ? "Cutting…" : "Cut turfs"}
        </button>

        <div className="mt-4 h-80 overflow-hidden rounded-lg border border-border">
          <HouseholdMap
            points={(map.data ?? []) as HouseholdPoint[]}
            onSelect={(point) => toast.info(`${point.address} · ${point.voters} voters`)}
          />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-extrabold">Turfs</h2>
          <button
            type="button"
            onClick={() => void exportCsv()}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-semibold"
          >
            Export results CSV
          </button>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-2">Turf</th>
                <th>Doors</th>
                <th>Knocked</th>
                <th>Assigned to</th>
                <th>Status</th>
                <th>Passcode</th>
                <th>Field link</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {turfs.map((turf) => (
                <tr key={turf.id} className="border-t border-border align-top">
                  <td className="py-2 pr-3 font-semibold">
                    {turf.name}
                    <span className="block text-xs text-muted-foreground">
                      {turf.district ? `District ${turf.district}` : "Mixed"} ·{" "}
                      {turf.mask_party ? "party hidden" : "party shown"}
                    </span>
                  </td>
                  <td className="pr-3">{turf.door_count}</td>
                  <td className="pr-3">
                    {turf.knocked}
                    <span className="block text-xs text-muted-foreground">{turf.spoke} spoke</span>
                  </td>
                  <td className="pr-3">
                    <select
                      value={turf.volunteer_id ?? ""}
                      onChange={(e) =>
                        patch.mutate({ id: turf.id, volunteerId: e.target.value || null })
                      }
                      className="rounded-md border border-border bg-background px-2 py-1"
                    >
                      <option value="">Open (self-serve)</option>
                      {volunteers.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="pr-3">
                    <select
                      value={turf.status}
                      onChange={(e) => patch.mutate({ id: turf.id, status: e.target.value })}
                      className="rounded-md border border-border bg-background px-2 py-1"
                    >
                      {["open", "assigned", "in_progress", "completed"].map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="pr-3">
                    <input
                      defaultValue={turf.passcode ?? ""}
                      placeholder="set passcode"
                      onBlur={(e) => patch.mutate({ id: turf.id, passcode: e.target.value })}
                      className="w-28 rounded-md border border-border bg-background px-2 py-1"
                    />
                  </td>
                  <td className="pr-3">
                    <button
                      type="button"
                      onClick={() => {
                        const url = `${window.location.origin}/canvass/walk/${turf.id}?t=${turf.share_token}`;
                        void navigator.clipboard.writeText(url);
                        toast.success("Field link copied");
                      }}
                      className="rounded-md border border-border px-2 py-1 text-xs font-semibold"
                    >
                      Copy link
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => remove.mutate(turf.id)}
                      className="rounded-md px-2 py-1 text-xs font-semibold text-destructive"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {turfs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-4 text-sm text-muted-foreground">
                    No turfs yet. Cut a batch above.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="font-display text-lg font-extrabold">Volunteers</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={volunteerName}
              onChange={(e) => setVolunteerName(e.target.value)}
              placeholder="Name"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <input
              value={volunteerEmail}
              onChange={(e) => setVolunteerEmail(e.target.value)}
              placeholder="Email (optional)"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => addVolunteer.mutate()}
              className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
            >
              Add
            </button>
          </div>
          <ul className="mt-3 space-y-1 text-sm">
            {volunteers.map((v) => (
              <li key={v.id} className="flex justify-between border-b border-border py-1">
                <span className="font-semibold">{v.name}</span>
                <span className="text-muted-foreground">{v.email ?? ""}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="font-display text-lg font-extrabold">What voters said</h2>
          <p className="mt-1 text-xs uppercase text-muted-foreground">Support 1 (opposed) to 5</p>
          <ul className="mt-2 space-y-1 text-sm">
            {(dashboard.data?.support ?? []).map((s) => (
              <li key={s.level} className="flex items-center gap-2">
                <span className="w-6 font-bold">{s.level}</span>
                <span
                  className="h-3 rounded bg-primary"
                  style={{ width: `${Math.min(100, s.count * 6)}%` }}
                />
                <span className="text-muted-foreground">{s.count}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs uppercase text-muted-foreground">Issues raised</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {(dashboard.data?.issues ?? []).map((i) => (
              <li key={i.tag} className="rounded-full bg-secondary px-3 py-1 font-semibold">
                {i.tag} · {i.count}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
