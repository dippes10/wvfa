-- WVFA teams, injury/context notes on load entries, and admin-on-behalf logging.

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table public.profiles add column team_id uuid references public.teams (id) on delete set null;
create index profiles_team_idx on public.profiles (team_id);

alter table public.load_entries add column notes text;
alter table public.load_entries add column logged_by uuid references public.profiles (id) on delete set null;

-- Existing rows predate logged_by; assume self-logged historically.
update public.load_entries set logged_by = player_id where logged_by is null;

-- team_id follows the same rule as role/status: only an admin-driven update
-- (through the app) may change it, otherwise a player could self-assign teams.
create or replace function public.protect_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.status := old.status;
    new.team_id := old.team_id;
  end if;
  return new;
end;
$$;

alter table public.teams enable row level security;

create policy "teams_select" on public.teams
  for select using (auth.uid() is not null);

create policy "teams_admin_write" on public.teams
  for all using (public.is_admin()) with check (public.is_admin());

-- Widen load_entries_insert so an admin can log a session on a player's
-- behalf, not just the player themselves.
drop policy "load_entries_insert" on public.load_entries;

create policy "load_entries_insert" on public.load_entries
  for insert with check (
    (
      player_id = auth.uid()
      and exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
    )
    or public.is_admin()
  );

alter publication supabase_realtime add table public.teams;
