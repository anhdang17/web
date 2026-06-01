'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface Props {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const price = product.salePrice ?? product.price;
  const hasSale = product.salePrice && product.salePrice < product.price;
  const hasDiscount = hasSale ? Math.round((1 - (product.salePrice! / product.price)) * 100) : 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view modal - future enhancement
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-brand-light overflow-hidden mb-3">
        <Image
          src={imageError ? '/placeholder.jpg' : product.image}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 ease-out ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          onError={() => setImageError(true)}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasSale && (
            <span className="bg-brand-black text-white text-[10px] font-medium px-2 py-1 tracking-wider">
              -{hasDiscount}%
            </span>
          )}
          {!hasSale && product.featured && (
            <span className="bg-brand-black text-white text-[10px] font-medium px-2 py-1 tracking-wider">
              NEW
            </span>
          )}
        </div>

        {/* Action Buttons - Appear on hover */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleWishlist}
            className={`w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white ${
              isWishlisted ? 'text-brand-black' : 'text-brand-gray hover:text-brand-black'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
          </button>
          <button
            onClick={handleQuickView}
            className="w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm text-brand-gray hover:text-brand-black transition-all duration-200 hover:bg-white"
            aria-label="Quick view"
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Quick Add - Appear on hover */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 transition-transform duration-300 ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <button className="w-full bg-brand-black text-white py-3 text-xs font-medium tracking-widest hover:bg-brand-dark transition-colors">
            THÊM VÀO GIỎ
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        {/* Category */}
        <p className="text-[10px] text-brand-gray tracking-wider uppercase">
          {product.gender === 'UNISEX' ? 'Unisex' : product.gender} · {product.category}
        </p>

        {/* Name */}
        <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:underline">
          {product.name}
        </h3>

        {/* Rating */}
        {product.avgRating ? (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-[10px] ${i < Math.round(product.avgRating!) ? 'text-brand-black' : 'text-brand-muted'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-[10px] text-brand-gray">({product.reviewCount})</span>
          </div>
        ) : null}

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className={`text-sm font-medium ${hasSale ? 'text-brand-black' : 'text-brand-black'}`}>
            {formatPrice(price)}
          </span>
          {hasSale && (
            <span className="text-xs text-brand-gray line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
