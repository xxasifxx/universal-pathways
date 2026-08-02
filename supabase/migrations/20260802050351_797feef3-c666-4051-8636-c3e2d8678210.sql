-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Visitors
CREATE TABLE public.visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_id text UNIQUE,
  fp_hash text,
  name text,
  phone text,
  email text,
  first_ip text,
  last_ip text,
  first_ua text,
  last_ua text,
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  signal_count integer NOT NULL DEFAULT 0,
  identified_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.visitors TO authenticated;
GRANT ALL ON public.visitors TO service_role;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read visitors" ON public.visitors
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX visitors_anon_id_idx ON public.visitors (anon_id);
CREATE INDEX visitors_fp_hash_idx ON public.visitors (fp_hash);
CREATE INDEX visitors_last_seen_idx ON public.visitors (last_seen DESC);

-- Lead signals
CREATE TABLE public.lead_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid REFERENCES public.visitors(id) ON DELETE CASCADE,
  anon_id text,
  session_id text,
  event text NOT NULL,
  service_slug text,
  service_group text,
  path text,
  referrer text,
  utm jsonb,
  dwell_ms integer,
  meta jsonb,
  ip text,
  user_agent text,
  fp_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.lead_signals TO authenticated;
GRANT ALL ON public.lead_signals TO service_role;
ALTER TABLE public.lead_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read lead signals" ON public.lead_signals
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX lead_signals_visitor_created_idx ON public.lead_signals (visitor_id, created_at DESC);
CREATE INDEX lead_signals_created_idx ON public.lead_signals (created_at DESC);
CREATE INDEX lead_signals_session_idx ON public.lead_signals (session_id);
CREATE INDEX lead_signals_event_idx ON public.lead_signals (event);

-- Pointer samples
CREATE TABLE public.pointer_samples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid REFERENCES public.visitors(id) ON DELETE CASCADE,
  session_id text,
  path text,
  viewport_w integer,
  viewport_h integer,
  is_touch boolean NOT NULL DEFAULT false,
  samples jsonb NOT NULL,
  sample_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pointer_samples TO authenticated;
GRANT ALL ON public.pointer_samples TO service_role;
ALTER TABLE public.pointer_samples ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read pointer samples" ON public.pointer_samples
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX pointer_samples_path_created_idx ON public.pointer_samples (path, created_at DESC);

-- Replay events
CREATE TABLE public.replay_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid REFERENCES public.visitors(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  seq integer NOT NULL,
  events jsonb NOT NULL,
  path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.replay_events TO authenticated;
GRANT ALL ON public.replay_events TO service_role;
ALTER TABLE public.replay_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read replay events" ON public.replay_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX replay_events_session_seq_idx ON public.replay_events (session_id, seq);
CREATE INDEX replay_events_visitor_created_idx ON public.replay_events (visitor_id, created_at DESC);

-- Attach identity to existing lead tables
ALTER TABLE public.volunteer_signups ADD COLUMN visitor_id uuid REFERENCES public.visitors(id) ON DELETE SET NULL;
ALTER TABLE public.contact_messages ADD COLUMN visitor_id uuid REFERENCES public.visitors(id) ON DELETE SET NULL;

GRANT SELECT ON public.volunteer_signups TO authenticated;
GRANT SELECT ON public.contact_messages TO authenticated;
CREATE POLICY "Admins can read volunteer signups" ON public.volunteer_signups
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read contact messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger for visitors
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_visitors_updated_at BEFORE UPDATE ON public.visitors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Retention purge
CREATE OR REPLACE FUNCTION public.purge_tracking_data()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  DELETE FROM public.replay_events WHERE created_at < now() - interval '30 days';
  DELETE FROM public.pointer_samples WHERE created_at < now() - interval '30 days';
  DELETE FROM public.lead_signals WHERE created_at < now() - interval '180 days';
END; $$;
REVOKE EXECUTE ON FUNCTION public.purge_tracking_data() FROM public, anon, authenticated;