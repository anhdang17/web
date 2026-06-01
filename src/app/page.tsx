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

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.filter((c) => c.id !== 'ALL').map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="px-5 py-2.5 border-2 border-black text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      <ProductCarousel
        title="HÀNG MỚI VỀ"
        subtitle="Unisex — Bộ sưu tập nổi bật"
        products={featured}
        viewAllHref="/products?featured=true"
      />

      {Object.entries(byCategory).map(([cat, products]) => (
        <ProductCarousel
          key={cat}
          title={catLabels[cat] || cat}
          subtitle="Unisex"
          products={products}
          viewAllHref={`/products?category=${cat}`}
        />
      ))}
    </>
  );
}
