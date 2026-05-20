import { PrismaClient } from '@prisma/client';
import { validateDatabaseEnv } from './db-config';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const { provider } = validateDatabaseEnv();

  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn']
        : ['error'],
    // Neon/serverless: tránh giữ connection quá lâu
    ...(provider === 'postgresql' && process.env.NODE_ENV === 'production'
      ? {}
      : {}),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
