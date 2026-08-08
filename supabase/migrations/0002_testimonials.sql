-- WVFA testimonials: user-submitted quotes with admin approval before they
-- appear on the public landing page. Builds on 0001_init.sql (uses
-- public.profiles and the public.is_admin() helper defined there).

create type public.testimonial_status as enum ('pending', 'approved', 'rejected');

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  author_name text not null,
  designation text not null,
  quote text not null,
  status public.testimonial_status not null default 'pending',
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index testimonials_status_idx on public.testimonials (status, created_at desc);
create index testimonials_author_idx on public.testimonials (author_id);

alter table public.testimonials enable row level security;

-- Public (including signed-out landing page visitors) sees only approved quotes.
create policy "testimonials_select_approved_public" on public.testimonials
  for select using (status = 'approved');

-- Authors can always see their own submission, whatever its status.
create policy "testimonials_select_own" on public.testimonials
  for select using (author_id = auth.uid());

-- Admins see everything, for the moderation queue.
create policy "testimonials_select_admin" on public.testimonials
  for select using (public.is_admin());

-- Only active accounts can submit, and only as themselves.
create policy "testimonials_insert_own" on public.testimonials
  for insert with check (
    author_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
  );

-- Approve/reject is admin-only.
create policy "testimonials_update_admin" on public.testimonials
  for update using (public.is_admin()) with check (public.is_admin());

-- Authors may retract their own still-pending submission; admins can remove any.
create policy "testimonials_delete" on public.testimonials
  for delete using (
    (author_id = auth.uid() and status = 'pending') or public.is_admin()
  );

alter publication supabase_realtime add table public.testimonials;
