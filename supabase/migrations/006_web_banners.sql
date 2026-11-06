create table if not exists public.web_banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.web_banners enable row level security;
