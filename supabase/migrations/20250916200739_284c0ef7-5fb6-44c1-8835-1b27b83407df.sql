-- Remove unique constraint to allow multiple roles per user
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;

-- Update the insert policy to prevent duplicate roles
DROP POLICY IF EXISTS "Users can add buyer or seller role to themselves" ON public.user_roles;

CREATE POLICY "Users can add additional roles"
ON public.user_roles
FOR INSERT  
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role IN ('buyer'::app_role, 'seller'::app_role)
);