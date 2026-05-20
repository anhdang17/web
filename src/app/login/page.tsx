'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/';
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(identifier, password);
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-black mb-2">ĐĂNG NHẬP</h1>
      <p className="text-sm text-brand-gray mb-8">Dùng email Gmail hoặc số điện thoại</p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs font-bold tracking-wide">EMAIL HOẶC SỐ ĐIỆN THOẠI</label>
          <input
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="user@gmail.com hoặc 0901234567"
            className="w-full border mt-1 px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold tracking-wide">MẬT KHẨU</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border mt-1 px-3 py-2.5 text-sm"
          />
        </div>
        {error && <p className="text-brand-red text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3.5 text-sm font-bold tracking-widest hover:bg-brand-red disabled:opacity-50"
        >
          {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
        </button>
      </form>

      <p className="text-sm text-center mt-6 text-brand-gray">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="text-black font-medium underline">
          Đăng ký
        </Link>
      </p>

      <div className="mt-8 p-4 bg-brand-light text-xs text-brand-gray">
        <p className="font-bold text-black mb-2">Tài khoản demo:</p>
        <p>User: user@gmail.com / user123</p>
        <p>Admin: admin@unisex.vn / admin123</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center">Đang tải...</div>}>
      <LoginForm />
    </Suspense>
  );
}
