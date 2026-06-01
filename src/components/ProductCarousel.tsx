'use client';

import Link from 'next/link';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}

export default function ProductCarousel({ title, subtitle, products, viewAllHref }: Props) {
  if (!products.length) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10 md:mb-16">
          <div>
            <p className="text-[10px] text-brand-gray tracking-[0.3em] uppercase mb-2">
              {subtitle}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden md:flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-brand-gray hover:text-brand-black transition-colors group"
            >
              <span>Xem tất cả</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          )}
        </div>

        {/* Product Grid - Editorial Fashion Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>

        {/* Mobile View All */}
        {viewAllHref && (
          <div className="mt-8 md:hidden">
            <Link
              href={viewAllHref}
              className="block w-full py-4 text-center text-xs font-medium tracking-widest uppercase border border-brand-border hover:bg-brand-black hover:text-white transition-colors"
            >
              XEM TẤT CẢ
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
