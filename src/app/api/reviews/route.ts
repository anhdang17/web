import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-response';

const schema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(500),
});

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return jsonError('Chưa đăng nhập', 401);

  try {
    const data = schema.parse(await req.json());

    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId: user.id, productId: data.productId } },
    });
    if (existing) return jsonError('Bạn đã đánh giá sản phẩm này', 400);

    const review = await prisma.review.create({
      data: { ...data, userId: user.id },
      include: { user: { select: { name: true } } },
    });
    return jsonOk(review, 201);
  } catch {
    return jsonError('Đánh giá thất bại', 400);
  }
}
