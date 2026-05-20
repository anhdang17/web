import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

process.env.DATABASE_PROVIDER = 'postgresql';

console.log('=== Vercel build: PostgreSQL (Neon) ===\n');

if (!process.env.DATABASE_URL) {
  console.error(`
❌ Thiếu DATABASE_URL trên Vercel.

Cách sửa:
1. Vercel Dashboard → Project "web" → Storage → Create Database → Neon
2. Connect database vào project
3. Settings → Environment Variables:
   - DATABASE_URL = (giá trị POSTGRES_PRISMA_URL hoặc DATABASE_URL từ Neon)
   - JWT_SECRET = chuỗi bí mật bất kỳ
   - NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
4. Redeploy
`);
  process.exit(1);
}

const run = (cmd) => {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: root });
};

run('node scripts/prepare-db.mjs');
run('npx prisma generate');
run('npx prisma db push');
run('npx tsx prisma/seed.ts');
run('npx next build');
