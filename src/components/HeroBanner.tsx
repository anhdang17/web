'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const heroContent = {
  image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  headline: 'COLLECTION',
  subheadline: 'Spring / Summer 2026',
  cta: {
    text: 'KHÁM PHÁ NGAY',
    href: '/products',
  },
};

export default function HeroBanner() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[900px] overflow-hidden bg-brand-light">
      {/* Full-bleed Image */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <Image
          src={heroContent.image}
          alt="Spring Summer 2026 Collection"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-16 md:pb-24">
        <div className="container max-w-[1400px] mx-auto px-4 md:px-8">
          <div className={`max-w-xl transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Eyebrow */}
            <p className="text-white/80 text-xs tracking-[0.3em] uppercase mb-4">
              {heroContent.subheadline}
            </p>

            {/* Headline */}
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              {heroContent.headline}
            </h1>

            {/* CTA */}
            <Link
              href={heroContent.cta.href}
              className="inline-flex items-center gap-3 bg-white text-brand-black px-8 py-4 text-xs font-medium tracking-widest uppercase hover:bg-brand-light transition-colors group"
            >
              {heroContent.cta.text}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2">
        <span className="text-white/60 text-[10px] tracking-widest uppercase rotate-90 origin-center translate-y-8">
          Scroll
        </span>
        <div className="w-px h-12 bg-white/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-[bounce_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
