import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-primary text-primary-foreground">
      <div className="container max-w-[1400px] py-12 md:py-16">
        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          <div className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10">
            <Truck className="h-8 w-8 shrink-0 text-accent" aria-hidden />
            <div>
              <p className="text-sm font-semibold">Giao hàng nhanh</p>
              <p className="mt-1 text-xs leading-relaxed text-white/70">Toàn quốc, theo dõi đơn trực tuyến</p>
            </div>
          </div>
          <div className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10">
            <ShieldCheck className="h-8 w-8 shrink-0 text-accent" aria-hidden />
            <div>
              <p className="text-sm font-semibold">Thanh toán an toàn</p>
              <p className="mt-1 text-xs leading-relaxed text-white/70">Bảo mật thông tin khách hàng</p>
            </div>
          </div>
          <div className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10">
            <RotateCcw className="h-8 w-8 shrink-0 text-accent" aria-hidden />
            <div>
              <p className="text-sm font-semibold">Đổi trả linh hoạt</p>
              <p className="mt-1 text-xs leading-relaxed text-white/70">Hỗ trợ trong vòng 7 ngày</p>
            </div>
          </div>
        </div>

        <div className="grid gap-10 text-sm md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo size={32} />
              <div className="flex items-baseline">
                <span className="text-lg font-black tracking-tight text-brand-red">UNI</span>
                <span className="text-lg font-black tracking-tight text-white">SEX</span>
              </div>
            </div>
            <p className="max-w-xs leading-relaxed text-white/70">
              Thời trang unisex tối giản — chất lượng, phong cách, giá minh bạch.
            </p>
          </div>
          <nav aria-labelledby="footer-nav-cat">
            <h2 id="footer-nav-cat" className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/90">
              Danh mục
            </h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products?category=AO"
                  className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm"
                >
                  Áo
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=QUAN"
                  className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm"
                >
                  Quần
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=PHU_KIEN"
                  className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm"
                >
                  Phụ kiện
                </Link>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/90">Hỗ trợ</h2>
            <ul className="space-y-3 text-white/70">
              <li>Hotline: 1900 xxxx</li>
              <li>
                <a
                  href="mailto:support@unisex.vn"
                  className="transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                >
                  support@unisex.vn
                </a>
              </li>
              <li>Giao hàng toàn quốc</li>
            </ul>
          </div>
          <nav aria-labelledby="footer-nav-account">
            <h2 id="footer-nav-account" className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/90">
              Tài khoản
            </h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/login"
                  className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm"
                >
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm"
                >
                  Đăng ký
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm"
                >
                  Giỏ hàng
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} UNISEX Fashion Store — Dự án sinh viên
      </div>
    </footer>
  );
}
