import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const benefits = [
  {
    title: "Independent market representation",
    description:
      "PPM operates as an independent third-party project marketing partner, helping connect the right buyers and investors to the right development opportunity.",
  },
  {
    title: "Qualified lead generation",
    description:
      "PPM is focused on attracting quality interest and creating a smoother path between market demand and project opportunity.",
  },
  {
    title: "End-to-end buyer guidance",
    description:
      "From first enquiry through display suite coordination and sales support, PPM helps move prospects through the buyer journey with clarity and confidence.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Project review",
    description:
      "PPM works with developers to understand the project, location, target buyer profile, and the overall sales opportunity.",
  },
  {
    step: "02",
    title: "Positioning and marketing support",
    description:
      "The project is positioned to appeal to qualified buyers and investors through a premium, trust-focused marketing presence.",
  },
  {
    step: "03",
    title: "Buyer matching and sales progression",
    description:
      "PPM supports the journey from early interest through buyer qualification, inspections or walkthroughs, and ongoing sales progression.",
  },
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
                  We specialise in off-the-plan project marketing, connecting
                  developers with qualified buyers and investors while managing
                  the sales process from enquiry to conversion.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-sm bg-[#2f2a24] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1f1a17]"
                  >
                    Contact Us
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
                    {[
                      "Independent third-party representation",
                      "Qualified buyer and investor matching",
                      "Premium project marketing support",
                      "Clear path from interest to sale",
                    ].map((item) => (
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
        {/* Intro content block */}
        <div className="max-w-5xl">
          <h2 className="text-3xl font-light text-[#1f1a17] md:text-4xl">
            How PPM works with developers
          </h2>

          <div className="mt-8 space-y-6 text-[15px] leading-8 text-[#5b5147]">
            <p>
              PPM works with developers as an independent project marketing
              partner focused on connecting the right developments with the
              right buyers and investors.
            </p>

            <p>
              Rather than acting as a simple listing platform, PPM supports the
              broader sales journey by helping position projects effectively,
              building trust with prospective buyers, and guiding interest
              toward meaningful sales conversations.
            </p>

            <p>
              This approach gives developers a clearer pathway to market, with a
              premium presentation, stronger buyer alignment, and support across
              the project marketing process.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <section className="mt-16">
          <div className="mb-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
              Benefits of Partnering With PPM
            </p>
            <h3 className="mt-3 text-3xl font-light text-[#1f1a17] md:text-4xl">
              Built for trust, visibility, and stronger sales outcomes
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
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

        {/* CTA */}
        <section className="mt-16 rounded-sm border border-[#d9cec0] bg-[#efe8dd] px-8 py-10 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#8a7b6d]">
                Work With PPM
              </p>
              <h3 className="mt-3 text-3xl font-light text-[#1f1a17]">
                Interested in partnering with us?
              </h3>
              <p className="mt-4 text-[14px] leading-7 text-[#5b5147]">
                Get in touch with our team to discuss your project and how PPM
                can support your development marketing goals.
              </p>
            </div>

            <div>
              <Link
                href="/contact"
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