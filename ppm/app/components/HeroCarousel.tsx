"use client";

import { useEffect, useState } from "react";

export default function HeroCarousel() {

  const slides: string[] = [
    "/images/house1.png",
    "/images/house2.png",
    "/images/house3.png",
    "/images/house4.png",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const changeSlide = (nextIndex: number) => {
    setIsFading(true);

    setTimeout(() => {
      setCurrentSlide(nextIndex);
      setIsFading(false);
    }, 250);
  };

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    changeSlide(nextIndex);
  };

  const prevSlide = () => {
    const nextIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    changeSlide(nextIndex);
  };

  const goToSlide = (index: number) => {
    if (index !== currentSlide) {
      changeSlide(index);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentSlide + 1) % slides.length;
      changeSlide(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <section className="overflow-hidden rounded-sm border border-[#d8cdc0] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
      <div className="relative h-[420px] overflow-hidden bg-[#d9d1c6]">
        <img
          src={slides[currentSlide]}
          alt={`Property banner ${currentSlide + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/10" />

        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/10 text-lg text-white backdrop-blur transition hover:bg-white/20"
          aria-label="Previous slide"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/10 text-lg text-white backdrop-blur transition hover:bg-white/20"
          aria-label="Next slide"
        >
          ›
        </button>

        <div className="absolute left-8 top-1/2 z-10 max-w-xl -translate-y-1/2 text-white md:left-12">
          <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-white/80">
            Premium Property Marketing
          </p>
          <h1 className="text-3xl font-light leading-tight md:text-5xl">
            Elevating projects with strategy, presentation, and reach
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/85 md:text-base">
            Delivering premium property outcomes through refined marketing,
            buyer engagement, and end-to-end project support.
          </p>
        </div>

        <a
          href="#"
          className="absolute bottom-8 right-8 z-10 inline-flex items-center gap-3 rounded-sm border border-white bg-white px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#1f1a17] shadow-lg transition hover:bg-[#f3ede4]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 stroke-[#2f2a24]"
            fill="none"
            strokeWidth="1.8"
          >
            <path d="M21 15a3 3 0 0 1-3 3H9l-4 3v-3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3v9Z" />
            <path d="M8 8h8v6H8z" />
          </svg>
          <span>Find Your Property</span>
        </a>
      </div>

      <div className="flex justify-center gap-3 border-t border-[#e7ddd0] bg-[#fcfaf7] py-5">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              currentSlide === index ? "bg-[#1f1a17]" : "bg-[#c2b7aa]"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}