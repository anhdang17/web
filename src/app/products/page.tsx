'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';
import { api } from '@/lib/fetcher';
import type { Product } from '@/types';

const FilterSidebar = dynamic(() => import('@/components/FilterSidebar'), {
  loading: () => <div className="w-full lg:w-56 h-64 bg-brand-light animate-pulse rounded-lg" />,
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

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-black tracking-tight mb-1">
        {q ? `Kết quả: "${q}"` : category ? 'SẢN PHẨM' : 'TẤT CẢ SẢN PHẨM'}
      </h1>
      <p className="text-sm text-brand-gray mb-6">{total} sản phẩm</p>

      <div className="flex flex-col lg:flex-row gap-8">
        <Suspense fallback={<div className="w-full lg:w-56 h-64 bg-brand-light animate-pulse rounded-lg" />}>
          <FilterSidebar />
        </Suspense>
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-brand-light animate-pulse rounded-lg" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-brand-gray py-16">Không tìm thấy sản phẩm</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
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
