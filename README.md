# The Deployment Company — Website

Bilingual (EN / HE, with RTL) single-page marketing site. Pure static front-end
(`index.html`) with a contact form that posts directly to a Supabase
`contact_submissions` table.

## Structure

- `index.html` — the entire site: design, copy, EN/HE toggle, RTL, scroll
  behavior, and the contact form. The form posts straight to Supabase's REST API.
- `vercel.json` — clean URLs.

No build step and no serverless functions: this deploys as static files.

## How the contact form works

The browser submits directly to Supabase's REST endpoint using the project's
**anon** key (embedded in `index.html`). This is safe because the
`contact_submissions` table has an **insert-only** RLS policy for the `anon`
role — the key can add rows but cannot read them, and the table is never read
from the client.

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
-- Insert-only policy for the anon role: the key can add rows but cannot read them.
create policy "anon can insert submissions"
  on public.contact_submissions
  for insert to anon
  with check (true);
```

This is already applied to the live Supabase project `deployment-company`
(ref `vcqorphrhfgrxmwdbvdl`).

## Deploy

See `DEPLOY.md` — push to GitHub, then connect the repo to Vercel (team
CreatioApp). No environment variables are required.

## Local dev

It's a single static file. Open `index.html` in a browser, or serve the folder:

```bash
cd deployment-company-site
python3 -m http.server 8000   # then open http://localhost:8000
```
