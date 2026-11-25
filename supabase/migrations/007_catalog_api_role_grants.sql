-- New Supabase projects may require explicit Data API grants for tables created through SQL.
-- RLS remains enabled; this only lets the server-side service key access catalog tables.
grant usage on schema public to service_role;
grant select, insert, update, delete on table public.catalog_items to service_role;
grant select, insert, update, delete on table public.web_banners to service_role;
grant usage, select on all sequences in schema public to service_role;
