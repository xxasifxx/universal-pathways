import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { readHeatmap, readPaths } from "@/lib/admin.functions";
import { HEATMAP_VIEWPORTS, type ViewportBucket } from "@/lib/preview";

export const Route = createFileRoute("/admin/heatmaps")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Heatmaps · Campaign admin" },
      { name: "description", content: "Pointer movement and click heatmaps for campaign pages." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Heatmaps · Campaign admin" },
      { property: "og:description", content: "Pointer and click heatmaps for campaign pages." },
    ],
  }),
  component: () => (
    <AdminShell>
      <Heatmaps />
    </AdminShell>
  ),
});

function Heatmaps() {
  const [path, setPath] = useState("/");
  const [bucket, setBucket] = useState<ViewportBucket>("desktop");
  const [mode, setMode] = useState<"movement" | "clicks">("movement");
  const [intensity, setIntensity] = useState(0.5);
  const [offset, setOffset] = useState(0);
  const [docHeight, setDocHeight] = useState(2000);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const paths = useQuery({ queryKey: ["admin", "paths"], queryFn: () => readPaths() });
  const heat = useQuery({
    queryKey: ["admin", "heatmap", path, bucket],
    queryFn: () => readHeatmap({ data: { path, bucket } }),
  });

  const view = HEATMAP_VIEWPORTS[bucket];

  // Scroll the iframe document, never stretch the iframe: stretching warps vh units.
  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.scrollTo(0, offset);
  }, [offset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = view.w;
    canvas.height = view.h;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const points = (mode === "movement" ? heat.data?.movement : heat.data?.clicks) ?? [];
    const radius = mode === "movement" ? 22 : 16;
    for (const point of points) {
      const x = (point.x / 100) * view.w;
      const y = (point.y / 100) * docHeight - offset;
      if (y < -radius || y > view.h + radius) continue;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(184, 77, 40, ${0.35 * intensity})`);
      gradient.addColorStop(1, "rgba(184, 77, 40, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [heat.data, mode, intensity, offset, docHeight, view.w, view.h]);

  function onLoad() {
    const doc = iframeRef.current?.contentDocument;
    if (doc) setDocHeight(doc.documentElement.scrollHeight);
  }

  return (
    <section className="space-y-4">
      <h1 className="font-display text-xl font-extrabold">Heatmaps</h1>

      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm font-semibold">
          Page
          <select
            value={path}
            onChange={(e) => {
              setPath(e.target.value);
              setOffset(0);
            }}
            className="mt-1 block rounded-md border border-border bg-card px-3 py-2 text-sm font-normal"
          >
            {["/", ...(paths.data ?? []).filter((p) => p !== "/")].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Viewport
          <select
            value={bucket}
            onChange={(e) => setBucket(e.target.value as ViewportBucket)}
            className="mt-1 block rounded-md border border-border bg-card px-3 py-2 text-sm font-normal"
          >
            <option value="desktop">Desktop 1280×900</option>
            <option value="mobile">Mobile 390×844</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Mode
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "movement" | "clicks")}
            className="mt-1 block rounded-md border border-border bg-card px-3 py-2 text-sm font-normal"
          >
            <option value="movement">Movement</option>
            <option value="clicks">Clicks</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Intensity
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.1}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="mt-1 block w-32"
          />
        </label>
        <label className="text-sm font-semibold">
          Scroll
          <input
            type="range"
            min={0}
            max={Math.max(0, docHeight - view.h)}
            step={20}
            value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
            className="mt-1 block w-48"
          />
        </label>
      </div>

      <p className="text-xs text-muted-foreground">
        {heat.data
          ? `${heat.data.movement.length} movement points · ${heat.data.clicks.length} clicks`
          : "Loading heat data…"}
      </p>

      <div
        className="relative overflow-hidden rounded-md border border-border"
        style={{ width: view.w, height: view.h }}
        onWheel={(e) => {
          e.preventDefault();
          setOffset((prev) =>
            Math.min(Math.max(0, docHeight - view.h), Math.max(0, prev + e.deltaY)),
          );
        }}
      >
        <iframe
          ref={iframeRef}
          title={`Preview of ${path}`}
          src={`${path}?heatmap=1`}
          onLoad={onLoad}
          width={view.w}
          height={view.h}
          className="block border-0"
        />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ width: view.w, height: view.h }}
        />
      </div>
    </section>
  );
}