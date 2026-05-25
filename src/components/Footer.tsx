import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#0F0F0F] text-white">
      {/* Newsletter / CTA band */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">UNISEX</h2>
            <p className="text-white/50 text-sm max-w-xs">
              Thời trang unisex tối giản — chất lượng, phong cách, giá minh bạch.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {[
              { Icon: Instagram, label: 'Instagram' },
              { Icon: Facebook, label: 'Facebook' },
              { Icon: Mail, label: 'Email' },
            ].map(({ Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white hover:text-[#0F0F0F] transition-all duration-200 active:scale-95"
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-2xl font-black tracking-tighter mb-4">UT</p>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Thời trang dành cho tất cả mọi người. Tối giản, hiện đại, không giới hạn.
            </p>
            <div className="space-y-3">
              {[
                { Icon: Truck, title: 'Giao hàng nhanh', desc: 'Toàn quốc 2-5 ngày' },
                { Icon: ShieldCheck, title: 'Thanh toán an toàn', desc: 'Bảo mật 100%' },
                { Icon: RotateCcw, title: 'Đổi trả 7 ngày', desc: 'Không phí' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={14} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{title}</p>
                    <p className="text-[11px] text-white/40">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danh mục */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-4">Danh mục</h3>
            <ul className="space-y-2.5">
              {['Áo', 'Quần', 'Váy', 'Áo khoác', 'Giày dép', 'Phụ kiện'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/products?category=${item === 'Áo' ? 'AO' : item === 'Quần' ? 'QUAN' : item === 'Váy' ? 'VAY' : item === 'Áo khoác' ? 'AO_KHOAC' : item === 'Giày dép' ? 'GIAY' : 'PHU_KIEN'}`}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-4">Hỗ trợ</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Chính sách giao hàng', href: '#' },
                { label: 'Chính sách đổi trả', href: '#' },
                { label: 'Hướng dẫn chọn size', href: '#' },
                { label: 'Liên hệ', href: 'mailto:support@unisex.vn' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tài khoản */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-4">Tài khoản</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Đăng nhập', href: '/login' },
                { label: 'Đăng ký', href: '/register' },
                { label: 'Giỏ hàng', href: '/cart' },
                { label: 'Đơn hàng', href: '/orders' },
                { label: 'Quản trị', href: '/admin' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/30">
          <p>© {new Date().getFullYear()} UNISEX Fashion Store — Dự án sinh viên</p>
          <p>Hotline: 1900 xxxx · support@unisex.vn</p>
        </div>
      </div>
    </footer>
  );
}
