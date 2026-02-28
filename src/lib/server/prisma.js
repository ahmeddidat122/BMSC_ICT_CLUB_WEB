import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import { DATABASE_URL } from '$env/static/private';

// Convert file:./dev.db to a clean path for better-sqlite3
const dbPath = (DATABASE_URL || "file:./dev.db").replace('file:', '');
const adapter = new PrismaBetterSqlite3({ url: dbPath });

export const prisma = new PrismaClient({ adapter });
