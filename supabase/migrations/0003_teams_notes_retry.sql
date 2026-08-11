-- Safe re-run of 0003_teams_notes.sql — skips anything already applied.
-- Run this instead if the original migration partially succeeded.

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'team_id'
  ) then
    alter table public.profiles add column team_id uuid references public.teams (id) on delete set null;
  end if;
end $$;

create index if not exists profiles_team_idx on public.profiles (team_id);

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'load_entries' and column_name = 'notes'
  ) then
    alter table public.load_entries add column notes text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'load_entries' and column_name = 'logged_by'
  ) then
    alter table public.load_entries add column logged_by uuid references public.profiles (id) on delete set null;
  end if;
end $$;

update public.load_entries set logged_by = player_id where logged_by is null;

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

drop policy if exists "teams_select" on public.teams;
create policy "teams_select" on public.teams
  for select using (auth.uid() is not null);

drop policy if exists "teams_admin_write" on public.teams;
create policy "teams_admin_write" on public.teams
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "load_entries_insert" on public.load_entries;
create policy "load_entries_insert" on public.load_entries
  for insert with check (
    (
      player_id = auth.uid()
      and exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
    )
    or public.is_admin()
  );

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'teams'
  ) then
    alter publication supabase_realtime add table public.teams;
  end if;
end $$;
