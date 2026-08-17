ALTER TABLE public.draft_comments ALTER COLUMN author_id DROP NOT NULL;
ALTER TABLE public.draft_comments ADD COLUMN IF NOT EXISTS reviewer_name text;
ALTER TABLE public.draft_comments ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'reviewer';
ALTER TABLE public.draft_status ADD COLUMN IF NOT EXISTS updated_by_name text;