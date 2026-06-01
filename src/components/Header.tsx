'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import Logo from '@/components/Logo';
import CartDrawer from '@/components/CartDrawer';

const navLinks = [
  { href: '/products?gender=NU', label: 'Nữ' },
  { href: '/products?gender=NAM', label: 'Nam' },
  { href: '/products?gender=UNISEX', label: 'Unisex' },
  { href: '/products?featured=true', label: 'Mới về' },
];

export default function Header() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Handle error silently
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}
      >
        <div className="container max-w-[1400px] mx-auto">
          <div className="flex h-16 items-center justify-between px-4 md:px-8">
            {/* Left: Logo & Nav */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2" aria-label="Trang chủ">
                <Logo size={32} />
              </Link>
              <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-xs font-medium tracking-wider uppercase transition-colors ${
                      pathname === item.href
                        ? 'text-brand-black'
                        : 'text-brand-gray hover:text-brand-black'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center: Logo (Mobile) */}
            <Link href="/" className="lg:hidden flex items-center gap-2" aria-label="Trang chủ">
              <Logo size={28} />
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Tìm kiếm"
              >
                <Search size={20} />
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 relative"
                onClick={() => setCartOpen(true)}
                aria-label="Giỏ hàng"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 6h15l-1.5 9h-12z" />
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                  <path d="M6 6L5 3H2" />
                </svg>
              </Button>

              {/* User Menu */}
              {!loading && (
                user ? (
                  <div className="relative group hidden lg:block">
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wider uppercase"
                      aria-haspopup="menu"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                      </svg>
                      <span>{user.name.split(' ')[0]}</span>
                    </button>
                    <div className="invisible absolute right-0 top-full z-50 mt-2 w-48 bg-white border border-border opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-xs text-brand-gray">{user.email ?? user.phone}</p>
                      </div>
                      <Link href="/account" className="block px-4 py-3 text-sm hover:bg-brand-light transition-colors">
                        Tài khoản
                      </Link>
                      <Link href="/orders" className="block px-4 py-3 text-sm hover:bg-brand-light transition-colors">
                        Đơn hàng
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link href="/admin" className="block px-4 py-3 text-sm font-medium hover:bg-brand-light transition-colors">
                          Quản trị
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-brand-gray hover:bg-brand-light transition-colors border-t border-border"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="hidden lg:inline-flex px-6 py-2 text-xs font-medium tracking-wider uppercase bg-brand-black text-white hover:bg-brand-dark transition-colors"
                  >
                    Đăng nhập
                  </Link>
                )
              )}

              {/* Mobile Menu */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden shrink-0"
                onClick={() => setDrawerOpen(true)}
                aria-label="Menu"
              >
                <Menu size={20} />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="border-t border-border px-4 md:px-8 py-4">
              <form action="/products" className="relative">
                <input
                  name="q"
                  type="search"
                  placeholder="Tìm sản phẩm..."
                  className="w-full h-12 pl-12 pr-4 border border-border bg-brand-light text-sm focus:outline-none focus:border-brand-black transition-colors"
                  autoFocus
                />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-full p-0">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <Logo size={28} />
            <button onClick={() => setDrawerOpen(false)} className="p-2" aria-label="Close">
              <X size={20} />
            </button>
          </div>
          <nav className="flex flex-col p-6">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className="py-4 text-lg font-medium tracking-wider uppercase border-b border-border hover:text-brand-gray transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/login"
                onClick={() => setDrawerOpen(false)}
                className="mt-6 py-4 text-center text-xs font-medium tracking-wider uppercase bg-brand-black text-white"
              >
                Đăng nhập
              </Link>
            )}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
