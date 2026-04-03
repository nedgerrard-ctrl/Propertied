import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const partnershipBenefits = [
  {
    title: "Independent third-party representation",
    description:
      "PPM is not tied to a single project or developer. We work as an independent project marketing partner, helping align the right development opportunities with the right buyers and investors.",
  },
  {
    title: "End-to-end investor journey",
    description:
      "Our model goes beyond an initial sale. Through our broader investment and portfolio services approach, we support a longer-term relationship that can extend from acquisition through to management and eventual resale.",
  },
  {
    title: "Experienced off-the-plan specialists",
    description:
      "PPM’s background is rooted in off-the-plan apartments and townhouses, with practical experience in project marketing, buyer qualification, display suite coordination, and sales progression.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Project alignment",
    description:
      "We work with developers to understand the project, the target buyer profile, and where the opportunity sits within the current market.",
  },
  {
    step: "02",
    title: "Project representation",
    description:
      "PPM represents suitable developments on a commission basis, positioning them to the right buyers and investors while maintaining a premium and professional presentation.",
  },
  {
    step: "03",
    title: "Buyer matching and progression",
    description:
      "We guide interested buyers through the next steps, including project discussions, display suite visits or virtual walkthroughs, and progression toward sale.",
  },
];

const differentiators = [
  "Independent channel partner, not tied to one developer",
  "Commission-based representation for suitable developments",
  "Experience across sourcing, selling, managing, and resale",
  "Strong background working with investor clients",
];

export default function DevelopersPage() {
  return (
    <main className="min-h-screen w-full bg-[#f6f2eb] text-[#1f1a17]">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-[#e3d8ca] bg-[#fbf8f3]">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
          <div className="overflow-hidden border border-[#bfb4a8] bg-[#f7f3ed]">
            <div className="grid gap-8 px-8 py-14 md:grid-cols-[1.4fr_0.8fr] md:px-14 md:py-20">
              <div className="flex flex-col justify-center">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
                  For Developers
                </p>

                <h1 className="mt-4 max-w-3xl text-4xl font-light leading-tight text-[#1f1a17] md:text-5xl">
                  Partner With Us to Sell Your Development
                </h1>

                <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#5b5147]">
                  We specialise in off-the-plan project marketing, working with
                  developers as an independent third-party partner to connect
                  quality projects with suitable buyers and investors.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/contact/developers"
                    className="inline-flex items-center justify-center rounded-sm bg-[#2f2a24] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1f1a17]"
                  >
                    Partner With Us
                  </Link>

                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center rounded-sm border border-[#cdbfae] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5b5147] transition hover:border-[#5f5245] hover:text-[#1f1a17]"
                  >
                    Learn More About PPM
                  </Link>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-full rounded-sm border border-[#ddd3c6] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a7b6d]">
                    Why Developers Work With PPM
                  </p>

                  <div className="mt-5 space-y-4">
                    {differentiators.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-[#2f2a24]" />
                        <p className="text-[13px] leading-6 text-[#5b5147]">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

         
          
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* Intro section */}
        <div className="max-w-5xl">
          <h2 className="text-3xl font-light text-[#1f1a17] md:text-4xl">
            How PPM works with developers
          </h2>

          <div className="mt-8 space-y-6 text-[15px] leading-8 text-[#5b5147]">
            <p>
              PPM works with developers as an independent third-party channel
              partner. Rather than operating as a developer-owned in-house sales
              team, we represent suitable projects on a commission basis and
              help align them with the right buyers and investors.
            </p>

            <p>
              This approach allows PPM to focus on quality project
              representation, trusted buyer relationships, and a more tailored
              path from first interest through to display suite engagement,
              project understanding, and sales progression.
            </p>

            <p>
              For developers, that means working with a partner that understands
              off-the-plan sales, premium project positioning, and the broader
              investment context surrounding each opportunity.
            </p>
          </div>
        </div>

        {/* Why partner */}
        <section className="mt-16">
          <div className="mb-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
              Why Partner With PPM
            </p>
            <h3 className="mt-3 text-3xl font-light text-[#1f1a17] md:text-4xl">
              Built on experience, trust, and long-term investor relationships
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {partnershipBenefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-sm border border-[#e3d8ca] bg-[#fbf8f3] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#2f2a24] text-white">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                    <path d="M12 2 3 6v6c0 5.25 3.438 10.125 9 11 5.562-.875 9-5.75 9-11V6l-9-4Zm-1 14-4-4 1.4-1.4 2.6 2.6 5.6-5.6L18 9l-7 7Z" />
                  </svg>
                </div>

                <h4 className="mt-6 text-xl font-semibold text-[#1f1a17]">
                  {benefit.title}
                </h4>

                <p className="mt-4 text-[13px] leading-7 text-[#5b5147]">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* End-to-end section */}
        <section className="mt-16 grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-start">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
              The PPM Difference
            </p>
            <h3 className="mt-3 text-3xl font-light text-[#1f1a17] md:text-4xl">
              More than a project marketer
            </h3>

            <div className="mt-6 space-y-6 text-[15px] leading-8 text-[#5b5147]">
              <p>
                PPM’s broader model extends beyond simply introducing a buyer to
                a project. The business is built around a wider investment
                journey that can continue after the initial sale through
                portfolio support and eventual resale.
              </p>

              <p>
                That matters to developers because it reflects deeper investor
                relationships, stronger market understanding, and a service
                model that is connected to the full life cycle of property
                ownership rather than a single transaction.
              </p>

              <p>
                It also gives the PPM brand a point of difference: an
                off-the-plan specialist with experience across sourcing,
                selling, managing, and resale.
              </p>
            </div>
          </div>

          <div className="rounded-sm border border-[#ddd3c6] bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a7b6d]">
              End-to-End Model
            </p>

            <div className="mt-6 space-y-5">
              {[
                "Source the right opportunity",
                "Support the buyer journey",
                "Manage long-term investor relationships",
                "Assist with future resale and reinvestment",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d7cabc] text-[11px] font-semibold text-[#2f2a24]">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-[13px] leading-6 text-[#5b5147]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="mt-16">
          <div className="mb-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
              Process
            </p>
            <h3 className="mt-3 text-3xl font-light text-[#1f1a17] md:text-4xl">
              A straightforward partnership approach
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {processSteps.map((step) => (
              <article
                key={step.step}
                className="rounded-sm border border-[#dfd4c7] bg-white p-8"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a7b6d]">
                  Step {step.step}
                </p>
                <h4 className="mt-3 text-xl font-semibold text-[#1f1a17]">
                  {step.title}
                </h4>
                <p className="mt-4 text-[13px] leading-7 text-[#5b5147]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Closing text block */}
        <section className="mt-16 max-w-5xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
            Built Around Trust
          </p>
          <h3 className="mt-3 text-3xl font-light text-[#1f1a17] md:text-4xl">
            A premium, relationship-led approach
          </h3>

          <div className="mt-6 space-y-6 text-[15px] leading-8 text-[#5b5147]">
            <p>
              PPM’s developer partnerships are grounded in experience, project
              understanding, and a premium client-facing approach. We are not
              trying to be a mass-market listing portal or a generic volume
              agency.
            </p>

            <p>
              Instead, the business is positioned around thoughtful project
              representation, strong investor understanding, and a longer-term
              relationship model that supports trust on both the developer side
              and the buyer side.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 rounded-sm border border-[#d9cec0] bg-[#efe8dd] px-8 py-10 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#8a7b6d]">
                Work With PPM
              </p>
              <h3 className="mt-3 text-3xl font-light text-[#1f1a17]">
                Interested in discussing your development?
              </h3>
              <p className="mt-4 text-[14px] leading-7 text-[#5b5147]">
                Contact our team to discuss how PPM can support your project
                through commission-based representation and premium market
                positioning.
              </p>
            </div>

            <div>
              <Link
                href="/contact/developers"
                className="inline-flex items-center justify-center rounded-sm bg-[#2f2a24] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1f1a17]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </section>

      <Footer />
    </main>
  );
}