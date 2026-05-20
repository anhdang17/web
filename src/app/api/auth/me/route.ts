import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return jsonError('Chưa đăng nhập', 401);
  return jsonOk(user);
}
