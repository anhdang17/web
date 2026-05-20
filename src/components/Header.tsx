'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-brand-red font-bold text-xl tracking-tight">UNI</span>
              <span className="font-bold text-xl tracking-tight">SEX</span>
            </Link>
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium tracking-wide">
              <Link href="/products?gender=NU" className="hover:opacity-60">NỮ</Link>
              <Link href="/products?gender=NAM" className="hover:opacity-60">NAM</Link>
              <Link href="/products?gender=UNISEX" className="hover:opacity-60">UNISEX</Link>
              <Link href="/products?featured=true" className="hover:opacity-60">MỚI</Link>
            </nav>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 hidden sm:block">
            <span className="text-brand-red font-black text-3xl tracking-tighter">UT</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 hover:opacity-60"
              aria-label="Tìm kiếm"
            >
              <Search size={20} />
            </button>
            <Link href="/cart" className="p-1 hover:opacity-60 relative">
              <ShoppingBag size={20} />
            </Link>
            {!loading && (
              user ? (
                <div className="relative group">
                  <button className="p-1 hover:opacity-60 flex items-center gap-1">
                    <User size={20} />
                    <span className="hidden lg:inline text-xs">{user.name.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="px-3 py-2 text-xs text-brand-gray border-b">{user.email || user.phone}</div>
                    <Link href="/account" className="block px-3 py-2 text-sm hover:bg-brand-light">Tài khoản</Link>
                    <Link href="/orders" className="block px-3 py-2 text-sm hover:bg-brand-light">Đơn hàng</Link>
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="block px-3 py-2 text-sm hover:bg-brand-light text-brand-red font-medium">Quản trị</Link>
                    )}
                    <button onClick={() => logout()} className="w-full text-left px-3 py-2 text-sm hover:bg-brand-light border-t">
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <Link href={`/login?redirect=${pathname}`} className="text-sm font-medium hover:opacity-60">
                  Đăng nhập
                </Link>
              )
            )}
            <button className="md:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-3 animate-fade-in">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm áo, quần, giày, phụ kiện..."
              className="w-full border-b-2 border-black py-2 text-sm outline-none"
            />
          </form>
        )}
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t px-4 py-3 flex flex-col gap-3 text-sm font-medium">
          <Link href="/products?category=AO" onClick={() => setMenuOpen(false)}>ÁO</Link>
          <Link href="/products?category=QUAN" onClick={() => setMenuOpen(false)}>QUẦN</Link>
          <Link href="/products?category=VAY" onClick={() => setMenuOpen(false)}>VÁY</Link>
          <Link href="/products?category=AO_KHOAC" onClick={() => setMenuOpen(false)}>ÁO KHOÁC</Link>
          <Link href="/products?category=GIAY" onClick={() => setMenuOpen(false)}>GIÀY DÉP</Link>
          <Link href="/products?category=PHU_KIEN" onClick={() => setMenuOpen(false)}>PHỤ KIỆN</Link>
        </nav>
      )}
    </header>
  );
}
