'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { api } from '@/lib/fetcher';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import type { CartItem } from '@/types';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  const load = () => {
    api<{ items: CartItem[]; total: number }>('/api/cart')
      .then((d) => { setItems(d.items); setTotal(d.total); })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login?redirect=/cart'); return; }
    load();
  }, [user, authLoading, router]);

  const updateQty = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    await api('/api/cart', { method: 'PUT', body: JSON.stringify({ productId, quantity }) });
    load();
  };

  const remove = async (productId: string) => {
    setRemoving(productId);
    await api(`/api/cart?productId=${productId}`, { method: 'DELETE' });
    setRemoving(null);
    load();
  };

  if (authLoading || loading) return (
    <div className="max-w-[900px] mx-auto px-4 py-16 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full skeleton" />
      <div className="h-4 w-32 rounded skeleton" />
    </div>
  );

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-black tracking-tight">GIỎ HÀNG</h1>
        {!loading && items.length > 0 && (
          <span className="bg-accent/10 text-accent text-xs font-bold px-2.5 py-1 rounded-full">
            {items.length} sản phẩm
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
            <ShoppingBag size={36} className="text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Giỏ hàng trống</h2>
          <p className="text-sm text-muted-foreground mb-8">Khám phá các sản phẩm tuyệt vời của chúng tôi</p>
          <Link href="/products">
            <Button className="rounded-xl font-semibold">Khám phá ngay</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items */}
          <div className="flex-1 space-y-4">
            {items.map((item) => {
              const price = item.product.salePrice ?? item.product.price;
              return (
                <div
                  key={item.id}
                  className={`flex gap-4 p-4 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-200 ${
                    removing === item.product.id ? 'opacity-50' : ''
                  }`}
                >
                  <Link href={`/products/${item.product.slug}`} className="relative w-24 h-28 sm:w-28 sm:h-36 bg-brand-cream rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <Link href={`/products/${item.product.slug}`} className="text-sm font-semibold hover:text-accent transition-colors line-clamp-2">
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.product.gender === 'UNISEX' ? 'Unisex' : item.product.gender}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 mt-3">
                      <div className="flex items-center border border-border rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQty(item.product.id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-secondary transition-colors active:scale-95"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.product.id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-secondary transition-colors active:scale-95"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.product.id)}
                        disabled={removing === item.product.id}
                        className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all active:scale-95"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between py-1 flex-shrink-0">
                    <p className="text-sm font-bold">{formatPrice(price * item.quantity)}</p>
                    {item.product.salePrice && (
                      <p className="text-[11px] text-muted-foreground line-through">{formatPrice(item.product.price * item.quantity)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="text-base font-bold mb-5">Tóm tắt đơn hàng</h3>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giảm giá</span>
                  <span className="text-accent font-semibold">-0đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí giao hàng</span>
                  <span className="text-muted-foreground text-xs">Tính khi checkout</span>
                </div>
              </div>
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">Tổng cộng</span>
                  <span className="text-xl font-black text-accent">{formatPrice(total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="block">
                <Button className="w-full rounded-xl font-bold h-12 text-sm tracking-wide">
                  THANH TOÁN NGAY
                </Button>
              </Link>
              <Link href="/products" className="block mt-3 text-center text-xs text-muted-foreground hover:text-accent transition-colors">
                Tiếp tục mua sắm →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
