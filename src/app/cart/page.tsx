'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { api } from '@/lib/fetcher';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/types';

const FREE_SHIPPING_THRESHOLD = 500000;

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api<{ items: CartItem[]; total: number }>('/api/cart')
      .then((d) => {
        setItems(d.items);
        setTotal(d.total);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

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

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const freeShippingProgress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  if (loading) {
    return (
      <div className="container max-w-[1400px] mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-6">
              <div className="w-24 h-24 bg-brand-light" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-brand-light w-1/3" />
                <div className="h-4 bg-brand-light w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">GIỎ HÀNG</h1>
          {items.length > 0 && (
            <p className="text-sm text-brand-gray mt-1">{items.length} sản phẩm</p>
          )}
        </div>
        <Link
          href="/products"
          className="flex items-center gap-2 text-sm text-brand-gray hover:text-brand-black transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Tiếp tục mua sắm</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag size={64} className="text-brand-muted mb-6" />
          <h2 className="text-xl font-bold mb-2">Giỏ hàng trống</h2>
          <p className="text-brand-gray mb-8">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
          <Link
            href="/products"
            className="bg-brand-black text-white px-8 py-4 text-xs font-medium tracking-widest uppercase hover:bg-brand-dark transition-colors"
          >
            KHÁM PHÁ SẢN PHẨM
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr,400px] gap-8 lg:gap-16">
          {/* Items */}
          <div>
            {/* Free Shipping Progress */}
            <div className="mb-6 p-4 bg-brand-light">
              {remainingForFreeShipping > 0 ? (
                <p className="text-sm">
                  Mua thêm <span className="font-bold">{formatPrice(remainingForFreeShipping)}</span> để được freeship
                </p>
              ) : (
                <p className="text-sm font-medium">Bạn đã đủ điều kiện freeship!</p>
              )}
              <div className="mt-2 h-1 bg-brand-border relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-brand-black transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="border-t border-border">
              {items.map((item) => {
                const price = item.product.salePrice ?? item.product.price;
                return (
                  <div key={item.id} className="flex gap-6 py-6 border-b border-border">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="relative w-24 h-28 md:w-32 md:h-36 flex-shrink-0 bg-brand-light overflow-hidden"
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <div>
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="text-sm font-medium leading-tight hover:underline"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-brand-gray mt-1">
                            {item.product.gender} · {item.product.category}
                          </p>
                        </div>
                        <button
                          onClick={() => remove(item.product.id)}
                          className="text-brand-gray hover:text-brand-black transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-end justify-between mt-4">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-brand-light transition-colors"
                            aria-label="Decrease"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-12 h-10 flex items-center justify-center text-sm font-medium border-x border-border">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-brand-light transition-colors"
                            aria-label="Increase"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-bold">{formatPrice(price * item.quantity)}</p>
                      </div>
                      <p className="text-xs text-brand-gray mt-2">{formatPrice(price)} / sản phẩm</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border p-6 space-y-4">
              <h2 className="text-lg font-bold">TÓM TẮT ĐƠN HÀNG</h2>

              <div className="space-y-3 py-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-gray">Tạm tính</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-gray">Phí vận chuyển</span>
                  <span>{total >= FREE_SHIPPING_THRESHOLD ? 'Miễn phí' : 'Tính khi checkout'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-medium">Tổng cộng</span>
                <span className="text-xl font-bold">{formatPrice(total)}</span>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-brand-black text-white py-4 text-xs font-medium tracking-widest uppercase text-center hover:bg-brand-dark transition-colors mt-4"
              >
                THANH TOÁN
              </Link>

              <div className="pt-4 border-t border-border space-y-2">
                <p className="text-xs text-brand-gray">Giao hàng miễn phí cho đơn từ 500.000đ</p>
                <p className="text-xs text-brand-gray">Đổi trả trong 7 ngày</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
