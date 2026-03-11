export default function Home() {
  const stats = [
    {
      value: "10+ Years",
      label: "Industry Experience",
      icon: (
        <svg viewBox="0 0 64 64" className="h-20 w-20 fill-[#333]">
          <path d="M14 28.5 27 18l13 10.5V50a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V28.5Zm8 17.5h10V34H22v12Zm22-25h10a4 4 0 0 1 4 4v25a2 2 0 0 1-2 2H44V21Zm6 8h4v4h-4v-4Zm0 8h4v4h-4v-4Zm0 8h4v4h-4v-4Z" />
        </svg>
      ),
    },
    {
      value: "$1.5B+",
      label: "Project Delivered",
      icon: (
        <svg viewBox="0 0 64 64" className="h-20 w-20 fill-[#333]">
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
        <svg viewBox="0 0 64 64" className="h-20 w-20 fill-[#333]">
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
    <main className="min-h-screen bg-[#efefef] text-[#1f2937]">
      <div className="w-full px-3 py-2">
        <div className="border border-[#d0d0d0] bg-[#f5f5f5] px-2 py-3">
          <header className="flex flex-col gap-3 bg-[#dfe2e6] px-3 py-3 md:flex-row md:items-center md:justify-between">
            <div className="text-[15px] font-bold text-[#2f2f2f]">
              Property Project Marketing Pty Ltd
            </div>

            <nav className="flex flex-wrap gap-3 text-[10px] font-medium text-[#334155] md:gap-4">
              <a href="#">Home</a>
              <a href="#">About Us</a>
              <a href="#">Buyers</a>
              <a href="#">Services</a>
              <a href="#">Developers</a>
              <a href="#">Blog</a>
              <a href="#">Testimonials</a>
              <a href="#">Contact</a>
            </nav>
          </header>

          <section className="mt-3 border border-[#9d9d9d] bg-white p-2">
            <div className="relative h-[250px] border border-[#666] bg-[#f9f9f9]">
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
                  stroke="#333"
                  strokeWidth="0.25"
                />
                <line
                  x1="100"
                  y1="0"
                  x2="0"
                  y2="100"
                  stroke="#333"
                  strokeWidth="0.25"
                />
              </svg>

              <button className="absolute left-2 top-1/2 flex h-3 w-8 -translate-y-1/2 items-center justify-center border border-[#aaa] bg-[#ececec] text-[10px] text-[#444]">
                ‹
              </button>

              <button className="absolute right-2 top-1/2 flex h-3 w-8 -translate-y-1/2 items-center justify-center border border-[#aaa] bg-[#ececec] text-[10px] text-[#444]">
                ›
              </button>

              <a
                href="#"
                className="absolute bottom-4 right-6 inline-flex items-center gap-2 rounded-[4px] border-2 border-[#6d6d6d] bg-white px-6 py-3 text-[15px] font-semibold text-[#2d3748] shadow-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7 stroke-[#333]"
                  fill="none"
                  strokeWidth="2"
                >
                  <path d="M21 15a3 3 0 0 1-3 3H9l-4 3v-3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3v9Z" />
                  <path d="M8 8h8v6H8z" />
                </svg>
                <span>Find Your Property</span>
              </a>
            </div>

            <div className="mt-4 flex justify-center gap-4">
              <span className="h-2.5 w-2.5 rounded-full bg-black" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#9b9b9b]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#9b9b9b]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#9b9b9b]" />
            </div>
          </section>

          <section className="mt-10 grid gap-10 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 flex justify-center">{stat.icon}</div>
                <h2 className="text-[21px] font-extrabold text-[#1f2937]">
                  {stat.value}
                </h2>
                <p className="mt-1 text-[12px] font-semibold text-[#1f2937]">
                  {stat.label}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-12 grid gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <a
                key={card.title}
                href="#"
                className="mx-auto block w-[200px] border border-[#c8c8c8] bg-white"
              >
                <div className="m-3 h-[105px] border border-[#666] bg-[#f9f9f9]">
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
                      stroke="#333"
                      strokeWidth="0.45"
                    />
                    <line
                      x1="100"
                      y1="0"
                      x2="0"
                      y2="100"
                      stroke="#333"
                      strokeWidth="0.45"
                    />
                  </svg>
                </div>

                <div className="px-3 pb-5">
                  <h3 className="text-[14px] font-bold text-[#1f2937]">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-[#334155]">
                    {card.subtitle}
                  </p>
                </div>
              </a>
            ))}
          </section>

          <footer className="mt-8 bg-[#dfe2e6] px-4 py-4 text-center text-[11px] text-[#374151]">
            <p>© 2026 Property Project Marketing Pty Ltd</p>
            <div className="mt-2 flex justify-center gap-4">
              <a href="#">fFacebook</a>
              <a href="#">𝕏Twitter</a>
              <a href="#">inLinkedIn</a>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}