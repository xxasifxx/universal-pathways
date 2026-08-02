REVOKE EXECUTE ON FUNCTION public.purge_tracking_data() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_tracking_data() TO service_role;