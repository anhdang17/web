'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  const price = product.salePrice ?? product.price;
  const hasSale = product.salePrice && product.salePrice < product.price;

  return (
    <Link href={`/products/${product.slug}`} className="group block w-full">
      <div className="relative aspect-square bg-brand-light overflow-hidden mb-2">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="200px"
        />
        {hasSale && (
          <span className="absolute top-2 left-2 bg-brand-red text-white text-[10px] font-bold px-1.5 py-0.5">
            SALE
          </span>
        )}
      </div>
      <p className="text-xs text-brand-gray mb-0.5">{product.gender === 'UNISEX' ? 'Unisex' : product.gender}</p>
      <h3 className="text-sm leading-tight line-clamp-2 mb-1 group-hover:underline">{product.name}</h3>
      <div className="flex items-center gap-1 mb-1">
        {product.avgRating ? (
          <>
            <Star size={10} className="fill-black text-black" />
            <span className="text-xs">{product.avgRating.toFixed(1)}</span>
            <span className="text-xs text-brand-gray">({product.reviewCount})</span>
          </>
        ) : null}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-bold">{formatPrice(price)}</span>
        {hasSale && (
          <span className="text-xs text-brand-gray line-through">{formatPrice(product.price)}</span>
        )}
      </div>
    </Link>
  );
}
