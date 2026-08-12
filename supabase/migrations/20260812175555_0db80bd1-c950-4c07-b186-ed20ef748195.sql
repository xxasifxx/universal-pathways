ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS notified_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS notify_status text;

ALTER TABLE public.volunteer_signups
  ADD COLUMN IF NOT EXISTS notified_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS notify_status text;