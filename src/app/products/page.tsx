'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';
import { api } from '@/lib/fetcher';
import type { Product } from '@/types';

const FilterSidebar = dynamic(() => import('@/components/FilterSidebar'), {
  loading: () => <div className="w-full lg:w-64 h-96 bg-brand-light animate-pulse" />,
  ssr: false,
});

function ProductsContent() {
  const params = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const qs = params.toString();
    api<{ products: Product[]; total: number }>(`/api/products?${qs}&limit=50`)
      .then((d) => {
        setProducts(d.products);
        setTotal(d.total);
      })
      .finally(() => setLoading(false));
  }, [params]);

  const q = params.get('q');
  const category = params.get('category');

  const categoryLabels: Record<string, string> = {
    AO: 'Áo',
    QUAN: 'Quần',
    VAY: 'Váy',
    AO_KHOAC: 'Áo khoác',
    GIAY: 'Giày',
    PHU_KIEN: 'Phụ kiện',
  };

  return (
    <div className="container max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          {q ? `Tìm kiếm: "${q}"` : category ? categoryLabels[category] || category : 'Tất cả sản phẩm'}
        </h1>
        <p className="text-sm text-brand-gray">{total} sản phẩm</p>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar */}
        <div className="lg:w-64 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Suspense fallback={<div className="w-full h-96 bg-brand-light animate-pulse" />}>
              <FilterSidebar />
            </Suspense>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-brand-light mb-3" />
                  <div className="h-3 bg-brand-light mb-2 w-1/2" />
                  <div className="h-4 bg-brand-light mb-2 w-3/4" />
                  <div className="h-3 bg-brand-light w-1/4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-medium mb-2">Không tìm thấy sản phẩm</p>
              <p className="text-sm text-brand-gray mb-6">Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác</p>
              <a
                href="/products"
                className="text-xs font-medium tracking-widest uppercase hover:underline"
              >
                Xóa bộ lọc
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 6} />
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
      <Suspense fallback={<div className="p-8 text-center">Đang tải...</div>}>
        <ProductsContent />
      </Suspense>
    </>
  );
}
