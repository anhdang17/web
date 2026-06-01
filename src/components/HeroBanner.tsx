'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const slides = [
  {
    image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1400&h=500&fit=crop',
    title: 'GRAPHIC TEES',
    subtitle: 'Bộ sưu tập UT mới — Unisex',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBRIhMQZBURRh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAZEQADAQEBAAAAAAAAAAAAAAAAAQIDBBH/2gAMAwEAAhEDEEA/AKOnOoLLS9J02S6tlZ5oEd2dAwJCgnAPYVK9N67o1tpNrDcahBFPHbxpJGzAFWUAqf4aKNOg',
  },
  {
    image: 'https://images.pexels.com/photos/7170727/pexels-photo-7170727.jpeg?auto=compress&cs=tinysrgb&w=1400&h=500&fit=crop',
    title: 'HOODIE COLLECTION',
    subtitle: 'Ấm áp — Phong cách tối giản',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAYH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBRIhMQZBURRh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAZEQADAQEBAAAAAAAAAAAAAAAAAQIDBBH/2gAMAwEAAhEDEQA/AKOmOoLLSdN02S6tlZ5oEd2dAwJCgnAPYVK9N6',
  },
  {
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1400&h=500&fit=crop',
    title: 'SNEAKER DROP',
    subtitle: 'Giày unisex — Hàng mới về',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAYH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBRIhMQZBURRh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAZEQADAQEBAAAAAAAAAAAAAAAAAQIDBBH/2gAMAwEAAhEDEQA/AKOmOoLLSdN02S6tlZ5oEd2dAwJCgnAPYVK9N6',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="relative w-full h-[280px] sm:h-[400px] bg-brand-light overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={slide.blurDataURL}
          />
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
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
