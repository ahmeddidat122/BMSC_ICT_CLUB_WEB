# Fix for Supabase Database Connection Issue

## The Problem
The website cannot connect to Supabase database. The Prisma client gets "Tenant or user not found" error when trying to query the database. This happens with Supabase connection pooler.

## What Was Done
- Database tables exist ✓
- RLS disabled ✓
- Admin user created ✓
- But Prisma connection fails ✗

## The Fix Needed

Replace the Prisma setup in `src/lib/server/prisma.js` to use **Supabase's REST API** instead of direct pg connection.

### Option 1: Use Supabase JS Client (Recommended)

Replace `src/lib/server/prisma.js` with a Supabase client that uses the API:

```javascript
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// For backward compatibility, export as prisma with methods
export const prisma = {
    user: {
        findMany: async (opts = {}) => {
            const { data } = await supabase.from('User').select('*').limit(opts.take || 100);
            return data || [];
        },
        findFirst: async (opts) => {
            const { data } = await supabase.from('User').select('*').eq('email', opts.where.email).maybeSingle();
            return data;
        },
        create: async ({ data }) => {
            const { data: result } = await supabase.from('User').insert(data).select().single();
            return result;
        },
        update: async ({ where, data }) => {
            const { data: result } = await supabase.from('User').update(data).eq('id', where.id).select().single();
            return result;
        },
        updateMany: async ({ where, data }) => {
            let query = supabase.from('User').update(data);
            if (where.email) query = query.eq('email', where.email);
            const { count } = await query;
            return { count };
        }
    },
    discussion: {
        findMany: async (opts = {}) => {
            const { data } = await supabase.from('Discussion').select('*').order('createdAt', { ascending: false }).limit(opts.take || 100);
            return data || [];
        },
        create: async ({ data }) => {
            const { data: result } = await supisma.from('Discussion').insert(data).select().single();
            return result;
        },
        delete: async ({ where: { id } }) => {
            await supabase.from('Discussion').delete().eq('id', id);
        }
    },
    // Add other tables as needed...
};
```

### Option 2: Use Raw SQL via Supabase REST API

Create a new file `src/lib/server/db.js` with REST calls.

### Option 3: Usepg directly (No pooler)

Change DATABASE_URL in .env to use Supabase's direct connection (port 5432), not the pooler (6543).

## Your Task

1. Try Option 1 first - replace prisma.js with Supabase client
2. Update the API routes to use `supabase` instead of `prisma`
3. Test the website

Good luck!