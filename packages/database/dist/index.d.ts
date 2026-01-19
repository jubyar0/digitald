import { PrismaClient } from './generated/client';
declare let prisma: PrismaClient;
export { prisma };
export * from './generated/client';
export { PrismaPg } from '@prisma/adapter-pg';
