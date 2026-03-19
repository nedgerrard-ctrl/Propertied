"use client";

import { useEffect, useState } from "react";
import HeroCarousel from "./components/HeroCarousel";

export default function Home() {

  const bannerImages = [
    "/images/house1.png",
    "/images/house2.png",
    "/images/house3.png",
    "/images/house4.png",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? bannerImages.length - 1 : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  }, 5000);

  return () => clearInterval(interval);
  }, [currentSlide, bannerImages.length]);

  const stats = [
    {
      value: "10+ Years",
      label: "Industry Experience",
      icon: (
        <svg viewBox="0 0 64 64" className="h-16 w-16 fill-[#2f2a24]">
          <path d="M14 28.5 27 18l13 10.5V50a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V28.5Zm8 17.5h10V34H22v12Zm22-25h10a4 4 0 0 1 4 4v25a2 2 0 0 1-2 2H44V21Zm6 8h4v4h-4v-4Zm0 8h4v4h-4v-4Zm0 8h4v4h-4v-4Z" />
        </svg>
      ),
    },
    {
      value: "$1.5B+",
      label: "Project Delivered",
      icon: (
        <svg viewBox="0 0 64 64" className="h-16 w-16 fill-[#2f2a24]">
          <rect x="8" y="26" width="10" height="28" rx="3" />
          <rect x="27" y="14" width="10" height="40" rx="3" />
          <rect x="46" y="20" width="10" height="34" rx="3" />
        </svg>
      ),
    },
    {
      value: "End-to-end",
      label: "Source, Buy, Manage & Resell",
      icon: (
        <svg viewBox="0 0 64 64" className="h-16 w-16 fill-[#2f2a24]">
          <path d="M18 12h16v8l12-12-12-12v8H14a6 6 0 0 0-6 6v18h10V18a6 6 0 0 1 6-6Zm28 34H30v-8L18 50l12 12v-8h20a6 6 0 0 0 6-6V30H46v10a6 6 0 0 1-6 6Zm10-24h-8v-8l-12 12 12 12v-8h10V18a6 6 0 0 0-6-6H34v10h12a6 6 0 0 1 6 6v-6ZM8 42h8v8l12-12-12-12v8H6v12a6 6 0 0 0 6 6h18V42H14a6 6 0 0 1-6-6v6Z" />
        </svg>
      ),
    },
  ];

  const cards = [
    { title: "About Us", subtitle: "View Company Details", image: "/images/house1.png", href: "/about" },
    { title: "Portfolio Services", subtitle: "View More", image: "/images/house2.png", href: "#" },
    { title: "Blog & Insights", subtitle: "Read Articles", image: "/images/house1.png", href: "#" },
    { title: "For Developers", subtitle: "Discover Partnerships", image: "/images/house2.png", href: "#" },
    { title: "For Buyers", subtitle: "Explore Buyer Options", image: "/images/house1.png", href: "#" },
    { title: "Testimonials", subtitle: "See Client Feedback", image: "/images/house2.png", href: "#" },
  ];

  return (
    <main className="min-h-screen w-full bg-[#f6f2eb] text-[#1f1a17]">
      <header className="border-b border-[#ddd3c6] bg-[#f6f2eb]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="shrink-0 text-lg font-semibold tracking-[0.12em] text-[#2f2a24] uppercase">
            Property Project Marketing Pty Ltd
          </div>

          <nav className="ml-16 flex items-center gap-6 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.14em] text-[#5b5147]">
            <a href="/" className="transition hover:text-[#1f1a17]">
              Home
            </a>
            <a href="/about" className="transition hover:text-[#1f1a17]">
              About Us
            </a>
            <a href="#" className="transition hover:text-[#1f1a17]">
              Buyers
            </a>
            <a href="#" className="transition hover:text-[#1f1a17]">
              Services
            </a>
            <a href="#" className="transition hover:text-[#1f1a17]">
              Developers
            </a>
            <a href="#" className="transition hover:text-[#1f1a17]">
              Blog
            </a>
            <a href="#" className="transition hover:text-[#1f1a17]">
              Testimonials
            </a>
            <a href="/contact" className="transition hover:text-[#1f1a17]">
              Contact
            </a>
            <a href="#" className="transition hover:text-[#1f1a17]">
              Projects
            </a>
            <a href="/#" className="transition hover:text-[#1f1a17]">
              Login
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <HeroCarousel />

        <section className="mt-20 grid gap-12 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-sm border border-[#e3d8ca] bg-[#fbf8f3] px-8 py-10 text-center shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
            >
              <div className="mb-5 flex justify-center">{stat.icon}</div>
              <h2 className="text-[34px] font-semibold tracking-[-0.02em] text-[#1f1a17]">
                {stat.value}
              </h2>
              <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.18em] text-[#6b6055]">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-20">
          <div className="mb-10 text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
              Explore More
            </p>
            <h2 className="mt-3 text-3xl font-light text-[#1f1a17] md:text-4xl">
              Discover our premium services and insights
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="group overflow-hidden rounded-sm border border-[#dfd4c7] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
              >
                <div className="m-4 overflow-hidden rounded-sm bg-[#e3dbd0]">
                  <div className="m-3 h-[105px] overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="px-5 pb-6">
                  <h3 className="text-[22px] font-semibold text-[#1f1a17] transition group-hover:text-[#5f5245]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-[#6c6258]">
                    {card.subtitle}
                  </p>
                  <span className="mt-5 inline-block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f2a24]">
                    Learn More
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-16 border-t border-[#ddd3c6] bg-[#efe8dd]">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center">
          <p className="text-[12px] tracking-[0.08em] text-[#5f554b]">
            © 2026 Property Project Marketing Pty Ltd
          </p>
          <div className="mt-4 flex justify-center gap-6 text-[12px] uppercase tracking-[0.14em] text-[#5f554b]">
            <a href="#" className="transition hover:text-[#1f1a17]">
              Facebook
            </a>
            <a href="#" className="transition hover:text-[#1f1a17]">
              Twitter
            </a>
            <a href="#" className="transition hover:text-[#1f1a17]">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}