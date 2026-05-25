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
    <div>
      <h3 className="font-bold text-sm mb-5">Bộ lọc</h3>

      {/* Gender */}
      <div className="mb-7">
        <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-3">Giới tính</p>
        <div className="space-y-1">
          {GENDERS.map((g) => (
            <label key={g.id} className="flex items-center gap-3 py-2 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                (params.get('gender') || 'ALL') === g.id
                  ? 'border-accent bg-accent'
                  : 'border-border group-hover:border-muted-foreground'
              }`}>
                {(params.get('gender') || 'ALL') === g.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {g.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mb-7">
        <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-3">Khoảng giá</p>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Từ"
            defaultValue={params.get('minPrice') || ''}
            onBlur={(e) => {
              if (e.target.value) update('minPrice', e.target.value);
            }}
            className="flex-1 border border-border rounded-lg px-3 py-2 text-xs bg-background outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent transition-all"
          />
          <span className="text-muted-foreground text-xs">—</span>
          <input
            type="number"
            placeholder="Đến"
            defaultValue={params.get('maxPrice') || ''}
            onBlur={(e) => {
              if (e.target.value) update('maxPrice', e.target.value);
            }}
            className="flex-1 border border-border rounded-lg px-3 py-2 text-xs bg-background outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent transition-all"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-3">Sắp xếp</p>
        <select
          value={params.get('sort') || 'newest'}
          onChange={(e) => update('sort', e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2.5 text-xs bg-background outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent transition-all cursor-pointer"
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá: Thấp → Cao</option>
          <option value="price_desc">Giá: Cao → Thấp</option>
        </select>
      </div>
    </div>
  );
}
