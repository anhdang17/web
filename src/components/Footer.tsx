import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white mt-16">
      <div className="max-w-[1400px] mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <p className="text-brand-red font-black text-2xl mb-3">UT</p>
          <p className="text-gray-400">Thời trang unisex tối giản — chất lượng, phong cách, giá hợp lý.</p>
        </div>
        <div>
          <h4 className="font-bold mb-3 tracking-wide">DANH MỤC</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/products?category=AO" className="hover:text-white">Áo</Link></li>
            <li><Link href="/products?category=QUAN" className="hover:text-white">Quần</Link></li>
            <li><Link href="/products?category=PHU_KIEN" className="hover:text-white">Phụ kiện</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 tracking-wide">HỖ TRỢ</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Hotline: 1900 xxxx</li>
            <li>Email: support@unisex.vn</li>
            <li>Giao hàng toàn quốc</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 tracking-wide">TÀI KHOẢN</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/login" className="hover:text-white">Đăng nhập</Link></li>
            <li><Link href="/register" className="hover:text-white">Đăng ký</Link></li>
            <li><Link href="/cart" className="hover:text-white">Giỏ hàng</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center text-xs text-gray-500 py-4">
        © 2024 UNISEX Fashion Store — Dự án sinh viên
      </div>
    </footer>
  );
}
