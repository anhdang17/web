import Link from 'next/link';
import Logo from '@/components/Logo';

const footerLinks = {
  shop: [
    { label: 'Áo', href: '/products?category=AO' },
    { label: 'Quần', href: '/products?category=QUAN' },
    { label: 'Áo khoác', href: '/products?category=AO_KHOAC' },
    { label: 'Giày', href: '/products?category=GIAY' },
    { label: 'Phụ kiện', href: '/products?category=PHU_KIEN' },
  ],
  help: [
    { label: 'Hướng dẫn chọn size', href: '#' },
    { label: 'Vận chuyển & Giao hàng', href: '#' },
    { label: 'Đổi trả & Hoàn tiền', href: '#' },
    { label: 'Thanh toán', href: '#' },
    { label: 'Liên hệ', href: '#' },
  ],
  company: [
    { label: 'Về chúng tôi', href: '#' },
    { label: 'Tuyển dụng', href: '#' },
    { label: 'Bền vững', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white">
      {/* Main Footer */}
      <div className="container max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <div className="flex items-center gap-2 mb-6">
              <Logo size={32} />
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Thời trang tối giản cho mọi người. Chất lượng cao, thiết kế hiện đại, giá cả hợp lý.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-medium tracking-widest uppercase mb-6">Cửa hàng</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs font-medium tracking-widest uppercase mb-6">Hỗ trợ</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-medium tracking-widest uppercase mb-6">Công ty</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-medium tracking-widest uppercase mb-6">Bản tin</h3>
            <p className="text-sm text-white/60 mb-4">
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="bg-white text-brand-black px-6 py-3 text-xs font-medium tracking-widest uppercase hover:bg-brand-light transition-colors"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container max-w-[1400px] mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} UNISEX. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-xs text-white/40 hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="#" className="text-xs text-white/40 hover:text-white transition-colors">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
