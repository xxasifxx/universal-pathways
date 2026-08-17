import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { setTrackingDisabled } from "@/lib/tracking-consent";

type AdminSessionState = {
  loading: boolean;
  session: Session | null;
  isAdmin: boolean;
  isReviewer: boolean;
};

export function useAdminSession(): AdminSessionState {
  const [state, setState] = useState<AdminSessionState>({
    loading: true,
    session: null,
    isAdmin: false,
    isReviewer: false,
  });

  useEffect(() => {
    let active = true;

    const checkRole = (session: Session | null) => {
      if (!session) {
        if (active) setState({ loading: false, session: null, isAdmin: false, isReviewer: false });
        return;
      }
      // Never await inside the auth callback — it deadlocks the Supabase client.
      setTimeout(() => {
        void supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .then(({ data }) => {
            if (!active) return;
            const roles = (data ?? []).map((r) => String(r.role));
            const isAdmin = roles.includes("admin");
            if (isAdmin) setTrackingDisabled(true);
            setState({
              loading: false,
              session,
              isAdmin,
              isReviewer: isAdmin || roles.includes("reviewer"),
            });
          });
      }, 0);
    };

    // Subscribe before reading the session so no transition is missed.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({ ...prev, session }));
      checkRole(session);
    });

    void supabase.auth.getSession().then(({ data }) => checkRole(data.session));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}