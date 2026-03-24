import TestimonialCard from "../components/TestimonialCard";
import Link from "next/link";

type Testimonial = {
  id: string;
  rating: number;
  review: string;
  username: string;
  image: string;
  role?: string;
};

const testimonials: Testimonial[] = [
  {
    id: "1",
    rating: 5,
    username: "Daniel K",
    role: "Investor",
    image: "/images/house1.png",
    review:
      "PPM made the process feel organised and transparent from the beginning. Their guidance gave me confidence when purchasing off-the-plan for the first time.",
  },
  {
    id: "2",
    rating: 5,
    username: "Sophia L",
    role: "Overseas Buyer",
    image: "/images/house2.png",
    review:
      "As an overseas buyer, I needed a team I could trust. Communication was prompt, professional, and easy to follow throughout the journey.",
  },
  {
    id: "3",
    rating: 4,
    username: "Michael T",
    role: "Property Investor",
    image: "/images/house3.png",
    review:
      "The team understood my goals clearly and matched me with options that suited my budget and long-term investment strategy.",
  },
  {
    id: "4",
    rating: 5,
    username: "Emma R",
    role: "Buyer",
    image: "/images/house4.png",
    review:
      "I appreciated how clearly everything was explained. The process felt premium but still very practical and straightforward.",
  },
  {
    id: "5",
    rating: 5,
    username: "James W",
    role: "Client",
    image: "/images/house1.png",
    review:
      "What stood out most was the end-to-end approach. It felt like I had a team supporting the whole property journey rather than just a sale.",
  },
  {
    id: "6",
    rating: 4,
    username: "Olivia C",
    role: "Local Investor",
    image: "/images/house2.png",
    review:
      "Professional presentation, timely follow-up, and a strong understanding of what investors actually need.",
  },
  {
    id: "7",
    rating: 4,
    username: "Bryan C",
    role: "Local Investor",
    image: "/images/house2.png",
    review:
      "Professional presentation, timely follow-up, and a strong understanding of what investors actually need.",
  },
  {
    id: "8",
    rating: 4,
    username: "Wallace C",
    role: "Local Investor",
    image: "/images/house2.png",
    review:
      "Professional presentation, timely follow-up, and a strong understanding of what investors actually need.",
  },
];

const averageRating =
  testimonials.reduce((sum, item) => sum + item.rating, 0) / testimonials.length;

function StarSummary() {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-[#b08d57]"
        >
          <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.58 6.1 20.67l1.13-6.57L2.45 9.44l6.6-.96L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
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
            <a href="testimonial" className="transition hover:text-[#1f1a17]">
              Testimonials
            </a>
            <a href="/contact" className="transition hover:text-[#1f1a17]">
              Contact
            </a>
            <a href="#" className="transition hover:text-[#1f1a17]">
              Projects
            </a>
            <a href="/login" className="transition hover:text-[#1f1a17]">
              Login
            </a>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="border border-[#e3d8ca] bg-[#fbf8f3] px-6 py-14 text-center">
          <h1 className="text-3xl font-light md:text-5xl">Testimonials</h1>

          <div className="mt-6 flex flex-col items-center gap-3">
            <StarSummary />
            <p className="text-[26px] font-semibold">
              {averageRating.toFixed(1)} / 5
            </p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a7b6d]">
              Based on {testimonials.length} reviews
            </p>
          </div>
        </section>

        <section className="mt-16">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                rating={testimonial.rating}
                review={testimonial.review}
                username={testimonial.username}
                image={testimonial.image}
                role={testimonial.role}
              />
            ))}
          </div>
        </section>
      </div>
      <footer className="border-t border-[#d8d0c4] bg-[#ebe6dd]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-center md:flex-row md:text-left">
          <p className="text-sm text-[#7a7166]">
            © 2026 Property Project Marketing Pty Ltd
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-[12px] uppercase tracking-[0.18em] text-[#7a7166] transition hover:text-[#2f2923]"
            >
              Facebook
            </Link>
            <Link
              href="#"
              className="text-[12px] uppercase tracking-[0.18em] text-[#7a7166] transition hover:text-[#2f2923]"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-[12px] uppercase tracking-[0.18em] text-[#7a7166] transition hover:text-[#2f2923]"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </footer>
    </main>
    
  );
}