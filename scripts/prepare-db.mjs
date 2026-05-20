import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

/** Mac local: sqlite | Vercel production: postgresql */
function resolveProvider() {
  if (process.env.DATABASE_PROVIDER === 'postgresql' || process.env.DATABASE_PROVIDER === 'sqlite') {
    return process.env.DATABASE_PROVIDER;
  }
  // Vercel sets VERCEL=1 during build & runtime
  if (process.env.VERCEL === '1') return 'postgresql';
  return 'sqlite';
}

const provider = resolveProvider();

const generator = `generator client {
  provider = "prisma-client-js"
}

`;

const datasource =
  provider === 'postgresql'
    ? `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

`
    : `datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

`;

const models = readFileSync(join(root, 'prisma', 'models.prisma'), 'utf8');
const schema = generator + datasource + models;

writeFileSync(join(root, 'prisma', 'schema.prisma'), schema);

console.log(`[db] Prisma schema → ${provider} (${provider === 'sqlite' ? 'MacBook local' : 'Vercel/Neon'})`);
