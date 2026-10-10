alter table public.catalog_items
  add column if not exists is_reserved boolean not null default false;
