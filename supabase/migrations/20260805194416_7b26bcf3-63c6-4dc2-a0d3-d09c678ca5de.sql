ALTER TABLE public.voters
  ADD COLUMN IF NOT EXISTS is_personal_contact boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS contact_name text;

CREATE INDEX IF NOT EXISTS voters_personal_contact_idx ON public.voters (is_personal_contact) WHERE is_personal_contact;