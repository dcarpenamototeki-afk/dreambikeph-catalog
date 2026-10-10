create extension if not exists pgcrypto;
create table if not exists public.catalog_items (id uuid primary key default gen_random_uuid(), title text not null default '', brand text not null default '', category text not null default 'Street', year_model text not null default '', odometer_km numeric, cash_price numeric, swapping_value numeric, image_url text not null default '', condition_notes text not null default '', is_available boolean not null default true, is_published boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create or replace function public.set_catalog_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists catalog_items_updated_at on public.catalog_items;
create trigger catalog_items_updated_at before update on public.catalog_items for each row execute function public.set_catalog_updated_at();
alter table public.catalog_items enable row level security;
drop policy if exists "Public can read live catalog" on public.catalog_items;
create policy "Public can read live catalog" on public.catalog_items for select to anon, authenticated using (is_published = true and is_available = true);
