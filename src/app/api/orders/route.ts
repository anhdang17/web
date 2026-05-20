import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return jsonError('Chưa đăng nhập', 401);

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return jsonOk(orders);
}

const orderSchema = z.object({
  address: z.string().min(5),
  city: z.string().min(2),
  district: z.string().min(2),
  phone: z.string().min(9),
  note: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return jsonError('Chưa đăng nhập', 401);

  try {
    const data = orderSchema.parse(await req.json());
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) return jsonError('Giỏ hàng trống', 400);

    const total = cartItems.reduce(
      (sum, i) => sum + (i.product.salePrice ?? i.product.price) * i.quantity,
      0
    );

    const order = await prisma.$transaction(async (tx) => {
      const o = await tx.order.create({
        data: {
          userId: user.id,
          total,
          address: data.address,
          city: data.city,
          district: data.district,
          phone: data.phone,
          note: data.note,
          items: {
            create: cartItems.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              price: i.product.salePrice ?? i.product.price,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { userId: user.id } });
      return o;
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { address: data.address, city: data.city, district: data.district },
    });

    return jsonOk(order, 201);
  } catch {
    return jsonError('Đặt hàng thất bại', 400);
  }
}
