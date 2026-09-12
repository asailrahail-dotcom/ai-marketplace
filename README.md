# مشروع (Project) — AI-Powered Project Supplies Marketplace

A Next.js (App Router) + Prisma marketplace connecting products, suppliers,
and services to real projects, with an AI-assisted needs extractor and a
fully isolated admin console.

## Stack

- Next.js 14 (App Router, Server Actions), TypeScript, Tailwind CSS
- Prisma ORM + PostgreSQL (works with any Postgres provider — Vercel
  Postgres, Neon, Supabase, or a self-hosted instance)
- Cookie-based sessions signed with `jose` (separate secrets/cookies for
  end users vs. admins — see "Admin isolation" below)

## Deploy without a terminal (Vercel)

The database is PostgreSQL, so the app can run on a normal serverless host
with a real public URL — no local install required. The build script
(`vercel-build` in `package.json`) provisions the schema and demo data
automatically on every deploy, so this is entirely point-and-click:

1. Go to https://vercel.com and sign up (the "Continue with GitHub" option
   is the fastest — no separate password to create).
2. Click **Add New… → Project**, then import this repository
   (`asailrahail-dotcom/ai-marketplace`) and pick the branch that has this
   code.
3. Before clicking Deploy, open **Storage** in the Vercel dashboard for the
   new project → **Create Database → Postgres**. Connect it to the project —
   this automatically sets `DATABASE_URL` for you.
4. In **Settings → Environment Variables**, add two more variables (any
   long random string works — ask whoever set this up for ready-made
   values, or generate your own):
   - `USER_JWT_SECRET`
   - `ADMIN_JWT_SECRET`
5. Click **Deploy**. Vercel gives you a public `https://…vercel.app` URL
   when it finishes — that link works from any device, no installation
   needed.
6. Admin console is at `<your-url>/admin/login` — see demo credentials
   below.

## Local setup (optional, for development)

```bash
npm install
cp .env.example .env   # DATABASE_URL needs a real Postgres connection string
                        # (e.g. from the Vercel/Neon/Supabase database above,
                        # or a local Postgres install) + the two JWT secrets
npx prisma db push     # creates the tables
npm run db:seed        # demo/seed data — see credentials below
npm run dev
```

App runs at http://localhost:3000. Admin console at
http://localhost:3000/admin/login.

## Demo credentials (seed data)

Printed by `npm run db:seed`, also listed here for convenience:

- Admin: `admin@mashroo.sa` / `Admin@12345`
- Demo sellers: `seller1@mashroo.sa` / `Demo@12345` (also `seller2`, `seller3`)

All seeded products/suppliers/services/categories are demo data for
development — replace or remove before a production launch.

## Admin isolation

The admin console (`/admin/*`) is intentionally isolated from the public
site:

- Separate session cookie and JWT secret (`ADMIN_JWT_SECRET` vs.
  `USER_JWT_SECRET`) — a shopper's session can never satisfy an admin check.
- Separate login (`/admin/login`), layout, sidebar navigation, and visual
  design — no shared header/bottom-nav with the shopper-facing site.
- `middleware.ts` blocks any `/admin/*` request without a valid admin
  session before it reaches a page, in addition to the per-page check in
  `src/app/admin/(dashboard)/layout.tsx`.

## AI needs extraction

`src/lib/ai/needs-extractor.ts` is a deterministic, rule-based Arabic
keyword matcher (project type / stage / needs, with a light quantity
heuristic). It requires no external API key and never fabricates
marketplace results — `src/lib/ai/needs-search.ts` always queries the real
database and reports honest zero counts when nothing matches. If you want
to swap in a real LLM call later, this is the seam to do it at.

## Payments

No payment gateway is wired in yet (no `MOYASAR_SECRET_KEY` /
`AUTHENTICA_API_KEY` are configured). Checkout creates a real order with
`paymentStatus: PENDING` rather than faking a successful charge — see
`.env.example` for where those keys would go server-side only.
# Last deploy trigger: 2026-09-12T12:27:51Z
