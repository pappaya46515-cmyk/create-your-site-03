-- Allow authenticated users to self-assign a non-privileged role
CREATE POLICY "Users can set buyer or seller role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (role = 'buyer'::app_role OR role = 'seller'::app_role)
);