CREATE OR REPLACE FUNCTION public.purge_tracking_data()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.replay_events WHERE created_at < now() - interval '14 days';
  DELETE FROM public.pointer_samples WHERE created_at < now() - interval '14 days';
  DELETE FROM public.lead_signals WHERE created_at < now() - interval '180 days';
END; $function$;