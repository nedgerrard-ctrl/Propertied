export default function AboutPage() {
  const team = [
    { name: "Team Member" },
    { name: "Team Member" },
    { name: "Team Member" },
    { name: "Team Member" },
    { name: "Team Member" },
  ];

  return (
    <main className="min-h-screen w-full bg-[#efefef] text-[#1f2937]">
      <header className="flex flex-col gap-3 bg-[#dfe2e6] px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="text-[15px] font-bold text-[#2f2f2f]">
          Property Project Marketing Pty Ltd
        </div>

        <nav className="flex flex-wrap gap-3 text-[10px] font-medium text-[#334155] md:gap-4">
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="#">Buyers</a>
          <a href="#">Services</a>
          <a href="#">Developers</a>
          <a href="#">Blog</a>
          <a href="#">Testimonials</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      <section className="px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="text-center">
            <h1 className="mb-4 text-[20px] font-bold text-[#2f3a4a]">
                About Us
            </h1>

            <div className="mx-auto max-w-[520px] space-y-3 text-[11px] leading-5 text-[#222]">
              <p>
                Property Project Marketing Pty Ltd is focused on connecting
                buyers, investors, and development opportunities through a
                simple and professional property marketing approach.
              </p>
              <p>
                We work across sourcing, buyer support, project promotion, and
                long-term investment pathways. Our goal is to present property
                opportunities clearly and help clients move with confidence.
              </p>
              <p>
                The business is built around trusted relationships, market
                understanding, and an end-to-end process that supports clients
                from first enquiry through to future growth.
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="h-[190px] w-full max-w-[420px] border border-[#666] bg-[#f9f9f9]">
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
                  strokeWidth="0.35"
                />
                <line
                  x1="100"
                  y1="0"
                  x2="0"
                  y2="100"
                  stroke="#333"
                  strokeWidth="0.35"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-4">
        <h2 className="mb-4 text-center text-[20px] font-bold text-[#2f3a4a]">
          End-to-End Model
        </h2>

        <div className="mx-auto h-[220px] w-full border border-[#666] bg-[#f9f9f9]">
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
              strokeWidth="0.3"
            />
            <line
              x1="100"
              y1="0"
              x2="0"
              y2="100"
              stroke="#333"
              strokeWidth="0.3"
            />
          </svg>
        </div>
      </section>

      <section className="px-6 py-8">
        <h2 className="mb-6 text-center text-[20px] font-bold text-[#2f3a4a]">
          Our Team
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto h-[120px] w-[120px] border border-[#666] bg-[#f9f9f9]">
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

              <p className="mt-3 text-[11px] text-[#333]">{member.name}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-8 bg-[#dfe2e6] px-4 py-4 text-center text-[11px] text-[#374151]">
        <p>© 2026 Property Project Marketing Pty Ltd</p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="#">fFacebook</a>
          <a href="#">𝕏Twitter</a>
          <a href="#">inLinkedIn</a>
        </div>
      </footer>
    </main>
  );
}