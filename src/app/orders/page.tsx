'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight } from 'lucide-react';
import { api } from '@/lib/fetcher';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string; image: string; slug: string };
}

interface Order {
  id: string;
  status: string;
  total: number;
  address: string;
  city: string;
  district: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-50 text-yellow-800' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-50 text-blue-800' },
  SHIPPING: { label: 'Đang giao', color: 'bg-purple-50 text-purple-800' },
  DELIVERED: { label: 'Đã giao', color: 'bg-green-50 text-green-800' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-50 text-red-800' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Order[]>('/api/orders')
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container max-w-[1400px] mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-8">ĐƠN HÀNG CỦA TÔI</h1>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-brand-light rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-16">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">ĐƠN HÀNG CỦA TÔI</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package size={64} className="text-brand-muted mb-6" />
          <h2 className="text-xl font-bold mb-2">Chưa có đơn hàng</h2>
          <p className="text-brand-gray mb-8">Bắt đầu mua sắm để tạo đơn hàng đầu tiên</p>
          <Link
            href="/products"
            className="bg-brand-black text-white px-8 py-4 text-xs font-medium tracking-widest uppercase hover:bg-brand-dark transition-colors"
          >
            KHÁM PHÁ SẢN PHẨM
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const cfg = STATUS[order.status] ?? { label: order.status, color: 'bg-gray-50' };
            return (
              <div key={order.id} className="border border-border">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-border bg-brand-light">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-brand-gray">#{order.id.slice(-8).toUpperCase()}</span>
                    <span className={`text-xs px-2 py-1 font-medium ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <span className="text-xs text-brand-gray">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                {/* Items */}
                <div className="p-4 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="relative w-16 h-20 bg-brand-light flex-shrink-0 overflow-hidden"
                      >
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-brand-gray mt-0.5">
                          {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-border bg-brand-light">
                  <p className="text-xs text-brand-gray">
                    {order.address}, {order.district}, {order.city}
                  </p>
                  <p className="text-sm font-bold">{formatPrice(order.total)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
