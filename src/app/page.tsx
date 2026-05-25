'use client';

import { useEffect, useState } from 'react';
import HeroBanner from '@/components/HeroBanner';
import ProductCarousel from '@/components/ProductCarousel';
import CategoryNav from '@/components/CategoryNav';
import Link from 'next/link';
import { api } from '@/lib/fetcher';
import type { Product } from '@/types';
import { CATEGORIES } from '@/lib/utils';

const CATEGORY_ICONS: Record<string, string> = {
  AO: '👕', QUAN: '👖', VAY: '👗', AO_KHOAC: '🧥', GIAY: '👟', PHU_KIEN: '👜',
};

const CATEGORY_COLORS: Record<string, string> = {
  AO: 'bg-red-50 text-red-600', QUAN: 'bg-blue-50 text-blue-600',
  VAY: 'bg-pink-50 text-pink-600', AO_KHOAC: 'bg-amber-50 text-amber-600',
  GIAY: 'bg-green-50 text-green-600', PHU_KIEN: 'bg-purple-50 text-purple-600',
};

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [byCategory, setByCategory] = useState<Record<string, Product[]>>({});

  useEffect(() => {
    api<{ products: Product[] }>('/api/products?featured=true&limit=12').then((d) =>
      setFeatured(d.products)
    );
    const cats = ['AO', 'QUAN', 'PHU_KIEN', 'GIAY'];
    cats.forEach((cat) => {
      api<{ products: Product[] }>(`/api/products?category=${cat}&limit=8`).then((d) =>
        setByCategory((prev) => ({ ...prev, [cat]: d.products }))
      );
    });
  }, []);

  const catLabels: Record<string, string> = {
    AO: 'ÁO', QUAN: 'QUẦN', PHU_KIEN: 'PHỤ KIỆN', GIAY: 'GIÀY DÉP',
  };

  return (
    <>
      <CategoryNav />
      <HeroBanner />

      {/* Category pills */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {CATEGORIES.filter((c) => c.id !== 'ALL').map((cat, i) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="animate-fade-up group flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover hover:border-accent/30 transition-all duration-300"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-2xl">{CATEGORY_ICONS[cat.id]}</span>
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground group-hover:text-accent transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured products */}
      {featured.length > 0 && (
        <ProductCarousel
          title="HÀNG MỚI VỀ"
          subtitle="Unisex — Bộ sưu tập nổi bật"
          products={featured}
          viewAllHref="/products?featured=true"
        />
      )}

      {/* Category sections */}
      {Object.entries(byCategory).map(([cat, products]) => (
        <ProductCarousel
          key={cat}
          title={catLabels[cat] || cat}
          subtitle="Khám phá bộ sưu tập"
          products={products}
          viewAllHref={`/products?category=${cat}`}
        />
      ))}

      {/* Promo banner */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <Link
          href="/products?featured=true"
          className="group relative flex items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F0F0F] to-[#1a1a1a] px-8 py-10 sm:px-14 sm:py-14 shadow-xl hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="relative z-10">
            <p className="text-white/40 text-xs font-semibold tracking-[0.25em] uppercase mb-2">Bộ sưu tập</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none mb-3">
              SALE<br />UP TO 30%
            </h2>
            <p className="text-white/60 text-sm mb-6 max-w-xs">
              Chương trình khuyến mãi đặc biệt dành cho các sản phẩm nổi bật
            </p>
            <span className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-full text-sm font-bold hover:bg-accent hover:text-white transition-colors duration-300">
              Mua ngay
            </span>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center opacity-20">
            <span className="text-[160px]">🛍️</span>
          </div>
        </Link>
      </div>

      {/* Brand strip */}
      <div className="border-y border-border bg-secondary/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 flex items-center justify-center gap-8 sm:gap-16 overflow-x-auto hide-scrollbar">
          {['UNISEX', 'MINIMAL', 'ESSENTIAL', 'PREMIUM', 'BASIC'].map((brand) => (
            <span key={brand} className="text-sm font-black tracking-[0.3em] text-muted-foreground/40 whitespace-nowrap hover:text-foreground transition-colors cursor-default">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
