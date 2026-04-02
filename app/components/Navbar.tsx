import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-[#ddd3c6] bg-[#f6f2eb]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        
        <Link
          href="/"
          className="shrink-0 text-lg font-semibold uppercase tracking-[0.12em] text-[#2f2a24] hover:opacity-80 transition"
        >
          Property Project Marketing Pty Ltd
        </Link>

        <nav className="ml-16 flex items-center gap-6 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.14em] text-[#5b5147]">

          <Link href="/" className="transition hover:text-[#1f1a17]">
            Home
          </Link>

          <Link href="/about" className="transition hover:text-[#1f1a17]">
            About Us
          </Link>

          <Link href="/buyers" className="transition hover:text-[#1f1a17]">
            Buyers
          </Link>

          <Link href="#" className="transition hover:text-[#1f1a17]">
            Services
          </Link>

          <Link href="/developer" className="transition hover:text-[#1f1a17]">
            Developers
          </Link>

          <Link href="/blog" className="transition hover:text-[#1f1a17]">
            Blog
          </Link>

          <Link href="/testimonial" className="transition hover:text-[#1f1a17]">
            Testimonials
          </Link>

          <Link href="/contact" className="transition hover:text-[#1f1a17]">
            Contact
          </Link>

          <Link href="#" className="transition hover:text-[#1f1a17]">
            Projects
          </Link>

          <Link href="/login" className="transition hover:text-[#1f1a17]">
            Login
          </Link>

        </nav>
      </div>
    </header>
  );
}