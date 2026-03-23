export default function AboutPage() {
  const team = [
    { name: "Team Member" },
    { name: "Team Member" },
    { name: "Team Member" },
    { name: "Team Member" },
    { name: "Team Member" },
  ];

  return (
    <main className="min-h-screen w-full bg-[#f6f2eb] text-[#1f1a17]">
      <header className="border-b border-[#ddd3c6] bg-[#f6f2eb]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="shrink-0 text-lg font-semibold tracking-[0.12em] text-[#2f2a24] uppercase">
            Property Project Marketing Pty Ltd
          </div>

          <nav className="ml-16 flex items-center gap-6 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.14em] text-[#5b5147]">
            <a href="/" className="transition hover:text-[#1f1a17]">Home</a>
            <a href="/about" className="transition hover:text-[#1f1a17]">About Us</a>
            <a href="#" className="transition hover:text-[#1f1a17]">Buyers</a>
            <a href="#" className="transition hover:text-[#1f1a17]">Services</a>
            <a href="#" className="transition hover:text-[#1f1a17]">Developers</a>
            <a href="#" className="transition hover:text-[#1f1a17]">Blog</a>
            <a href="#" className="transition hover:text-[#1f1a17]">Testimonials</a>
            <a href="/contact" className="transition hover:text-[#1f1a17]">Contact</a>
            <a href="#" className="transition hover:text-[#1f1a17]">Projects</a>
            <a href="#" className="transition hover:text-[#1f1a17]">Login</a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* About section */}
        <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
              Who We Are
            </p>
            <h1 className="mt-3 text-3xl font-light text-[#1f1a17]">About PPM</h1>

            <div className="mt-6 space-y-4 text-[13px] leading-6 text-[#3d3530]">
              <p>
                Property Project Marketing Pty Ltd (PPM) is focused on connecting
                buyers, investors, and development opportunities through a simple
                and professional property marketing approach.
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

          <div className="overflow-hidden rounded-sm border border-[#ddd3c6]">
            <img
              src="/images/aboutus.png"
              alt="PPM property"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        {/* End-to-End Model */}
        <section className="mt-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
            Our Approach
          </p>
          <h2 className="mt-3 text-2xl font-light text-[#1f1a17]">End-to-End Model</h2>

          <div className="mt-6 overflow-hidden rounded-sm border border-[#ddd3c6]">
            <img
              src="/images/house4.png"
              alt="End-to-end model"
              className="h-[240px] w-full object-cover"
            />
          </div>
        </section>

        {/* Team */}
        <section className="mt-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
            The People
          </p>
          <h2 className="mt-3 text-2xl font-light text-[#1f1a17]">Our Team</h2>

          <div className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto h-[120px] w-[120px] overflow-hidden rounded-sm border border-[#ddd3c6] bg-[#e8e0d5]">
                  <img
                    src={index % 2 === 0 ? "/images/house1.png" : "/images/house2.png"}
                    alt={member.name}
                    className="h-full w-full object-cover opacity-60"
                  />
                </div>
                <p className="mt-3 text-[11px] text-[#5b5147]">{member.name}</p>
              </div>
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
            <a href="#" className="transition hover:text-[#1f1a17]">Facebook</a>
            <a href="#" className="transition hover:text-[#1f1a17]">Twitter</a>
            <a href="#" className="transition hover:text-[#1f1a17]">LinkedIn</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
