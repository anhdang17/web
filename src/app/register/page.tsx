'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: '',
    district: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email && !form.phone) {
      setError('Vui lòng nhập email hoặc số điện thoại');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(form);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="flex items-center gap-2 mb-6">
        <Logo size={40} />
        <div className="flex items-baseline">
          <span className="text-xl font-black tracking-tight text-brand-red">UNI</span>
          <span className="text-xl font-black tracking-tight text-foreground">SEX</span>
        </div>
      </div>
      <h1 className="text-2xl font-black mb-2">ĐĂNG KÝ</h1>
      <p className="text-sm text-brand-gray mb-8">Thông tin được lưu vào cơ sở dữ liệu</p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs font-bold tracking-wide">HỌ TÊN *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border mt-1 px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold tracking-wide">EMAIL (Gmail)</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="example@gmail.com"
            className="w-full border mt-1 px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold tracking-wide">SỐ ĐIỆN THOẠI</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="09xxxxxxxx"
            className="w-full border mt-1 px-3 py-2.5 text-sm"
          />
        </div>
        <p className="text-xs text-brand-gray">* Nhập ít nhất email hoặc số điện thoại</p>
        <div>
          <label className="text-xs font-bold tracking-wide">MẬT KHẨU *</label>
          <input
            required
            type="password"
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border mt-1 px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold tracking-wide">ĐỊA CHỈ</label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border mt-1 px-3 py-2.5 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold tracking-wide">QUẬN/HUYỆN</label>
            <input
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className="w-full border mt-1 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold tracking-wide">TỈNH/TP</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border mt-1 px-3 py-2.5 text-sm"
            />
          </div>
        </div>
        {error && <p className="text-brand-red text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3.5 text-sm font-bold tracking-widest hover:bg-brand-red disabled:opacity-50"
        >
          {loading ? 'ĐANG ĐĂNG KÝ...' : 'ĐĂNG KÝ'}
        </button>
      </form>

      <p className="text-sm text-center mt-6 text-brand-gray">
        Đã có tài khoản?{' '}
        <Link href="/login" className="text-black font-medium underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
