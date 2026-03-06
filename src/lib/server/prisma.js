import { PrismaClient } from '@prisma/client';

/**
 * Robust lazy-initialization of Prisma Client.
 * This prevents the application from crashing at module evaluation time 
 * if environment variables (DATABASE_URL) are missing.
 */
class PrismaManager {
    constructor() {
        this._prisma = null;
    }

    get client() {
        if (this._prisma) return this._prisma;

        // In development, handle hot-reloading by checking global scope
        if (process.env.NODE_ENV !== 'production') {
            if (!global.__prisma) {
                global.__prisma = new PrismaClient();
            }
            this._prisma = global.__prisma;
        } else {
            this._prisma = new PrismaClient();
        }

        return this._prisma;
    }
}

const manager = new PrismaManager();

// Export a proxy as 'prisma' so we don't have to change any existing imports
export const prisma = new Proxy({}, {
    get: (target, prop) => {
        // Handle common properties accessed by frameworks/tools if needed
        if (prop === 'then') return undefined;

        return manager.client[prop];
    }
});
