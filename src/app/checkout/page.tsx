'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Lock, Truck } from 'lucide-react';
import { api } from '@/lib/fetcher';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/types';

const FREE_SHIPPING_THRESHOLD = 500000;

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({
    address: '',
    city: '',
    district: '',
    phone: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    api<{ items: CartItem[]; total: number }>('/api/cart').then((d) => {
      if (d.items.length === 0) {
        router.push('/cart');
        return;
      }
      setItems(d.items);
      setTotal(d.total);
      setInitialized(true);
    });
  }, [router]);

  useEffect(() => {
    if (initialized && form.address === '') {
      api('/api/auth/me').then((user: unknown) => {
        const u = user as { address?: string; city?: string; district?: string; phone?: string };
        setForm({
          address: u?.address || '',
          city: u?.city || '',
          district: u?.district || '',
          phone: u?.phone || '',
          note: '',
        });
      }).catch(() => {});
    }
  }, [initialized]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api('/api/orders', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      router.push('/orders?success=1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi');
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) {
    return (
      <div className="container max-w-[1200px] mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-brand-light rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-[1200px] mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/cart" className="flex items-center gap-2 text-sm text-brand-gray hover:text-brand-black transition-colors">
          <ArrowLeft size={16} />
          <span>Giỏ hàng</span>
        </Link>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">THANH TOÁN</h1>
        <div className="flex items-center gap-1 text-xs text-brand-gray">
          <Lock size={12} />
          <span>Bảo mật</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr,420px] gap-8 lg:gap-16">
        {/* Form */}
        <form onSubmit={submit} className="space-y-8">
          {/* Shipping */}
          <div>
            <h2 className="text-sm font-medium tracking-wider uppercase mb-6 flex items-center gap-2">
              <Truck size={16} />
              Thông tin giao hàng
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-brand-gray tracking-wide block mb-2">
                  Địa chỉ *
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Số nhà, tên đường..."
                  required
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-brand-gray tracking-wide block mb-2">
                    Quận/Huyện *
                  </label>
                  <input
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    required
                    className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-gray tracking-wide block mb-2">
                    Tỉnh/Thành phố *
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-brand-gray tracking-wide block mb-2">
                  Số điện thoại *
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="0xxx xxx xxx"
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-gray tracking-wide block mb-2">
                  Ghi chú
                </label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Hướng dẫn giao hàng..."
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-black text-white py-4 text-xs font-medium tracking-widest uppercase hover:bg-brand-dark disabled:opacity-50 transition-colors"
          >
            {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG'}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-border p-6 space-y-6">
            <h2 className="text-sm font-medium tracking-wider uppercase">Đơn hàng của bạn</h2>

            {/* Items */}
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {items.map((item) => {
                const price = item.product.salePrice ?? item.product.price;
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-brand-light flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-gray text-white text-[10px] font-medium flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-brand-gray mt-1">{formatPrice(price)}</p>
                    </div>
                    <p className="text-sm font-medium flex-shrink-0">
                      {formatPrice(price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-brand-gray">Tạm tính</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-gray">Vận chuyển</span>
                <span>{total >= FREE_SHIPPING_THRESHOLD ? 'Miễn phí' : 'Tính khi xác nhận'}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="font-medium">Tổng cộng</span>
                <span className="text-lg font-bold">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Trust */}
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center gap-2 text-xs text-brand-gray">
                <Lock size={14} />
                <span>Thanh toán an toàn, bảo mật</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-gray">
                <Truck size={14} />
                <span>Giao hàng trong 2-5 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
