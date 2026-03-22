-- ============================================================
-- Artisan Connect — Initial Schema
-- ============================================================
-- Run order:
--   1. Enums
--   2. Tables
--   3. Indexes
--   4. Row Level Security policies
--   5. Seed data
-- ============================================================


-- ============================================================
-- 1. ENUMS
-- ============================================================

create type public.user_role as enum ('customer', 'service_provider');

create type public.request_status as enum ('open', 'closed');


-- ============================================================
-- 2. TABLES
-- ============================================================

-- ------------------------------------------------------------
-- profiles
-- One row per auth user; extended with app-specific fields.
-- ------------------------------------------------------------
create table public.profiles (
  id          uuid        primary key references auth.users (id) on delete cascade,
  full_name   text        not null default '',
  phone       text,
  role        public.user_role not null default 'customer',
  location    text,
  bio         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is
  'Extended user profile linked 1-to-1 with auth.users.';

-- ------------------------------------------------------------
-- service_categories
-- Lookup table — e.g. plumber, electrician, etc.
-- ------------------------------------------------------------
create table public.service_categories (
  id          serial      primary key,
  name        text        not null unique,
  description text,
  icon        text,                          -- optional emoji / icon key
  created_at  timestamptz not null default now()
);

comment on table public.service_categories is
  'Master list of service trades available on the platform.';

-- ------------------------------------------------------------
-- provider_skills
-- Many-to-many: a provider can offer multiple services.
-- ------------------------------------------------------------
create table public.provider_skills (
  id           bigserial   primary key,
  provider_id  uuid        not null references public.profiles (id) on delete cascade,
  category_id  int         not null references public.service_categories (id) on delete cascade,
  created_at   timestamptz not null default now(),

  -- A provider cannot list the same skill twice
  unique (provider_id, category_id)
);

comment on table public.provider_skills is
  'Junction table linking service providers to the categories they offer.';

-- ------------------------------------------------------------
-- service_requests
-- Posted by customers; matched to providers via category.
-- ------------------------------------------------------------
create table public.service_requests (
  id           bigserial          primary key,
  customer_id  uuid               not null references public.profiles (id) on delete cascade,
  category_id  int                references public.service_categories (id) on delete set null,
  title        text               not null default '',
  description  text               not null,
  location     text               not null,
  status       public.request_status not null default 'open',
  created_at   timestamptz        not null default now(),
  updated_at   timestamptz        not null default now()
);

comment on table public.service_requests is
  'Jobs posted by customers looking for a service provider.';


-- ============================================================
-- 3. INDEXES
-- ============================================================

-- profiles — lookup by role (e.g. "list all providers")
create index idx_profiles_role
  on public.profiles (role);

-- provider_skills — find all skills for a given provider
create index idx_provider_skills_provider_id
  on public.provider_skills (provider_id);

-- provider_skills — find all providers for a given category
create index idx_provider_skills_category_id
  on public.provider_skills (category_id);

-- service_requests — a customer's own requests
create index idx_service_requests_customer_id
  on public.service_requests (customer_id);

-- service_requests — filter by open/closed
create index idx_service_requests_status
  on public.service_requests (status);

-- service_requests — filter by category (providers browsing jobs)
create index idx_service_requests_category_id
  on public.service_requests (category_id);

-- service_requests — chronological listing
create index idx_service_requests_created_at
  on public.service_requests (created_at desc);


-- ============================================================
-- 4. TRIGGERS
-- ============================================================

-- Auto-update updated_at on profiles
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger trg_service_requests_updated_at
  before update on public.service_requests
  for each row execute function public.set_updated_at();

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on every application table
alter table public.profiles          enable row level security;
alter table public.service_categories enable row level security;
alter table public.provider_skills   enable row level security;
alter table public.service_requests  enable row level security;


-- ── profiles ────────────────────────────────────────────────

-- Anyone who is logged in can read any profile (public directory)
create policy "profiles: authenticated users can read all"
  on public.profiles
  for select
  to authenticated
  using (true);

-- A user can only insert their own profile row
create policy "profiles: user can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

-- A user can only update their own profile
create policy "profiles: user can update own profile"
  on public.profiles
  for update
  to authenticated
  using  (id = auth.uid())
  with check (id = auth.uid());

-- A user can delete their own profile (triggers cascade on auth.users delete)
create policy "profiles: user can delete own profile"
  on public.profiles
  for delete
  to authenticated
  using (id = auth.uid());


-- ── service_categories ──────────────────────────────────────

-- Publicly readable by all authenticated users
create policy "service_categories: anyone can read"
  on public.service_categories
  for select
  to authenticated
  using (true);

-- Only service-role (Supabase backend) can insert/update/delete categories
-- (managed by admins via the Supabase dashboard or a service-role key)
create policy "service_categories: service role can manage"
  on public.service_categories
  for all
  to service_role
  using (true)
  with check (true);


-- ── provider_skills ─────────────────────────────────────────

-- Any authenticated user can browse provider skills
create policy "provider_skills: authenticated users can read"
  on public.provider_skills
  for select
  to authenticated
  using (true);

-- Only service providers can add their own skills
create policy "provider_skills: providers can insert own skills"
  on public.provider_skills
  for insert
  to authenticated
  with check (
    provider_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role = 'service_provider'
    )
  );

-- Providers can remove their own skills
create policy "provider_skills: providers can delete own skills"
  on public.provider_skills
  for delete
  to authenticated
  using (
    provider_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role = 'service_provider'
    )
  );


-- ── service_requests ────────────────────────────────────────

-- Customers can see all open requests; each customer can see their own closed ones
-- Service providers can see all open requests in their skill categories
create policy "service_requests: customers see own requests"
  on public.service_requests
  for select
  to authenticated
  using (
    -- The customer who owns it can always see it
    customer_id = auth.uid()
    -- Any provider can see open requests
    or status = 'open'
  );

-- Only customers can create requests
create policy "service_requests: customers can insert"
  on public.service_requests
  for insert
  to authenticated
  with check (
    customer_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role = 'customer'
    )
  );

-- Only the owning customer can update their request
create policy "service_requests: customers can update own"
  on public.service_requests
  for update
  to authenticated
  using  (customer_id = auth.uid())
  with check (customer_id = auth.uid());

-- Only the owning customer can delete their request
create policy "service_requests: customers can delete own"
  on public.service_requests
  for delete
  to authenticated
  using (customer_id = auth.uid());


-- ============================================================
-- 6. SEED DATA — service_categories
-- ============================================================

insert into public.service_categories (name, description, icon) values
  ('Plumber',      'Water supply, drainage, and pipe installation/repair',  '🔧'),
  ('Electrician',  'Wiring, electrical panels, outlets, and lighting',      '⚡'),
  ('Carpenter',    'Furniture, woodwork, doors, and roofing frames',        '🪚'),
  ('Mason',        'Brickwork, concrete, plastering, and tiling',           '🧱'),
  ('Painter',      'Interior and exterior painting and surface finishing',  '🖌️'),
  ('Welder',       'Metal fabrication, gates, and structural welding',      '🔩'),
  ('AC Technician','Air conditioning installation, servicing, and repair',  '❄️'),
  ('Cleaner',      'Residential and commercial deep cleaning',              '🧹');
