'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CATEGORIES } from '@/lib/utils';

const navLinks = [
  { href: '/products?gender=NU', label: 'Nữ' },
  { href: '/products?gender=NAM', label: 'Nam' },
  { href: '/products?gender=UNISEX', label: 'Unisex' },
  { href: '/products?featured=true', label: 'Mới về' },
] as const;

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Đã đăng xuất');
    } catch {
      toast.error('Không thể đăng xuất');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-all duration-200 ease-in-out">
      <div className="container max-w-[1400px]">
        <div className="flex h-14 min-h-14 items-center justify-between gap-4 md:h-16 md:min-h-16">
          <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-8">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-1 rounded-lg outline-none ring-offset-background transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="text-base font-bold tracking-tight text-brand-red md:text-xl">UNI</span>
              <span className="text-base font-bold tracking-tight text-foreground md:text-xl">SEX</span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Danh mục chính">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 ease-in-out hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            href="/"
            className="absolute left-1/2 hidden -translate-x-1/2 sm:block"
            aria-label="Trang chủ UT"
          >
            <span className="text-2xl font-black tracking-tighter text-brand-red md:text-3xl">UT</span>
          </Link>

          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setSearchOpen((o) => !o)}
              aria-expanded={searchOpen}
              aria-controls="header-search"
              aria-label="Mở tìm kiếm"
            >
              <Search className="h-5 w-5" aria-hidden />
            </Button>
            <Button variant="ghost" size="icon" className="shrink-0" asChild>
              <Link href="/cart" aria-label="Giỏ hàng">
                <ShoppingBag className="h-5 w-5" aria-hidden />
              </Link>
            </Button>
            {!loading &&
              (user ? (
                <div className="relative group">
                  <button
                    type="button"
                    className="hidden min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:inline-flex"
                    aria-haspopup="menu"
                    aria-expanded="false"
                  >
                    <User className="h-5 w-5 shrink-0" aria-hidden />
                    <span className="max-w-[6rem] truncate">{user.name.split(' ')[0]}</span>
                  </button>
                  <Button variant="ghost" size="icon" className="lg:hidden" asChild>
                    <Link href="/account" aria-label="Tài khoản">
                      <User className="h-5 w-5" aria-hidden />
                    </Link>
                  </Button>
                  <div
                    className="invisible absolute right-0 top-full z-50 mt-2 hidden w-52 origin-top-right scale-95 rounded-xl border border-border bg-card p-1 opacity-0 shadow-lg transition-all duration-200 ease-in-out group-hover:visible group-hover:scale-100 group-hover:opacity-100 lg:block"
                    role="menu"
                  >
                    <div className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
                      {user.email ?? user.phone}
                    </div>
                    <Link
                      href="/account"
                      className="block rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors duration-200 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      role="menuitem"
                    >
                      Tài khoản
                    </Link>
                    <Link
                      href="/orders"
                      className="block rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors duration-200 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      role="menuitem"
                    >
                      Đơn hàng
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-accent transition-colors duration-200 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        role="menuitem"
                      >
                        Quản trị
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-lg border-t border-border px-3 py-2.5 text-left text-sm text-foreground transition-colors duration-200 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      role="menuitem"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <Button variant="default" size="sm" className="hidden min-h-11 sm:inline-flex" asChild>
                  <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>Đăng nhập</Link>
                </Button>
              ))}
            {!loading && !user && (
              <Button variant="ghost" size="sm" className="min-h-11 px-2 sm:hidden" asChild>
                <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>Đăng nhập</Link>
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 md:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="Mở menu điều hướng"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div id="header-search" className="border-t border-border pb-4 pt-2 animate-fade-in">
            <form onSubmit={handleSearch}>
              <label htmlFor="header-search-input" className="sr-only">
                Tìm sản phẩm
              </label>
              <input
                id="header-search-input"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm áo, quần, giày, phụ kiện…"
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </form>
          </div>
        )}
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border p-6 text-left">
            <SheetTitle className="text-xl font-semibold tracking-tight">Menu</SheetTitle>
            <p className="text-sm text-muted-foreground">Danh mục & điều hướng</p>
          </SheetHeader>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4" aria-label="Menu di động">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-4 text-base font-medium text-foreground transition-colors duration-200 hover:bg-secondary active:bg-secondary/80"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-4 h-px bg-border" />
            {CATEGORIES.filter((c) => c.id !== 'ALL').map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                onClick={() => setDrawerOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-4 text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground"
              >
                {cat.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
