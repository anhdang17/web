import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAdmin } from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    requireAdmin(user);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      totalUsers,
      newUsers,
      totalOrders,
      totalProducts,
      ordersByStatus,
      topProductsWithDetails,
      monthlyRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
        _sum: { total: true },
      }),
      prisma.orderItem.findMany({
        where: { order: { status: { in: ['CONFIRMED', 'SHIPPING', 'DELIVERED'] } } },
        select: { productId: true, quantity: true },
      }),
      prisma.order.findMany({
        where: {
          status: { in: ['CONFIRMED', 'SHIPPING', 'DELIVERED'] },
          createdAt: { gte: sixMonthsAgo },
        },
        select: { total: true, createdAt: true },
      }),
    ]);

    // Aggregate top products efficiently
    const productSalesMap = new Map<string, number>();
    for (const item of topProductsWithDetails) {
      productSalesMap.set(
        item.productId,
        (productSalesMap.get(item.productId) ?? 0) + item.quantity
      );
    }

    const sortedProducts = Array.from(productSalesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const topProductIds = sortedProducts.map(([id]) => id);
    const topProductsData = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, image: true, price: true, category: true },
    });

    const productMap = new Map(topProductsData.map((p) => [p.id, p]));
    const top10Products = sortedProducts.map(([productId, totalSold]) => ({
      ...productMap.get(productId),
      totalSold,
    })).filter(Boolean);

    // Calculate monthly revenue
    const monthlyRevenueMap = new Map<string, number>();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenueMap.set(key, 0);
    }

    for (const order of monthlyRevenue) {
      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyRevenueMap.has(key)) {
        monthlyRevenueMap.set(key, (monthlyRevenueMap.get(key) ?? 0) + order.total);
      }
    }

    const sortedMonths = Array.from(monthlyRevenueMap.keys()).sort();
    const revenueByMonth = sortedMonths.map((month) => ({
      month,
      revenue: monthlyRevenueMap.get(month) ?? 0,
    }));

    const totalRevenue = ordersByStatus
      .filter((o) => ['CONFIRMED', 'SHIPPING', 'DELIVERED'].includes(o.status))
      .reduce((sum, o) => sum + (o._sum.total ?? 0), 0);

    const ordersStatusMap = Object.fromEntries(
      ordersByStatus.map((o) => [o.status, { count: o._count.status, revenue: o._sum.total ?? 0 }])
    );

    return jsonOk({
      overview: { totalUsers, newUsers, totalOrders, totalProducts, totalRevenue },
      ordersByStatus: ordersStatusMap,
      topProducts: top10Products,
      revenueByMonth,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    if (msg === 'FORBIDDEN') return jsonError('Không có quyền', 403);
    console.error(e);
    return jsonError('Lỗi server', 500);
  }
}
