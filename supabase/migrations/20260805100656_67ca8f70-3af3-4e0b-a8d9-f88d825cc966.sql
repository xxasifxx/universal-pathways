CREATE TABLE public.households (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hh_key text NOT NULL UNIQUE,
  street_num text,
  street_name text,
  city text,
  zip text,
  district integer,
  voter_count integer NOT NULL DEFAULT 0,
  matched_count integer NOT NULL DEFAULT 0,
  avg_turnout_pct numeric NOT NULL DEFAULT 0,
  lat double precision,
  lng double precision,
  geocode_status text NOT NULL DEFAULT 'pending',
  geocode_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.voters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_id text NOT NULL UNIQUE,
  leg_id text,
  party text,
  status text,
  first_name text,
  last_name text,
  middle_name text,
  street_num text,
  street_name text,
  apt_unit text,
  city text,
  zip text,
  district integer,
  ward text,
  reg_date date,
  phone text,
  voted_2018 boolean NOT NULL DEFAULT false,
  voted_2019 boolean NOT NULL DEFAULT false,
  voted_2020 boolean NOT NULL DEFAULT false,
  voted_2021 boolean NOT NULL DEFAULT false,
  voted_2022 boolean NOT NULL DEFAULT false,
  voted_2023 boolean NOT NULL DEFAULT false,
  voted_2024 boolean NOT NULL DEFAULT false,
  voted_2025 boolean NOT NULL DEFAULT false,
  turnout_pct numeric NOT NULL DEFAULT 0,
  hh_key text,
  household_size integer NOT NULL DEFAULT 1,
  is_matched boolean NOT NULL DEFAULT false,
  is_petition_signer boolean NOT NULL DEFAULT false,
  impact_score numeric GENERATED ALWAYS AS (
    turnout_pct * 0.7 + (LEAST(household_size, 5)::numeric / 5) * 0.3
  ) STORED,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.petition_signers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text,
  last_name text,
  address text,
  town text,
  signed boolean NOT NULL DEFAULT false,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.turnout_history (
  year integer PRIMARY KEY,
  voted integer NOT NULL DEFAULT 0,
  turnout_pct numeric NOT NULL DEFAULT 0
);

CREATE INDEX idx_voters_district_impact ON public.voters (district, impact_score DESC);
CREATE INDEX idx_voters_hh_key ON public.voters (hh_key);
CREATE INDEX idx_voters_matched ON public.voters (is_matched) WHERE is_matched;
CREATE INDEX idx_voters_turnout ON public.voters (turnout_pct);
CREATE INDEX idx_households_district ON public.households (district);
CREATE INDEX idx_households_geocode_status ON public.households (geocode_status);

GRANT SELECT ON public.households TO authenticated;
GRANT ALL ON public.households TO service_role;
GRANT SELECT ON public.voters TO authenticated;
GRANT ALL ON public.voters TO service_role;
GRANT SELECT ON public.petition_signers TO authenticated;
GRANT ALL ON public.petition_signers TO service_role;
GRANT SELECT ON public.turnout_history TO authenticated;
GRANT ALL ON public.turnout_history TO service_role;

ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.petition_signers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turnout_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read households" ON public.households FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can read voters" ON public.voters FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can read petition signers" ON public.petition_signers FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can read turnout history" ON public.turnout_history FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_households_updated_at BEFORE UPDATE ON public.households FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();