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
    <div className="bg-background border-b border-border sticky top-16 z-40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-3">
          {CATEGORIES.map((cat) => {
            const isActive = active === cat.id;
            return (
              <Link
                key={cat.id}
                href={cat.id === 'ALL' ? '/products' : `/products?category=${cat.id}`}
                className={cn(
                  'flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold tracking-wider transition-all duration-250 whitespace-nowrap',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CategoryNav() {
  return (
    <Suspense fallback={<div className="h-14 border-b border-border bg-background animate-pulse" />}>
      <CategoryNavInner />
    </Suspense>
  );
}
