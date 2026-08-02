-- 1. Alias table: one person, many device ids
CREATE TABLE public.visitor_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL REFERENCES public.visitors(id) ON DELETE CASCADE,
  anon_id text,
  fp_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.visitor_aliases TO authenticated;
GRANT ALL ON public.visitor_aliases TO service_role;

ALTER TABLE public.visitor_aliases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read visitor aliases"
  ON public.visitor_aliases FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE UNIQUE INDEX visitor_aliases_anon_id_key ON public.visitor_aliases (anon_id) WHERE anon_id IS NOT NULL;
CREATE INDEX visitor_aliases_fp_hash_idx ON public.visitor_aliases (fp_hash) WHERE fp_hash IS NOT NULL;
CREATE INDEX visitor_aliases_visitor_idx ON public.visitor_aliases (visitor_id);

-- 2. Merge + staff bookkeeping on visitors
ALTER TABLE public.visitors
  ADD COLUMN merged_into uuid REFERENCES public.visitors(id) ON DELETE SET NULL,
  ADD COLUMN is_staff boolean NOT NULL DEFAULT false,
  ADD COLUMN label text;

CREATE INDEX visitors_merged_into_idx ON public.visitors (merged_into);

-- 3. Backfill aliases from the identities already stored on visitors
INSERT INTO public.visitor_aliases (visitor_id, anon_id, fp_hash)
SELECT id, anon_id, fp_hash FROM public.visitors
WHERE anon_id IS NOT NULL OR fp_hash IS NOT NULL
ON CONFLICT DO NOTHING;

-- 4. Merge existing duplicates that share a fingerprint: keep the earliest row
WITH survivors AS (
  SELECT fp_hash, MIN(first_seen) AS keep_seen
  FROM public.visitors
  WHERE fp_hash IS NOT NULL AND merged_into IS NULL
  GROUP BY fp_hash
  HAVING COUNT(*) > 1
), keepers AS (
  SELECT v.id, v.fp_hash
  FROM public.visitors v
  JOIN survivors s ON s.fp_hash = v.fp_hash AND s.keep_seen = v.first_seen
), dupes AS (
  SELECT v.id AS dupe_id, k.id AS keep_id
  FROM public.visitors v
  JOIN keepers k ON k.fp_hash = v.fp_hash AND k.id <> v.id
)
UPDATE public.visitors v
SET merged_into = d.keep_id
FROM dupes d
WHERE v.id = d.dupe_id;

-- Re-point child rows at the surviving visitor
UPDATE public.lead_signals s SET visitor_id = v.merged_into
FROM public.visitors v WHERE s.visitor_id = v.id AND v.merged_into IS NOT NULL;
UPDATE public.pointer_samples s SET visitor_id = v.merged_into
FROM public.visitors v WHERE s.visitor_id = v.id AND v.merged_into IS NOT NULL;
UPDATE public.replay_events s SET visitor_id = v.merged_into
FROM public.visitors v WHERE s.visitor_id = v.id AND v.merged_into IS NOT NULL;
UPDATE public.volunteer_signups s SET visitor_id = v.merged_into
FROM public.visitors v WHERE s.visitor_id = v.id AND v.merged_into IS NOT NULL;
UPDATE public.contact_messages s SET visitor_id = v.merged_into
FROM public.visitors v WHERE s.visitor_id = v.id AND v.merged_into IS NOT NULL;

-- Aliases of merged rows now belong to the survivor
UPDATE public.visitor_aliases a SET visitor_id = v.merged_into
FROM public.visitors v WHERE a.visitor_id = v.id AND v.merged_into IS NOT NULL;

-- Survivor keeps the freshest activity stamps
UPDATE public.visitors k
SET last_seen = GREATEST(k.last_seen, m.last_seen),
    signal_count = k.signal_count + m.signal_count
FROM (
  SELECT merged_into, MAX(last_seen) AS last_seen, SUM(signal_count) AS signal_count
  FROM public.visitors WHERE merged_into IS NOT NULL GROUP BY merged_into
) m
WHERE k.id = m.merged_into;

-- 5. Purge noise: whole-page hovers and admin-area activity
DELETE FROM public.lead_signals
WHERE event = 'cta_hover'
   OR path LIKE '/admin%'
   OR (meta->>'tag') IN ('main', 'body', 'html');
DELETE FROM public.pointer_samples WHERE path LIKE '/admin%';
DELETE FROM public.replay_events WHERE path LIKE '/admin%';