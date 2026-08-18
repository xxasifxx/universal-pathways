-- Data API grants (were missing entirely)
GRANT SELECT ON public.voters TO authenticated;
GRANT ALL ON public.voters TO service_role;
GRANT SELECT ON public.households TO authenticated;
GRANT ALL ON public.households TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.turfs TO authenticated;
GRANT ALL ON public.turfs TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.turf_households TO authenticated;
GRANT ALL ON public.turf_households TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.canvass_visits TO authenticated;
GRANT ALL ON public.canvass_visits TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.canvass_responses TO authenticated;
GRANT ALL ON public.canvass_responses TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.canvass_volunteers TO authenticated;
GRANT ALL ON public.canvass_volunteers TO service_role;

-- Is this turf currently assigned to the signed-in canvasser?
CREATE OR REPLACE FUNCTION public.is_my_turf(_turf_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.turfs t
    JOIN public.canvass_volunteers v ON v.id = t.volunteer_id
    WHERE t.id = _turf_id
      AND v.user_id = auth.uid()
      AND v.active
      AND t.status IN ('assigned', 'in_progress')
  )
$$;

-- Canvassers: only their assigned turfs
CREATE POLICY "Canvassers read assigned turfs"
ON public.turfs FOR SELECT TO authenticated
USING (public.is_my_turf(id));

CREATE POLICY "Canvassers read assigned turf stops"
ON public.turf_households FOR SELECT TO authenticated
USING (public.is_my_turf(turf_id));

CREATE POLICY "Canvassers log visits on assigned turfs"
ON public.canvass_visits FOR INSERT TO authenticated
WITH CHECK (public.is_my_turf(turf_id));

CREATE POLICY "Canvassers read visits on assigned turfs"
ON public.canvass_visits FOR SELECT TO authenticated
USING (public.is_my_turf(turf_id));

CREATE POLICY "Canvassers log responses on assigned turfs"
ON public.canvass_responses FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.canvass_visits cv
    WHERE cv.id = visit_id AND public.is_my_turf(cv.turf_id)
  )
);

CREATE POLICY "Canvassers read responses on assigned turfs"
ON public.canvass_responses FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.canvass_visits cv
    WHERE cv.id = visit_id AND public.is_my_turf(cv.turf_id)
  )
);