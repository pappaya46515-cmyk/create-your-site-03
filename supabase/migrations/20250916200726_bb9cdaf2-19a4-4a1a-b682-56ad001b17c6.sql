-- Remove the unique constraint that prevents multiple roles
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;

-- Allow users to have multiple roles (buyer AND seller, but not admin)
-- Users can now be both buyer and seller
CREATE POLICY "Users can add buyer or seller role to themselves"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role IN ('buyer'::app_role, 'seller'::app_role)
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = NEW.role
  )
);