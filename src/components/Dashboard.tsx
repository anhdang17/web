'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/fetcher';
import { formatPrice } from '@/lib/utils';
import {
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  DollarSign,
  BarChart3,
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

const statusLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: <CheckCircle className="w-4 h-4" /> },
  SHIPPING: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800', icon: <Truck className="w-4 h-4" /> },
  DELIVERED: { label: 'Đã giao', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> },
};

const monthNames: Record<string, string> = {
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-16 text-brand-gray">Không thể tải dữ liệu dashboard</div>;
  }

  const { overview, ordersByStatus, topProducts, revenueByMonth } = data;
  const maxRevenue = Math.max(...revenueByMonth.map((m) => m.revenue), 1);

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Tổng khách hàng"
          value={overview.totalUsers.toLocaleString('vi-VN')}
          subtext={`+${overview.newUsers} tháng này`}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<ShoppingCart className="w-5 h-5" />}
          label="Tổng đơn hàng"
          value={overview.totalOrders.toLocaleString('vi-VN')}
          subtext={`${ordersByStatus['PENDING']?.count ?? 0} chờ xử lý`}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5" />}
          label="Đã giao thành công"
          value={(ordersByStatus['DELIVERED']?.count ?? 0).toLocaleString('vi-VN')}
          subtext={formatPrice(ordersByStatus['DELIVERED']?.revenue ?? 0)}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<Package className="w-5 h-5" />}
          label="Sản phẩm"
          value={overview.totalProducts.toLocaleString('vi-VN')}
          subtext="đang bán"
          color="bg-orange-50 text-orange-600"
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Doanh thu"
          value={formatPrice(overview.totalRevenue)}
          subtext="tổng cộng"
          color="bg-brand-red/10 text-brand-red"
        />
      </div>

      {/* Orders by Status */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-base font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          TÌNH TRẠNG ĐƠN HÀNG
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(ordersByStatus).map(([status, info]) => {
            const cfg = statusLabels[status] ?? { label: status, color: 'bg-gray-100 text-gray-800', icon: null };
            return (
              <div key={status} className={`rounded-lg p-3 ${cfg.color}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  {cfg.icon}
                  <span className="text-xs font-medium truncate">{cfg.label}</span>
                </div>
                <p className="text-xl font-bold">{info.count}</p>
                <p className="text-xs opacity-80">{formatPrice(info.revenue)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Chart & Top Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            DOANH THU 6 THÁNG GẦN NHẤT
          </h3>
          <div className="flex items-end gap-2 h-40">
            {revenueByMonth.map((item) => {
              const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
              const label = monthNames[item.month.split('-')[1]] ?? item.month;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center justify-end h-32">
                    <span className="text-xs font-medium text-muted-foreground mb-1">
                      {item.revenue > 0 ? formatPrice(item.revenue) : '—'}
                    </span>
                    <div
                      className="w-full bg-brand-red/80 rounded-t-sm transition-all hover:bg-brand-red min-h-[4px]"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 10 Products */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <Package className="w-4 h-4" />
            TOP 10 SẢN PHẨM BÁN CHẠY
          </h3>
          <div className="space-y-3 max-h-52 overflow-y-auto">
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Chưa có dữ liệu</p>
            ) : (
              topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    index === 0 ? 'bg-brand-red text-white' :
                    index === 1 ? 'bg-orange-400 text-white' :
                    index === 2 ? 'bg-yellow-400 text-white' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="relative w-10 h-10 rounded overflow-hidden border border-border shrink-0 bg-secondary">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-brand-red">{product.totalSold}</p>
                    <p className="text-xs text-muted-foreground">đã bán</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-black mb-0.5">{value}</p>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-xs text-muted-foreground/70 mt-0.5">{subtext}</p>
    </div>
  );
}
