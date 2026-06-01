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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-brand-light">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2">
            <Logo size={40} />
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white p-8 md:p-12">
          <h1 className="text-2xl font-bold tracking-tight mb-2">TẠO TÀI KHOẢN</h1>
          <p className="text-sm text-brand-gray mb-8">
            Đăng ký để theo dõi đơn hàng và nhận ưu đãi
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-xs font-medium tracking-wide text-brand-gray block mb-2">
                Họ tên *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Nguyễn Văn A"
                className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wide text-brand-gray block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wide text-brand-gray block mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0xxx xxx xxx"
                className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wide text-brand-gray block mb-2">
                Mật khẩu *
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-black text-white py-4 text-xs font-medium tracking-widest uppercase hover:bg-brand-dark disabled:opacity-50 transition-colors"
            >
              {loading ? 'ĐANG ĐĂNG KÝ...' : 'TẠO TÀI KHOẢN'}
            </button>
          </form>

          <p className="text-xs text-brand-gray text-center mt-6">
            Bằng việc đăng ký, bạn đồng ý với{' '}
            <Link href="#" className="underline hover:text-brand-black">Điều khoản</Link>{' '}
            và{' '}
            <Link href="#" className="underline hover:text-brand-black">Chính sách bảo mật</Link>
          </p>

          <div className="mt-8 text-center">
            <p className="text-sm text-brand-gray">
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-medium text-brand-black hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
