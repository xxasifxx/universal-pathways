CREATE TABLE public.canvass_volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.canvass_volunteers TO authenticated;
GRANT ALL ON public.canvass_volunteers TO service_role;
ALTER TABLE public.canvass_volunteers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage volunteers" ON public.canvass_volunteers FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Volunteers read their own row" ON public.canvass_volunteers FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE TABLE public.turfs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  district integer,
  status text NOT NULL DEFAULT 'open',
  volunteer_id uuid REFERENCES public.canvass_volunteers(id) ON DELETE SET NULL,
  target_size integer NOT NULL DEFAULT 55,
  door_count integer NOT NULL DEFAULT 0,
  share_token text NOT NULL DEFAULT encode(gen_random_bytes(9), 'hex'),
  passcode text,
  mask_party boolean NOT NULL DEFAULT false,
  allow_contact_info boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (share_token)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.turfs TO authenticated;
GRANT ALL ON public.turfs TO service_role;
ALTER TABLE public.turfs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage turfs" ON public.turfs FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.turf_households (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  turf_id uuid NOT NULL REFERENCES public.turfs(id) ON DELETE CASCADE,
  hh_key text NOT NULL,
  sequence integer NOT NULL DEFAULT 0,
  address text,
  city text,
  zip text,
  lat double precision,
  lng double precision,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (turf_id, hh_key)
);
CREATE INDEX turf_households_turf_seq_idx ON public.turf_households (turf_id, sequence);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.turf_households TO authenticated;
GRANT ALL ON public.turf_households TO service_role;
ALTER TABLE public.turf_households ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage turf households" ON public.turf_households FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.canvass_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL,
  turf_id uuid NOT NULL REFERENCES public.turfs(id) ON DELETE CASCADE,
  hh_key text NOT NULL,
  outcome text NOT NULL,
  note text,
  visited_at timestamptz NOT NULL DEFAULT now(),
  canvasser_name text,
  canvasser_user_id uuid,
  volunteer_id uuid REFERENCES public.canvass_volunteers(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (client_id)
);
CREATE INDEX canvass_visits_turf_idx ON public.canvass_visits (turf_id, visited_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.canvass_visits TO authenticated;
GRANT ALL ON public.canvass_visits TO service_role;
ALTER TABLE public.canvass_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage visits" ON public.canvass_visits FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.canvass_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id uuid NOT NULL REFERENCES public.canvass_visits(id) ON DELETE CASCADE,
  voter_id uuid NOT NULL,
  support smallint,
  issues text[] NOT NULL DEFAULT '{}'::text[],
  wants_lawn_sign boolean NOT NULL DEFAULT false,
  volunteer_lead boolean NOT NULL DEFAULT false,
  vote_by_mail boolean NOT NULL DEFAULT false,
  do_not_contact boolean NOT NULL DEFAULT false,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (visit_id, voter_id)
);
CREATE INDEX canvass_responses_voter_idx ON public.canvass_responses (voter_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.canvass_responses TO authenticated;
GRANT ALL ON public.canvass_responses TO service_role;
ALTER TABLE public.canvass_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage responses" ON public.canvass_responses FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_canvass_volunteers_updated_at BEFORE UPDATE ON public.canvass_volunteers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_turfs_updated_at BEFORE UPDATE ON public.turfs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();