'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Star, ShoppingBag, Minus, Plus, ChevronLeft, Heart, Truck, RotateCcw, Shield } from 'lucide-react';
import { api } from '@/lib/fetcher';
import { formatPrice, cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import type { Product, Review } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    api<{ product: Product; reviews: Review[] }>(`/api/products/${slug}`)
      .then((d) => { setProduct(d.product); setReviews(d.reviews); })
      .finally(() => setLoading(false));
  }, [slug]);

  const addToCart = async () => {
    if (!user) { router.push(`/login?redirect=/products/${slug}`); return; }
    setAdding(true);
    try {
      await api('/api/cart', { method: 'POST', body: JSON.stringify({ productId: product!.id, quantity: qty }) });
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Lỗi');
    } finally {
      setAdding(false);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push(`/login?redirect=/products/${slug}`); return; }
    try {
      await api('/api/reviews', { method: 'POST', body: JSON.stringify({ productId: product!.id, rating, comment }) });
      const data = await api<{ product: Product; reviews: Review[] }>(`/api/products/${slug}`);
      setProduct(data.product);
      setReviews(data.reviews);
      setComment('');
      toast.success('Cảm ơn đánh giá của bạn!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Lỗi');
    }
  };

  if (loading) return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-[3/4] rounded-3xl skeleton" />
        <div className="space-y-4">
          <div className="h-3 w-24 rounded skeleton" />
          <div className="h-8 w-3/4 rounded skeleton" />
          <div className="h-6 w-32 rounded skeleton" />
          <div className="h-20 w-full rounded skeleton" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-[1400px] mx-auto px-4 py-24 text-center">
      <h2 className="text-xl font-bold mb-2">Không tìm thấy sản phẩm</h2>
      <Link href="/products" className="text-sm text-accent hover:underline">← Quay lại</Link>
    </div>
  );

  const price = product.salePrice ?? product.price;
  const hasSale = product.salePrice && product.salePrice < product.price;
  const discount = hasSale ? Math.round((1 - product.salePrice! / product.price) * 100) : 0;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground transition-colors">Sản phẩm</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-brand-cream rounded-3xl overflow-hidden shadow-card-hover group">
            {hasSale && (
              <span className="absolute top-4 left-4 z-10 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                -{discount}%
              </span>
            )}
            <button
              onClick={() => setWishlist(!wishlist)}
              className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
                wishlist ? 'bg-accent/90 text-white scale-110' : 'bg-white/70 text-muted-foreground hover:bg-white/90 hover:text-accent'
              }`}
            >
              <Heart size={16} className={wishlist ? 'fill-current' : ''} />
            </button>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col animate-fade-up">
          <div className="mb-1">
            <span className="text-[11px] font-bold tracking-[0.2em] text-accent uppercase">
              {product.gender === 'UNISEX' ? 'Unisex' : product.gender === 'NAM' ? 'Nam' : 'Nữ'}
            </span>
            {product.subcategory && (
              <span className="text-[11px] text-muted-foreground ml-2">/ {product.subcategory}</span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          {product.avgRating ? (
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={cn(i < Math.round(product.avgRating!) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200')} />
                ))}
              </div>
              <span className="text-sm font-medium">{product.avgRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount} đánh giá)</span>
            </div>
          ) : <div className="mb-4" />}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-black text-primary">{formatPrice(price)}</span>
            {hasSale && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-destructive'}`} />
            <span className="text-xs text-muted-foreground">
              {product.stock > 0 ? `Còn hàng (${product.stock} sản phẩm)` : 'Hết hàng'}
            </span>
          </div>

          {/* Quantity + Add to cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-secondary transition-colors active:scale-95"
                >
                  <Minus size={15} />
                </button>
                <span className="w-12 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-11 h-11 flex items-center justify-center hover:bg-secondary transition-colors active:scale-95"
                >
                  <Plus size={15} />
                </button>
              </div>
              <Button
                onClick={addToCart}
                disabled={adding}
                className="flex-1 h-12 rounded-xl font-bold text-sm tracking-wide gap-2"
              >
                <ShoppingBag size={16} />
                {adding ? 'ĐANG THÊM…' : 'THÊM VÀO GIỎ'}
              </Button>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { Icon: Truck, label: 'Giao hàng nhanh', sub: '2-5 ngày' },
              { Icon: RotateCcw, label: 'Đổi trả 7 ngày', sub: 'Không phí' },
              { Icon: Shield, label: 'Bảo hành', sub: 'Chính hãng' },
            ].map(({ Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 border border-border text-center">
                <Icon size={18} className="text-accent" />
                <p className="text-[10px] font-semibold">{label}</p>
                <p className="text-[9px] text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>

          {msg && <p className="text-sm text-accent mb-4">{msg}</p>}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="text-xl font-black mb-6">ĐÁNH GIÁ ({reviews.length})</h2>
        {user && (
          <form onSubmit={submitReview} className="mb-10 p-6 bg-card border border-border rounded-2xl shadow-card">
            <p className="text-sm font-bold mb-3">Viết đánh giá của bạn</p>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} className="transition-transform hover:scale-110 active:scale-95">
                  <Star size={22} className={cn(n <= rating ? 'fill-accent text-accent' : 'fill-gray-200 text-gray-200')} />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này…"
              className="w-full border border-border rounded-xl p-4 text-sm mb-4 bg-background outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all resize-none h-24"
              required
            />
            <Button type="submit" className="rounded-xl font-semibold">Gửi đánh giá</Button>
          </form>
        )}
        <div className="space-y-4">
          {reviews.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Chưa có đánh giá nào. Hãy là người đầu tiên!
            </div>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-border pb-5 animate-fade-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">
                  {r.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">{r.user.name}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={11} className="fill-accent text-accent" />
                    ))}
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground ml-auto">
                  {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
