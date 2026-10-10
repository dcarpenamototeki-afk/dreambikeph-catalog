alter table public.catalog_items
  add column if not exists image_urls text[] not null default '{}'::text[];

alter table public.catalog_items
  add column if not exists is_cash_only boolean not null default false;

update public.catalog_items
set image_urls = array[image_url]
where coalesce(array_length(image_urls, 1), 0) = 0
  and image_url <> '';
