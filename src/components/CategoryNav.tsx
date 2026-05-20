'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/utils';
import { cn } from '@/lib/utils';

function CategoryNavInner() {
  const searchParams = useSearchParams();
  const active = searchParams.get('category') || 'ALL';

  return (
    <div className="border-b border-gray-200 bg-white sticky top-14 z-40">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center overflow-x-auto hide-scrollbar px-4 gap-0">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.id === 'ALL' ? '/products' : `/products?category=${cat.id}`}
              className={cn(
                'flex-shrink-0 px-4 py-3 text-xs font-bold tracking-widest whitespace-nowrap transition-colors',
                active === cat.id
                  ? 'border-b-[3px] border-black text-black'
                  : 'text-brand-gray hover:text-black border-b-[3px] border-transparent'
              )}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CategoryNav() {
  return (
    <Suspense fallback={<div className="h-12 border-b border-gray-200" />}>
      <CategoryNavInner />
    </Suspense>
  );
}
