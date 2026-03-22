-- ============================================================
-- Public browse policies
-- Allows unauthenticated (anon) visitors to browse the marketplace
-- without requiring a login.
-- ============================================================

-- Service categories are a static lookup table — fully public
create policy "service_categories: anon can read"
  on public.service_categories
  for select
  to anon
  using (true);

-- Profiles: anonymous visitors can read service-provider profiles only
-- (customers' profiles stay private to authenticated users)
create policy "profiles: anon can read service providers"
  on public.profiles
  for select
  to anon
  using (role = 'service_provider');

-- Provider skills: needed to display per-category provider counts
create policy "provider_skills: anon can read"
  on public.provider_skills
  for select
  to anon
  using (true);
