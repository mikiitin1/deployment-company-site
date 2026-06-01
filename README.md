# The Deployment Company — Website

Bilingual (EN / HE, with RTL) single-page marketing site, with a contact form
backed by Supabase. Static front-end + one Vercel serverless function.

## Structure

- `index.html` — the full site (design, copy, EN/HE toggle, RTL, scroll behavior).
- `api/contact.js` — serverless function: validates the form and inserts into
  the Supabase `contact_submissions` table using the service-role key.
- `vercel.json` — clean URLs.
- `.env.example` — required environment variables.

## Environment variables

Set these in Vercel → Project → Settings → Environment Variables (and in
`.env.local` for local dev):

- `SUPABASE_URL` — e.g. `https://<project-ref>.supabase.co`
- `SUPABASE_ANON_KEY` — Supabase anon / publishable key (the table's RLS policy
  allows INSERT only, so this key cannot read submissions)

## Database schema

```sql
create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  company     text,
  message     text not null,
  locale      text not null default 'en'
);
alter table public.contact_submissions enable row level security;
-- Insert-only policy for the anon role: the API key can add rows but cannot
-- read them. The browser never touches the database directly.
create policy "anon can insert submissions"
  on public.contact_submissions
  for insert to anon
  with check (true);
```

## Push to GitHub

```bash
cd deployment-company-site
git init
git add .
git commit -m "Initial commit: The Deployment Company site"
git branch -M main
git remote add origin git@github.com:<you>/deployment-company-site.git
git push -u origin main
```

## Deploy on Vercel

Import the GitHub repo in Vercel (Team: CreatioApp), add the two environment
variables above, and deploy. Then point `thedeploymentcompany.co.il` at the
Vercel project and redirect the other two domains to it.

## Local dev

```bash
npm i -g vercel
vercel dev   # serves index.html and runs /api/contact locally
```
