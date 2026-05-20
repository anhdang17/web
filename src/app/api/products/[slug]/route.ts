import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAdmin } from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-response';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return jsonError('Không tìm thấy sản phẩm', 404);

  const reviews = await prisma.review.findMany({
    where: { productId: product.id },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const agg = await prisma.review.aggregate({
    where: { productId: product.id },
    _avg: { rating: true },
    _count: true,
  });

  return jsonOk({
    product: {
      ...product,
      avgRating: agg._avg.rating ?? 0,
      reviewCount: agg._count,
    },
    reviews,
  });
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const user = await getAuthUser(req);
    requireAdmin(user);
    await prisma.product.delete({ where: { slug: params.slug } });
    return jsonOk({ message: 'Đã xóa sản phẩm' });
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    if (msg === 'FORBIDDEN') return jsonError('Không có quyền', 403);
    return jsonError('Xóa thất bại', 400);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const user = await getAuthUser(req);
    requireAdmin(user);
    const body = await req.json();
    const product = await prisma.product.update({
      where: { slug: params.slug },
      data: body,
    });
    return jsonOk(product);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    if (msg === 'FORBIDDEN') return jsonError('Không có quyền', 403);
    return jsonError('Cập nhật thất bại', 400);
  }
}
