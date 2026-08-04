import { useEffect, useState } from "react";

import { GIVEBUTTER_CAMPAIGN } from "@/lib/campaign";

const SCRIPT_ID = "givebutter-widget-js";

/**
 * Renders the Givebutter donation widget inline. Client-only: the widget
 * script is injected once on mount. Returns null when no campaign is
 * configured, so the page never shows an empty frame.
 */
export function GivebutterEmbed({ campaign = GIVEBUTTER_CAMPAIGN }: { campaign?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!campaign) return;
    setMounted(true);
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://js.givebutter.com/elements/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, [campaign]);

  if (!campaign || !mounted) return null;

  return (
    <div className="min-h-[420px]">
      {/* @ts-expect-error — Givebutter custom element */}
      <givebutter-widget id={campaign} />
    </div>
  );
}