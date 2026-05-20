'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/fetcher';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import type { CartItem } from '@/types';

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ address: '', city: '', district: '', phone: '', note: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }
    setForm({
      address: user.address || '',
      city: user.city || '',
      district: user.district || '',
      phone: user.phone || '',
      note: '',
    });
    api<{ items: CartItem[]; total: number }>('/api/cart').then((d) => {
      setItems(d.items);
      setTotal(d.total);
      if (d.items.length === 0) router.push('/cart');
    });
  }, [user, authLoading, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api('/api/orders', { method: 'POST', body: JSON.stringify(form) });
      router.push('/orders?success=1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="p-16 text-center">Đang tải...</div>;

  return (
    <div className="max-w-[700px] mx-auto px-4 py-10">
      <h1 className="text-2xl font-black mb-8">THANH TOÁN</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs font-bold tracking-wide">ĐỊA CHỈ GIAO HÀNG</label>
          <input
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border mt-1 px-3 py-2.5 text-sm"
            placeholder="Số nhà, tên đường..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold tracking-wide">QUẬN/HUYỆN</label>
            <input
              required
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className="w-full border mt-1 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold tracking-wide">TỈNH/THÀNH PHỐ</label>
            <input
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border mt-1 px-3 py-2.5 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold tracking-wide">SỐ ĐIỆN THOẠI</label>
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border mt-1 px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold tracking-wide">GHI CHÚ</label>
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full border mt-1 px-3 py-2.5 text-sm h-20"
          />
        </div>

        <div className="border-t pt-4 mt-6">
          <p className="text-sm text-brand-gray mb-2">{items.length} sản phẩm</p>
          <p className="text-xl font-black">{formatPrice(total)}</p>
        </div>

        {error && <p className="text-brand-red text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-4 text-sm font-bold tracking-widest hover:bg-brand-red disabled:opacity-50"
        >
          {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG'}
        </button>
      </form>
    </div>
  );
}
