CREATE OR REPLACE FUNCTION public.can_review(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','reviewer')
  )
$$;

CREATE TABLE public.draft_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_key text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'drafting',
  note text,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.draft_status TO authenticated;
GRANT ALL ON public.draft_status TO service_role;
ALTER TABLE public.draft_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviewers can read draft status" ON public.draft_status
  FOR SELECT TO authenticated USING (public.can_review(auth.uid()));
CREATE POLICY "Reviewers can create draft status" ON public.draft_status
  FOR INSERT TO authenticated WITH CHECK (public.can_review(auth.uid()));
CREATE POLICY "Reviewers can update draft status" ON public.draft_status
  FOR UPDATE TO authenticated USING (public.can_review(auth.uid()))
  WITH CHECK (public.can_review(auth.uid()));

CREATE TABLE public.draft_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_key text NOT NULL,
  anchor text,
  body text NOT NULL,
  author_id uuid NOT NULL,
  author_email text,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX draft_comments_draft_key_idx ON public.draft_comments (draft_key, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.draft_comments TO authenticated;
GRANT ALL ON public.draft_comments TO service_role;
ALTER TABLE public.draft_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviewers can read draft comments" ON public.draft_comments
  FOR SELECT TO authenticated USING (public.can_review(auth.uid()));
CREATE POLICY "Reviewers can add draft comments" ON public.draft_comments
  FOR INSERT TO authenticated WITH CHECK (public.can_review(auth.uid()) AND author_id = auth.uid());
CREATE POLICY "Reviewers can update their own comments" ON public.draft_comments
  FOR UPDATE TO authenticated USING (author_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (author_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete draft comments" ON public.draft_comments
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_draft_status_updated_at BEFORE UPDATE ON public.draft_status
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_draft_comments_updated_at BEFORE UPDATE ON public.draft_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();