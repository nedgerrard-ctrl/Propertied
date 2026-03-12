export default function Home() {
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
    { title: "About Us", subtitle: "View Company Details" },
    { title: "Portfolio Services", subtitle: "View More" },
    { title: "Blog & Insights", subtitle: "Read Articles" },
    { title: "For Developers", subtitle: "Discover Partnerships" },
    { title: "For Buyers", subtitle: "Explore Buyer Options" },
    { title: "Testimonials", subtitle: "See Client Feedback" },
  ];

  return (
    <main className="min-h-screen w-full bg-[#f6f2eb] text-[#1f1a17]">
      <header className="border-b border-[#ddd3c6] bg-[#f6f2eb]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="text-lg font-semibold tracking-[0.12em] text-[#2f2a24] uppercase">
            Property Project Marketing Pty Ltd
          </div>

          <nav className="flex flex-wrap gap-5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#5b5147] md:gap-6">
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
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <section className="overflow-hidden rounded-sm border border-[#d8cdc0] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <div className="relative h-[420px] bg-[#d9d1c6]">
            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-black/10" />

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <line
                x1="0"
                y1="0"
                x2="100"
                y2="100"
                stroke="#7c7369"
                strokeWidth="0.25"
              />
              <line
                x1="100"
                y1="0"
                x2="0"
                y2="100"
                stroke="#7c7369"
                strokeWidth="0.25"
              />
            </svg>

            <button className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/10 text-lg text-white backdrop-blur transition hover:bg-white/20">
              ‹
            </button>

            <button className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/10 text-lg text-white backdrop-blur transition hover:bg-white/20">
              ›
            </button>

            <div className="absolute left-8 top-1/2 max-w-xl -translate-y-1/2 text-white md:left-12">
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
              className="absolute bottom-8 right-8 inline-flex items-center gap-3 rounded-sm border border-white bg-white px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#1f1a17] shadow-lg transition hover:bg-[#f3ede4]"
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
            <span className="h-2.5 w-2.5 rounded-full bg-[#1f1a17]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#c2b7aa]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#c2b7aa]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#c2b7aa]" />
          </div>
        </section>

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
                href="#"
                className="group overflow-hidden rounded-sm border border-[#dfd4c7] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
              >
                <div className="m-4 overflow-hidden rounded-sm bg-[#e3dbd0]">
                  <div className="h-[190px]">
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="h-full w-full"
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="100"
                        y2="100"
                        stroke="#7b7268"
                        strokeWidth="0.35"
                      />
                      <line
                        x1="100"
                        y1="0"
                        x2="0"
                        y2="100"
                        stroke="#7b7268"
                        strokeWidth="0.35"
                      />
                    </svg>
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