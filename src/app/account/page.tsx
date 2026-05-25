'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/fetcher';
import { Button } from '@/components/ui/button';
import { User, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export default function AccountPage() {
  const { user, loading: authLoading, refresh } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', address: '', city: '', district: '' });
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login?redirect=/account');
    if (user) setForm({ name: user.name, address: user.address || '', city: user.city || '', district: user.district || '' });
  }, [user, authLoading, router]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api('/api/auth/profile', { method: 'PUT', body: JSON.stringify(form) });
      await refresh();
      setMsg('Cập nhật thông tin thành công!');
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg('Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center"><div className="w-12 h-12 rounded-full skeleton mx-auto" /></div>
  );

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-black tracking-tight mb-8">TÀI KHOẢN</h1>

      {/* Profile card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6 animate-fade-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center text-2xl font-black">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-lg">{user.name}</p>
            {user.role === 'ADMIN' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full mt-1">
                <ShieldCheck size={12} /> Quản trị viên
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3 text-sm">
          {user.email && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail size={15} className="flex-shrink-0" />
              <span>{user.email}</span>
            </div>
          )}
          {user.phone && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone size={15} className="flex-shrink-0" />
              <span>{user.phone}</span>
            </div>
          )}
          {(user.address || user.city) && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin size={15} className="flex-shrink-0" />
              <span>{[user.address, user.district, user.city].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={save} className="bg-card border border-border rounded-2xl p-6 shadow-card animate-fade-up space-y-4">
        <h2 className="font-bold text-base mb-1">Cập nhật thông tin</h2>

        {[
          { id: 'name', label: 'HỌ TÊN', type: 'text' },
          { id: 'address', label: 'ĐỊA CHỈ', type: 'text' },
          { id: 'district', label: 'QUẬN/HUYỆN', type: 'text' },
          { id: 'city', label: 'TỈNH/TP', type: 'text' },
        ].map(({ id, label, type }) => (
          <div key={id}>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">{label}</label>
            <input
              type={type}
              value={form[id as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [id]: e.target.value })}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
            />
          </div>
        ))}

        {msg && <p className={`text-sm font-medium ${msg.includes('thành công') ? 'text-green-600' : 'text-destructive'}`}>{msg}</p>}

        <Button type="submit" disabled={saving} className="w-full rounded-xl font-bold h-12 text-sm tracking-wide">
          {saving ? 'ĐANG LƯU…' : 'LƯU THAY ĐỔI'}
        </Button>
      </form>
    </div>
  );
}
