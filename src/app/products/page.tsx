'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { api } from '@/lib/fetcher';
import type { Product } from '@/types';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ProductsContent() {
  const params = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const qs = params.toString();
    api<{ products: Product[]; total: number }>(`/api/products?${qs}&limit=60`)
      .then((d) => {
        setProducts(d.products);
        setTotal(d.total);
      })
      .finally(() => setLoading(false));
  }, [params]);

  const q = params.get('q');
  const category = params.get('category');
  const sort = params.get('sort') || 'newest';

  const sortLabels: Record<string, string> = {
    newest: 'Mới nhất',
    price_asc: 'Giá: Thấp → Cao',
    price_desc: 'Giá: Cao → Thấp',
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground tracking-[0.15em] uppercase mb-1">
            {category
              ? ['AO','QUAN','VAY','AO_KHOAC','GIAY','PHU_KIEN'].includes(category)
                ? ['Áo','Quần','Váy','Áo khoác','Giày','Phụ kiện'][['AO','QUAN','VAY','AO_KHOAC','GIAY','PHU_KIEN'].indexOf(category)]
                : category
              : 'Tất cả sản phẩm'}
          </p>
          <h1 className="text-3xl font-black tracking-tight">
            {q ? (
              <>Kết quả: <span className="text-accent">"{q}"</span></>
            ) : category === 'ALL' || !category ? (
              'SẢN PHẨM'
            ) : (
              'SẢN PHẨM'
            )}
          </h1>
          {!loading && (
            <p className="text-sm text-muted-foreground mt-1">{total} sản phẩm</p>
          )}
        </div>

        {/* Mobile filter button */}
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden rounded-xl gap-2"
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontal size={14} />
          Lọc
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar — desktop always visible, mobile via drawer */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-32">
            <FilterSidebar />
          </div>
        </aside>

        {/* Mobile filter drawer */}
        {filtersOpen && (
          <>
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
            <div className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-background shadow-dropdown animate-slide-down overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <p className="font-bold">Bộ lọc</p>
                <button onClick={() => setFiltersOpen(false)} className="p-1 hover:bg-secondary rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <div className="p-5">
                <FilterSidebar />
              </div>
              <div className="p-5 border-t border-border">
                <Button className="w-full rounded-xl" onClick={() => setFiltersOpen(false)}>
                  Áp dụng
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Product grid */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <p className="text-xs text-muted-foreground">
              {loading ? '…' : `${total} sản phẩm`}
            </p>
            <select
              value={sort}
              onChange={(e) => {
                const p = new URLSearchParams(params.toString());
                p.set('sort', e.target.value);
                window.location.href = `/products?${p.toString()}`;
              }}
              className="text-xs border border-border rounded-xl px-3 py-2 bg-background outline-none focus:ring-2 focus:ring-accent/30 cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá thấp → cao</option>
              <option value="price_desc">Giá cao → thấp</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="aspect-[3/4] rounded-2xl skeleton mb-3" />
                  <div className="h-3 w-12 rounded skeleton mb-2" />
                  <div className="h-4 w-full rounded skeleton mb-2" />
                  <div className="h-4 w-20 rounded skeleton" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
              <span className="text-5xl mb-4">🔍</span>
              <h3 className="text-lg font-bold mb-1">Không tìm thấy sản phẩm</h3>
              <p className="text-sm text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
              {products.map((p, i) => (
                <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      <CategoryNav />
      <Suspense fallback={
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] rounded-2xl skeleton mb-3" />
                <div className="h-3 w-12 rounded skeleton mb-2" />
                <div className="h-4 w-full rounded skeleton mb-2" />
                <div className="h-4 w-20 rounded skeleton" />
              </div>
            ))}
          </div>
        </div>
      }>
        <ProductsContent />
      </Suspense>
    </>
  );
}
