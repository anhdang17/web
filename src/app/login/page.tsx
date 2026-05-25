'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/';
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1 mb-6">
            <span className="text-3xl font-black tracking-tighter text-accent">UNI</span>
            <span className="text-3xl font-black tracking-tighter text-primary">SEX</span>
          </Link>
          <h1 className="text-2xl font-black tracking-tight mb-1">Đăng nhập</h1>
          <p className="text-sm text-muted-foreground">Chào mừng bạn quay trở lại</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
              EMAIL HOẶC SỐ ĐIỆN THOẠI
            </label>
            <input
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="user@gmail.com"
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">MẬT KHẨU</label>
            <div className="relative">
              <input
                required
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 pr-11 text-sm bg-background outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full rounded-xl font-bold h-12 text-sm tracking-wide">
            {loading ? 'ĐANG ĐĂNG NHẬP…' : 'ĐĂNG NHẬP'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-accent font-semibold hover:text-accent/80 transition-colors">
            Đăng ký ngay
          </Link>
        </p>

        {/* Demo accounts */}
        <div className="mt-8 p-5 bg-secondary rounded-2xl border border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Tài khoản demo</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Khách hàng:</span>
              <code className="text-xs bg-background px-2 py-0.5 rounded-lg border border-border">user@gmail.com</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quản trị:</span>
              <code className="text-xs bg-background px-2 py-0.5 rounded-lg border border-border">admin@unisex.vn</code>
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">Mật khẩu: <code className="bg-background px-1 py-0.5 rounded border border-border">123456</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 rounded-full skeleton" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
