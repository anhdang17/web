import Link from 'next/link';
import HeroBanner from '@/components/HeroBanner';
import ProductCarousel from '@/components/ProductCarousel';
import CategoryNav from '@/components/CategoryNav';
import { getHomePageData } from '@/lib/data';
import { CATEGORIES } from '@/lib/utils';

export const revalidate = 60;

export default async function HomePage() {
  const { featured, byCategory } = await getHomePageData();

  const catLabels: Record<string, string> = {
    AO: 'ÁO',
    QUAN: 'QUẦN',
    PHU_KIEN: 'PHỤ KIỆN',
    GIAY: 'GIÀY DÉP',
  };

  return (
    <>
      <CategoryNav />
      <HeroBanner />

      {/* Featured Products */}
      <ProductCarousel
        title="HÀNG MỚI VỀ"
        subtitle="New Arrivals"
        products={featured}
        viewAllHref="/products?featured=true"
      />

      {/* Editorial Banner */}
      <section className="py-16 md:py-24 bg-brand-light">
        <div className="container max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <p className="text-[10px] text-brand-gray tracking-[0.3em] uppercase">
                Bộ sưu tập
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                Phong cách tối giản cho mọi người
              </h2>
              <p className="text-brand-gray leading-relaxed">
                Khám phá bộ sưu tập mới với thiết kế tối giản, chất liệu cao cấp và phong cách unisex hiện đại.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-3 bg-brand-black text-white px-8 py-4 text-xs font-medium tracking-widest uppercase hover:bg-brand-dark transition-colors group"
              >
                KHÁM PHÁ
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <div className="relative aspect-[4/5] bg-brand-muted overflow-hidden">
              <img
                src="https://images.pexels.com/photos/7170727/pexels-photo-7170727.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop"
                alt="Spring Collection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24">
        <div className="container max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-[10px] text-brand-gray tracking-[0.3em] uppercase mb-2">
              Danh mục
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Duyệt theo danh mục</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.filter((c) => c.id !== 'ALL').map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group relative aspect-[3/4] bg-brand-light overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-lg md:text-xl font-bold tracking-wider uppercase">
                    {cat.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Products */}
      {Object.entries(byCategory).map(([cat, products]) => (
        <ProductCarousel
          key={cat}
          title={catLabels[cat] || cat}
          subtitle="Unisex"
          products={products}
          viewAllHref={`/products?category=${cat}`}
        />
      ))}

      {/* Newsletter */}
      <section className="py-16 md:py-24 bg-brand-black text-white">
        <div className="container max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Cập nhật xu hướng mới
            </h2>
            <p className="text-white/70 mb-8">
              Đăng ký nhận thông tin về sản phẩm mới và ưu đãi đặc biệt.
            </p>
            <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="bg-white text-brand-black px-6 py-3 text-xs font-medium tracking-widest uppercase hover:bg-brand-light transition-colors"
              >
                ĐĂNG KÝ
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
