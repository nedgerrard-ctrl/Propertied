'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const FloatingDust = dynamic(() => import('../components/FloatingDust'), {
  ssr: false,
  loading: () => null,
})

type Section = {
  number: number
  heading: string
  paragraphs: string[]
  bullets?: { intro?: string; items: string[] }
  details?: string[]
}

const sections: Section[] = [
  {
    number: 1,
    heading: "Acceptance of these Terms",
    paragraphs: [
      "By accessing or using the PPM website at www.ppmproperty.com.au (the \"Website\"), you agree to be bound by these Terms of Use. If you do not agree, you must not use the Website.",
      "These Terms of Use apply to all visitors, registered users, and others who access the Website. They are to be read together with our Privacy Policy, which governs how we collect and handle your personal information.",
      "We may update these Terms of Use at any time by posting a revised version on this page. Continued use of the Website after any update constitutes your acceptance of the revised terms.",
    ],
  },
  {
    number: 2,
    heading: "About PPM",
    paragraphs: [
      "The Website is operated by Property Project Marketing Pty Ltd (ABN 99 162 429 558), trading as Online Property Services, a licensed estate agent operating under the brand \"PPM\" (Estate Agents Licence No. 074846L), with its principal place of business at Level 7, 570 St Kilda Road, Melbourne, Victoria 3004.",
      "References to \"PPM\", \"we\", \"us\" and \"our\" in these Terms of Use are references to Property Project Marketing Pty Ltd and its related entities, employees, contractors and licensed agents.",
    ],
  },
  {
    number: 3,
    heading: "Use of the Website",
    paragraphs: [
      "You may use the Website only for lawful purposes and in accordance with these Terms of Use. You must not use the Website in any way that breaches any applicable local, national or international law or regulation, or that is unlawful or fraudulent.",
    ],
    bullets: {
      intro: "You must not:",
      items: [
        "use the Website in any way that could damage, disable, overburden or impair it, or interfere with any other user's use of the Website",
        "attempt to gain unauthorised access to any part of the Website, the server on which the Website is stored, or any server, computer or database connected to the Website",
        "use automated scripts, bots or crawlers to scrape, copy or extract data from the Website without our prior written consent",
        "transmit any unsolicited or unauthorised advertising or promotional material",
        "use the Website to impersonate any person or entity, or to misrepresent your affiliation with any person or entity",
        "upload or transmit any material that is defamatory, offensive, unlawful, or that infringes the intellectual property rights of any third party",
      ],
    },
  },
  {
    number: 4,
    heading: "Accounts and Registration",
    paragraphs: [
      "Certain features of the Website require registration. When you register for an account, you must provide accurate, current and complete information and keep that information updated.",
      "You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately if you become aware of any unauthorised use of your account.",
      "We reserve the right to suspend or terminate your account at any time if we reasonably believe you have breached these Terms of Use, provided false information during registration, or engaged in activity harmful to other users or to PPM.",
      "Accounts registered by \"Existing Clients\" are subject to manual approval by PPM. Approval is at our sole discretion and does not create any obligation to provide any specific service.",
    ],
  },
  {
    number: 5,
    heading: "Intellectual Property",
    paragraphs: [
      "All content on the Website — including text, graphics, logos, images, data compilations, software, and the overall design and layout — is the property of Property Project Marketing Pty Ltd or its content licensors and is protected by Australian and international copyright and intellectual property laws.",
      "You may view and print pages from the Website for your own personal, non-commercial use only. You must not reproduce, distribute, modify, publicly display or create derivative works from any content on the Website without our prior written consent.",
      "The PPM name, logo and related marks are trade marks of Property Project Marketing Pty Ltd. Nothing on the Website grants any licence to use any trade mark without our prior written consent.",
    ],
  },
  {
    number: 6,
    heading: "Property Information and Listings",
    paragraphs: [
      "Property information, project details, pricing indications, floor plan images and availability details published on the Website are provided for general information purposes only. They do not constitute a representation, warranty or offer to sell or lease any property.",
      "Property availability, pricing and specifications are subject to change without notice and should be verified independently before any reliance is placed on them. PPM recommends that you obtain independent legal, financial and building advice before committing to any property transaction.",
      "Images, renders and artist impressions of properties shown on the Website are indicative only. Completed developments may differ from images shown.",
    ],
  },
  {
    number: 7,
    heading: "No Financial or Legal Advice",
    paragraphs: [
      "Nothing on this Website constitutes financial product advice, investment advice, legal advice or taxation advice. PPM is a licensed real estate agent, not a financial adviser or legal practitioner.",
      "You should obtain your own independent financial, legal and taxation advice before making any property investment decision. Past performance of property values is not indicative of future performance.",
    ],
  },
  {
    number: 8,
    heading: "Disclaimer of Warranties",
    paragraphs: [
      "The Website and its content are provided on an \"as is\" and \"as available\" basis. To the maximum extent permitted by law, PPM makes no representations or warranties of any kind, express or implied, regarding the Website or its content, including as to accuracy, completeness, reliability or fitness for a particular purpose.",
      "We do not warrant that the Website will be uninterrupted, error-free or free of viruses or other harmful components. You are responsible for implementing sufficient security measures to protect your own systems when accessing the Website.",
      "Our full legal and regulatory disclosures are set out in our Full Disclaimer, available at /full-disclaimer.",
    ],
  },
  {
    number: 9,
    heading: "Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by applicable law, PPM and its directors, employees, agents and licensors will not be liable to you for any indirect, incidental, special, consequential or punitive loss or damage arising out of or in connection with your use of, or inability to use, the Website or its content.",
      "Where legislation implies any condition, warranty or guarantee that cannot be excluded, PPM's liability for any breach of such implied term is limited, to the maximum extent permitted by law, to re-supplying the relevant service or the cost of having that service supplied again.",
      "Nothing in these Terms of Use excludes, restricts or modifies any right or remedy, or any guarantee, warranty or other term or condition, implied or imposed by the Australian Consumer Law that cannot lawfully be excluded or limited.",
    ],
  },
  {
    number: 10,
    heading: "Third-Party Links and Services",
    paragraphs: [
      "The Website may contain links to third-party websites or services. These links are provided for your convenience only. PPM does not endorse, control or take responsibility for the content, privacy practices or availability of any linked third-party website.",
      "Your use of third-party websites is at your own risk and subject to the terms and conditions of those websites.",
    ],
  },
  {
    number: 11,
    heading: "Cookies and Analytics",
    paragraphs: [
      "The Website uses cookies and similar technologies. Please refer to Section 10 of our Privacy Policy for full details of how we use cookies, the third-party analytics services we use (including Google Analytics and Meta Pixel), and how you can manage your cookie preferences.",
    ],
  },
  {
    number: 12,
    heading: "Governing Law",
    paragraphs: [
      "These Terms of Use are governed by the laws of Victoria, Australia. You submit to the non-exclusive jurisdiction of the courts of Victoria and the Federal Court of Australia.",
    ],
  },
  {
    number: 13,
    heading: "Changes to these Terms",
    paragraphs: [
      "We may update these Terms of Use from time to time. The current version will always be available on this page with the effective date shown below. We encourage you to review this page periodically.",
    ],
  },
  {
    number: 14,
    heading: "Contact Us",
    paragraphs: [
      "Questions about these Terms of Use should be directed to:",
    ],
    details: [
      "Property Project Marketing Pty Ltd T/A Online Property Services",
      "Level 7, 570 St Kilda Road, Melbourne, Victoria 3004",
      "Email: admin@ppmproperty.com.au",
      "ABN 99 162 429 558  ·  Estate Agents Licence No. 074846L",
    ],
  },
]

function SectionBlock({ section }: { section: Section }) {
  return (
    <div className="py-8 border-t border-[#ede8e1] first:border-t-0 first:pt-0">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c8a96e] mb-4">
        {section.number}. {section.heading}
      </h2>
      <div className="space-y-4">
        {section.paragraphs.map((p, i) => (
          <p key={i} className="text-[14px] leading-[1.9] text-[#3d3530]">
            {p}
          </p>
        ))}
        {section.bullets && (
          <div className="space-y-2">
            {section.bullets.intro && (
              <p className="text-[14px] leading-[1.9] text-[#3d3530]">{section.bullets.intro}</p>
            )}
            <ul className="space-y-2 pl-4">
              {section.bullets.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-[14px] leading-[1.9] text-[#3d3530]">
                  <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a96e]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {section.details && (
          <div className="border-l-2 border-[#c8a96e] pl-5 space-y-1">
            {section.details.map((d, i) => (
              <p key={i} className="text-[13px] leading-[1.8] text-[#1f1a17]">{d}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TermsPage() {
  return (
    <main className="min-h-screen w-full text-[#1f1a17]">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
        <FloatingDust />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">Legal</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">Terms</p>
          </div>
          <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white max-w-4xl">
              Terms of
              <br />
              <span className="text-[#c8a96e]">Use.</span>
            </h1>
          </div>
          <p className="mt-8 max-w-[52ch] text-[14px] leading-[1.9] text-[#8a7b6d]">
            Please read these terms carefully before using the PPM website. Effective 1 July 2026.
          </p>
        </div>
      </section>

      {/* Document header */}
      <section className="bg-[#f6f2eb] border-b border-[#e3d8ca] py-10">
        <div className="mx-auto max-w-3xl px-8">
          <p className="text-[13px] font-semibold text-[#1f1a17]">PPM Terms of Use</p>
          <p className="mt-1 text-[12px] text-[#8a7b6d]">Effective date: 1 July 2026  ·  Last reviewed: June 2026</p>
          <p className="mt-0.5 text-[12px] text-[#8a7b6d]">Publication: www.ppmproperty.com.au/terms</p>
          <p className="mt-3 text-[13px] leading-[1.8] text-[#3d3530]">
            These Terms of Use are published by Property Project Marketing Pty Ltd (ABN 99 162 429 558), trading as Online Property Services, the licensed estate agent operating under the brand &ldquo;PPM&rdquo; (Estate Agents Licence No. 074846L).
            These Terms govern your access to and use of the PPM website and related services. For information about how we collect and handle personal data, see our{' '}
            <Link href="/privacy-policy" className="text-[#c8a96e] underline underline-offset-2 hover:text-[#a8894e]">Privacy Policy</Link>.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-8">
          <div>
            {sections.map((section) => (
              <SectionBlock key={section.number} section={section} />
            ))}
          </div>
          <div className="mt-12 border-t border-[#ede8e1] pt-8">
            <p className="text-[12px] text-[#8a7b6d]">
              © 2026 Property Project Marketing Pty Ltd. All rights reserved.
            </p>
          </div>
          <div className="mt-8 border-t border-[#ede8e1] pt-6 text-center">
            <p className="text-[11px] tracking-[0.18em] text-[#b0a090]">
              PPM · Property Project Marketing · www.onlineprojects.com.au
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
