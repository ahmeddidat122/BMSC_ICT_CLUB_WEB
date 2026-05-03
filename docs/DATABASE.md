# Database: Supabase (PostgreSQL)

This project uses **Supabase** for both **auth** and **database**. The database is **PostgreSQL only** — there is no SQLite or other provider.

## Configuration

| Purpose | Env variable | When used |
|--------|--------------|-----------|
| App runtime (SvelteKit) | `DATABASE_URL` | All Prisma queries in the app. Use the **pooled** URL (port **6543**, `?pgbouncer=true`) to avoid connection exhaustion. |
| Migrations (Prisma CLI) | `DIRECT_URL` | `prisma migrate`, `prisma db push`, etc. Use a **direct/session** connection (e.g. pooler port **5432**). |

- **Auth**: Supabase Auth (cookies, JWT). Set `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`.
- **Database**: Supabase Postgres. Set `DATABASE_URL` and `DIRECT_URL` from Supabase **Project Settings → Database → Connect**.

## Why two URLs?

- **Pooled URL (6543)** is for the app so many requests share a limited number of DB connections.
- **Direct URL (5432)** is needed for migrations; running migrations through the pooler (transaction mode) can cause errors like `prepared statement 's0' does not exist`.

`prisma.config.ts` is set so the CLI uses `DIRECT_URL` when present; otherwise it falls back to `DATABASE_URL`.

## No SQLite

The Prisma schema uses `provider = "postgresql"`. Do not change it to `sqlite` — the app and Supabase are built for Postgres (types, features, and connection strings differ).

## Troubleshooting

- **"Tenant or user not found"** — Check `DATABASE_URL` / `DIRECT_URL` (correct project ref, password, region).
- **"prepared statement does not exist"** — You are running migrations with the pooled (6543) URL. Ensure `DIRECT_URL` is set and that `prisma.config.ts` uses it for the datasource `url`.
- **Connection timeouts** — Use the pooled URL for the app and ensure your Supabase project allows connections from your host.
