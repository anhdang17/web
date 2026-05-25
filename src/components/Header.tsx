'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/products?gender=UNISEX', label: 'Unisex' },
  { href: '/products?gender=NAM', label: 'Nam' },
  { href: '/products?gender=NU', label: 'Nữ' },
  { href: '/products?featured=true', label: 'Mới về' },
  { href: '/products?salePrice=true', label: 'Sale' },
];

export default function Header() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Đã đăng xuất');
    } catch {
      toast.error('Không thể đăng xuất');
    }
    setUserMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'bg-background/95 backdrop-blur-md shadow-card border-b border-border'
            : 'bg-background border-b border-transparent'
        )}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-0.5 group flex-shrink-0">
              <span className="text-2xl font-black tracking-tighter text-accent transition-transform duration-200 group-hover:scale-105">
                UNI
              </span>
              <span className="text-2xl font-black tracking-tighter text-primary transition-transform duration-200 group-hover:scale-105">
                SEX
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Danh mục chính">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg',
                      isActive
                        ? 'text-accent font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSearchOpen(!searchOpen)}
                className="rounded-xl hover:bg-secondary transition-colors"
                aria-label="Tìm kiếm"
              >
                {searchOpen ? <X size={18} /> : <Search size={18} />}
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="icon-sm" className="rounded-xl hover:bg-secondary transition-colors relative" asChild>
                <Link href="/cart" aria-label="Giỏ hàng">
                  <ShoppingBag size={18} />
                </Link>
              </Button>

              {/* User */}
              {!loading && (
                <div className="relative">
                  {user ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:inline-flex gap-2 rounded-xl hover:bg-secondary transition-colors font-semibold"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                      >
                        <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="sm:hidden rounded-xl" asChild>
                        <Link href="/account"><User size={18} /></Link>
                      </Button>

                      {userMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                          <div className="absolute right-0 top-full mt-2 z-50 w-56 bg-background rounded-2xl border border-border shadow-dropdown animate-scale-in overflow-hidden">
                            <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-accent/5 to-transparent">
                              <p className="text-sm font-semibold truncate">{user.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.email || user.phone}</p>
                            </div>
                            <div className="py-1">
                              <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition-colors">
                                <User size={15} className="text-muted-foreground" />
                                Tài khoản
                              </Link>
                              <Link href="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition-colors">
                                <ShoppingBag size={15} className="text-muted-foreground" />
                                Đơn hàng
                              </Link>
                              {user.role === 'ADMIN' && (
                                <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-accent hover:bg-accent/5 transition-colors">
                                  Quản trị
                                </Link>
                              )}
                            </div>
                            <div className="border-t border-border py-1">
                              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors">
                                Đăng xuất
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <Button variant="default" size="sm" className="rounded-xl font-semibold hidden sm:inline-flex" asChild>
                      <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
                        Đăng nhập
                      </Link>
                    </Button>
                  )}
                </div>
              )}

              {/* Mobile menu */}
              <Button
                variant="ghost"
                size="icon-sm"
                className="lg:hidden rounded-xl hover:bg-secondary transition-colors"
                onClick={() => setDrawerOpen(true)}
                aria-label="Mở menu"
              >
                <Menu size={18} />
              </Button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="border-t border-border pb-3 pt-2 animate-slide-down">
              <form onSubmit={handleSearch} className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm áo, quần, giày, phụ kiện…"
                  className="w-full h-11 rounded-xl border border-border bg-secondary/50 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                />
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full max-w-sm flex flex-col p-0 gap-0">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-0.5">
              <span className="text-2xl font-black tracking-tighter text-accent">UNI</span>
              <span className="text-2xl font-black tracking-tighter text-primary">SEX</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-6 space-y-1" aria-label="Menu di động">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center h-12 px-4 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {!loading && !user && (
            <div className="px-6 pb-6 pt-2 border-t border-border space-y-2">
              <Link href="/login" onClick={() => setDrawerOpen(false)} className="block w-full text-center py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
                Đăng nhập
              </Link>
              <Link href="/register" onClick={() => setDrawerOpen(false)} className="block w-full text-center py-3 border-2 border-primary text-primary rounded-xl font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                Đăng ký
              </Link>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
