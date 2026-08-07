-- WVFA initial schema: profiles, guardian links, load/sleep tracking, academy settings.
-- Apply via `supabase db push` (after `supabase link`) or paste into the Supabase SQL editor.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('head_admin', 'parent', 'player');
create type public.user_status as enum ('pending', 'active');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role public.user_role not null default 'player',
  status public.user_status not null default 'pending',
  date_of_birth date,
  created_at timestamptz not null default now()
);

create table public.guardians_players (
  guardian_id uuid not null references public.profiles (id) on delete cascade,
  player_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (guardian_id, player_id)
);

create table public.load_entries (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.profiles (id) on delete cascade,
  activity_date date not null,
  description text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  rpe integer not null check (rpe between 0 and 10),
  session_load integer generated always as (duration_minutes * rpe) stored,
  created_at timestamptz not null default now()
);

create table public.sleep_entries (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.profiles (id) on delete cascade,
  entry_date date not null,
  duration_hours numeric(4, 2) not null check (duration_hours >= 0 and duration_hours <= 24),
  quality integer not null check (quality between 0 and 10),
  created_at timestamptz not null default now()
);

-- Single-row settings table (id is always `true`, enforced by the primary key).
create table public.academy_settings (
  id boolean primary key default true check (id),
  hard_rpe_threshold integer not null default 7,
  max_hard_sessions_week integer not null default 2,
  guided_mode_age_cutoff integer not null default 13,
  sleep_target_min_hours numeric(4, 2) not null default 9,
  sleep_target_max_hours numeric(4, 2) not null default 11,
  updated_at timestamptz not null default now()
);

insert into public.academy_settings (id) values (true);

create index load_entries_player_date_idx on public.load_entries (player_id, activity_date desc);
create index sleep_entries_player_date_idx on public.sleep_entries (player_id, entry_date desc);
create index guardians_players_guardian_idx on public.guardians_players (guardian_id);

-- ---------------------------------------------------------------------------
-- New-user bootstrap: every Google sign-in gets a pending player profile.
-- Admin promotes/reassigns role and activates the account from /admin/users.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Helper functions (security definer so RLS policies can check role/links
-- without recursively re-triggering RLS on `profiles`).
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'head_admin'
  );
$$;

create or replace function public.is_guardian_of(target uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.guardians_players
    where guardian_id = auth.uid() and player_id = target
  );
$$;

-- Prevent players/parents from self-promoting via a direct profile update
-- made through the app; only an admin-driven update may change role or
-- status there. Direct SQL/dashboard access (auth.uid() is null — no app
-- session involved) is left unguarded: it already requires full database
-- credentials, which is a superset of admin trust, and this is also how the
-- very first head_admin gets bootstrapped (see SETUP.md).
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
  end if;
  return new;
end;
$$;

create trigger protect_profile_fields
  before update on public.profiles
  for each row execute function public.protect_profile_privileged_fields();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.guardians_players enable row level security;
alter table public.load_entries enable row level security;
alter table public.sleep_entries enable row level security;
alter table public.academy_settings enable row level security;

-- profiles: see your own row, admins see everyone, guardians see their linked players.
create policy "profiles_select" on public.profiles
  for select using (
    id = auth.uid() or public.is_admin() or public.is_guardian_of(id)
  );

create policy "profiles_update" on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
-- (role/status escalation is blocked by the protect_profile_fields trigger above)

-- guardians_players: admins manage links, guardians can read their own.
create policy "guardians_players_select" on public.guardians_players
  for select using (guardian_id = auth.uid() or public.is_admin());

create policy "guardians_players_admin_write" on public.guardians_players
  for all using (public.is_admin()) with check (public.is_admin());

-- load_entries: players own their rows, guardians/admins read.
create policy "load_entries_select" on public.load_entries
  for select using (
    player_id = auth.uid() or public.is_admin() or public.is_guardian_of(player_id)
  );

create policy "load_entries_insert" on public.load_entries
  for insert with check (
    player_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
  );

create policy "load_entries_modify" on public.load_entries
  for update using (player_id = auth.uid() or public.is_admin())
  with check (player_id = auth.uid() or public.is_admin());

create policy "load_entries_delete" on public.load_entries
  for delete using (player_id = auth.uid() or public.is_admin());

-- sleep_entries: same shape as load_entries.
create policy "sleep_entries_select" on public.sleep_entries
  for select using (
    player_id = auth.uid() or public.is_admin() or public.is_guardian_of(player_id)
  );

create policy "sleep_entries_insert" on public.sleep_entries
  for insert with check (
    player_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
  );

create policy "sleep_entries_modify" on public.sleep_entries
  for update using (player_id = auth.uid() or public.is_admin())
  with check (player_id = auth.uid() or public.is_admin());

create policy "sleep_entries_delete" on public.sleep_entries
  for delete using (player_id = auth.uid() or public.is_admin());

-- academy_settings: everyone signed in can read the thresholds, only admins write.
create policy "academy_settings_select" on public.academy_settings
  for select using (auth.uid() is not null);

create policy "academy_settings_update" on public.academy_settings
  for update using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Realtime: live-updating dashboards for players, parents, and admin.
-- ---------------------------------------------------------------------------

alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.load_entries;
alter publication supabase_realtime add table public.sleep_entries;
