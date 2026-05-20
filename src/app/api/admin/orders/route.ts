import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAdmin } from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    requireAdmin(user);

    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return jsonOk(orders);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    if (msg === 'FORBIDDEN') return jsonError('Không có quyền', 403);
    return jsonError('Lỗi', 401);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    requireAdmin(user);
    const { orderId, status } = await req.json();
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return jsonOk(order);
  } catch {
    return jsonError('Cập nhật thất bại', 400);
  }
}
