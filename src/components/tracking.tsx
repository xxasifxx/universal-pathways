import { useEffect, useState } from "react";

import { useCampaignIntent } from "@/hooks/use-campaign-intent";
import { useClickTracking } from "@/hooks/use-click-tracking";
import { usePageEngagement } from "@/hooks/use-page-engagement";
import { usePageView } from "@/hooks/use-page-view";
import { usePointerTracking } from "@/hooks/use-pointer-tracking";
import { useSessionReplay } from "@/hooks/use-session-replay";
import { resolveFingerprint } from "@/lib/fingerprint";

function Emitters() {
  usePageView();
  usePageEngagement();
  useClickTracking();
  usePointerTracking();
  useSessionReplay();
  useCampaignIntent();

  useEffect(() => {
    void resolveFingerprint();
  }, []);

  return null;
}

/** Mounted once in __root. Client-only: nothing here runs during SSR. */
export function Tracking() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;
  return <Emitters />;
}