export default function Navbar() {
  return (
    <header className="border-b border-[#ddd3c6] bg-[#f6f2eb]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <a
          href="/"
          className="shrink-0 text-lg font-semibold uppercase tracking-[0.12em] text-[#2f2a24] hover:opacity-80 transition"
        >
          Property Project Marketing Pty Ltd
        </a>

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
          <a href="/testimonial" className="transition hover:text-[#1f1a17]">
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
  );
}