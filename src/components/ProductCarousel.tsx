'use client';

import { useRef } from 'react';
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
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth ?? 220;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -(cardWidth + 16) : (cardWidth + 16), behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <section className="py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-1">Bộ sưu tập</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-all duration-200 active:scale-95"
              aria-label="Cuộn trái"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-all duration-200 active:scale-95"
              aria-label="Cuộn phải"
            >
              <ChevronRight size={16} />
            </button>
            {viewAllHref && (
              <a
                href={viewAllHref}
                className="hidden sm:flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 transition-colors ml-2"
              >
                Xem tất cả <ChevronRight size={13} />
              </a>
            )}
          </div>
        </div>

        {/* Scroll container */}
        <div className="relative group/carousel">
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto hide-scrollbar pb-2 scroll-smooth snap-x snap-mandatory"
            style={{ scrollPadding: '0 1rem' }}
          >
            {products.map((p) => (
              <div key={p.id} className="flex-shrink-0 w-[165px] sm:w-[200px] lg:w-[220px] snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-6 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300" />
          <div className="absolute right-0 top-0 bottom-6 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300" />
        </div>

        {viewAllHref && (
          <div className="sm:hidden flex justify-center mt-4">
            <a
              href={viewAllHref}
              className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              Xem tất cả <ChevronRight size={13} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
