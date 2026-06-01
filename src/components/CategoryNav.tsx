'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/utils';

function CategoryNavInner() {
  const searchParams = useSearchParams();
  const active = searchParams.get('category') || 'ALL';

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container max-w-[1400px] mx-auto">
        <nav className="flex items-center overflow-x-auto hide-scrollbar" aria-label="Product categories">
          {CATEGORIES.map((cat) => {
            const isActive = active === cat.id;
            return (
              <Link
                key={cat.id}
                href={cat.id === 'ALL' ? '/products' : `/products?category=${cat.id}`}
                className={`relative flex-shrink-0 px-6 py-4 text-[11px] font-medium tracking-widest uppercase transition-colors duration-200 ${
                  isActive
                    ? 'text-brand-black'
                    : 'text-brand-gray hover:text-brand-black'
                }`}
              >
                {cat.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-black" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function CategoryNav() {
  return (
    <Suspense fallback={<div className="h-12 border-b border-border" />}>
      <CategoryNavInner />
    </Suspense>
  );
}
