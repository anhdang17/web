'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/fetcher';
import { formatPrice } from '@/lib/utils';
import {
  Users,
  ShoppingCart,
  Package,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

interface DashboardData {
  overview: {
    totalUsers: number;
    newUsers: number;
    totalOrders: number;
    totalProducts: number;
    totalRevenue: number;
  };
  ordersByStatus: Record<string, { count: number; revenue: number }>;
  topProducts: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    category: string;
    totalSold: number;
  }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-50 text-yellow-800 border-yellow-100' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-50 text-blue-800 border-blue-100' },
  SHIPPING: { label: 'Đang giao', color: 'bg-purple-50 text-purple-800 border-purple-100' },
  DELIVERED: { label: 'Đã giao', color: 'bg-green-50 text-green-800 border-green-100' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-50 text-red-800 border-red-100' },
};

const monthLabels: Record<string, string> = {
  '01': 'T1', '02': 'T2', '03': 'T3', '04': 'T4',
  '05': 'T5', '06': 'T6', '07': 'T7', '08': 'T8',
  '09': 'T9', '10': 'T10', '11': 'T11', '12': 'T12',
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<DashboardData>('/api/admin/dashboard')
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 bg-brand-light animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!data) return <div className="text-center py-16 text-brand-gray">Không thể tải dữ liệu</div>;

  const { overview, ordersByStatus, topProducts, revenueByMonth } = data;
  const maxRevenue = Math.max(...revenueByMonth.map((m) => m.revenue), 1);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={<Users size={20} />} value={overview.totalUsers} label="Khách hàng" subtext={`+${overview.newUsers} tháng này`} />
        <StatCard icon={<ShoppingCart size={20} />} value={overview.totalOrders} label="Đơn hàng" subtext={`${ordersByStatus['PENDING']?.count ?? 0} chờ xử lý`} />
        <StatCard icon={<CheckCircle size={20} />} value={ordersByStatus['DELIVERED']?.count ?? 0} label="Đã giao" subtext={formatPrice(ordersByStatus['DELIVERED']?.revenue ?? 0)} />
        <StatCard icon={<Package size={20} />} value={overview.totalProducts} label="Sản phẩm" subtext="đang bán" />
        <StatCard icon={<DollarSign size={20} />} value={formatPrice(overview.totalRevenue)} label="Doanh thu" subtext="tổng cộng" />
      </div>

      {/* Orders & Revenue */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="border border-border p-6">
          <h3 className="text-sm font-medium tracking-wider uppercase mb-6">Tình trạng đơn hàng</h3>
          <div className="space-y-3">
            {Object.entries(ordersByStatus).map(([status, info]) => {
              const cfg = statusLabels[status] ?? { label: status, color: 'bg-gray-50 text-gray-800' };
              return (
                <div key={status} className={`flex items-center justify-between p-4 border ${cfg.color}`}>
                  <span className="text-sm font-medium">{cfg.label}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold">{info.count}</span>
                    <span className="text-xs text-brand-gray ml-2">{formatPrice(info.revenue)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="border border-border p-6">
          <h3 className="text-sm font-medium tracking-wider uppercase mb-6 flex items-center gap-2">
            <TrendingUp size={16} />
            Doanh thu 6 tháng
          </h3>
          <div className="flex items-end gap-2 h-48">
            {revenueByMonth.map((item) => {
              const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
              const label = monthLabels[item.month.split('-')[1]] ?? item.month;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-40">
                    <span className="text-[10px] text-brand-gray mb-1">
                      {item.revenue > 0 ? formatPrice(item.revenue) : '—'}
                    </span>
                    <div
                      className="w-full bg-brand-black/10 hover:bg-brand-black/20 transition-colors"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="border border-border p-6">
        <h3 className="text-sm font-medium tracking-wider uppercase mb-6">Top sản phẩm bán chạy</h3>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center gap-4">
              <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${
                index === 0 ? 'bg-brand-black text-white' :
                index === 1 ? 'bg-brand-gray text-white' :
                index === 2 ? 'bg-brand-muted text-white' :
                'bg-brand-light text-brand-gray'
              }`}>
                {index + 1}
              </span>
              <div className="relative w-12 h-12 bg-brand-light flex-shrink-0 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-brand-gray">{formatPrice(product.price)}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold">{product.totalSold}</p>
                <p className="text-xs text-brand-gray">đã bán</p>
              </div>
            </div>
          ))}
          {topProducts.length === 0 && (
            <p className="text-sm text-brand-gray text-center py-8">Chưa có dữ liệu</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  subtext,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  subtext: string;
}) {
  return (
    <div className="border border-border p-4">
      <div className="text-brand-gray mb-2">{icon}</div>
      <p className="text-xl md:text-2xl font-bold">{value}</p>
      <p className="text-xs text-brand-gray mt-0.5">{label}</p>
      <p className="text-[10px] text-brand-gray mt-0.5">{subtext}</p>
    </div>
  );
}
