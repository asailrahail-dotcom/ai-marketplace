# مشروع (Project) — AI-Powered Project Supplies Marketplace

A Next.js (App Router) + Prisma marketplace connecting products, suppliers,
and services to real projects, with an AI-assisted needs extractor and a
fully isolated admin console.

## Stack

- Next.js 14 (App Router, Server Actions), TypeScript, Tailwind CSS
- Prisma ORM + SQLite (swap the `datasource` in `prisma/schema.prisma` for
  Postgres/MySQL later — the rest of the app is unaffected)
- Cookie-based sessions signed with `jose` (separate secrets/cookies for
  end users vs. admins — see "Admin isolation" below)

## Getting started

```bash
npm install
cp .env.example .env   # then edit the two JWT secrets
npx prisma db push     # creates prisma/dev.db
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
