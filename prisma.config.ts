import "dotenv/config";
import { defineConfig } from "@prisma/config";

/**
 * Prisma config for Supabase (PostgreSQL only — no SQLite).
 * - CLI (migrate, db push): uses DIRECT_URL so migrations run against a direct/session connection.
 * - App runtime: uses DATABASE_URL from env (set in hooks) — use pooled URL (port 6543) for production.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Use DATABASE_URL (Supabase pooler)
    url: process.env.DATABASE_URL,
  },
});
