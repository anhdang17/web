import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonOk, jsonError } from '@/lib/api-response';
import { z } from 'zod';

async function enrichProducts(products: Awaited<ReturnType<typeof prisma.product.findMany>>) {
  if (products.length === 0) return [];
  const ids = products.map((p) => p.id);
  const reviews = await prisma.review.groupBy({
    by: ['productId'],
    where: { productId: { in: ids } },
    _avg: { rating: true },
    _count: true,
  });
  const map = new Map(reviews.map((r) => [r.productId, { avg: r._avg.rating, count: r._count }]));
  return products.map((p) => ({
    ...p,
    avgRating: map.get(p.id)?.avg ?? 0,
    reviewCount: map.get(p.id)?.count ?? 0,
  }));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const gender = searchParams.get('gender') || '';
  const featured = searchParams.get('featured');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }
  if (category && category !== 'ALL') where.category = category;
  if (gender && gender !== 'ALL') where.gender = gender;
  if (featured === 'true') where.featured = true;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
    if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
  }

  const orderBy =
    sort === 'price_asc'
      ? { price: 'asc' as const }
      : sort === 'price_desc'
        ? { price: 'desc' as const }
        : { createdAt: 'desc' as const };

  const [products, total] = await Promise.all([
    enrichProducts(
      await prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      })
    ),
    prisma.product.count({ where }),
  ]);

  return jsonOk({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

const createSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000),
  price: z.number().positive().max(1_000_000_000),
  salePrice: z.number().positive().optional(),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  gender: z.string().default('UNISEX'),
  image: z.string().url(),
  stock: z.number().int().min(0).default(100),
  featured: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const { getAuthUser, requireAdmin } = await import('@/lib/auth');
    const user = await getAuthUser(req);
    requireAdmin(user);

    const data = createSchema.parse(await req.json());
    const slug =
      data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now();

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        images: JSON.stringify([data.image]),
      },
    });
    return jsonOk(product, 201);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    if (msg === 'UNAUTHORIZED') return jsonError('Chưa đăng nhập', 401);
    if (msg === 'FORBIDDEN') return jsonError('Không có quyền', 403);
    return jsonError('Thêm sản phẩm thất bại', 400);
  }
}
