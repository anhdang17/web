'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { api } from '@/lib/fetcher';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/types';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const FREE_SHIPPING_THRESHOLD = 500000;

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = () => {
    api<{ items: CartItem[]; total: number }>('/api/cart')
      .then((d) => {
        setItems(d.items);
        setTotal(d.total);
      })
      .catch(() => setItems([]));
  };

  useEffect(() => {
    if (open) {
      load();
    }
  }, [open]);

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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} />
            <h2 className="text-base font-medium tracking-tight">GIỎ HÀNG</h2>
            {items.length > 0 && (
              <span className="text-xs text-brand-gray">({items.length})</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-light transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && (
          <div className="px-6 py-3 bg-brand-light">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-brand-gray">
                Mua thêm <span className="font-medium text-brand-black">{formatPrice(remainingForFreeShipping)}</span> để được freeship
              </p>
            ) : (
              <p className="text-xs font-medium text-brand-black">
                Bạn đã đủ điều kiện freeship!
              </p>
            )}
            <div className="mt-2 h-0.5 bg-brand-border relative overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-brand-black transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-brand-muted mb-4" />
              <p className="text-brand-gray mb-4">Giỏ hàng trống</p>
              <button
                onClick={onClose}
                className="text-xs font-medium tracking-widest uppercase hover:underline"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => {
                const price = item.product.salePrice ?? item.product.price;
                return (
                  <div key={item.id} className="flex gap-4">
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={onClose}
                      className="relative w-20 h-24 flex-shrink-0 bg-brand-light overflow-hidden"
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={onClose}
                        className="text-sm font-medium leading-tight line-clamp-2 hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm font-medium mt-1">{formatPrice(price)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-brand-light transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-brand-light transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => remove(item.product.id)}
                          className="text-xs text-brand-gray hover:text-brand-black transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tổng cộng</span>
              <span className="text-lg font-bold">{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-brand-black text-white py-4 text-xs font-medium tracking-widest uppercase text-center hover:bg-brand-dark transition-colors"
            >
              THANH TOÁN
            </Link>
            <button
              onClick={onClose}
              className="block w-full py-3 text-xs font-medium tracking-widest uppercase text-center hover:underline"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </div>
    </>
  );
}
