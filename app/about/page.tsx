import Link from "next/link";

export default function AboutPage() {
  const cycleSteps = [
    {
      step: "01",
      title: "Source",
      description:
        "We identify and curate the best off-the-plan developments across Melbourne on your behalf — from boutique townhouses to high-rise apartments.",
    },
    {
      step: "02",
      title: "Buy",
      description:
        "We match you with the right property, organise display suite visits, and guide you through the purchase with no fees to the buyer — our commission is paid by the developer.",
    },
    {
      step: "03",
      title: "Manage",
      description:
        "Through our sister division Online Property Services, we manage your residential asset as a premium portfolio — maximising returns, not just collecting rent.",
    },
    {
      step: "04",
      title: "Maximise",
      description:
        "We actively protect and grow the value of your investment over time, keeping you informed and ahead of the market.",
    },
    {
      step: "05",
      title: "Resell",
      description:
        "When the time is right, we appraise and resell your property — leveraging our market knowledge to achieve the best possible result.",
    },
    {
      step: "06",
      title: "Reinvest",
      description:
        "We help you re-enter the market with new opportunities, keeping you in the loop for long-term wealth building.",
    },
  ];

  const differentiators = [
    {
      title: "Independent Third-Party Agent",
      description:
        "We are not tied to any single developer or project. We source the best available stock across Melbourne and match it to your needs — with no conflict of interest.",
    },
    {
      title: "$1.5B+ in Delivered Projects",
      description:
        "For over a decade we operated as the silent engine behind major Melbourne residential developments. Now we bring that expertise directly to you.",
    },
    {
      title: "Premium Portfolio Management",
      description:
        "We manage a $50M+ residential asset portfolio on behalf of long-term investors. This is not standard property management — it is strategic asset stewardship.",
    },
    {
      title: "Overseas Investor Specialists",
      description:
        "With a client base that is predominantly overseas-based, we understand the complexities of investing in Australian property from abroad and guide you every step of the way.",
    },
  ];

  const developerServices = [
    {
      title: "Project Marketing & Sales Management",
      description:
        "We have managed the end-to-end sales campaigns for major Melbourne residential developments — handling everything from launch strategy to contract execution. Your project is in hands that have delivered over $1.5 billion in results.",
    },
    {
      title: "Independent Sales Agency",
      description:
        "As a third-party agent, we are not beholden to any single developer. We bring credibility, a qualified buyer network, and transparent reporting — so you always know exactly where your project stands.",
    },
    {
      title: "Qualified Buyer Network",
      description:
        "Our buyer database spans local owner-occupiers, local investors, and overseas investors — particularly across Asia-Pacific. We match the right buyer to the right product from day one.",
    },
    {
      title: "Feasibility & Strategy Advisory",
      description:
        "Before a single contract is signed, we work with you on product mix, pricing strategy, and market positioning to maximise sellout outcomes and minimise holding risk.",
    },
  ];

  const featuredProjects = [
    {
      name: "Project Alpha",
      location: "Southbank, Melbourne",
      type: "High-Rise Apartments",
      status: "Completed",
      units: "180 Units",
    },
    {
      name: "Project Beta",
      location: "Richmond, Melbourne",
      type: "Boutique Townhouses",
      status: "Completed",
      units: "32 Units",
    },
    {
      name: "Project Gamma",
      location: "Docklands, Melbourne",
      type: "Mixed-Use Residential",
      status: "Sold Out",
      units: "240 Units",
    },
  ];

  const team = [
    {
      name: "Ned Gerrard",
      role: "Co-Founder & Director",
      description:
        "With a background in management consulting, accounting, and marketing, Ned brings a strategic approach to every project. He leads developer relationships, feasibility planning, and client strategy.",
    },
    {
      name: "Joan Alcock",
      role: "Director & Officer in Effective Control",
      description:
        "A multi-award-winning sales professional ranked in the Top 2% nationally, Joan leads the sales division and holds the agency licence for Property Project Marketing.",
    },
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
            <a href="/about" className="text-[#1f1a17]">About Us</a>
            <a href="#" className="transition hover:text-[#1f1a17]">Buyers</a>
            <a href="#" className="transition hover:text-[#1f1a17]">Services</a>
            <a href="#" className="transition hover:text-[#1f1a17]">Developers</a>
            <a href="#" className="transition hover:text-[#1f1a17]">Blog</a>
            <a href="/testimonial" className="transition hover:text-[#1f1a17]">Testimonials</a>
            <a href="/contact" className="transition hover:text-[#1f1a17]">Contact</a>
            <a href="/login" className="transition hover:text-[#1f1a17]">Login</a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* About Us — Hero */}
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
              Who We Are
            </p>
            <h1 className="mt-3 text-3xl font-light text-[#1f1a17]">
              Melbourne&rsquo;s discreet off-the-plan &amp; portfolio specialists
            </h1>

            <div className="mt-6 space-y-4 text-[13px] leading-6 text-[#3d3530]">
              <p>
                Property Project Marketing Pty Ltd (PPM) was founded in April
                2013 and for over a decade operated invisibly behind major
                Melbourne residential developers — delivering more than{" "}
                <strong>$1.5 billion</strong> in off-the-plan property sales
                with zero public presence.
              </p>
              <p>
                We are now launching our own premium brand for the first time.
                After years of working exclusively under developers&rsquo; names,
                we are bringing that same expertise directly to buyers,
                investors, and developers who want a trusted end-to-end partner.
              </p>
              <p>
                Our approach goes far beyond a traditional real estate
                transaction. We source, we sell, we manage, and we resell — a
                true closed-loop service from first viewing to lifelong
                investment success.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-block border border-[#2f2a24] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2f2a24] transition hover:bg-[#2f2a24] hover:text-white"
              >
                Get in Touch
              </Link>
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

        {/* Stats bar */}
        <section className="mt-16 grid gap-px border border-[#ddd3c6] bg-[#ddd3c6] sm:grid-cols-3">
          {[
            { value: "2013", label: "Founded" },
            { value: "$1.5B+", label: "In Delivered Sales" },
            { value: "10+ Years", label: "Industry Experience" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#f6f2eb] px-8 py-8 text-center"
            >
              <p className="text-[28px] font-semibold tracking-[-0.02em] text-[#1f1a17]">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a7b6d]">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Mission & Vision */}
        <section className="mt-20 grid gap-6 sm:grid-cols-2">
          <div className="rounded-sm border border-[#ddd3c6] bg-[#fbf8f3] px-8 py-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
              Our Mission
            </p>
            <h2 className="mt-3 text-xl font-light text-[#1f1a17]">
              Connecting the right people to the right property
            </h2>
            <p className="mt-4 text-[13px] leading-6 text-[#5b5147]">
              To be Melbourne&rsquo;s most trusted end-to-end off-the-plan property
              partner — connecting buyers, investors, and developers with the
              right opportunities and stewarding those assets for long-term
              growth. We do not simply transact. We build lasting relationships
              grounded in expertise, transparency, and results.
            </p>
          </div>

          <div className="rounded-sm border border-[#ddd3c6] bg-[#fbf8f3] px-8 py-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
              Our Vision
            </p>
            <h2 className="mt-3 text-xl font-light text-[#1f1a17]">
              The premium name in Melbourne property investment
            </h2>
            <p className="mt-4 text-[13px] leading-6 text-[#5b5147]">
              To be recognised as Melbourne&rsquo;s leading premium property services
              brand — known for delivering exceptional outcomes across the full
              investment lifecycle. We are building a business where every client,
              whether a first-time buyer or a seasoned developer, receives the
              same level of strategic, personalised service.
            </p>
          </div>
        </section>

        {/* End-to-End Model */}
        <section className="mt-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
            Our Approach
          </p>
          <h2 className="mt-3 text-2xl font-light text-[#1f1a17]">
            The End-to-End Model
          </h2>
          <p className="mt-4 max-w-2xl text-[13px] leading-6 text-[#3d3530]">
            Unlike a traditional agent who simply sells or simply manages, PPM
            covers the complete investment cycle. Once you become a client, you
            never have to start from scratch again.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cycleSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-sm border border-[#ddd3c6] bg-[#fbf8f3] px-6 py-7"
              >
                <p className="text-[11px] font-medium tracking-[0.24em] text-[#b5a899]">
                  {item.step}
                </p>
                <h3 className="mt-2 text-[17px] font-semibold text-[#1f1a17]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[13px] leading-6 text-[#5b5147]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Cycle arrow visual */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a7b6d]">
            {["Source", "Buy", "Manage", "Maximise", "Resell", "Reinvest"].map(
              (label, i, arr) => (
                <span key={label} className="flex items-center gap-2">
                  <span className="rounded-sm border border-[#ddd3c6] bg-white px-3 py-1">
                    {label}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="text-[#c4b8ab]">→</span>
                  )}
                </span>
              )
            )}
          </div>
        </section>

        {/* Why PPM */}
        <section className="mt-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
            Why PPM
          </p>
          <h2 className="mt-3 text-2xl font-light text-[#1f1a17]">
            What sets us apart
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {differentiators.map((item) => (
              <div
                key={item.title}
                className="rounded-sm border border-[#ddd3c6] bg-[#fbf8f3] px-6 py-7"
              >
                <h3 className="text-[15px] font-semibold text-[#1f1a17]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[13px] leading-6 text-[#5b5147]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* For Developers */}
        <section className="mt-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
            Developer Services
          </p>
          <h2 className="mt-3 text-2xl font-light text-[#1f1a17]">
            Partnering with developers
          </h2>
          <p className="mt-4 max-w-2xl text-[13px] leading-6 text-[#3d3530]">
            For over a decade, PPM was the silent force behind some of
            Melbourne&rsquo;s most successful residential launches. We understand
            the pressures developers face — from presales targets to settlement
            risk — and we deliver the results that make projects viable.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {developerServices.map((item) => (
              <div
                key={item.title}
                className="rounded-sm border border-[#ddd3c6] bg-[#fbf8f3] px-6 py-7"
              >
                <h3 className="text-[15px] font-semibold text-[#1f1a17]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[13px] leading-6 text-[#5b5147]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-block border border-[#2f2a24] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2f2a24] transition hover:bg-[#2f2a24] hover:text-white"
            >
              Enquire as a Developer
            </Link>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="mt-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
            Our Track Record
          </p>
          <h2 className="mt-3 text-2xl font-light text-[#1f1a17]">
            Featured projects
          </h2>
          <p className="mt-4 max-w-2xl text-[13px] leading-6 text-[#3d3530]">
            A selection of the Melbourne residential developments we have
            delivered. Further project details will be published as our brand
            launches publicly.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {featuredProjects.map((project) => (
              <div
                key={project.name}
                className="overflow-hidden rounded-sm border border-[#ddd3c6] bg-[#fbf8f3]"
              >
                {/* Image placeholder */}
                <div className="flex h-[160px] items-center justify-center bg-[#e8e0d5] text-[11px] uppercase tracking-widest text-[#b5a899]">
                  Project Image
                </div>
                <div className="px-6 py-6">
                  <span className="inline-block rounded-sm bg-[#2f2a24] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white">
                    {project.status}
                  </span>
                  <h3 className="mt-3 text-[16px] font-semibold text-[#1f1a17]">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-[12px] text-[#8a7b6d]">
                    {project.location}
                  </p>
                  <div className="mt-4 flex gap-4 text-[11px] text-[#5b5147]">
                    <span>{project.type}</span>
                    <span className="text-[#ddd3c6]">|</span>
                    <span>{project.units}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mt-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
            The People
          </p>
          <h2 className="mt-3 text-2xl font-light text-[#1f1a17]">
            Our Leadership
          </h2>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-sm border border-[#ddd3c6] bg-[#fbf8f3] px-6 py-7"
              >
                <div className="mb-5 h-[120px] w-[120px] overflow-hidden rounded-sm border border-[#ddd3c6] bg-[#e8e0d5]">
                  {/* Placeholder — replaced when client supplies photos */}
                  <div className="flex h-full w-full items-center justify-center text-[11px] uppercase tracking-widest text-[#b5a899]">
                    Photo
                  </div>
                </div>
                <h3 className="text-[16px] font-semibold text-[#1f1a17]">
                  {member.name}
                </h3>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#8a7b6d]">
                  {member.role}
                </p>
                <p className="mt-4 text-[13px] leading-6 text-[#5b5147]">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Next Steps / Contact */}
        <section className="mt-20 rounded-sm border border-[#ddd3c6] bg-[#fbf8f3] px-8 py-14">
          <div className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
              Next Steps
            </p>
            <h2 className="mt-3 text-2xl font-light text-[#1f1a17]">
              Ready to start your property journey?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[13px] leading-6 text-[#5b5147]">
              Whether you are a buyer looking for off-the-plan opportunities, an
              investor seeking portfolio growth, or a developer needing a trusted
              sales partner — we would love to hear from you.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Link
              href="/contact"
              className="block rounded-sm border border-[#ddd3c6] bg-white px-6 py-7 text-center transition hover:border-[#2f2a24]"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a7b6d]">
                I am a
              </p>
              <p className="mt-2 text-[17px] font-semibold text-[#1f1a17]">
                Buyer or Investor
              </p>
              <p className="mt-2 text-[12px] leading-5 text-[#5b5147]">
                Find the right off-the-plan property and grow your portfolio
              </p>
              <span className="mt-5 inline-block text-[11px] font-medium uppercase tracking-[0.18em] text-[#2f2a24]">
                Enquire Now →
              </span>
            </Link>

            <Link
              href="/contact"
              className="block rounded-sm border border-[#ddd3c6] bg-white px-6 py-7 text-center transition hover:border-[#2f2a24]"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a7b6d]">
                I am a
              </p>
              <p className="mt-2 text-[17px] font-semibold text-[#1f1a17]">
                Developer
              </p>
              <p className="mt-2 text-[12px] leading-5 text-[#5b5147]">
                Partner with Melbourne&rsquo;s proven project marketing specialists
              </p>
              <span className="mt-5 inline-block text-[11px] font-medium uppercase tracking-[0.18em] text-[#2f2a24]">
                Partner With Us →
              </span>
            </Link>

            <Link
              href="/contact"
              className="block rounded-sm border border-[#ddd3c6] bg-white px-6 py-7 text-center transition hover:border-[#2f2a24]"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a7b6d]">
                General
              </p>
              <p className="mt-2 text-[17px] font-semibold text-[#1f1a17]">
                Get in Touch
              </p>
              <p className="mt-2 text-[12px] leading-5 text-[#5b5147]">
                Any questions or just want to learn more about what we do
              </p>
              <span className="mt-5 inline-block text-[11px] font-medium uppercase tracking-[0.18em] text-[#2f2a24]">
                Contact Us →
              </span>
            </Link>
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
