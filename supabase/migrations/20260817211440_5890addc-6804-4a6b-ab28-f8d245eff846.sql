REVOKE EXECUTE ON FUNCTION public.can_review(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_review(uuid) TO authenticated, service_role;