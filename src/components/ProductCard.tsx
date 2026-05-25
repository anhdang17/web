'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';
import { useState } from 'react';
import { api } from '@/lib/fetcher';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProductCard({ product }: { product: Product }) {
  const price = product.salePrice ?? product.price;
  const hasSale = product.salePrice && product.salePrice < product.price;
  const discount = hasSale ? Math.round((1 - (product.salePrice!) / product.price) * 100) : 0;
  const [imgLoaded, setImgLoaded] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(`/login?redirect=/products/${product.slug}`);
      return;
    }
    try {
      await api('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      toast.success('Đã thêm vào giỏ hàng!');
    } catch {
      toast.error('Thêm thất bại');
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block w-full animate-fade-up"
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] bg-brand-cream overflow-hidden rounded-2xl mb-3 shadow-card group-hover:shadow-card-hover transition-all duration-300">
        {/* Skeleton loader */}
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton rounded-2xl" />
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-500 group-hover:scale-110 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onLoad={() => setImgLoaded(true)}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasSale && (
            <span className="bg-accent text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
              -{discount}%
            </span>
          )}
          {product.featured && !hasSale && (
            <span className="bg-primary text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
              NỔI BẬT
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlist(!wishlist); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            wishlist
              ? 'bg-accent/90 text-white scale-110'
              : 'bg-white/70 text-muted-foreground hover:bg-white/90 hover:text-accent'
          }`}
          aria-label="Yêu thích"
        >
          <Heart size={14} className={wishlist ? 'fill-current' : ''} />
        </button>

        {/* Quick-add overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickAdd}
            className="w-full py-3 flex items-center justify-center gap-2 text-white text-sm font-semibold hover:bg-white/10 active:scale-95 transition-all duration-200"
          >
            <ShoppingBag size={15} />
            Thêm vào giỏ
          </button>
        </div>

        {/* Sale price tag */}
        {hasSale && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
            <span className="text-[11px] font-bold text-accent line-through block">{formatPrice(product.price)}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1 px-0.5">
        <p className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
          {product.gender === 'UNISEX' ? 'UNISEX' : product.gender === 'NAM' ? 'NAM' : 'NỮ'}
        </p>
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        {product.avgRating ? (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={i < Math.round(product.avgRating!) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
                />
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {product.avgRating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        ) : (
          <div className="h-3 w-16 rounded bg-muted animate-pulse" />
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-base font-bold text-primary">{formatPrice(price)}</span>
        </div>
      </div>
    </Link>
  );
}
