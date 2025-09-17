-- Bootstrap admin function: allows first authenticated user to become admin if none exists
create or replace function public.bootstrap_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_count integer;
begin
  select count(*) into admin_count from public.user_roles where role = 'admin';
  if admin_count = 0 then
    insert into public.user_roles (user_id, role) values (auth.uid(), 'admin');
    return true;
  else
    return false;
  end if;
end;
$$;

-- Allow authenticated users to execute the function
grant execute on function public.bootstrap_admin() to authenticated;