import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAdmin } from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    requireAdmin(user);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        city: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return jsonOk(users);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    if (msg === 'FORBIDDEN') return jsonError('Không có quyền', 403);
    return jsonError('Lỗi', 401);
  }
}
