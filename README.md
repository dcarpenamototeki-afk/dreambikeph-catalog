# DreambikePH Catalog

Standalone public motorcycle catalog and Supabase-backed admin manager. This project is separate from DBPH-aftersales.

## Stack

- Next.js + TypeScript
- Supabase Auth + PostgreSQL
- Vercel hosting

## Local setup

1. Copy `.env.example` to `.env.local` and insert your Supabase values.
2. Create an email/password user in Supabase Authentication and copy its UUID into both allowed-user variables.
3. Run `supabase/migrations/001_catalog_items.sql` in the Supabase SQL Editor.
4. Run `npm install`, then `npm run dev`.
5. Sign in at `/login`, then manage motorcycle listings at `/admin`.

## Deploy with GitHub and Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Add every `.env.example` variable in Vercel Project Settings → Environment Variables. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
4. Deploy. No ChatGPT account or ChatGPT Site is used in the live app.
