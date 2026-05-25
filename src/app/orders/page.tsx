'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
};

function OrdersContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login?redirect=/orders');
    if (user) api<Order[]>('/api/orders').then(setOrders);
  }, [user, authLoading, router]);

  if (authLoading) return <div className="p-16 text-center">Đang tải...</div>;

  return (
    <div className="max-w-[900px] mx-auto px-4 py-10">
      <h1 className="text-2xl font-black mb-6">ĐƠN HÀNG CỦA TÔI</h1>
      {params.get('success') && (
        <div className="bg-green-50 border border-green-200 p-4 mb-6 text-sm">
          Đặt hàng thành công! Cảm ơn bạn đã mua sắm.
        </div>
      )}
      {orders.length === 0 ? (
        <p className="text-brand-gray">Chưa có đơn hàng</p>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div key={o.id} className="border p-4">
              <div className="flex justify-between mb-3 text-sm">
                <span className="font-bold">#{o.id.slice(-8).toUpperCase()}</span>
                <span className="text-brand-red font-medium">{STATUS_LABEL[o.status] || o.status}</span>
              </div>
              <p className="text-xs text-brand-gray mb-3">
                {new Date(o.createdAt).toLocaleDateString('vi-VN')} · {o.address}, {o.district}, {o.city}
              </p>
              <div className="flex gap-3 overflow-x-auto">
                {o.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 flex-shrink-0">
                    <div className="relative w-12 h-12 bg-brand-light">
                      <Image src={item.product.image} alt="" fill className="object-cover" />
                    </div>
                    <span className="text-xs">{item.product.name} x{item.quantity}</span>
                  </div>
                ))}
              </div>
              <p className="text-right font-bold mt-3">{formatPrice(o.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center">Đang tải...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
