'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Minus, Plus, ChevronDown, ChevronUp, Truck, RotateCcw, Shield } from 'lucide-react';
import { api } from '@/lib/fetcher';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import type { Product, Review } from '@/types';
import ProductCard from '@/components/ProductCard';

interface Props {
  product: Product;
  reviews: Review[];
  relatedProducts?: Product[];
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductDetailClient({ product, reviews, relatedProducts = [] }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');
  const [allReviews, setAllReviews] = useState(reviews);
  const [activeImage, setActiveImage] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>('details');

  const price = product.salePrice ?? product.price;
  const hasSale = product.salePrice && product.salePrice < product.price;
  const hasDiscount = hasSale ? Math.round((1 - (product.salePrice! / product.price)) * 100) : 0;

  const addToCart = async () => {
    if (!user) {
      router.push(`/login?redirect=/products/${product.slug}`);
      return;
    }
    try {
      await api('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ productId: product.id, quantity: qty }),
      });
      setMsg('Đã thêm vào giỏ!');
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Lỗi');
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=/products/${product.slug}`);
      return;
    }
    try {
      const rating = (e.target as HTMLFormElement).rating ? parseInt((e.target as HTMLFormElement).rating.value) : 5;
      const comment = (e.target as HTMLFormElement).comment.value;
      await api('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({ productId: product.id, rating, comment }),
      });
      const data = await api<{ product: Product; reviews: Review[] }>(`/api/products/${product.slug}`);
      setAllReviews(data.reviews);
      setMsg('Cảm ơn đánh giá của bạn!');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Lỗi');
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container max-w-[1400px] mx-auto px-4 md:px-8 py-4 border-b border-border">
        <nav className="flex items-center gap-2 text-xs text-brand-gray">
          <Link href="/" className="hover:text-brand-black transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-black transition-colors">Sản phẩm</Link>
          <span>/</span>
          <span className="text-brand-black">{product.name}</span>
        </nav>
      </div>

      <div className="container max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-brand-light overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {hasSale && (
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-black text-white text-xs font-medium px-3 py-1.5">
                    -{hasDiscount}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            {/* Header */}
            <div>
              <p className="text-xs text-brand-gray tracking-wider uppercase mb-2">
                {product.gender} · {product.category}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{product.name}</h1>

              {/* Rating */}
              {product.avgRating ? (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.round(product.avgRating!) ? 'fill-brand-black text-brand-black' : 'text-brand-muted'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-brand-gray">
                    {product.avgRating.toFixed(1)} ({product.reviewCount} đánh giá)
                  </span>
                </div>
              ) : null}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold">{formatPrice(price)}</span>
                {hasSale && (
                  <span className="text-base text-brand-gray line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Kích thước</span>
                <button className="text-xs text-brand-gray underline hover:text-brand-black transition-colors">
                  Hướng dẫn chọn size
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-12 border text-xs font-medium tracking-wider transition-colors ${
                      selectedSize === size
                        ? 'bg-brand-black text-white border-brand-black'
                        : 'border-border hover:border-brand-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <span className="text-sm font-medium block mb-3">Số lượng</span>
              <div className="flex items-center border border-border w-fit">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-brand-light transition-colors"
                  aria-label="Decrease"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 h-12 flex items-center justify-center text-sm font-medium border-x border-border">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-brand-light transition-colors"
                  aria-label="Increase"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-3">
              <button
                onClick={addToCart}
                className="w-full bg-brand-black text-white py-4 text-xs font-medium tracking-widest uppercase hover:bg-brand-dark transition-colors"
              >
                THÊM VÀO GIỎ
              </button>
              <button
                onClick={addToCart}
                className="w-full border border-brand-black py-4 text-xs font-medium tracking-widest uppercase hover:bg-brand-black hover:text-white transition-colors"
              >
                MUA NGAY
              </button>
            </div>

            {msg && (
              <p className={`text-sm ${msg.includes('thành') ? 'text-green-600' : 'text-brand-red'}`}>
                {msg}
              </p>
            )}

            {/* Trust Signals */}
            <div className="space-y-3 py-6 border-t border-border">
              <div className="flex items-center gap-3 text-sm text-brand-gray">
                <Truck size={18} />
                <span>Miễn phí giao hàng cho đơn từ 500.000đ</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-brand-gray">
                <RotateCcw size={18} />
                <span>Đổi trả trong 7 ngày</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-brand-gray">
                <Shield size={18} />
                <span>Thanh toán an toàn, bảo mật</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-0 border-t border-border">
              {/* Details */}
              <div className="border-b border-border">
                <button
                  onClick={() => toggleSection('details')}
                  className="w-full flex items-center justify-between py-4 text-sm font-medium"
                >
                  <span>Chi tiết sản phẩm</span>
                  {expandedSection === 'details' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSection === 'details' && (
                  <div className="pb-4 text-sm text-brand-gray leading-relaxed">
                    {product.description}
                  </div>
                )}
              </div>

              {/* Shipping */}
              <div className="border-b border-border">
                <button
                  onClick={() => toggleSection('shipping')}
                  className="w-full flex items-center justify-between py-4 text-sm font-medium"
                >
                  <span>Vận chuyển & Đổi trả</span>
                  {expandedSection === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSection === 'shipping' && (
                  <div className="pb-4 text-sm text-brand-gray space-y-2">
                    <p>Giao hàng toàn quốc trong 2-5 ngày làm việc.</p>
                    <p>Đổi trả miễn phí trong 7 ngày nếu sản phẩm còn nguyên tag.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16 md:mt-24 pt-12 border-t border-border">
          <h2 className="text-xl font-bold mb-8">ĐÁNH GIÁ SẢN PHẨM</h2>
          {user && (
            <form onSubmit={submitReview} className="mb-8 p-6 bg-brand-light space-y-4 max-w-xl">
              <p className="text-sm font-medium">Viết đánh giá</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" className="text-xl text-brand-muted hover:text-brand-black transition-colors">
                    ★
                  </button>
                ))}
              </div>
              <textarea
                name="comment"
                placeholder="Chia sẻ trải nghiệm của bạn..."
                className="w-full p-4 border border-border text-sm h-32 resize-none focus:outline-none focus:border-brand-black transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-brand-black text-white px-6 py-3 text-xs font-medium tracking-widest uppercase hover:bg-brand-dark transition-colors"
              >
                GỬI ĐÁNH GIÁ
              </button>
            </form>
          )}
          <div className="space-y-6">
            {allReviews.map((r) => (
              <div key={r.id} className="pb-6 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">{r.user.name}</span>
                  <div className="flex">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-brand-black text-brand-black" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-brand-gray">{r.comment}</p>
              </div>
            ))}
            {allReviews.length === 0 && (
              <p className="text-brand-gray text-sm">Chưa có đánh giá nào.</p>
            )}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h2 className="text-xl font-bold mb-8">SẢN PHẨM LIÊN QUAN</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
