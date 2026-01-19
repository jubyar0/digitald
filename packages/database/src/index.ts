import { PrismaClient } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as any;

let prisma: PrismaClient;

if (process.env.DATABASE_URL) {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    prisma = globalForPrisma.prisma || new PrismaClient({
        adapter,
        log: ['error', 'warn'],
    });
} else {
    prisma = globalForPrisma.prisma || new PrismaClient({
        log: ['error', 'warn'],
    });
}

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export { prisma };
export * from './generated/client';
export { PrismaPg } from '@prisma/adapter-pg';
