-- Allow authenticated users to self-assign a non-privileged role
create policy if not exists "Users can set buyer or seller role"
on public.user_roles
for insert
to authenticated
with check (
  auth.uid() = user_id
  and (role = 'buyer'::app_role or role = 'seller'::app_role)
);
