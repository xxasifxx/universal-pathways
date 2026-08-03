CREATE TABLE public.contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  address_line1 text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  occupation text NOT NULL,
  employer text NOT NULL,
  amount_cents integer NOT NULL,
  method text NOT NULL,
  certifies_own_funds boolean NOT NULL DEFAULT false,
  certifies_us_person boolean NOT NULL DEFAULT false,
  note text,
  status text NOT NULL DEFAULT 'pledged',
  visitor_id uuid REFERENCES public.visitors(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.contributions TO authenticated;
GRANT ALL ON public.contributions TO service_role;

ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read contributions"
  ON public.contributions FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX contributions_created_at_idx ON public.contributions (created_at DESC);