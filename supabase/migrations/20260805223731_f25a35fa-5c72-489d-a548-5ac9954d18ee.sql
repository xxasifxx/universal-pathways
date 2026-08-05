UPDATE public.voters SET is_personal_contact = true, contact_name = v.cname
FROM (VALUES
  ('ce09bebf-1434-46ab-8296-54b9011ecaff'::uuid,'Erum Shakir'),
  ('af64e16f-7127-46b8-819d-2d00af79295d'::uuid,'Ethan'),
  ('14651d08-f887-4dd5-b197-301449d09283'::uuid,'Elana'),
  ('4bcb4f16-5324-43f8-9ae6-3bd5ef161107'::uuid,'Ateka Gunja')
) AS v(vid, cname)
WHERE public.voters.id = v.vid;