import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { logSignal } from "@/lib/analytics";
import { isTrackingDisabled } from "@/lib/tracking-consent";
import { isNewSession, getSessionId } from "@/lib/visitor";

export function usePageView() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const startedSession = useRef(false);

  useEffect(() => {
    if (isTrackingDisabled()) return;
    if (!startedSession.current) {
      startedSession.current = true;
      const fresh = isNewSession();
      getSessionId();
      if (fresh) {
        logSignal({
          event: "session_start",
          path: pathname,
          meta: { entry: pathname, screen: `${window.screen.width}x${window.screen.height}` },
        });
      }
    }
    logSignal({
      event: "page_view",
      path: pathname,
      meta: { title: document.title, viewport: `${window.innerWidth}x${window.innerHeight}` },
    });
  }, [pathname]);
}