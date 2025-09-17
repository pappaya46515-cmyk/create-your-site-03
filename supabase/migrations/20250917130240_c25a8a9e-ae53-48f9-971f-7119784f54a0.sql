-- Fix security issue: Set search_path for the function
ALTER FUNCTION public.create_cc_upload_on_sale() SET search_path = public;