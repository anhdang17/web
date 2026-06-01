'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

export default function FilterSidebar() {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    if (value && value !== 'ALL') p.set(key, value);
    else p.delete(key);
    p.delete('page');
    router.push(`/products?${p.toString()}`);
  };

  const clearAll = () => {
    router.push('/products');
  };

  const hasFilters = params.toString().length > 0;

  const activeFilters = Array.from(params.entries()).filter(([key]) =>
    ['gender', 'category', 'minPrice', 'maxPrice', 'sort', 'q'].includes(key)
  );

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium tracking-wider">BỘ LỌC</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-brand-gray hover:text-brand-black transition-colors"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 px-3 py-1 bg-brand-light text-xs"
            >
              {value}
              <button
                onClick={() => update(key, '')}
                className="hover:text-brand-red transition-colors"
                aria-label={`Remove ${key} filter`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Gender */}
      <div className="mb-8">
        <h4 className="text-xs font-medium text-brand-gray tracking-wider uppercase mb-3">Giới tính</h4>
        <div className="space-y-2">
          {['ALL', 'UNISEX', 'NAM', 'NU'].map((g) => (
            <label key={g} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="gender"
                checked={(params.get('gender') || 'ALL') === g}
                onChange={() => update('gender', g)}
                className="w-4 h-4 border-brand-border accent-brand-black"
              />
              <span className={`text-sm transition-colors ${
                (params.get('gender') || 'ALL') === g
                  ? 'font-medium'
                  : 'text-brand-gray group-hover:text-brand-black'
              }`}>
                {g === 'ALL' ? 'Tất cả' : g === 'UNISEX' ? 'Unisex' : g === 'NAM' ? 'Nam' : 'Nữ'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mb-8">
        <h4 className="text-xs font-medium text-brand-gray tracking-wider uppercase mb-3">Khoảng giá</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Từ"
            defaultValue={params.get('minPrice') || ''}
            onBlur={(e) => update('minPrice', e.target.value)}
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-brand-black transition-colors"
          />
          <span className="text-brand-gray">—</span>
          <input
            type="number"
            placeholder="Đến"
            defaultValue={params.get('maxPrice') || ''}
            onBlur={(e) => update('maxPrice', e.target.value)}
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-brand-black transition-colors"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 className="text-xs font-medium text-brand-gray tracking-wider uppercase mb-3">Sắp xếp</h4>
        <select
          value={params.get('sort') || 'newest'}
          onChange={(e) => update('sort', e.target.value)}
          className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-brand-black transition-colors bg-white"
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá: Thấp đến cao</option>
          <option value="price_desc">Giá: Cao đến thấp</option>
        </select>
      </div>
    </aside>
  );
}
