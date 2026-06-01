# Deploy — The Deployment Company

The site is built and committed, and the Supabase backend is live (project
`deployment-company`, table `contact_submissions` with an insert-only RLS
policy). This is a **pure static site** — no build step, no serverless
functions, **no environment variables**. The contact form posts directly to
Supabase using the anon key embedded in `index.html`.

The remaining steps need your GitHub and Vercel logins, so they run on your
machine.

## 1 — Create the GitHub repo and push

The local repo is already committed on the `main` branch. Create an empty repo
on github.com (e.g. `deployment-company-site`, no README/license), then:

```bash
cd "deployment-company-site"
git remote add origin git@github.com:<your-username>/deployment-company-site.git
git push -u origin main
```

(Or, with the GitHub CLI: `gh repo create deployment-company-site --private --source=. --push`.)

## 2 — Connect to Vercel

In Vercel (vercel.com, team **CreatioApp**): New Project → Import the repo →
Framework preset **Other** → Deploy. No environment variables, no build command.
Vercel will serve `index.html` and print your live URL.

## 3 — Verify

1. Open the deployment URL, toggle EN/HE, and submit the contact form once.
2. Confirm the row landed: Supabase → project `deployment-company` →
   Table editor → `contact_submissions`.

## 4 — Point the domain

Vercel → Project → Settings → Domains → add `thedeploymentcompany.co.il`, and
set `deploymentcompany.co.il` and `deployment.co.il` to redirect to it. Add the
DNS records Vercel shows at your `.co.il` registrar.
