'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { GENDERS } from '@/lib/utils';

export default function FilterSidebar() {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    if (value && value !== 'ALL') p.set(key, value);
    else p.delete(key);
    router.push(`/products?${p.toString()}`);
  };

  return (
    <aside className="w-full lg:w-56 flex-shrink-0">
      <h3 className="font-bold text-sm tracking-widest mb-4">BỘ LỌC</h3>

      <div className="mb-6">
        <p className="text-xs font-bold text-brand-gray mb-2 tracking-wide">GIỚI TÍNH</p>
        {GENDERS.map((g) => (
          <label key={g.id} className="flex items-center gap-2 py-1.5 text-sm cursor-pointer">
            <input
              type="radio"
              name="gender"
              checked={(params.get('gender') || 'ALL') === g.id}
              onChange={() => update('gender', g.id)}
              className="accent-black"
            />
            {g.label}
          </label>
        ))}
      </div>

      <div className="mb-6">
        <p className="text-xs font-bold text-brand-gray mb-2 tracking-wide">GIÁ (VND)</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Từ"
            defaultValue={params.get('minPrice') || ''}
            onBlur={(e) => update('minPrice', e.target.value)}
            className="w-full border px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="Đến"
            defaultValue={params.get('maxPrice') || ''}
            onBlur={(e) => update('maxPrice', e.target.value)}
            className="w-full border px-2 py-1.5 text-sm"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-brand-gray mb-2 tracking-wide">SẮP XẾP</p>
        <select
          value={params.get('sort') || 'newest'}
          onChange={(e) => update('sort', e.target.value)}
          className="w-full border px-2 py-2 text-sm"
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá thấp → cao</option>
          <option value="price_desc">Giá cao → thấp</option>
        </select>
      </div>
    </aside>
  );
}
