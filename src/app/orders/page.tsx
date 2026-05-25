'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/fetcher';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface OrderItem {
  id: string; quantity: number; price: number;
  product: { name: string; image: string; slug: string };
}
interface Order {
  id: string; status: string; total: number;
  address: string; city: string; district: string; createdAt: string; items: OrderItem[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:    { label: 'Chờ xác nhận', color: 'text-amber-600', bg: 'bg-amber-50' },
  CONFIRMED:  { label: 'Đã xác nhận',  color: 'text-blue-600',  bg: 'bg-blue-50' },
  SHIPPING:   { label: 'Đang giao',    color: 'text-purple-600', bg: 'bg-purple-50' },
  DELIVERED:  { label: 'Đã giao',      color: 'text-green-600', bg: 'bg-green-50' },
  CANCELLED:  { label: 'Đã hủy',       color: 'text-red-600',   bg: 'bg-red-50' },
};

function OrderStatus({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: 'text-gray-600', bg: 'bg-gray-50' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.color} ${cfg.bg}`}>
      {cfg.label}
    </span>
  );
}

function OrdersContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login?redirect=/orders'); return; }
    if (user) api<Order[]>('/api/orders').then(setOrders).finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || loading) return (
    <div className="max-w-[900px] mx-auto px-4 py-16 flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full skeleton" />
      <div className="h-4 w-40 rounded skeleton" />
    </div>
  );

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-black tracking-tight mb-2">ĐƠN HÀNG</h1>
      <p className="text-sm text-muted-foreground mb-8">Lịch sử mua hàng của bạn</p>

      {params.get('success') && (
        <div className="mb-8 p-5 bg-green-50 border border-green-200 rounded-2xl text-sm animate-fade-up flex items-center gap-3">
          <span className="text-lg">🎉</span>
          <p className="font-semibold text-green-800">Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại UNISEX.</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <span className="text-5xl mb-4">📦</span>
          <h3 className="text-lg font-bold mb-1">Chưa có đơn hàng</h3>
          <p className="text-sm text-muted-foreground mb-6">Bắt đầu mua sắm để xem đơn hàng tại đây</p>
          <Button onClick={() => router.push('/products')} className="rounded-xl">Khám phá ngay</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-200 animate-fade-up">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border bg-secondary/20">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground">#</span>
                  <span className="font-bold text-sm">{o.id.slice(-8).toUpperCase()}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatus status={o.status} />
                  <span className="text-sm font-bold">{formatPrice(o.total)}</span>
                </div>
              </div>
              {/* Items */}
              <div className="p-5">
                <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                  {o.items.map((item) => (
                    <a key={item.id} href={`/products/${item.product.slug}`} className="flex items-center gap-2 flex-shrink-0 group">
                      <div className="relative w-14 h-16 bg-brand-cream rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={item.product.image} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-[11px] text-muted-foreground">x{item.quantity}</p>
                        <p className="text-[11px] font-semibold">{formatPrice(item.price)}</p>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{o.address}, {o.district}, {o.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center"><div className="w-12 h-12 rounded-full skeleton mx-auto" /></div>}>
      <OrdersContent />
    </Suspense>
  );
}
