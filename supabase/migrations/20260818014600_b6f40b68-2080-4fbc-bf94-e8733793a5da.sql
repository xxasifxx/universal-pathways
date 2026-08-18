REVOKE ALL ON FUNCTION public.is_my_turf(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_review(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.purge_tracking_data() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.is_my_turf(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_review(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.purge_tracking_data() TO service_role;