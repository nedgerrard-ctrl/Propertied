export type PrivacyBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'subheading'; text: string }
  | { kind: 'bullets'; intro?: string; bullets: string[] }

export type PrivacySection = {
  number: number
  heading: string
  blocks: PrivacyBlock[]
  details?: string[]
}

export const privacySections: PrivacySection[] = [
  {
    number: 1,
    heading: "Introduction",
    blocks: [
      { kind: 'paragraph', text: `The privacy of personal information you provide to us is important to us. This privacy policy governs how Property Project Marketing Pty Ltd trading as Online Property Services, together with our related entities, employees, contractors and licensed real estate agents who assist you (in this policy referred to as "we", "us", "our" or "PPM") collect, hold, use and disclose your personal information.` },
      { kind: 'paragraph', text: "We comply with the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth), as amended by the Privacy and Other Legislation Amendment Act 2024, together with all other applicable Commonwealth and Victorian privacy and data legislation, including:" },
      { kind: 'bullets', bullets: [
        "the Spam Act 2003 (Cth)",
        "the Do Not Call Register Act 2006 (Cth)",
        "the Estate Agents Act 1980 (Vic)",
        "the Residential Tenancies Act 1997 (Vic)",
        "the Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (Cth) as amended in 2024",
      ]},
      { kind: 'paragraph', text: "This policy explains what personal information we collect, why we collect it, how we use it, who we disclose it to, how we store it, and your rights in relation to it." },
    ],
  },
  {
    number: 2,
    heading: "What personal information we collect",
    blocks: [
      { kind: 'paragraph', text: "We collect personal information that is reasonably necessary to provide our real estate services. The categories of personal information we collect depend on which of our services you engage. The information we collect is limited to what is set out below." },
      { kind: 'subheading', text: "From enquirers, prospective buyers and developers" },
      { kind: 'bullets', bullets: [
        "Name, email address, telephone number and preferred contact times",
        "Property preferences, budget indications and stated objectives",
        "Country of residence and preferred language",
        "Records of communications between you and PPM",
        "Where you create a website account: your email address and a password (passwords are stored in encrypted, non-recoverable form)",
      ]},
      { kind: 'subheading', text: "From tenancy applicants" },
      { kind: 'paragraph', text: `Tenancy applications are submitted to PPM through the realestate.com.au tenant application service ("REA"), which itemises and collects the supporting documentation required to verify the application. As permitted under the Residential Tenancies Act 1997 (Vic) and consistent with industry practice for verifying rental applications, PPM receives copies of:` },
      { kind: 'bullets', bullets: [
        "Identification documents (typically passport, driver licence, Medicare card or similar government-issued document)",
        "Financial verification documents (typically recent payslips, employer statements, bank statements or Centrelink statements)",
        "Employer references, rental references (previous landlord or property manager), and character references",
        "Where an applicant's financial position is insufficient on its own (for example, applications from younger tenants), guarantor information from a parent or other guarantor, including their identification and financial verification",
      ]},
      { kind: 'paragraph', text: "PPM does not collect any tenancy application information beyond what is requested through the REA tenant application service." },
      { kind: 'paragraph', text: "Sensitive information (such as health information that bears on a tenancy application) is only collected where you have provided express consent or where the law requires it." },
      { kind: 'subheading', text: "From rental providers (landlords)" },
      { kind: 'paragraph', text: "The personal information we collect from rental providers is limited to the information requested on our standard Management Authority and related property-management forms (for example, name, contact details, banking details for rental disbursement, ownership details and authority to act)." },
      { kind: 'subheading', text: "From vendors" },
      { kind: 'paragraph', text: "The personal information we collect from vendors is limited to the information requested on our standard Sales Authority and supporting forms (for example, name, contact details, ownership details and authority to act)." },
      { kind: 'subheading', text: "From buyers under property sale contracts" },
      { kind: 'paragraph', text: "PPM does not currently collect or verify formal identity documents from property buyers as part of the purchase process. Identity verification for property transactions is generally handled by the buyer's solicitor or conveyancer at the contract and settlement stage." },
      { kind: 'paragraph', text: "This position will change in part from 1 July 2026 — see Customer Due Diligence under AML/CTF below." },
      { kind: 'subheading', text: "Website usage information" },
      { kind: 'paragraph', text: "When you use our website (www.ppmproperty.com.au), we automatically collect technical information including your IP address, device type, browser type, pages visited, referring website and time on site. This information is used for security, analytics and to improve the website. See Section 10 (Cookies and analytics) for further detail." },
      { kind: 'subheading', text: "Customer due diligence information under AML/CTF" },
      { kind: 'paragraph', text: "The Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (Cth) was amended in 2024 to extend reporting-entity obligations to real estate professionals from 1 July 2026." },
      { kind: 'paragraph', text: "From that date, PPM will be required to perform customer due diligence (CDD) on certain clients in connection with real estate transactions. CDD may include:" },
      { kind: 'bullets', bullets: [
        "collecting and verifying identity documents",
        "collecting source-of-funds information for the relevant transaction",
        "screening against sanctions lists and politically exposed person (PEP) databases",
        "identifying ultimate beneficial owners where the client is a company or trust",
        "ongoing monitoring of the customer relationship",
      ]},
      { kind: 'paragraph', text: "CDD records are retained for seven years from the end of the customer relationship as required by AUSTRAC. PPM performs customer due diligence using Reapit Verify, the AML/CTF compliance module built into our Reapit Sales (Agentbox) CRM platform. Identity and verification checks are initiated by the assigned PPM sales agent directly from within the existing CRM workflow, and the resulting check records are stored alongside the relevant client and transaction records in the same Reapit-hosted environment (Australian servers — see Section 6). Reapit Verify in turn passes data to underlying identity-data, sanctions-list and politically-exposed-person-list providers in order to complete the relevant checks. A current list of Reapit's sub-processors is published by Reapit; please contact our Compliance Officer if you would like the up-to-date list. Higher-risk transactions identified by Reapit Verify are automatically flagged for review by PPM's Compliance Officer, who makes the final decision on how the matter is handled." },
    ],
  },
  {
    number: 3,
    heading: "How we collect your personal information",
    blocks: [
      { kind: 'bullets', intro: "We may collect personal information from you through any of the following:", bullets: [
        "enquiry forms and registration of interest submissions on our website",
        "attendance at open inspections, sales inspections and property viewings",
        "Management Authority and Sales Authority forms completed by rental providers and vendors",
        "tenancy application forms completed by prospective tenants, processed through our property management platform (PropertyMe)",
        "AML/CTF customer identification and verification procedures",
        "direct correspondence with us by email, telephone, in person or via messaging platforms",
        "competitions, promotions, marketing events, webinars or registration for our publications",
        "third-party referrers, mortgage brokers, conveyancers, and accountants with your knowledge or consent",
        "publicly available sources where reasonably necessary (e.g. land titles registers, court records, sanctions and PEP databases for AML compliance)",
      ]},
      { kind: 'paragraph', text: "Where it is reasonable and practicable, we will give you the option of interacting with us anonymously or under a pseudonym. However, for most regulated services — including AML-regulated transactions, tenancy applications and Sales/Management Authorities — anonymous dealing is not practicable." },
    ],
  },
  {
    number: 4,
    heading: "How we use your personal information",
    blocks: [
      { kind: 'bullets', intro: "We use your personal information to:", bullets: [
        "conduct our business as a licensed real estate agency",
        "assess your suitability for buying, selling, leasing or managing property",
        "complete transactions, including completion of application forms, Management Authorities and Sales Authorities",
        "communicate with you about properties, services and market intelligence relevant to your stated interest",
        "meet our regulatory obligations under the Estate Agents Act 1980 (Vic), Residential Tenancies Act 1997 (Vic), AML/CTF Act 2006 (Cth), and the Australian Consumer Law",
        "perform customer due diligence, identity verification, and ongoing monitoring as required by AUSTRAC, using Reapit Verify (the AML/CTF module built into our Reapit Sales / Agentbox CRM)",
        "conduct internal administration, marketing planning, product development and quality assurance",
        "update third-party referrers regarding progress of a transaction, for example to calculate commission or referral fees",
        "process tenancy applications through PropertyMe, our authorised property management platform",
        "detect, investigate and prevent fraud, criminal activity, breaches of our terms, or harm to any person",
      ]},
      { kind: 'paragraph', text: "At any time you may opt out of receiving marketing communications by contacting our Privacy Officer or by using the unsubscribe function in any electronic message. Some service-related communications (e.g. transaction updates, regulatory notices) cannot be opted out of where they are required to deliver the service." },
    ],
  },
  {
    number: 5,
    heading: "Automated decision-making",
    blocks: [
      { kind: 'paragraph', text: "We may use automated tools to assist with tasks such as initial sorting of enquiries, document verification, identity matching and sanctions screening. We do not currently make decisions about you that have legal or similarly significant effects solely on the basis of automated processing. Where automated tools assist a human decision-maker, the final decision is made by a qualified PPM team member." },
      { kind: 'paragraph', text: "In particular, Reapit Verify performs automated identity matching, sanctions screening, politically-exposed-person screening and risk scoring of clients and transactions for AML/CTF purposes. Where Reapit Verify flags a transaction as higher-risk, that flag triggers a review by PPM's Compliance Officer, who makes the final decision on whether and how to proceed. Reapit Verify itself does not determine whether PPM proceeds with a transaction." },
      { kind: 'paragraph', text: "If at any point we introduce automated decision-making with significant effects, we will update this policy and provide you with the information required under the Privacy Act 1988 (Cth), including a meaningful description of the processing and your right to request human review." },
    ],
  },
  {
    number: 6,
    heading: "How we disclose your personal information",
    blocks: [
      { kind: 'bullets', intro: "We may disclose your personal information to:", bullets: [
        "Service providers — IT, cloud storage, payment processors, marketing platforms, mailing houses and analytics providers",
        "Reapit (Reapit Sales / Agentbox, including the Reapit Verify module) — our customer relationship management (CRM) and AML/CTF compliance platform. Reapit Sales receives website enquiries and stores ongoing client correspondence and transaction records; Reapit Verify, built into the same platform, performs customer due diligence checks (identity matching, sanctions and PEP screening, risk scoring) on PPM's behalf for AML/CTF-regulated transactions. Reapit hosts PPM client data on servers located in Australia. Reapit may engage sub-processors (including identity-data providers and sanctions/PEP list providers) in the course of performing Verify checks; a current sub-processor list is maintained by Reapit and can be requested via our Compliance Officer.",
        "REA tenant application service (realestate.com.au) — through which tenancy applications and their supporting documents are submitted to PPM for assessment",
        "PropertyMe — for tenancy application processing and property management record-keeping",
        "Government and regulatory bodies — including AUSTRAC, the Australian Taxation Office, Consumer Affairs Victoria, the Office of the Australian Information Commissioner, courts, tribunals and law enforcement agencies, where authorised or required by law",
        "Industry partners — including conveyancers, mortgage brokers, building inspectors, valuers and insurers, where relevant to the transaction and with your consent",
        "Referrers and joint marketing partners — where you have provided consent",
        "Vendors, purchasers, landlords or tenants — only to the extent necessary to give effect to a transaction or tenancy",
        "Professional advisers — our lawyers, accountants and auditors under confidentiality obligations",
        "In connection with a sale of our business — to potential or actual purchasers of all or part of our business, under appropriate confidentiality protections",
      ]},
      { kind: 'paragraph', text: "We do not sell, rent or trade personal information to third parties for marketing purposes." },
    ],
  },
  {
    number: 7,
    heading: "Disclosure of personal information to overseas recipients",
    blocks: [
      { kind: 'paragraph', text: "PPM serves clients across parts of the Asia-Pacific region. In the course of providing our services, personal information may be disclosed to or accessed by individuals or entities located outside Australia, including in:" },
      { kind: 'bullets', bullets: [
        "Mainland China and Hong Kong — for client services to investors based in those jurisdictions",
        "Singapore and Malaysia — for client services to investors based in those jurisdictions",
        "United States — where cloud storage and software platforms used by PPM (or by our service providers) are hosted by US-headquartered providers",
      ]},
      { kind: 'paragraph', text: "Before disclosing personal information to an overseas recipient, we will take reasonable steps to ensure that the overseas recipient does not breach the Australian Privacy Principles in relation to your information, including by entering into contractual measures requiring APP-equivalent treatment." },
      { kind: 'paragraph', text: "Where you are engaging with us from outside Australia, by providing your personal information you consent to its disclosure to overseas recipients as described in this policy." },
    ],
  },
  {
    number: 8,
    heading: "PropertyMe data processing",
    blocks: [
      { kind: 'paragraph', text: "Tenancy application data and property management records are processed and stored through PropertyMe, a third-party property management platform operated by Box+Dice Pty Ltd trading as PropertyMe. PropertyMe acts as a data processor on our behalf and is bound by its own privacy policy, which is published at propertyme.com." },
      { kind: 'paragraph', text: "PropertyMe stores data on servers located in Australia. We have satisfied ourselves that PropertyMe maintains appropriate data security and privacy standards consistent with the Australian Privacy Principles. PPM remains responsible as the data controller for all personal information processed through PropertyMe on our behalf." },
    ],
  },
  {
    number: 9,
    heading: "Website enquiry, registration and client member access",
    blocks: [
      { kind: 'bullets', intro: "When you submit an enquiry, register your interest, or create a client account through the PPM website (www.ppmproperty.com.au), the personal information you provide is:", bullets: [
        "received by PPM staff via our business email accounts hosted at onlinepropertyservices.com.au, and",
        "recorded in our customer relationship management (CRM) platform, Reapit-Agentbox, where ongoing communications and client records are maintained",
      ]},
      { kind: 'paragraph', text: "This information is used to respond to your enquiry and to provide ongoing communications about properties, services, market updates and member-only benefits that may be of interest to you. Where you have submitted an enquiry or transacted with PPM, we may rely on your inferred consent under the Spam Act 2003 (Cth) to send you related communications. Every electronic marketing communication includes an unsubscribe option, and you may withdraw consent at any time by contacting our Privacy Officer." },
      { kind: 'paragraph', text: "CRM database records are retained for as long as they remain relevant to providing our services or to potential future engagement with you, and are deleted or de-identified on request or when no longer required." },
      { kind: 'subheading', text: "Client member access" },
      { kind: 'paragraph', text: "PPM offers a free client member registration that provides access to:" },
      { kind: 'bullets', bullets: [
        "our full curated showcase of off-the-plan and established projects, including projects not displayed publicly",
        "preferential sales commission rates available only to PPM members",
        "early notice of selected new opportunities and member-only incentives",
      ]},
      { kind: 'paragraph', text: "Registration requires your name, email address, telephone number, country of residence and a password of your choosing. By registering you consent to PPM contacting you about properties and services relevant to your stated interest. You may close your account or withdraw consent for marketing communications at any time by contacting our Privacy Officer." },
      { kind: 'paragraph', text: "Your password is stored in encrypted (hashed) form and is not visible to PPM staff. We recommend using a strong, unique password and not sharing it with any third party." },
    ],
  },
  {
    number: 10,
    heading: "Cookies and analytics",
    blocks: [
      { kind: 'paragraph', text: "Our website uses cookies and similar technologies to maintain user sessions, generate aggregate website usage statistics and improve the user experience." },
      { kind: 'paragraph', text: "We use the following third-party analytics and tracking services:" },
      { kind: 'bullets', bullets: [
        "Google Analytics — to generate aggregate website usage statistics",
        "Meta Pixel (Facebook) — only if and where active for specific marketing campaigns",
      ]},
      { kind: 'paragraph', text: "These services may set cookies and collect online identifiers including IP addresses. You can control or disable cookies through your browser settings. You can opt out of Google personalised advertising at adssettings.google.com." },
      { kind: 'paragraph', text: "We do not knowingly store cookies that contain personally identifying information." },
    ],
  },
  {
    number: 11,
    heading: "How we store and protect your personal information",
    blocks: [
      { kind: 'paragraph', text: "We take reasonable steps to protect your personal information from misuse, interference, loss, unauthorised access, modification or disclosure. These include:" },
      { kind: 'bullets', bullets: [
        "physical security measures at our Melbourne office (Level 7, 570 St Kilda Road)",
        "restricted access to information systems based on role and need-to-know",
        "password protection and multi-factor authentication for staff system access",
        "encrypted transmission of sensitive data",
        "confidentiality obligations imposed on staff, contractors and third-party service providers",
        "regular security review of our IT systems and providers",
      ]},
      { kind: 'paragraph', text: "Personal information may be stored electronically (in databases, in PropertyMe, in cloud storage, on staff devices) and in physical files where applicable. We do not retain personal information for longer than necessary for the purpose for which it was collected or longer than required by law (including the seven-year retention period under the AML/CTF Act). When personal information is no longer required, it is destroyed or de-identified." },
      { kind: 'paragraph', text: "Despite the precautions we take, no electronic system is completely secure. You must take reasonable care to protect your own login credentials and notify us immediately if you suspect unauthorised access to your information." },
    ],
  },
  {
    number: 12,
    heading: "Data retention",
    blocks: [
      { kind: 'paragraph', text: "We retain personal information only for as long as necessary to:" },
      { kind: 'bullets', bullets: [
        "fulfil the purposes for which it was collected, including ongoing client relationship management within our CRM platform (Reapit-Agentbox)",
        "meet legal, accounting and regulatory record-keeping obligations (including the seven-year retention requirement under the AML/CTF Act 2006 (Cth) and the record-keeping requirements under the Estate Agents Act 1980 (Vic))",
        "exercise or defend legal claims",
      ]},
      { kind: 'paragraph', text: "CRM database records are retained for as long as they remain relevant to providing our services or to potential future engagement with you. You may request deletion of your records at any time by contacting our Privacy Officer." },
      { kind: 'paragraph', text: "When information is no longer required for any of the above purposes, we securely destroy or de-identify it." },
    ],
  },
  {
    number: 13,
    heading: "Notifiable Data Breaches",
    blocks: [
      { kind: 'paragraph', text: "We acknowledge our obligations under the Notifiable Data Breaches Scheme. If we suspect a data breach that is likely to result in serious harm to an affected individual, we will:" },
      { kind: 'bullets', bullets: [
        "contain the breach and assess the harm as soon as practicable",
        "where required, notify the affected individual or individuals",
        "where required, notify the Office of the Australian Information Commissioner",
      ]},
      { kind: 'paragraph', text: "We maintain a Data Breach Response Plan and conduct regular staff training on identification and reporting of suspected incidents." },
    ],
  },
  {
    number: 14,
    heading: "Children's privacy",
    blocks: [
      { kind: 'paragraph', text: "PPM's services are directed at adults. We do not knowingly collect personal information from individuals under 18 years of age except where they appear on a tenancy application as a dependent occupant disclosed by the lead applicant, or where required by law. We comply with the Children's Online Privacy Code as it comes into operation." },
      { kind: 'paragraph', text: "If we become aware that we have inadvertently collected personal information from a child without appropriate consent, we will take reasonable steps to delete that information." },
    ],
  },
  {
    number: 15,
    heading: "Direct marketing",
    blocks: [
      { kind: 'bullets', intro: "If you provide us with your email address or telephone number, we may use them to send you:", bullets: [
        "information about specific properties that may be of interest to you",
        "periodic property availability blasts and new listing notifications",
        "newsletters covering market commentary, off-the-plan and investment topics",
        "updates on PPM services, member benefits and changes to our offering",
      ]},
      { kind: 'paragraph', text: "Where you have made an enquiry with PPM or transacted with us, we rely on your inferred consent under the Spam Act 2003 (Cth) to send you communications of the kinds listed above. Where the relationship is more remote, or where a communication is outside the scope of inferred consent, we will rely on your express consent." },
      { kind: 'paragraph', text: "Every electronic marketing message will include a working unsubscribe link. Unsubscribe requests are processed within 5 business days as required by law. You may also withdraw consent at any time by contacting our Privacy Officer." },
      { kind: 'paragraph', text: "Operational communications relating to an active service, transaction or tenancy are not marketing communications and continue regardless of marketing preferences." },
      { kind: 'paragraph', text: "We comply with the Spam Act 2003 (Cth) and the Do Not Call Register Act 2006 (Cth) and will not send you unsolicited commercial electronic messages or make unsolicited telemarketing calls if you have registered on the Do Not Call Register, except as permitted by law." },
    ],
  },
  {
    number: 16,
    heading: "Your rights — access and correction",
    blocks: [
      { kind: 'bullets', intro: "You have the right to:", bullets: [
        "request access to the personal information we hold about you",
        "request correction of information you believe is inaccurate, out of date, incomplete, irrelevant or misleading",
        "request that we no longer use your information for direct marketing",
        "request information about how your personal information has been disclosed in the previous twelve months",
      ]},
      { kind: 'paragraph', text: "We will respond to your request within a reasonable period (generally no later than 30 days). We may charge a reasonable fee to cover administrative costs of providing copies of records. Identity verification will be required before we release personal information." },
      { kind: 'paragraph', text: "If we are unable to fulfil your request, we will explain why in writing." },
    ],
  },
  {
    number: 17,
    heading: "Complaints",
    blocks: [
      { kind: 'paragraph', text: "If you have a complaint about how we have handled your personal information, please contact our Privacy Officer in the first instance." },
      { kind: 'bullets', intro: "We will:", bullets: [
        "acknowledge your complaint within 5 business days",
        "conduct a thorough investigation",
        "aim to provide a substantive response within 30 days",
      ]},
      { kind: 'paragraph', text: "If you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC):" },
      { kind: 'bullets', bullets: [
        "Website: oaic.gov.au",
        "Phone: 1300 363 992",
        "Mail: GPO Box 5288, Sydney NSW 2001",
      ]},
      { kind: 'paragraph', text: "You may also have rights under the statutory tort for serious invasions of privacy introduced by the Privacy and Other Legislation Amendment Act 2024. We encourage you to seek your own legal advice on those rights." },
    ],
  },
  {
    number: 18,
    heading: "Changes to this privacy policy",
    blocks: [
      { kind: 'paragraph', text: "We may update this privacy policy from time to time to reflect changes in law, our business operations or our information handling practices. Any updated version will be published on this page and will take effect from the date of publication. We encourage you to review this page periodically." },
      { kind: 'paragraph', text: "The current effective date is shown at the top of this policy." },
    ],
  },
  {
    number: 19,
    heading: "Contact the Privacy Officer",
    blocks: [
      { kind: 'paragraph', text: "All access requests, correction requests, opt-out requests and privacy complaints should be directed to:" },
    ],
    details: [
      "The Privacy Officer  ·  Property Project Marketing Pty Ltd T/A Online Property Services",
      "Level 7, 570 St Kilda Road, Melbourne, Victoria 3004",
      "Email: admin@ppmproperty.com.au",
      "Compliance Officer (for AML/CTF matters): Ned Gerrard, Property Project Marketing Pty Ltd, Level 7, 570 St Kilda Road, Melbourne, Victoria 3004. Email: admin@ppmproperty.com.au",
      "ABN 99 162 429 558  ·  Estate Agents Licence No. 074846L",
    ],
  },
]

export function defaultSectionFields(): Record<string, string> {
  const fields: Record<string, string> = {}
  for (const section of privacySections) {
    const n = section.number
    section.blocks.forEach((block, bi) => {
      if (block.kind === 'paragraph' || block.kind === 'subheading') {
        fields[`s${n}k${bi}`] = block.text
      } else if (block.kind === 'bullets') {
        if (block.intro) fields[`s${n}k${bi}i`] = block.intro
        block.bullets.forEach((b, bui) => {
          fields[`s${n}k${bi}b${bui}`] = b
        })
      }
    })
    if (section.details) {
      section.details.forEach((d, i) => {
        fields[`s${n}d${i}`] = d
      })
    }
  }
  return fields
}

export function resolveText(key: string, overrides: Record<string, string>, defaultText: string): string {
  return overrides[key] !== undefined ? overrides[key] : defaultText
}
