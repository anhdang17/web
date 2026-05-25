'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, User, Mail, Phone, Lock, MapPin } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    address: '', city: '', district: '',
  });
  const [showPw, setShowPw] = useState(false);
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

  const field = (
    id: keyof typeof form,
    label: string,
    Icon: React.ElementType,
    placeholder: string,
    type = 'text',
    required = false
  ) => (
    <div>
      <label className="text-xs font-semibold text-muted-foreground block mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          type={type}
          value={form[id]}
          onChange={(e) => setForm({ ...form, [id]: e.target.value })}
          placeholder={placeholder}
          className="w-full border border-border rounded-xl pl-11 pr-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
          required={required}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1 mb-6">
            <span className="text-3xl font-black tracking-tighter text-accent">UNI</span>
            <span className="text-3xl font-black tracking-tighter text-primary">SEX</span>
          </Link>
          <h1 className="text-2xl font-black tracking-tight mb-1">Tạo tài khoản</h1>
          <p className="text-sm text-muted-foreground">Đăng ký để trải nghiệm mua sắm tốt hơn</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {field('name', 'HỌ TÊN *', User, 'Nguyễn Văn A', 'text', true)}
          {field('email', 'EMAIL', Mail, 'example@gmail.com')}
          {field('phone', 'SỐ ĐIỆN THOẠI', Phone, '09xxxxxxxx')}
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">MẬT KHẨU *</label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                required type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={6}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full border border-border rounded-xl pl-11 pr-11 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground -mt-2">* Nhập ít nhất email hoặc số điện thoại</p>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Địa chỉ (tùy chọn)</p>
            {field('address', 'ĐỊA CHỈ', MapPin, '123 Nguyễn Huệ')}
            <div className="grid grid-cols-2 gap-3 mt-3">
              {field('district', 'QUẬN/HUYỆN', MapPin, 'Quận 1')}
              {field('city', 'TỈNH/TP', MapPin, 'TP.HCM')}
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full rounded-xl font-bold h-12 text-sm tracking-wide">
            {loading ? 'ĐANG ĐĂNG KÝ…' : 'TẠO TÀI KHOẢN'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-accent font-semibold hover:text-accent/80">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
