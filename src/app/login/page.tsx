'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/';
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.identifier, form.password);
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-brand-light">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2">
            <Logo size={40} />
          </Link>
        </div>

        <div className="bg-white p-8 md:p-12">
          <h1 className="text-2xl font-bold tracking-tight mb-2">ĐĂNG NHẬP</h1>
          <p className="text-sm text-brand-gray mb-8">Dùng email hoặc số điện thoại để đăng nhập</p>

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="text-xs font-medium tracking-wide text-brand-gray block mb-2">
                Email hoặc SĐT
              </label>
              <input
                type="text"
                name="identifier"
                value={form.identifier}
                onChange={handleChange}
                required
                placeholder="user@email.com"
                className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wide text-brand-gray block mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
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
              {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-brand-gray">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="font-medium text-brand-black hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-light" />}>
      <LoginForm />
    </Suspense>
  );
}
