import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return jsonError('Chưa đăng nhập', 401);

  const items = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });
  const total = items.reduce(
    (sum, i) => sum + (i.product.salePrice ?? i.product.price) * i.quantity,
    0
  );
  return jsonOk({ items, total });
}

const addSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1).default(1),
});

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return jsonError('Chưa đăng nhập', 401);

  try {
    const { productId, quantity } = addSchema.parse(await req.json());
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return jsonError('Sản phẩm không tồn tại', 404);

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    const item = existing
      ? await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + quantity },
          include: { product: true },
        })
      : await prisma.cartItem.create({
          data: { userId: user.id, productId, quantity },
          include: { product: true },
        });

    return jsonOk(item);
  } catch {
    return jsonError('Thêm giỏ hàng thất bại', 400);
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return jsonError('Chưa đăng nhập', 401);

  const productId = new URL(req.url).searchParams.get('productId');
  if (!productId) return jsonError('Thiếu productId', 400);

  await prisma.cartItem.deleteMany({ where: { userId: user.id, productId } });
  return jsonOk({ message: 'Đã xóa' });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return jsonError('Chưa đăng nhập', 401);

  const { productId, quantity } = await req.json();
  if (quantity < 1) {
    await prisma.cartItem.deleteMany({ where: { userId: user.id, productId } });
    return jsonOk({ message: 'Đã xóa' });
  }

  const item = await prisma.cartItem.update({
    where: { userId_productId: { userId: user.id, productId } },
    data: { quantity },
    include: { product: true },
  });
  return jsonOk(item);
}
