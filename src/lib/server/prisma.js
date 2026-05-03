// @ts-nocheck
/**
 * Supabase REST adapter that mimics the Prisma Client API surface.
 *
 * Every downstream file keeps its `import { prisma } from '$lib/server/prisma'`
 * and `.findMany()` / `.create()` / etc. calls completely unchanged.
 *
 * Internally we call the Supabase REST API via @supabase/supabase-js.
 */
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('⚠️  Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY / PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// ---------------------------------------------------------------------------
// Helper: build a Supabase query from Prisma-style `where` clauses
// ---------------------------------------------------------------------------
function applyWhere(query, where) {
    if (!where) return query;
    for (const [key, value] of Object.entries(where)) {
        if (value === undefined) continue;

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            // Prisma operator objects
            if ('equals' in value && value.mode === 'insensitive') {
                query = query.ilike(key, value.equals);
            } else if ('equals' in value) {
                query = query.eq(key, value.equals);
            } else if ('in' in value) {
                query = query.in(key, value.in);
            } else if ('not' in value) {
                query = query.neq(key, value.not);
            } else {
                // Nested plain object — treat as eq
                query = query.eq(key, value);
            }
        } else {
            query = query.eq(key, value);
        }
    }
    return query;
}

// ---------------------------------------------------------------------------
// Helper: apply `orderBy` to a query
// ---------------------------------------------------------------------------
function applyOrderBy(query, orderBy) {
    if (!orderBy) return query;
    if (Array.isArray(orderBy)) {
        for (const ob of orderBy) {
            query = applyOrderBy(query, ob);
        }
        return query;
    }
    for (const [col, dir] of Object.entries(orderBy)) {
        query = query.order(col, { ascending: dir === 'asc' });
    }
    return query;
}

// ---------------------------------------------------------------------------
// Helper: add default timestamps to create data (replaces Prisma's @default(now()) / @updatedAt)
// Maps every table to the timestamp columns it needs auto-filled.
// ---------------------------------------------------------------------------
const TIMESTAMP_COLUMNS = {
    User:            { createdAt: true, updatedAt: true },
    Discussion:      { createdAt: true, updatedAt: true },
    DiscussionReply: { createdAt: true, updatedAt: true },
    Project:         { createdAt: true },
    UserBadge:       { earnedAt: true },
    UserActivity:    { createdAt: true },
    AuditLog:        { timestamp: true },
    CourseProgress:  { updatedAt: true },
};

function addTimestampDefaults(tableName, data) {
    const cols = TIMESTAMP_COLUMNS[tableName];
    if (!cols) return data;
    const now = new Date().toISOString();
    const out = { ...data };
    for (const col of Object.keys(cols)) {
        if (out[col] === undefined) out[col] = now;
    }
    return out;
}

function addUpdatedAt(tableName, data) {
    const cols = TIMESTAMP_COLUMNS[tableName];
    if (!cols) return data;
    const now = new Date().toISOString();
    const out = { ...data };
    if (cols.updatedAt && out.updatedAt === undefined) out.updatedAt = now;
    return out;
}

// ---------------------------------------------------------------------------
// Helper: apply `select` columns
// ---------------------------------------------------------------------------
function buildSelectString(select, include) {
    if (include) {
        // Build a Supabase foreign-table select
        // e.g. include: { badge: true } → '*, Badge(*)'
        // include: { author: { select: { name: true } } } → '*, User!authorId(name)'
        const parts = ['*'];
        for (const [rel, val] of Object.entries(include)) {
            const tableMap = {
                badge: 'Badge',
                user: 'User',
                author: 'User',
                replies: 'DiscussionReply',
                discussion: 'Discussion',
                badges: 'UserBadge'
            };
            const foreignTable = tableMap[rel] || rel;
            if (val === true) {
                parts.push(`${foreignTable}(*)`);
            } else if (val && typeof val === 'object' && val.select) {
                const cols = Object.keys(val.select).join(',');
                parts.push(`${foreignTable}(${cols})`);
            }
        }
        return parts.join(', ');
    }
    if (select) {
        return Object.keys(select).filter(k => select[k]).join(', ');
    }
    return '*';
}

// ---------------------------------------------------------------------------
// Generic model factory — creates findMany, findFirst, create, update, etc.
// ---------------------------------------------------------------------------
function createModel(tableName) {
    return {
        /**
         * findMany({ where, select, orderBy, take, include })
         */
        findMany: async (opts = {}) => {
            let selectStr = buildSelectString(opts.select, opts.include);
            let q = supabase.from(tableName).select(selectStr);
            q = applyWhere(q, opts.where);
            q = applyOrderBy(q, opts.orderBy);
            if (opts.take) q = q.limit(opts.take);
            const { data, error } = await q;
            if (error) { console.error(`[prisma.${tableName}.findMany]`, error); throw error; }

            // Post-process include results to match Prisma's nesting format
            if (opts.include && data) {
                return data.map(row => transformIncludes(row, opts.include));
            }
            return data || [];
        },

        /**
         * findFirst({ where })
         */
        findFirst: async (opts = {}) => {
            let q = supabase.from(tableName).select('*');
            q = applyWhere(q, opts.where);
            q = q.limit(1).maybeSingle();
            const { data, error } = await q;
            if (error) { console.error(`[prisma.${tableName}.findFirst]`, error); throw error; }
            return data;
        },

        /**
         * findUnique({ where: { id }, select })
         */
        findUnique: async (opts = {}) => {
            let selectStr = buildSelectString(opts.select);
            let q = supabase.from(tableName).select(selectStr);
            q = applyWhere(q, opts.where);
            q = q.maybeSingle();
            const { data, error } = await q;
            if (error) { console.error(`[prisma.${tableName}.findUnique]`, error); throw error; }
            return data;
        },

        /**
         * count({ where })
         */
        count: async (opts = {}) => {
            let q = supabase.from(tableName).select('id', { count: 'exact', head: true });
            q = applyWhere(q, opts.where);
            const { count, error } = await q;
            if (error) { console.error(`[prisma.${tableName}.count]`, error); throw error; }
            return count || 0;
        },

        /**
         * create({ data }) → returns the created row
         */
        create: async ({ data }) => {
            const dataWithDefaults = addTimestampDefaults(tableName, data);
            const { data: result, error } = await supabase
                .from(tableName)
                .insert(dataWithDefaults)
                .select('*')
                .single();
            if (error) { 
                console.error(`[prisma.${tableName}.create]`, error); 
                throw new Error(error.message);
            }
            return result;
        },

        /**
         * createMany({ data: [...] })
         */
        createMany: async ({ data }) => {
            const rows = data.map(row => addTimestampDefaults(tableName, row));
            const { error } = await supabase.from(tableName).insert(rows);
            if (error) { console.error(`[prisma.${tableName}.createMany]`, error); throw error; }
            return { count: data.length };
        },

        /**
         * update({ where: { id }, data }) → returns the updated row
         */
        update: async ({ where, data }) => {
            const dataWithTs = addUpdatedAt(tableName, data);
            let q = supabase.from(tableName).update(dataWithTs);
            q = applyWhere(q, where);
            q = q.select('*').single();
            const { data: result, error } = await q;
            if (error) { console.error(`[prisma.${tableName}.update]`, error); throw error; }
            return result;
        },

        /**
         * updateMany({ where, data }) → returns { count }
         */
        updateMany: async ({ where, data }) => {
            const dataWithTs = addUpdatedAt(tableName, data);
            let q = supabase.from(tableName).update(dataWithTs);
            q = applyWhere(q, where);
            q = q.select('id');
            const { data: rows, error } = await q;
            if (error) { console.error(`[prisma.${tableName}.updateMany]`, error); throw error; }
            return { count: rows ? rows.length : 0 };
        },

        /**
         * delete({ where: { id } })
         */
        delete: async ({ where }) => {
            let q = supabase.from(tableName).delete();
            q = applyWhere(q, where);
            const { error } = await q;
            if (error) { console.error(`[prisma.${tableName}.delete]`, error); throw error; }
        }
    };
}

// ---------------------------------------------------------------------------
// Transform Supabase's flat join results into Prisma's nested format
// e.g. row.Badge → row.badge (for `include: { badge: true }`)
// ---------------------------------------------------------------------------
function transformIncludes(row, include) {
    if (!row || !include) return row;
    const result = { ...row };
    for (const [rel] of Object.entries(include)) {
        const tableMap = {
            badge: 'Badge',
            user: 'User',
            author: 'User',
            replies: 'DiscussionReply',
            discussion: 'Discussion',
            badges: 'UserBadge'
        };
        const foreignTable = tableMap[rel] || rel;
        if (result[foreignTable] !== undefined) {
            result[rel] = result[foreignTable];
            if (rel !== foreignTable) {
                delete result[foreignTable];
            }
        }
    }
    return result;
}

// ---------------------------------------------------------------------------
// Export `prisma` — a Prisma-compatible object with model accessors
// ---------------------------------------------------------------------------
export const prisma = {
    user:            createModel('User'),
    project:         createModel('Project'),
    course:          createModel('Course'),
    notice:          createModel('Notice'),
    teamMember:      createModel('TeamMember'),
    badge:           createModel('Badge'),
    userBadge:       createModel('UserBadge'),
    userActivity:    createModel('UserActivity'),
    auditLog:        createModel('AuditLog'),
    discussion:      createModel('Discussion'),
    discussionReply: createModel('DiscussionReply'),
    courseProgress:   createModel('CourseProgress'),
};