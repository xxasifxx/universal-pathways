import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AdminShell, formatMs } from "@/components/admin/admin-shell";
import { ReplayTab } from "@/components/admin/replay-tab";
import { readSignals, readVisitorDetail, readVisitors } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/intent")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Visitor intent · Campaign admin" },
      { name: "description", content: "People, sessions and signals recorded on the campaign site." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Visitor intent · Campaign admin" },
      { property: "og:description", content: "People, sessions and signals on the campaign site." },
    ],
  }),
  component: () => (
    <AdminShell>
      <Intent />
    </AdminShell>
  ),
});

type SubTab = "people" | "signals";

function Intent() {
  const [tab, setTab] = useState<SubTab>("people");
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="space-y-4">
      <div className="flex gap-2">
        {(["people", "signals"] as SubTab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold capitalize ${
              tab === t ? "border-primary text-primary" : "border-border text-foreground/70"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "people" ? <People selected={selected} onSelect={setSelected} /> : <Signals />}
    </section>
  );
}

function People({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const visitors = useQuery({ queryKey: ["admin", "visitors"], queryFn: () => readVisitors() });

  if (visitors.isLoading) return <p className="text-sm text-muted-foreground">Loading people…</p>;
  if (visitors.error)
    return <p role="alert" className="text-sm text-destructive">{(visitors.error as Error).message}</p>;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Visitors recorded on the campaign site</caption>
          <thead className="bg-secondary text-xs uppercase">
            <tr>
              <th scope="col" className="px-3 py-2">Person</th>
              <th scope="col" className="px-3 py-2">Last seen</th>
              <th scope="col" className="px-3 py-2">Active</th>
              <th scope="col" className="px-3 py-2">Pages</th>
              <th scope="col" className="px-3 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {(visitors.data ?? []).map((v) => (
              <tr key={v.id} className="border-t border-border">
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => onSelect(v.id)}
                    className="font-semibold text-primary underline underline-offset-4"
                  >
                    {v.name || v.phone || v.email || `anon ${String(v.anon_id ?? "").slice(0, 8)}`}
                  </button>
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {new Date(v.last_seen).toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  {formatMs(v.active_ms)}{" "}
                  <span className="text-muted-foreground">({v.session_count} sessions)</span>
                </td>
                <td className="px-3 py-2">{v.page_count}</td>
                <td className="px-3 py-2">{v.engagement_score}</td>
              </tr>
            ))}
            {(visitors.data ?? []).length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                  No visitors recorded yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {selected ? <Detail visitorId={selected} onClose={() => onSelect(null)} /> : null}
    </div>
  );
}

function Detail({ visitorId, onClose }: { visitorId: string; onClose: () => void }) {
  const [tab, setTab] = useState<"overview" | "replay" | "timeline">("overview");
  const detail = useQuery({
    queryKey: ["admin", "visitor", visitorId],
    queryFn: () => readVisitorDetail({ data: { visitorId } }),
  });

  if (detail.isLoading) return <p className="text-sm text-muted-foreground">Loading person…</p>;
  const d = detail.data;
  if (!d) return null;
  const v = d.visitor as Record<string, unknown> | null;

  return (
    <div className="space-y-4 rounded-md border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-extrabold">
            {String(v?.["name"] ?? "") || `anon ${String(v?.["anon_id"] ?? "").slice(0, 8)}`}
          </h2>
          <p className="text-xs text-muted-foreground">
            {String(v?.["email"] ?? "")} {String(v?.["phone"] ?? "")} · {String(v?.["last_ip"] ?? "")}
          </p>
          <p className="mt-1 text-sm">
            {formatMs(d.total_active_ms)} active across {d.sessions.length} sessions
          </p>
        </div>
        <button type="button" onClick={onClose} className="text-sm underline">
          Close
        </button>
      </div>

      <div className="flex gap-2">
        {(["overview", "replay", "timeline"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
              tab === t ? "border-primary text-primary" : "border-border"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold">Sessions</h3>
            <ul className="mt-1 space-y-1 text-sm">
              {d.sessions.map((s) => (
                <li key={s.session_id} className="text-muted-foreground">
                  {new Date(s.started_at).toLocaleString()} · span {formatMs(s.span_ms)} · active{" "}
                  {formatMs(s.active_ms)} · {s.pages.length} pages · {s.clicks} clicks
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold">Pages</h3>
            <table className="mt-1 w-full text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr>
                  <th scope="col">Path</th>
                  <th scope="col">Active</th>
                  <th scope="col">Scroll</th>
                  <th scope="col">Clicks</th>
                  <th scope="col">Rage/dead</th>
                </tr>
              </thead>
              <tbody>
                {d.pages.map((p) => (
                  <tr key={p.path} className="border-t border-border">
                    <td>{p.path}</td>
                    <td>{formatMs(p.active_ms)}</td>
                    <td>{p.max_scroll_pct}%</td>
                    <td>{p.clicks}</td>
                    <td>
                      {p.rage}/{p.dead}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {d.hover_conversion.length > 0 ? (
            <div>
              <h3 className="text-sm font-bold">Hover → click</h3>
              <ul className="mt-1 space-y-1 text-sm">
                {d.hover_conversion.map((h) => (
                  <li key={h.label}>
                    <span className="font-medium">{h.label}</span>{" "}
                    <span
                      className={
                        h.rate >= 50 ? "text-primary" : h.rate > 0 ? "text-foreground" : "text-muted-foreground"
                      }
                    >
                      {h.clicks}/{h.hovers} ({h.rate}%)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {d.leads.volunteer.length + d.leads.contact.length > 0 ? (
            <div>
              <h3 className="text-sm font-bold">Form submissions</h3>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                {d.leads.volunteer.map((l: Record<string, unknown>) => (
                  <li key={String(l["id"])}>Volunteer · {String(l["name"])} · {String(l["email"])}</li>
                ))}
                {d.leads.contact.map((l: Record<string, unknown>) => (
                  <li key={String(l["id"])}>Message · {String(l["name"])} · {String(l["role"])}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {tab === "replay" ? <ReplayTab visitorId={visitorId} /> : null}

      {tab === "timeline" ? (
        <ol className="max-h-96 space-y-1 overflow-auto text-xs">
          {d.signals.map((s) => (
            <li key={s.id} className="border-b border-border pb-1">
              <span className="font-mono">{new Date(s.created_at).toLocaleTimeString()}</span>{" "}
              <span className="font-semibold">{s.event}</span> {s.path}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

function Signals() {
  const [event, setEvent] = useState("");
  const signals = useQuery({
    queryKey: ["admin", "signals", event],
    queryFn: () => readSignals({ data: { ...(event ? { event } : {}), limit: 300 } }),
  });

  return (
    <div className="space-y-3">
      <label className="block max-w-xs text-sm font-semibold">
        Filter by event
        <input
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          placeholder="element_click"
          className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-normal"
        />
      </label>
      <div className="max-h-[70vh] overflow-auto rounded-md border border-border">
        <table className="w-full text-left text-xs">
          <caption className="sr-only">Raw signal feed</caption>
          <thead className="bg-secondary uppercase">
            <tr>
              <th scope="col" className="px-2 py-1.5">Time</th>
              <th scope="col" className="px-2 py-1.5">Event</th>
              <th scope="col" className="px-2 py-1.5">Path</th>
              <th scope="col" className="px-2 py-1.5">Label</th>
            </tr>
          </thead>
          <tbody>
            {(signals.data ?? []).map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="px-2 py-1.5">{new Date(s.created_at).toLocaleString()}</td>
                <td className="px-2 py-1.5 font-semibold">{s.event}</td>
                <td className="px-2 py-1.5">{s.path}</td>
                <td className="px-2 py-1.5">
                  {String((s.meta as Record<string, unknown> | null)?.["label"] ?? "")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}