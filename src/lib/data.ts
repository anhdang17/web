import { prisma } from '@/lib/prisma';

export async function getFeaturedProducts(limit = 12) {
  const products = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  if (products.length === 0) return products;

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

export async function getProductsByCategory(category: string, limit = 8) {
  const products = await prisma.product.findMany({
    where: { category },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  if (products.length === 0) return products;

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

export async function getHomePageData() {
  const categories = ['AO', 'QUAN', 'PHU_KIEN', 'GIAY'];

  const [featured, ...categoryProducts] = await Promise.all([
    getFeaturedProducts(12),
    ...categories.map((cat) => getProductsByCategory(cat, 8)),
  ]);

  return {
    featured,
    byCategory: Object.fromEntries(
      categories.map((cat, i) => [cat, categoryProducts[i]])
    ),
  };
}
