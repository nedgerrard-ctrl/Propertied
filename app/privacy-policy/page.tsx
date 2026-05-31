"use client";

import dynamic from "next/dynamic";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const FloatingDust = dynamic(() => import("@/app/components/FloatingDust"), {
  ssr: false,
  loading: () => null,
});

type Section = {
  heading: string;
  body: React.ReactNode;
};

const sections: Section[] = [
  {
    heading: "1. Introduction",
    body: (
      <>
        <p>The privacy of personal information you provide to us is important to us. This privacy policy governs how Property Project Marketing Pty Ltd trading as Online Property Services, together with our related entities, employees, contractors and licensed real estate agents who assist you (in this policy referred to as "we", "us", "our" or "PPM") collect, hold, use and disclose your personal information.</p>
        <p className="mt-4">We comply with the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth), as amended by the Privacy and Other Legislation Amendment Act 2024, together with all other applicable Commonwealth and Victorian privacy and data legislation, including:</p>
        <ul className="mt-3 space-y-1 list-disc pl-6">
          <li>the Spam Act 2003 (Cth)</li>
          <li>the Do Not Call Register Act 2006 (Cth)</li>
          <li>the Estate Agents Act 1980 (Vic)</li>
          <li>the Residential Tenancies Act 1997 (Vic)</li>
          <li>the Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (Cth) as amended in 2024</li>
        </ul>
        <p className="mt-4">This policy explains what personal information we collect, why we collect it, how we use it, who we disclose it to, how we store it, and your rights in relation to it.</p>
      </>
    ),
  },
  {
    heading: "2. What personal information we collect",
    body: (
      <>
        <p>We collect personal information that is reasonably necessary to provide our real estate services. The categories of personal information we collect depend on which of our services you engage. The information we collect is limited to what is set out below.</p>

        <p className="mt-5 font-medium text-[#2a2320]">From enquirers, prospective buyers and developers</p>
        <ul className="mt-2 space-y-1 list-disc pl-6">
          <li>Name, email address, telephone number and preferred contact times</li>
          <li>Property preferences, budget indications and stated objectives</li>
          <li>Country of residence and preferred language</li>
          <li>Records of communications between you and PPM</li>
          <li>Where you create a website account: your email address and a password (passwords are stored in encrypted, non-recoverable form)</li>
        </ul>

        <p className="mt-5 font-medium text-[#2a2320]">From tenancy applicants</p>
        <p className="mt-2">Tenancy applications are submitted to PPM through our authorised tenant application service, which itemises and collects the supporting documentation required to verify the application. As permitted under the Residential Tenancies Act 1997 (Vic) and consistent with industry practice for verifying rental applications, PPM receives copies of:</p>
        <ul className="mt-2 space-y-1 list-disc pl-6">
          <li>Identification documents (typically passport, driver licence, Medicare card or similar government-issued document)</li>
          <li>Financial verification documents (typically recent payslips, employer statements, bank statements or Centrelink statements)</li>
          <li>Employer references, rental references (previous rental provider or property manager), and character references</li>
          <li>Where an applicant's financial position is insufficient on its own (for example, applications from younger tenants), guarantor information from a parent or other guarantor, including their identification and financial verification</li>
        </ul>
        <p className="mt-3">PPM does not collect any tenancy application information beyond what is requested through our authorised tenant application service.</p>
        <p className="mt-3">Sensitive information (such as health information that bears on a tenancy application) is only collected where you have provided express consent or where the law requires it.</p>

        <p className="mt-5 font-medium text-[#2a2320]">From rental providers (landlords)</p>
        <p className="mt-2">The personal information we collect from rental providers is limited to the information requested on our standard Management Authority and related property-management forms (for example, name, contact details, banking details for rental disbursement, ownership details and authority to act).</p>

        <p className="mt-5 font-medium text-[#2a2320]">From vendors</p>
        <p className="mt-2">The personal information we collect from vendors is limited to the information requested on our standard Sales Authority and supporting forms (for example, name, contact details, ownership details and authority to act).</p>

        <p className="mt-5 font-medium text-[#2a2320]">From buyers under property sale contracts</p>
        <p className="mt-2">PPM does not currently collect or verify formal identity documents from property buyers as part of the purchase process. Identity verification for property transactions is generally handled by the buyer's solicitor or conveyancer at the contract and settlement stage.</p>
        <p className="mt-3">This position will change in part when the amended AML/CTF Act takes effect — see Customer Due Diligence under AML/CTF below.</p>

        <p className="mt-5 font-medium text-[#2a2320]">Website usage information</p>
        <p className="mt-2">When you use our website (www.ppmproperty.com.au), we automatically collect technical information including your IP address, device type, browser type, pages visited, referring website and time on site. This information is used for security, analytics and to improve the website. See Section 10 (Cookies and analytics) for further detail.</p>

        <p className="mt-5 font-medium text-[#2a2320]">Customer due diligence information under AML/CTF</p>
        <p className="mt-2">The Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (Cth) was amended in 2024 to extend reporting-entity obligations to real estate professionals from the relevant commencement date. From that commencement date, PPM will be required to perform customer due diligence (CDD) on certain clients in connection with real estate transactions. CDD may include:</p>
        <ul className="mt-2 space-y-1 list-disc pl-6">
          <li>collecting and verifying identity documents</li>
          <li>collecting source-of-funds information for the relevant transaction</li>
          <li>screening against sanctions lists and politically exposed person (PEP) databases</li>
          <li>identifying ultimate beneficial owners where the client is a company or trust</li>
          <li>ongoing monitoring of the customer relationship</li>
        </ul>
        <p className="mt-3">CDD records are retained for the period required by AUSTRAC. PPM performs customer due diligence using our authorised AML/CTF compliance platform, which is built into our authorised CRM platform (Agentbox). Identity and verification checks are initiated by the assigned PPM sales agent directly from within the existing CRM workflow, and the resulting check records are stored alongside the relevant client and transaction records in the same operator-hosted environment (Australian servers — see Section 6). Our authorised AML/CTF compliance platform in turn passes data to underlying identity-data, sanctions-list and politically-exposed-person-list providers in order to complete the relevant checks. Higher-risk transactions identified by our authorised AML/CTF compliance platform are automatically flagged for review by PPM's Compliance Officer, who makes the final decision on how the matter is handled.</p>
      </>
    ),
  },
  {
    heading: "3. How we collect your personal information",
    body: (
      <>
        <p>We may collect personal information from you through any of the following:</p>
        <ul className="mt-3 space-y-1 list-disc pl-6">
          <li>enquiry forms and registration of interest submissions on our website</li>
          <li>attendance at open inspections, sales inspections and property viewings</li>
          <li>Management Authority and Sales Authority forms completed by rental providers and vendors</li>
          <li>tenancy application forms completed by prospective tenants, processed through our authorised property management platform</li>
          <li>AML/CTF customer identification and verification procedures</li>
          <li>direct correspondence with us by email, telephone, in person or via messaging platforms</li>
          <li>competitions, promotions, marketing events, webinars or registration for our publications</li>
          <li>third-party referrers, mortgage brokers, conveyancers, and accountants with your knowledge or consent</li>
          <li>publicly available sources where reasonably necessary (e.g. land titles registers, court records, sanctions and PEP databases for AML compliance)</li>
        </ul>
        <p className="mt-4">Where it is reasonable and practicable, we will give you the option of interacting with us anonymously or under a pseudonym. However, for most regulated services — including AML-regulated transactions, tenancy applications and Sales/Management Authorities — anonymous dealing is not practicable.</p>
      </>
    ),
  },
  {
    heading: "4. How we use your personal information",
    body: (
      <>
        <p>We use your personal information to:</p>
        <ul className="mt-3 space-y-1 list-disc pl-6">
          <li>conduct our business as a licensed real estate agency</li>
          <li>assess your suitability for buying, selling, leasing or managing property</li>
          <li>complete transactions, including completion of application forms, Management Authorities and Sales Authorities</li>
          <li>communicate with you about properties, services and market intelligence relevant to your stated interest</li>
          <li>meet our regulatory obligations under the Estate Agents Act 1980 (Vic), Residential Tenancies Act 1997 (Vic), AML/CTF Act 2006 (Cth), and the Australian Consumer Law</li>
          <li>perform customer due diligence, identity verification, and ongoing monitoring as required by AUSTRAC, using our authorised AML/CTF compliance platform</li>
          <li>conduct internal administration, marketing planning, product development and quality assurance</li>
          <li>update third-party referrers regarding progress of a transaction, for example to calculate commission or referral fees</li>
          <li>process tenancy applications through our authorised property management platform</li>
          <li>detect, investigate and prevent fraud, criminal activity, breaches of our terms, or harm to any person</li>
        </ul>
        <p className="mt-4">At any time you may opt out of receiving marketing communications by contacting our Privacy Officer or by using the unsubscribe function in any electronic message. Some service-related communications (e.g. transaction updates, regulatory notices) cannot be opted out of where they are required to deliver the service.</p>
      </>
    ),
  },
  {
    heading: "5. Automated decision-making",
    body: (
      <>
        <p>We may use automated tools to assist with tasks such as initial sorting of enquiries, document verification, identity matching and sanctions screening. We do not currently make decisions about you that have legal or similarly significant effects solely on the basis of automated processing. Where automated tools assist a human decision-maker, the final decision is made by a qualified PPM team member.</p>
        <p className="mt-4">In particular, our authorised AML/CTF compliance platform performs automated identity matching, sanctions screening, politically-exposed-person screening and risk scoring of clients and transactions for AML/CTF purposes. Where our authorised AML/CTF compliance platform flags a transaction as higher-risk, that flag triggers a review by PPM's Compliance Officer, who makes the final decision on whether and how to proceed. Our authorised AML/CTF compliance platform itself does not determine whether PPM proceeds with a transaction.</p>
        <p className="mt-4">If at any point we introduce automated decision-making with significant effects, we will update this policy and provide you with the information required under the Privacy Act 1988 (Cth), including a meaningful description of the processing and your right to request human review.</p>
      </>
    ),
  },
  {
    heading: "6. How we disclose your personal information",
    body: (
      <>
        <p>We may disclose your personal information to:</p>
        <ul className="mt-3 space-y-1 list-disc pl-6">
          <li>Service providers — IT, cloud storage, payment processors, marketing platforms, mailing houses and analytics providers</li>
          <li>Our authorised CRM and AML/CTF compliance platform — used for client relationship management and to perform customer due diligence checks in connection with AML/CTF-regulated transactions</li>
          <li>Our authorised tenant application service — through which tenancy applications and their supporting documents are submitted to PPM for assessment</li>
          <li>Our authorised property management platform — for tenancy application processing and property management record-keeping</li>
          <li>Government and regulatory bodies — including AUSTRAC, the Australian Taxation Office, Consumer Affairs Victoria, the Office of the Australian Information Commissioner, courts, tribunals and law enforcement agencies, where authorised or required by law</li>
          <li>Industry partners — including conveyancers, mortgage brokers, building inspectors, valuers and insurers, where relevant to the transaction and with your consent</li>
          <li>Referrers and joint marketing partners — where you have provided consent</li>
          <li>Vendors, purchasers, landlords or tenants — only to the extent necessary to give effect to a transaction or tenancy</li>
          <li>Professional advisers — our lawyers, accountants and auditors under confidentiality obligations</li>
          <li>In connection with a sale of our business — to potential or actual purchasers of all or part of our business, under appropriate confidentiality protections</li>
        </ul>
        <p className="mt-4">We do not sell, rent or trade personal information to third parties for marketing purposes.</p>
      </>
    ),
  },
  {
    heading: "7. Disclosure of personal information to overseas recipients",
    body: (
      <>
        <p>PPM serves clients across parts of the Asia-Pacific region. In the course of providing our services, personal information may be disclosed to or accessed by individuals or entities located outside Australia, including in:</p>
        <ul className="mt-3 space-y-1 list-disc pl-6">
          <li>Mainland China and Hong Kong — for client services to investors based in those jurisdictions</li>
          <li>Singapore and Malaysia — for client services to investors based in those jurisdictions</li>
          <li>United States — if cloud storage and software platforms used by PPM (or by our service providers) are hosted by US-headquartered providers</li>
        </ul>
        <p className="mt-4">Before disclosing personal information to an overseas recipient, we will take reasonable steps to ensure that the overseas recipient does not breach the Australian Privacy Principles in relation to your information, including by entering into contractual measures requiring APP-equivalent treatment.</p>
        <p className="mt-4">Where you are engaging with us from outside Australia, by providing your personal information you consent to its disclosure to overseas recipients as described in this policy.</p>
      </>
    ),
  },
  {
    heading: "8. Property management platform data processing",
    body: (
      <p>Tenancy application data and property management records are processed and stored through our authorised property management platform, operated by a third-party platform provider. Our authorised property management platform acts as a data processor on our behalf and is bound by its own privacy policy, which is published at the platform operator's published privacy policy.</p>
    ),
  },
  {
    heading: "9. Website enquiry, registration and client member access",
    body: (
      <>
        <p>When you submit an enquiry, register your interest, or create a client account through the PPM website, the personal information you provide is:</p>
        <ul className="mt-3 space-y-1 list-disc pl-6">
          <li>received by PPM staff via our business email accounts hosted at onlinepropertyservices.com.au, and</li>
          <li>recorded in our authorised CRM platform, where ongoing communications and client records may be maintained</li>
        </ul>
        <p className="mt-4">This information is used to respond to your enquiry and to provide ongoing communications about properties, services, market updates and member-only benefits that may be of interest to you. Where you have submitted an enquiry or transacted with PPM, we may rely on your inferred consent under the Spam Act 2003 (Cth) to send you related communications. Every electronic marketing communication includes an unsubscribe option, and you may withdraw consent at any time by contacting our Privacy Officer.</p>
        <p className="mt-4">CRM database records are retained for as long as they remain relevant to providing our services or to potential future engagement with you, and are deleted or de-identified on request or when no longer required.</p>

        <p className="mt-5 font-medium text-[#2a2320]">Client member access</p>
        <p className="mt-2">PPM may offer a free client member registration that provides access to:</p>
        <ul className="mt-2 space-y-1 list-disc pl-6">
          <li>our full curated showcase of off-the-plan and established projects, including projects not displayed publicly</li>
          <li>preferential sales commission rates available only to PPM members</li>
          <li>early notice of selected new opportunities and member-only incentives</li>
        </ul>
        <p className="mt-3">If it does, registration requires your name, email address, telephone number, country of residence and a password of your choosing. By registering you consent to PPM contacting you about properties and services relevant to your stated interest. You may close your account or withdraw consent for marketing communications at any time by contacting our Privacy Officer.</p>
      </>
    ),
  },
  {
    heading: "10. Cookies and analytics",
    body: (
      <>
        <p>Our website uses cookies and similar technologies to maintain user sessions, generate aggregate website usage statistics and improve the user experience.</p>
        <p className="mt-4">We use the following third-party analytics and tracking services:</p>
        <ul className="mt-2 space-y-1 list-disc pl-6">
          <li>Google Analytics — to generate aggregate website usage statistics</li>
          <li>Meta Pixel (Facebook) — only if and where active for specific marketing campaigns</li>
        </ul>
        <p className="mt-4">These services may set cookies and collect online identifiers including IP addresses. You can control or disable cookies through your browser settings. You can opt out of Google personalised advertising at adssettings.google.com.</p>
        <p className="mt-4">We do not knowingly store cookies that contain personally identifying information.</p>
      </>
    ),
  },
  {
    heading: "11. How we store and protect your personal information",
    body: (
      <>
        <p>We take reasonable steps to protect your personal information from misuse, interference, loss, unauthorised access, modification or disclosure. These include:</p>
        <ul className="mt-3 space-y-1 list-disc pl-6">
          <li>physical security measures at our Melbourne office (Level 7, 570 St Kilda Road)</li>
          <li>restricted access to information systems based on role and need-to-know</li>
          <li>password protection and multi-factor authentication for staff system access</li>
          <li>encrypted transmission of sensitive data</li>
          <li>confidentiality obligations imposed on staff, contractors and third-party service providers</li>
          <li>regular security review of our IT systems and providers</li>
        </ul>
        <p className="mt-4">Personal information may be stored electronically (in databases, in our authorised property management platform, in cloud storage, on staff devices) and in physical files where applicable. We do not retain personal information for longer than necessary for the purpose for which it was collected or longer than required by law (including the seven-year retention period under the AML/CTF Act). When personal information is no longer required, it is destroyed or de-identified.</p>
        <p className="mt-4">Despite the precautions we take, no electronic system is completely secure. You must take reasonable care to protect your own login credentials and notify us immediately if you suspect unauthorised access to your information.</p>
      </>
    ),
  },
  {
    heading: "12. Data retention",
    body: (
      <>
        <p>We retain personal information only for as long as necessary to:</p>
        <ul className="mt-3 space-y-1 list-disc pl-6">
          <li>fulfil the purposes for which it was collected, including ongoing client relationship management within our authorised CRM platform</li>
          <li>meet legal, accounting and regulatory record-keeping obligations (including the seven-year retention requirement under the AML/CTF Act 2006 (Cth) and the record-keeping requirements under the Estate Agents Act 1980 (Vic))</li>
          <li>exercise or defend legal claims</li>
        </ul>
        <p className="mt-4">CRM database records are retained for as long as they remain relevant to providing our services or to potential future engagement with you. You may request deletion of your records at any time by contacting our Privacy Officer.</p>
        <p className="mt-4">When information is no longer required for any of the above purposes, we securely destroy or de-identify it.</p>
      </>
    ),
  },
  {
    heading: "13. Notifiable Data Breaches",
    body: (
      <>
        <p>We acknowledge our obligations under the Notifiable Data Breaches Scheme. If we suspect a data breach that is likely to result in serious harm to an affected individual, we will:</p>
        <ul className="mt-3 space-y-1 list-disc pl-6">
          <li>contain the breach and assess the harm as soon as practicable</li>
          <li>where required, notify the affected individual or individuals</li>
          <li>where required, notify the Office of the Australian Information Commissioner</li>
        </ul>
        <p className="mt-4">We maintain a Data Breach Response Plan and conduct regular staff training on identification and reporting of suspected incidents.</p>
      </>
    ),
  },
  {
    heading: "14. Children's privacy",
    body: (
      <>
        <p>PPM's services are directed at adults. We do not knowingly collect personal information from individuals under 18 years of age except where they appear on a tenancy application as a dependent occupant disclosed by the lead applicant, or where required by law. We comply with the Children's Online Privacy Code as it comes into operation.</p>
        <p className="mt-4">If we become aware that we have inadvertently collected personal information from a child without appropriate consent, we will take reasonable steps to delete that information.</p>
      </>
    ),
  },
  {
    heading: "15. Direct marketing",
    body: (
      <>
        <p>If you provide us with your email address or telephone number, we may use them to send you:</p>
        <ul className="mt-3 space-y-1 list-disc pl-6">
          <li>information about specific properties that may be of interest to you</li>
          <li>periodic property availability blasts and new listing notifications</li>
          <li>newsletters covering market commentary, off-the-plan and investment topics</li>
          <li>updates on PPM services, member benefits and changes to our offering</li>
        </ul>
        <p className="mt-4">Where you have made an enquiry with PPM or transacted with us, we rely on your inferred consent under the Spam Act 2003 (Cth) to send you communications of the kinds listed above. Where the relationship is more remote, or where a communication is outside the scope of inferred consent, we will rely on your express consent.</p>
        <p className="mt-4">Every electronic marketing message will include a working unsubscribe link. Unsubscribe requests are processed within 5 business days as required by law. You may also withdraw consent at any time by contacting our Privacy Officer.</p>
        <p className="mt-4">Operational communications relating to an active service, transaction or tenancy are not marketing communications and continue regardless of marketing preferences.</p>
        <p className="mt-4">We comply with the Spam Act 2003 (Cth) and the Do Not Call Register Act 2006 (Cth) and will not send you unsolicited commercial electronic messages or make unsolicited telemarketing calls if you have registered on the Do Not Call Register, except as permitted by law.</p>
      </>
    ),
  },
  {
    heading: "16. Your rights — access and correction",
    body: (
      <>
        <p>You have the right to:</p>
        <ul className="mt-3 space-y-1 list-disc pl-6">
          <li>request access to the personal information we hold about you</li>
          <li>request correction of information you believe is inaccurate, out of date, incomplete, irrelevant or misleading</li>
          <li>request that we no longer use your information for direct marketing</li>
          <li>request information about how your personal information has been disclosed in the previous twelve months</li>
        </ul>
        <p className="mt-4">We will respond to your request within a reasonable period (generally no later than 30 days). We may charge a reasonable fee to cover administrative costs of providing copies of records. Identity verification will be required before we release personal information.</p>
        <p className="mt-4">If we are unable to fulfil your request, we will explain why in writing.</p>
      </>
    ),
  },
  {
    heading: "17. Complaints",
    body: (
      <>
        <p>If you have a complaint about how we have handled your personal information, please contact our Privacy Officer in the first instance.</p>
        <p className="mt-4">We will:</p>
        <ul className="mt-2 space-y-1 list-disc pl-6">
          <li>acknowledge your complaint within 5 business days</li>
          <li>conduct a thorough investigation</li>
          <li>aim to provide a substantive response within 30 days</li>
        </ul>
        <p className="mt-4">If you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC):</p>
        <ul className="mt-2 space-y-1 list-disc pl-6">
          <li>Website: oaic.gov.au</li>
          <li>Phone: 1300 363 992</li>
          <li>Mail: GPO Box 5288, Sydney NSW 2001</li>
        </ul>
        <p className="mt-4">You may also have rights under the statutory tort for serious invasions of privacy introduced by the Privacy and Other Legislation Amendment Act 2024. We encourage you to seek your own legal advice on those rights.</p>
      </>
    ),
  },
  {
    heading: "18. Changes to this privacy policy",
    body: (
      <>
        <p>We may update this privacy policy from time to time to reflect changes in law, our business operations or our information handling practices. Any updated version will be published on this page and will take effect from the date of publication. We encourage you to review this page periodically.</p>
        <p className="mt-4">The current effective date is shown at the top of this policy.</p>
      </>
    ),
  },
  {
    heading: "19. Contact the Privacy Officer",
    body: (
      <>
        <p>All access requests, correction requests, opt-out requests and privacy complaints should be directed to:</p>
        <div className="mt-4 space-y-1">
          <p className="font-medium text-[#2a2320]">The Privacy Officer · Property Project Marketing Pty Ltd T/A Online Property Services</p>
          <p>Level 7, 570 St Kilda Road, Melbourne, Victoria 3004</p>
          <p>
            Email:{" "}
            <a
              href="mailto:admin@onlinepropertyservices.com.au"
              className="text-[#2a2320] underline underline-offset-2 hover:text-[#c8a96e] transition-colors"
            >
              admin@onlinepropertyservices.com.au
            </a>
          </p>
        </div>
        <p className="mt-4">Compliance Officer (for AML/CTF matters): Ned Gerrard, Property Project Marketing Pty Ltd, Level 7, 570 St Kilda Road, Melbourne, Victoria 3004. Email:{" "}
          <a
            href="mailto:admin@onlinepropertyservices.com.au"
            className="text-[#2a2320] underline underline-offset-2 hover:text-[#c8a96e] transition-colors"
          >
            admin@onlinepropertyservices.com.au
          </a>
        </p>
        <p className="mt-6 text-[12px] tracking-[0.08em] text-[#8a7b6d]">
          ABN 99 162 429 558 · Estate Agents Licence No. 074846L
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen w-full text-[#1f1a17]">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
        <FloatingDust />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">Legal</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">Privacy</p>
          </div>

          <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white max-w-4xl">
              PPM{" "}
              <span className="text-[#c8a96e]">Privacy Policy</span>
            </h1>
          </div>

          <p className="mt-8 max-w-[52ch] text-[14px] leading-[1.9] text-[#8a7b6d]">
            This policy is reviewed and updated periodically. The current version applies from the date of publication.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-8">

          {/* Intro */}
          <p className="text-[14px] leading-[1.9] text-[#3d3530]">
            This privacy policy is published by Property Project Marketing Pty Ltd (ABN 99 162 429 558), trading as Online Property Services, the licensed estate agent operating under the brand "PPM" (Estate Agents Licence No. 074846L).
          </p>

          {/* Sections */}
          <div className="mt-12 divide-y divide-[#ede8e1]">
            {sections.map((section) => (
              <div key={section.heading} className="py-10 first:pt-0">
                <h2 className="text-[15px] font-semibold text-[#1f1a17] mb-4">
                  {section.heading}
                </h2>
                <div className="text-[14px] leading-[1.9] text-[#3d3530]">
                  {section.body}
                </div>
              </div>
            ))}
          </div>

          {/* Footer credit */}
          <div className="mt-12 border-t border-[#ede8e1] pt-6 text-center">
            <p className="text-[11px] tracking-[0.18em] text-[#b0a090]">
              © 2026 Property Project Marketing Pty Ltd. All rights reserved.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
