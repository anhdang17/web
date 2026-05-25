'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const slides = [
  {
    image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop',
    title: 'GRAPHIC TEES',
    subtitle: 'Bộ sưu tập UT mới — Unisex',
    cta: 'Mua ngay',
    ctaHref: '/products?category=AO',
  },
  {
    image: 'https://images.pexels.com/photos/7170727/pexels-photo-7170727.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop',
    title: 'HOODIE SEASON',
    subtitle: 'Ấm áp — Phong cách tối giản',
    cta: 'Khám phá',
    ctaHref: '/products?category=AO_KHOAC',
  },
  {
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop',
    title: 'SNEAKER DROP',
    subtitle: 'Giày unisex — Hàng mới về',
    cta: 'Xem ngay',
    ctaHref: '/products?category=GIAY',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next]);

  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      style={{ height: 'clamp(320px, 45vw, 520px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-10" />
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6">
              <div className="max-w-xl animate-fade-up" style={{ animationDelay: `${i === current ? '200' : '0'}ms` }}>
                <p className="text-white/70 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
                  {slide.subtitle}
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
                  {slide.title}
                </h1>
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full text-sm font-bold hover:bg-accent hover:text-white transition-all duration-300 active:scale-95"
                >
                  {slide.cta}
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-[3px] bg-white/10">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-full bg-white/80 transition-all duration-100"
            style={{
              width: i === current ? '100%' : '0%',
              transformOrigin: 'left',
              animation: i === current ? `progressFill 5s linear forwards` : 'none',
              animationDelay: `${i === current ? '0s' : '0s'}`,
            }}
          />
        ))}
      </div>

      {/* Dot nav */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Prev/Next */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 opacity-0 hover:opacity-100 focus:opacity-100"
        aria-label="Trước"
      >
        <ChevronRight size={18} className="rotate-180" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 opacity-0 hover:opacity-100 focus:opacity-100"
        aria-label="Sau"
      >
        <ChevronRight size={18} />
      </button>
    </section>
  );
}
