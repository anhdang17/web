'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/fetcher';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import type { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, StickyNote, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ address: '', city: '', district: '', phone: '', note: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login?redirect=/checkout'); return; }
    setForm({ address: user.address || '', city: user.city || '', district: user.district || '', phone: user.phone || '', note: '' });
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
      setOrderSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center animate-scale-in">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
      <h1 className="text-2xl font-black mb-3">Đặt hàng thành công!</h1>
      <p className="text-muted-foreground text-sm mb-8">Cảm ơn bạn đã mua sắm. Đơn hàng đang được xử lý.</p>
      <div className="space-y-3">
        <Button className="w-full rounded-xl font-bold h-12" onClick={() => router.push('/orders')}>
          Xem đơn hàng
        </Button>
        <Button variant="outline" className="w-full rounded-xl" onClick={() => router.push('/')}>
          Tiếp tục mua sắm
        </Button>
      </div>
    </div>
  );

  if (authLoading) return <div className="p-16 text-center"><div className="w-12 h-12 rounded-full skeleton mx-auto" /></div>;

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-black mb-8 tracking-tight">THANH TOÁN</h1>
      <form onSubmit={submit} className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1 space-y-6">
          {/* Delivery info */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={18} className="text-accent" />
              <h2 className="font-bold">Địa chỉ giao hàng</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">ĐỊA CHỈ *</label>
                  <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all" placeholder="Số nhà, tên đường…" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">SỐ ĐIỆN THOẠI *</label>
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all" placeholder="09xxxxxxxx" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">QUẬN/HUYỆN *</label>
                  <input required value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">TỈNH/THÀNH PHỐ *</label>
                  <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <StickyNote size={18} className="text-accent" />
              <h2 className="font-bold">Ghi chú (tùy chọn)</h2>
            </div>
            <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all resize-none h-20" placeholder="Ghi chú thêm cho đơn hàng…" />
          </div>

          {/* Payment notice */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 flex items-start gap-3">
            <CreditCard size={18} className="text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold mb-0.5">Thanh toán khi nhận hàng (COD)</p>
              <p className="text-xs text-muted-foreground">Bạn sẽ thanh toán khi nhận được sản phẩm. An toàn và tiện lợi.</p>
            </div>
          </div>

          {error && <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-sm text-destructive">{error}</div>}
        </div>

        {/* Order summary */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 shadow-card">
            <h3 className="font-bold mb-5">Đơn hàng ({items.length} sản phẩm)</h3>
            <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-14 bg-brand-cream rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.product.image} alt="" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                  </div>
                  <p className="text-xs font-semibold flex-shrink-0">
                    {formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2 mb-6 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Tạm tính</span><span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Phí giao hàng</span><span className="font-medium">Miễn phí</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                <span>Tổng</span>
                <span className="text-accent text-lg">{formatPrice(total)}</span>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-xl font-bold h-12 text-sm tracking-wide">
              {loading ? 'ĐANG XỬ LÝ…' : 'XÁC NHẬN ĐẶT HÀNG'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
