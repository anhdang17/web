'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/fetcher';

export default function AccountPage() {
  const { user, loading: authLoading, refresh } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', address: '', city: '', district: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login?redirect=/account');
    if (user) {
      setForm({
        name: user.name,
        address: user.address || '',
        city: user.city || '',
        district: user.district || '',
      });
    }
  }, [user, authLoading, router]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api('/api/auth/profile', { method: 'PUT', body: JSON.stringify(form) });
      await refresh();
      setMsg('Đã cập nhật thông tin');
    } catch {
      setMsg('Cập nhật thất bại');
    }
  };

  if (authLoading || !user) return <div className="p-16 text-center">Đang tải...</div>;

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-black mb-6">TÀI KHOẢN</h1>
      <div className="text-sm text-brand-gray mb-6 space-y-1">
        <p>Email: {user.email || '—'}</p>
        <p>SĐT: {user.phone || '—'}</p>
        <p>Vai trò: {user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}</p>
      </div>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="text-xs font-bold">HỌ TÊN</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border mt-1 px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold">ĐỊA CHỈ</label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border mt-1 px-3 py-2.5 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold">QUẬN/HUYỆN</label>
            <input
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className="w-full border mt-1 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold">TỈNH/TP</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border mt-1 px-3 py-2.5 text-sm"
            />
          </div>
        </div>
        {msg && <p className="text-sm text-brand-red">{msg}</p>}
        <button type="submit" className="w-full bg-black text-white py-3 text-sm font-bold tracking-widest">
          LƯU THAY ĐỔI
        </button>
      </form>
    </div>
  );
}
