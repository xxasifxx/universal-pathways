import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { readReplayChunks, readReplaySessions } from "@/lib/admin.functions";
import { formatMs } from "@/components/admin/admin-shell";

const IDLE_GAP_MS = 3000;

type RRWebEvent = { type: number; timestamp: number; data?: unknown };

type Segment = {
  events: RRWebEvent[];
  startedAt: number;
  durationMs: number;
  skipped: { at: number; ms: number }[];
};

/** Split on meta/full-snapshot pairs so each segment starts with its own snapshot. */
function segment(events: RRWebEvent[]): Segment[] {
  const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
  const segments: RRWebEvent[][] = [];
  let current: RRWebEvent[] = [];
  for (const event of sorted) {
    if (event.type === 4 && current.length > 0) {
      segments.push(current);
      current = [];
    }
    current.push(event);
  }
  if (current.length) segments.push(current);

  return segments
    .filter((list) => list.length > 1)
    .map((list) => {
      const startedAt = list[0]!.timestamp;
      const skipped: { at: number; ms: number }[] = [];
      let shift = 0;
      const rewritten = list.map((event, index) => {
        if (index > 0) {
          const gap = event.timestamp - list[index - 1]!.timestamp;
          if (gap > IDLE_GAP_MS) {
            skipped.push({ at: list[index - 1]!.timestamp, ms: gap });
            shift += gap - 1000;
          }
        }
        return { ...event, timestamp: event.timestamp - shift };
      });
      return {
        events: rewritten,
        startedAt,
        durationMs: list[list.length - 1]!.timestamp - startedAt,
        skipped,
      };
    });
}

export function ReplayTab({ visitorId }: { visitorId: string }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const holder = useRef<HTMLDivElement>(null);

  const sessions = useQuery({
    queryKey: ["admin", "replay-sessions", visitorId],
    queryFn: () => readReplaySessions({ data: { visitorId } }),
  });

  const chunks = useQuery({
    queryKey: ["admin", "replay-chunks", sessionId],
    enabled: Boolean(sessionId),
    queryFn: () => readReplayChunks({ data: { sessionId: sessionId! } }),
  });

  const segments = chunks.data
    ? segment(JSON.parse(chunks.data.eventsJson) as RRWebEvent[])
    : [];

  useEffect(() => {
    const node = holder.current;
    const seg = segments[segmentIndex];
    if (!node || !seg) return;
    node.innerHTML = "";
    let player: { $destroy?: () => void } | null = null;
    let cancelled = false;

    void (async () => {
      const [{ default: Player }] = await Promise.all([
        import("rrweb-player"),
        import("rrweb-player/dist/style.css"),
      ]);
      if (cancelled) return;
      player = new Player({
        target: node,
        props: {
          events: seg.events as never,
          width: Math.min(960, node.clientWidth || 960),
          height: 480,
          autoPlay: false,
          skipInactive: true,
        },
      }) as unknown as { $destroy?: () => void };
    })();

    return () => {
      cancelled = true;
      player?.$destroy?.();
      node.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunks.data, segmentIndex]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(sessions.data ?? []).map((s) => (
          <button
            key={s.session_id}
            type="button"
            onClick={() => {
              setSessionId(s.session_id);
              setSegmentIndex(0);
            }}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              sessionId === s.session_id ? "border-primary bg-secondary text-primary" : "border-border"
            }`}
          >
            {new Date(s.started_at).toLocaleString()} · {s.chunks} chunks
          </button>
        ))}
        {sessions.data && sessions.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No replays recorded for this visitor.</p>
        ) : null}
      </div>

      {segments.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {segments.map((seg, i) => (
            <button
              key={seg.startedAt}
              type="button"
              onClick={() => setSegmentIndex(i)}
              className={`rounded-md border px-2.5 py-1 text-xs ${
                segmentIndex === i ? "border-primary text-primary" : "border-border"
              }`}
            >
              {new Date(seg.startedAt).toLocaleTimeString()} · {formatMs(seg.durationMs)}
            </button>
          ))}
        </div>
      ) : null}

      {segments[segmentIndex]?.skipped.length ? (
        <p className="text-xs text-muted-foreground">
          {segments[segmentIndex]!.skipped
            .map((s) => `skipped ${formatMs(s.ms)} idle at ${new Date(s.at).toLocaleTimeString()}`)
            .join(" · ")}
        </p>
      ) : null}

      <div ref={holder} className="overflow-auto rounded-md border border-border bg-card p-2" />
    </div>
  );
}