ALTER TABLE public.volunteer_signups ADD COLUMN IF NOT EXISTS visitor_id uuid REFERENCES public.visitors(id) ON DELETE SET NULL;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS visitor_id uuid REFERENCES public.visitors(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS volunteer_signups_visitor_id_idx ON public.volunteer_signups(visitor_id);
CREATE INDEX IF NOT EXISTS contact_messages_visitor_id_idx ON public.contact_messages(visitor_id);