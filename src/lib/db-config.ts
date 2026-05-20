export type DatabaseProvider = 'sqlite' | 'postgresql';

export function getDatabaseProvider(): DatabaseProvider {
  if (process.env.DATABASE_PROVIDER === 'postgresql') return 'postgresql';
  if (process.env.DATABASE_PROVIDER === 'sqlite') return 'sqlite';
  if (process.env.VERCEL === '1') return 'postgresql';
  if (process.env.DATABASE_URL?.startsWith('postgresql')) return 'postgresql';
  return 'sqlite';
}

export function validateDatabaseEnv() {
  const provider = getDatabaseProvider();
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      provider === 'postgresql'
        ? 'Thiếu DATABASE_URL (PostgreSQL). Trên Vercel: tạo Neon Database và gắn POSTGRES_PRISMA_URL → DATABASE_URL.'
        : 'Thiếu DATABASE_URL. Local Mac: DATABASE_URL="file:./dev.db"'
    );
  }

  if (provider === 'sqlite' && !url.startsWith('file:')) {
    console.warn('[db] DATABASE_PROVIDER=sqlite nhưng URL không phải file: — kiểm tra .env');
  }

  if (provider === 'postgresql' && !url.startsWith('postgresql')) {
    throw new Error('DATABASE_URL phải là chuỗi postgresql://... cho môi trường Vercel/Neon.');
  }

  return { provider, url };
}
