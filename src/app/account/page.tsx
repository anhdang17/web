'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, MapPin, Package, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/fetcher';

export default function AccountPage() {
  const { user, loading: authLoading, refresh } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', address: '', city: '', district: '' });
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/account');
    }
    if (user) {
      setForm({
        name: user.name,
        address: user.address || '',
        city: user.city || '',
        district: user.district || '',
      });
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await api('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      await refresh();
      setMsg('Đã lưu thông tin');
    } catch {
      setMsg('Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="container max-w-[1400px] mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-brand-light rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-16">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">TÀI KHOẢN</h1>

      <div className="grid lg:grid-cols-[300px,1fr] gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          <div className="p-6 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-light flex items-center justify-center">
                <User size={20} className="text-brand-gray" />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-brand-gray">{user.email || user.phone}</p>
              </div>
            </div>
          </div>

          <nav className="border border-border">
            <a href="#profile" className="flex items-center gap-3 px-6 py-4 text-sm font-medium bg-brand-light border-b border-border">
              <User size={16} />
              Thông tin cá nhân
            </a>
            <Link href="/orders" className="flex items-center gap-3 px-6 py-4 text-sm text-brand-gray hover:bg-brand-light transition-colors">
              <Package size={16} />
              Đơn hàng
            </Link>
            <button className="w-full flex items-center gap-3 px-6 py-4 text-sm text-brand-gray hover:bg-brand-light transition-colors">
              <Heart size={16} />
              Yêu thích
            </button>
            <button className="w-full flex items-center gap-3 px-6 py-4 text-sm text-brand-gray hover:bg-brand-light transition-colors">
              <MapPin size={16} />
              Địa chỉ
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="border border-border p-6 md:p-8">
          <h2 id="profile" className="text-lg font-bold mb-6">Thông tin cá nhân</h2>
          <form onSubmit={save} className="space-y-5 max-w-lg">
            <div>
              <label className="text-xs font-medium text-brand-gray tracking-wide block mb-2">
                Họ tên
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-brand-gray tracking-wide block mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full border border-border px-4 py-3 text-sm bg-brand-light text-brand-gray cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-brand-gray tracking-wide block mb-2">
                Số điện thoại
              </label>
              <input
                value={user.phone || ''}
                disabled
                className="w-full border border-border px-4 py-3 text-sm bg-brand-light text-brand-gray cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-brand-gray tracking-wide block mb-2">
                Địa chỉ mặc định
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Số nhà, tên đường..."
                className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-brand-gray tracking-wide block mb-2">
                  Quận/Huyện
                </label>
                <input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-gray tracking-wide block mb-2">
                  Tỉnh/TP
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
                />
              </div>
            </div>

            {msg && (
              <p className={`text-sm ${msg.includes('thành') ? 'text-green-600' : 'text-red-600'}`}>
                {msg}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="bg-brand-black text-white px-8 py-3 text-xs font-medium tracking-widest uppercase hover:bg-brand-dark disabled:opacity-50 transition-colors"
            >
              {saving ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
