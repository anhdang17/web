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

    const [
      totalUsers,
      newUsers,
      totalOrders,
      totalProducts,
      ordersByStatus,
      topProducts,
      monthlyRevenue,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // New users in last 30 days
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),

      // Total orders
      prisma.order.count(),

      // Total products
      prisma.product.count(),

      // Orders grouped by status
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
        _sum: { total: true },
      }),

      // Top 10 best-selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10,
      }),

      // Monthly revenue (last 6 months)
      prisma.order.findMany({
        where: {
          status: { in: ['CONFIRMED', 'SHIPPING', 'DELIVERED'] },
          createdAt: { gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) },
        },
        select: {
          total: true,
          createdAt: true,
        },
      }),
    ]);

    // Get product details for top 10
    const topProductIds = topProducts.map((p) => p.productId);
    const topProductsWithDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
        category: true,
      },
    });

    const topProductsMap = new Map(topProductsWithDetails.map((p) => [p.id, p]));
    const top10Products = topProducts.map((p) => ({
      ...topProductsMap.get(p.productId),
      totalSold: p._sum.quantity ?? 0,
    })).filter(Boolean);

    // Calculate monthly revenue breakdown
    const monthlyRevenueMap = new Map<string, number>();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenueMap.set(key, 0);
    }

    monthlyRevenue.forEach((order) => {
      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyRevenueMap.has(key)) {
        monthlyRevenueMap.set(key, (monthlyRevenueMap.get(key) ?? 0) + order.total);
      }
    });

    // Format monthly revenue array (oldest to newest)
    const sortedMonths = Array.from(monthlyRevenueMap.keys()).sort();
    const revenueByMonth = sortedMonths.map((month) => ({
      month,
      revenue: monthlyRevenueMap.get(month) ?? 0,
    }));

    // Total revenue
    const totalRevenue = ordersByStatus
      .filter((o) => ['CONFIRMED', 'SHIPPING', 'DELIVERED'].includes(o.status))
      .reduce((sum, o) => sum + (o._sum.total ?? 0), 0);

    // Orders by status map
    const ordersStatusMap = Object.fromEntries(
      ordersByStatus.map((o) => [o.status, { count: o._count.status, revenue: o._sum.total ?? 0 }])
    );

    return jsonOk({
      overview: {
        totalUsers,
        newUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
      },
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
