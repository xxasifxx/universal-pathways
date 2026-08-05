import { useEffect, useRef } from "react";

export type HouseholdPoint = {
  hh_key: string;
  address: string;
  city: string;
  zip: string;
  district: number | null;
  lat: number;
  lng: number;
  voters: number;
  matched: number;
  avg_turnout: number;
  avg_impact: number;
};

declare global {
  interface Window {
    google?: any;
    __ebMapReady?: () => void;
  }
}

const EB_CENTER = { lat: 40.4276, lng: -74.4157 };

export function loadMaps(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.maps?.Map) return Promise.resolve(window.google);
  const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
  if (!key) return Promise.reject(new Error("Google Maps browser key is not configured"));

  return new Promise((resolve, reject) => {
    const existing = document.getElementById("eb-google-maps") as HTMLScriptElement | null;
    window.__ebMapReady = () => resolve(window.google);
    if (existing) return;
    const script = document.createElement("script");
    script.id = "eb-google-maps";
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__ebMapReady`;
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(script);
  });
}

function colorFor(point: HouseholdPoint): string {
  if (point.matched > 0) return "#F2A007";
  if (point.avg_impact >= 0.7) return "#0E351A";
  if (point.avg_impact >= 0.45) return "#3E7D4F";
  return "#9AAF9F";
}

export function HouseholdMap({
  points,
  onSelect,
}: {
  points: HouseholdPoint[];
  onSelect: (point: HouseholdPoint) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const overlays = useRef<any[]>([]);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let cancelled = false;
    void loadMaps()
      .then((google) => {
        if (cancelled || !container.current) return;
        map.current ??= new google.maps.Map(container.current, {
          center: EB_CENTER,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
        });
      })
      .catch((error: Error) => {
        if (errorRef.current) errorRef.current.textContent = error.message;
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const google = window.google;
    if (!google || !map.current) return;

    for (const overlay of overlays.current) overlay.setMap(null);
    overlays.current = [];

    const bounds = new google.maps.LatLngBounds();
    for (const point of points) {
      const circle = new google.maps.Circle({
        map: map.current,
        center: { lat: point.lat, lng: point.lng },
        radius: 14 + Math.min(point.voters, 8) * 9,
        strokeColor: colorFor(point),
        strokeOpacity: 0.9,
        strokeWeight: point.matched > 0 ? 3 : 1,
        fillColor: colorFor(point),
        fillOpacity: 0.45,
      });
      circle.addListener("click", () => onSelect(point));
      overlays.current.push(circle);

      const label = new google.maps.Marker({
        map: map.current,
        position: { lat: point.lat, lng: point.lng },
        label: { text: String(point.voters), color: "#ffffff", fontSize: "11px", fontWeight: "700" },
        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 0, strokeOpacity: 0 },
        clickable: true,
      });
      label.addListener("click", () => onSelect(point));
      overlays.current.push(label);
      bounds.extend({ lat: point.lat, lng: point.lng });
    }

    if (points.length > 0) map.current.fitBounds(bounds);
  }, [points, onSelect]);

  return (
    <div className="space-y-2">
      <div
        ref={container}
        className="h-[560px] w-full rounded-lg border border-border bg-secondary"
        role="application"
        aria-label="Household map of filtered voters"
      />
      <p ref={errorRef} className="text-sm text-destructive" role="status" />
      <ul className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <li>
          <span className="mr-1 inline-block size-3 rounded-full align-middle" style={{ background: "#F2A007" }} />
          Matched household
        </li>
        <li>
          <span className="mr-1 inline-block size-3 rounded-full align-middle" style={{ background: "#0E351A" }} />
          High impact
        </li>
        <li>
          <span className="mr-1 inline-block size-3 rounded-full align-middle" style={{ background: "#9AAF9F" }} />
          Low impact
        </li>
        <li>Bubble size and number = voters in that household</li>
      </ul>
    </div>
  );
}