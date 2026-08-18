import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { OutcomeSheet } from "@/components/canvass/outcome-sheet";
import { OUTCOMES, mapsUrl, type OutcomeKey, type TurfBundle } from "@/lib/canvass";
import {
  cacheBundle,
  flushOutbox,
  newClientId,
  pendingVisits,
  queueVisit,
  readCachedBundle,
  type PendingVisit,
} from "@/lib/canvass-outbox";
import { getTurfBundle, openTurfWithCode } from "@/lib/canvass.functions";

export const Route = createFileRoute("/canvass/walk/$turfId")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    t: typeof search["t"] === "string" ? search["t"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Walk list · Canvass" },
      { name: "description", content: "Door-to-door walk list for campaign volunteers." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Walk list · Canvass" },
      { property: "og:description", content: "Door-to-door walk list for campaign volunteers." },
    ],
  }),
  component: WalkDeck,
});

const QUICK = OUTCOMES.filter((o) => o.key !== "spoke");

function WalkDeck() {
  const { turfId } = Route.useParams();
  const { t: shareToken } = useSearch({ from: "/canvass/walk/$turfId" });

  const [bundle, setBundle] = useState<TurfBundle | null>(null);
  const [canvasser, setCanvasser] = useState("");
  const [needsCode, setNeedsCode] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [pending, setPending] = useState(0);
  const [online, setOnline] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [done, setDone] = useState<Set<string>>(new Set());

  const refreshPending = useCallback(async () => {
    setPending((await pendingVisits(turfId)).length);
  }, [turfId]);

  // Cached bundle first so a mid-walk refresh with no signal still works.
  useEffect(() => {
    let active = true;
    void (async () => {
      const cached = await readCachedBundle(turfId);
      if (active && cached) {
        setBundle(cached.bundle);
        setCanvasser(cached.canvasser);
        setLoading(false);
      }
      try {
        const result = await getTurfBundle({ data: { turfId } });
        if (!active) return;
        if (result.ok && result.bundle) {
          setBundle(result.bundle);
          setCanvasser(result.canvasser);
          setDone(new Set(result.bundle.households.filter((h) => h.visited).map((h) => h.hh_key)));
          void cacheBundle(turfId, result.bundle, result.canvasser);
        } else if (!cached) {
          setNeedsCode(true);
        }
      } catch {
        if (!cached && active) setNeedsCode(true);
      } finally {
        if (active) setLoading(false);
      }
      void refreshPending();
    })();
    return () => {
      active = false;
    };
  }, [turfId, refreshPending]);

  // Flush on reconnect and on a slow timer; never on the tap path.
  useEffect(() => {
    setOnline(navigator.onLine);
    const flush = async () => {
      setOnline(navigator.onLine);
      setPending(await flushOutbox(turfId, canvasser || "volunteer"));
    };
    const goOnline = () => void flush();
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    const timer = window.setInterval(() => void flush(), 20000);
    void flush();
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      window.clearInterval(timer);
    };
  }, [turfId, canvasser]);

  const households = bundle?.households ?? [];
  const current = households[index];
  const knocked = useMemo(() => done.size, [done]);

  const record = useCallback(
    async (outcome: OutcomeKey, responses: PendingVisit["responses"] = [], note = "") => {
      if (!current) return;
      const visit: PendingVisit = {
        client_id: newClientId(),
        hh_key: current.hh_key,
        outcome,
        note: note || null,
        visited_at: new Date().toISOString(),
        responses,
      };
      setDone((prev) => new Set(prev).add(current.hh_key));
      setSheetOpen(false);
      setIndex((i) => Math.min(i + 1, Math.max(households.length - 1, 0)));
      await queueVisit(turfId, visit);
      await refreshPending();
      void flushOutbox(turfId, canvasser || "volunteer").then(setPending);
    },
    [current, households.length, turfId, canvasser, refreshPending],
  );

  async function unlock(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const result = await openTurfWithCode({
      data: { shareToken, passcode, canvasser: nameInput },
    });
    if (!result.ok || !result.bundle) {
      setError(result.ok ? "That turf is empty." : "That passcode didn't work.");
      return;
    }
    setBundle(result.bundle);
    setCanvasser(nameInput.trim() || "volunteer");
    setNeedsCode(false);
    setDone(new Set(result.bundle.households.filter((h) => h.visited).map((h) => h.hh_key)));
    void cacheBundle(turfId, result.bundle, nameInput.trim() || "volunteer");
  }

  if (loading) {
    return <p className="p-6 text-base font-semibold text-foreground">Loading your walk list…</p>;
  }

  if (needsCode) {
    return (
      <div className="mx-auto max-w-sm p-5">
        <h1 className="font-display text-3xl font-extrabold text-foreground">Open your turf</h1>
        <p className="mt-2 text-base text-foreground">
          Enter your name and the passcode the organizer gave you.
        </p>
        <form onSubmit={unlock} className="mt-4 space-y-3">
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Your name"
            className="min-h-14 w-full rounded-xl border-2 border-border bg-card px-4 text-lg text-foreground"
          />
          <input
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Turf passcode"
            className="min-h-14 w-full rounded-xl border-2 border-border bg-card px-4 text-lg text-foreground"
          />
          {error ? <p className="text-base font-bold text-destructive">{error}</p> : null}
          <button
            type="submit"
            className="min-h-14 w-full rounded-xl bg-primary text-lg font-extrabold text-primary-foreground"
          >
            Start walking
          </button>
        </form>
      </div>
    );
  }

  if (!bundle || households.length === 0) {
    return <p className="p-6 text-base font-semibold text-foreground">This turf has no doors yet.</p>;
  }

  const syncLabel = pending === 0 ? "All synced" : `${pending} pending`;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between gap-2 border-b-2 border-border bg-card px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-base font-extrabold text-foreground">{bundle.turf.name}</p>
          <p className="text-sm font-semibold text-foreground/80">
            Stop {index + 1} of {households.length} · {knocked} knocked
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-2 text-sm font-bold ${
            pending === 0 && online
              ? "bg-secondary text-foreground"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          {online ? syncLabel : "Offline"}
        </span>
      </header>

      {current ? (
        <main className="flex-1 p-4">
          <div className="rounded-2xl border-2 border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground">
                  {current.address}
                </h1>
                <p className="text-base font-semibold text-foreground">
                  {current.city}
                  {current.zip ? ` ${current.zip}` : ""}
                </p>
              </div>
              <a
                href={mapsUrl(current.lat, current.lng, `${current.address} ${current.city ?? ""}`)}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 min-w-12 items-center rounded-xl bg-secondary px-4 text-base font-bold text-foreground"
              >
                Navigate
              </a>
            </div>

            <ul className="mt-4 space-y-2">
              {current.voters.map((voter) => (
                <li key={voter.id} className="rounded-xl bg-background p-3">
                  <p className="text-lg font-bold text-foreground">{voter.name}</p>
                  <p className="text-sm font-semibold text-foreground/80">
                    {voter.propensity}
                    {voter.party ? ` · ${voter.party}` : ""}
                    {voter.phone ? ` · ${voter.phone}` : ""}
                  </p>
                </li>
              ))}
              {current.voters.length === 0 ? (
                <li className="text-base font-semibold text-foreground">No voters on file here.</li>
              ) : null}
            </ul>

            {done.has(current.hh_key) ? (
              <p className="mt-3 text-base font-bold text-foreground">Already recorded.</p>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {QUICK.map((outcome) => (
              <button
                key={outcome.key}
                type="button"
                onClick={() => void record(outcome.key)}
                className="min-h-14 rounded-xl border-2 border-border bg-card text-lg font-extrabold text-foreground active:bg-secondary"
              >
                {outcome.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="mt-3 min-h-16 w-full rounded-xl bg-primary text-xl font-extrabold text-primary-foreground"
          >
            Spoke to voter
          </button>
        </main>
      ) : null}

      <nav className="sticky bottom-0 flex gap-3 border-t-2 border-border bg-card p-3">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="min-h-14 flex-1 rounded-xl border-2 border-border text-lg font-extrabold text-foreground disabled:opacity-40"
        >
          ‹ Prev
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(households.length - 1, i + 1))}
          disabled={index >= households.length - 1}
          className="min-h-14 flex-1 rounded-xl border-2 border-border text-lg font-extrabold text-foreground disabled:opacity-40"
        >
          Skip ›
        </button>
      </nav>

      {sheetOpen && current ? (
        <OutcomeSheet
          household={current}
          onCancel={() => setSheetOpen(false)}
          onSave={(responses, note) => void record("spoke", responses, note)}
        />
      ) : null}
    </div>
  );
}
