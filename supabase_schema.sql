-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. projects table
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  subtitle text,
  short_description text,
  full_description text,
  category text,
  type text,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  is_featured boolean default false,
  is_promotional boolean default false,
  price numeric,
  promotional_price numeric,
  cover_image_url text,
  gallery_images jsonb default '[]'::jsonb,
  attributes_json jsonb default '{}'::jsonb,
  display_order integer default 0,
  gallery_click_action text not null default 'page' check (gallery_click_action in ('page', 'photo')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. testimonials table
create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  client_role text,
  content text not null,
  rating integer check (rating >= 1 and rating <= 5) default 5,
  avatar_url text,
  is_featured boolean default false,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. leads table
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  source text,
  message text,
  related_project_id uuid references public.projects(id) on delete set null,
  status text default 'new' check (status in ('new', 'contacted', 'converted', 'lost')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. site_settings table
create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  brand_name text not null default 'Site Mauro',
  logo_url text,
  primary_color text default '#000000',
  secondary_color text default '#ffffff',
  whatsapp_number text,
  contact_email text,
  address text,
  business_hours text,
  instagram_url text,
  facebook_url text,
  hero_title text,
  hero_subtitle text,
  hero_cta_text text default 'Falar com Consultor',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. promotions table
create table if not exists public.promotions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text,
  related_project_id uuid references public.projects(id) on delete cascade,
  badge_text text,
  active boolean default true,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);


-- ==========================================
-- ÍNDICES (Performance)
-- ==========================================

create index if not exists idx_projects_status_display_order on public.projects(status, display_order);
create index if not exists idx_promotions_active on public.promotions(active);
create index if not exists idx_leads_status_created_at on public.leads(status, created_at);

-- Foreign Keys (melhorar performance em JOINS e deletes em cascata)
create index if not exists idx_leads_related_project_id on public.leads(related_project_id);
create index if not exists idx_promotions_related_project_id on public.promotions(related_project_id);


-- ==========================================
-- TRIGGERS (Idempotentes)
-- ==========================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists handle_projects_updated_at on public.projects;
create trigger handle_projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

drop trigger if exists handle_testimonials_updated_at on public.testimonials;
create trigger handle_testimonials_updated_at
  before update on public.testimonials
  for each row execute function public.handle_updated_at();

drop trigger if exists handle_leads_updated_at on public.leads;
create trigger handle_leads_updated_at
  before update on public.leads
  for each row execute function public.handle_updated_at();

drop trigger if exists handle_site_settings_updated_at on public.site_settings;
create trigger handle_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.handle_updated_at();

drop trigger if exists handle_promotions_updated_at on public.promotions;
create trigger handle_promotions_updated_at
  before update on public.promotions
  for each row execute function public.handle_updated_at();


-- ==========================================
-- RLS (Habilitação pré-policies)
-- ==========================================

alter table public.projects enable row level security;
alter table public.testimonials enable row level security;
alter table public.leads enable row level security;
alter table public.site_settings enable row level security;
alter table public.promotions enable row level security;


-- ==========================================
-- ESTRATÉGIA DE PROTEÇÃO & RLS (POLICIES IDEMPOTENTES)
-- ==========================================

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- NOTA TÉCNICA (JWT):
-- Modificações manuais da 'app_metadata.role' no Supabase Dashboard
-- exigem a renovação do token (re-login / refresh) do lado do cliente 
-- para validarem as permissões de gravação na função is_admin().


-- PUBLIC POLICIES (Reads only)
drop policy if exists "Public can view published projects" on public.projects;
create policy "Public can view published projects"
  on public.projects for select using (status = 'published');

drop policy if exists "Public can view testimonials" on public.testimonials;
create policy "Public can view testimonials"
  on public.testimonials for select using (true);

drop policy if exists "Public can view active promotions" on public.promotions;
create policy "Public can view active promotions"
  on public.promotions for select using (active = true);

drop policy if exists "Public can view site settings" on public.site_settings;
create policy "Public can view site settings"
  on public.site_settings for select using (true);


-- AUTHENTICATED ADMIN POLICIES (Full Access CRUD)
drop policy if exists "Admins have full access to projects" on public.projects;
create policy "Admins have full access to projects"
  on public.projects
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins have full access to testimonials" on public.testimonials;
create policy "Admins have full access to testimonials"
  on public.testimonials
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins have full access to leads" on public.leads;
create policy "Admins have full access to leads"
  on public.leads
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins have full access to site_settings" on public.site_settings;
create policy "Admins have full access to site_settings"
  on public.site_settings
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins have full access to promotions" on public.promotions;
create policy "Admins have full access to promotions"
  on public.promotions
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- ==========================================
-- SUPABASE STORAGE (BUCKETS E POLICIES)
-- ==========================================

insert into storage.buckets (id, name, public)
values
  ('project-images', 'project-images', true),
  ('brand-assets', 'brand-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Admin Insert" on storage.objects;
create policy "Admin Insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('project-images', 'brand-assets')
    and public.is_admin()
  );

drop policy if exists "Admin Update" on storage.objects;
create policy "Admin Update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('project-images', 'brand-assets')
    and public.is_admin()
  )
  with check (
    bucket_id in ('project-images', 'brand-assets')
    and public.is_admin()
  );

drop policy if exists "Admin Delete" on storage.objects;
create policy "Admin Delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('project-images', 'brand-assets')
    and public.is_admin()
  );
