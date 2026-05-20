'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/fetcher';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import type { CartItem } from '@/types';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api<{ items: CartItem[]; total: number }>('/api/cart')
      .then((d) => {
        setItems(d.items);
        setTotal(d.total);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login?redirect=/cart');
      return;
    }
    load();
  }, [user, authLoading, router]);

  const updateQty = async (productId: string, quantity: number) => {
    await api('/api/cart', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
    load();
  };

  const remove = async (productId: string) => {
    await api(`/api/cart?productId=${productId}`, { method: 'DELETE' });
    load();
  };

  if (authLoading || loading) return <div className="p-16 text-center">Đang tải...</div>;

  return (
    <div className="max-w-[900px] mx-auto px-4 py-10">
      <h1 className="text-2xl font-black mb-8">GIỎ HÀNG</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-brand-gray mb-4">Giỏ hàng trống</p>
          <Link href="/products" className="underline text-sm">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-8">
            {items.map((item) => {
              const price = item.product.salePrice ?? item.product.price;
              return (
                <div key={item.id} className="flex gap-4 border-b pb-6">
                  <div className="relative w-24 h-24 bg-brand-light flex-shrink-0">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${item.product.slug}`} className="text-sm font-medium hover:underline">
                      {item.product.name}
                    </Link>
                    <p className="text-sm font-bold mt-1">{formatPrice(price)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border">
                        <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="p-1.5">
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="p-1.5">
                          <Plus size={14} />
                        </button>
                      </div>
                      <button onClick={() => remove(item.product.id)} className="text-brand-gray hover:text-brand-red">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-bold">{formatPrice(price * item.quantity)}</p>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center border-t pt-6">
            <span className="font-bold">Tổng cộng</span>
            <span className="text-xl font-black">{formatPrice(total)}</span>
          </div>
          <Link
            href="/checkout"
            className="block w-full mt-6 bg-black text-white text-center py-4 text-sm font-bold tracking-widest hover:bg-brand-red transition-colors"
          >
            THANH TOÁN
          </Link>
        </>
      )}
    </div>
  );
}
