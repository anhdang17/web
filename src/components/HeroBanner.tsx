'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1400&h=500&fit=crop',
    title: 'GRAPHIC TEES',
    subtitle: 'Bộ sưu tập UT mới — Unisex',
  },
  {
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1400&h=500&fit=crop',
    title: 'HOODIE COLLECTION',
    subtitle: 'Ấm áp — Phong cách tối giản',
  },
  {
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1400&h=500&fit=crop',
    title: 'SNEAKER DROP',
    subtitle: 'Giày unisex — Hàng mới về',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative w-full h-[280px] sm:h-[400px] bg-brand-light overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image src={slide.image} alt={slide.title} fill className="object-cover" priority={i === 0} />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-xs tracking-widest mb-1">{slide.subtitle}</p>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{slide.title}</h1>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
}
