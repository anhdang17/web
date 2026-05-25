'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Star, ShoppingBag, Minus, Plus } from 'lucide-react';
import { api } from '@/lib/fetcher';
import { formatPrice, cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import type { Product, Review } from '@/types';

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

  useEffect(() => {
    api<{ product: Product; reviews: Review[] }>(`/api/products/${slug}`)
      .then((d) => {
        setProduct(d.product);
        setReviews(d.reviews);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const addToCart = async () => {
    if (!user) {
      router.push(`/login?redirect=/products/${slug}`);
      return;
    }
    try {
      await api('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ productId: product!.id, quantity: qty }),
      });
      setMsg('Đã thêm vào giỏ hàng!');
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Lỗi');
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=/products/${slug}`);
      return;
    }
    try {
      await api('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({ productId: product!.id, rating, comment }),
      });
      const data = await api<{ product: Product; reviews: Review[] }>(`/api/products/${slug}`);
      setProduct(data.product);
      setReviews(data.reviews);
      setComment('');
      setMsg('Cảm ơn đánh giá của bạn!');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Lỗi');
    }
  };

  if (loading) return <div className="p-16 text-center">Đang tải...</div>;
  if (!product) return <div className="p-16 text-center">Không tìm thấy sản phẩm</div>;

  const price = product.salePrice ?? product.price;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative aspect-square bg-brand-light">
          <Image src={product.image} alt={product.name} fill className="object-cover" priority />
        </div>
        <div>
          <p className="text-xs text-brand-gray tracking-widest mb-1">{product.gender} · {product.subcategory}</p>
          <h1 className="text-2xl font-black mb-3">{product.name}</h1>
          {product.avgRating ? (
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={cn(i < Math.round(product.avgRating!) ? 'fill-black text-black' : 'text-gray-300')}
                />
              ))}
              <span className="text-sm ml-1">{product.avgRating.toFixed(1)} ({product.reviewCount} đánh giá)</span>
            </div>
          ) : null}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-bold">{formatPrice(price)}</span>
            {product.salePrice && (
              <span className="text-brand-gray line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          <p className="text-sm text-brand-gray leading-relaxed mb-6">{product.description}</p>
          <p className="text-xs mb-4">Còn {product.stock} sản phẩm</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2"><Minus size={16} /></button>
              <span className="px-4 text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-2"><Plus size={16} /></button>
            </div>
            <button
              onClick={addToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 text-sm font-bold tracking-widest hover:bg-brand-red transition-colors"
            >
              <ShoppingBag size={18} />
              THÊM VÀO GIỎ
            </button>
          </div>
          {msg && <p className="text-sm text-brand-red mb-4">{msg}</p>}
        </div>
      </div>

      <section className="mt-16 border-t pt-10">
        <h2 className="text-xl font-black mb-6">ĐÁNH GIÁ ({reviews.length})</h2>
        {user && (
          <form onSubmit={submitReview} className="mb-8 p-4 bg-brand-light">
            <p className="text-sm font-bold mb-2">Viết đánh giá</p>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)}>
                  <Star size={20} className={cn(n <= rating ? 'fill-black text-black' : 'text-gray-300')} />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn..."
              className="w-full border p-3 text-sm mb-3 h-24"
              required
            />
            <button type="submit" className="bg-black text-white px-6 py-2 text-sm font-bold">
              GỬI ĐÁNH GIÁ
            </button>
          </form>
        )}
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border-b pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{r.user.name}</span>
                <div className="flex">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={12} className="fill-black text-black" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-brand-gray">{r.comment}</p>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-brand-gray text-sm">Chưa có đánh giá</p>}
        </div>
      </section>
    </div>
  );
}
