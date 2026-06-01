'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}

export default function ProductCarousel({ title, subtitle, products, viewAllHref }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <section className="py-8 animate-fade-in">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h2>
            {subtitle && <p className="text-sm text-brand-gray mt-1">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className="text-sm text-blue-600 hover:underline whitespace-nowrap">
              XEM TẤT CẢ
            </Link>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 border p-1.5 rounded-full shadow hidden sm:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 scroll-smooth"
          >
            {products.map((p) => (
              <div key={p.id} className="flex-shrink-0 w-[160px] sm:w-[200px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 border p-1.5 rounded-full shadow hidden sm:flex"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex justify-center gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-black' : 'bg-gray-300'}`} aria-hidden />
          ))}
        </div>
      </div>
    </section>
  );
}
