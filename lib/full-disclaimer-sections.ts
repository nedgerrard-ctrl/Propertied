/** Flat key → default text for every editable element across all 20 sections */
export function defaultSectionFields(): Record<string, string> {
  const fields: Record<string, string> = {}
  for (const s of disclaimerSections) {
    const n = s.number
    if (s.type === 'paragraphs') {
      s.paragraphs.forEach((p, i) => { fields[`s${n}p${i}`] = p })
    } else if (s.type === 'mixed') {
      s.blocks.forEach((block, bi) => {
        if (block.kind === 'paragraph') {
          fields[`s${n}k${bi}`] = block.text
        } else {
          if (block.intro) fields[`s${n}k${bi}i`] = block.intro
          block.bullets.forEach((b, bui) => { fields[`s${n}k${bi}b${bui}`] = b })
        }
      })
    } else if (s.type === 'contact') {
      s.paragraphs.forEach((p, i) => { fields[`s${n}p${i}`] = p })
      s.details.forEach((d, i) => { fields[`s${n}d${i}`] = d })
    }
  }
  return fields
}

/** Resolve a field's display text: use override if saved, else the static default */
export function resolveText(
  key: string,
  overrides: Record<string, string>,
  defaultText: string
): string {
  return overrides[key] || defaultText
}

export type DisclaimerBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'bullets'; intro?: string; bullets: string[] }

export type DisclaimerSection = {
  number: number
  heading: string
} & (
  | { type: 'paragraphs'; paragraphs: string[] }
  | { type: 'mixed'; blocks: DisclaimerBlock[] }
  | { type: 'contact'; paragraphs: string[]; details: string[] }
)

export const disclaimerSections: DisclaimerSection[] = [
  {
    number: 1,
    heading: 'Entity and licensing',
    type: 'paragraphs',
    paragraphs: [
      'PPM is the public-facing brand of Property Project Marketing Pty Ltd (ABN 99 162 429 558), trading as Online Property Services. PPM is a licensed real estate agency in Victoria, Australia (Estate Agents Licence No. 074846L). PPM operates from Level 7, 570 St Kilda Road, Melbourne, Victoria 3004.',
    ],
  },
  {
    number: 2,
    heading: 'Nature of services and agency relationships',
    type: 'mixed',
    blocks: [
      {
        kind: 'paragraph',
        text: 'PPM provides off-the-plan and established residential property sales services, property asset management services, and resale services to clients in Australia and the Asia-Pacific region.',
      },
      {
        kind: 'bullets',
        intro: 'PPM acts:',
        bullets: [
          'as agent for vendors and developers when marketing and selling residential property',
          'as agent for rental providers when managing residential property',
          "as buyer's agent only where there is a written buyer's agency engagement in place",
        ],
      },
      {
        kind: 'paragraph',
        text: 'PPM also provides advisory and selective third-party agency services to property developers.',
      },
    ],
  },
  {
    number: 3,
    heading: 'Fee structure',
    type: 'paragraphs',
    paragraphs: [
      "PPM's acquisition services for buyers are vendor-compensated — no fees are charged to buyers for property selection, vetting or transactional guidance.",
      'Property management fees are charged to rental providers in accordance with the relevant Management Authority. Resale commissions are charged to vendors in accordance with the relevant Sales Authority. Clients who originally purchased a property through PPM are eligible for preferential resale commission rates. Terms are available on request.',
    ],
  },
  {
    number: 4,
    heading: 'General information disclaimer',
    type: 'paragraphs',
    paragraphs: [
      'All information published on www.ppmproperty.com.au and its sub-pages is provided for general informational purposes only. It is not financial, legal, taxation or investment advice, nor is it a recommendation, endorsement or solicitation of any specific property, investment strategy or service.',
      'Information is provided in good faith and is current as at its publication date. PPM endeavours to keep information accurate and up to date but does not warrant the accuracy, completeness, currency or reliability of any information on the website. Users should verify information independently and obtain professional advice before relying on it.',
      'Before making any property, financial, legal or taxation decision, you should obtain independent advice from a licensed real estate professional, qualified accountant, registered tax agent and/or legal practitioner who can assess your specific situation.',
    ],
  },
  {
    number: 5,
    heading: 'Off-the-plan and new build disclaimer',
    type: 'mixed',
    blocks: [
      {
        kind: 'bullets',
        intro: 'Where PPM markets or sells off-the-plan or new build properties:',
        bullets: [
          "Computer-generated images, artist's impressions, renders, floor plans, dimensions, finishes and inclusions shown on the website or in marketing materials are indicative only. Final built form may vary from depicted representations.",
          "Estimated completion dates, settlement dates and construction schedules are estimates only and may change at the developer's discretion or due to market or construction factors.",
          'All off-the-plan contracts include sunset clauses giving the developer and/or buyer specific rights and remedies if the project is not completed within stated timeframes. Buyers should consider the impact of these clauses carefully.',
          "Before signing any contract of sale, buyers should obtain independent legal review of the contract (including the section 32 vendor statement under the Sale of Land Act 1962 (Vic)) and obtain a copy of the developer's disclosure documents.",
          'Stamp duty concessions on off-the-plan purchases are subject to individual buyer circumstances, property type, contract timing and applicable Victorian legislation at the time of contract.',
        ],
      },
    ],
  },
  {
    number: 6,
    heading: 'Tax provisions disclaimer',
    type: 'paragraphs',
    paragraphs: [
      'Information published on this website regarding negative gearing, capital gains tax treatment, depreciation, and other tax provisions relates substantially to the legislative changes announced in the 2026-27 Federal Budget (handed down 12 May 2026).',
      'These tax changes are subject to amendment during their legislative passage and their application will vary significantly depending on individual circumstances, existing tax position, property type, transaction timing, and other factors.',
      'Nothing on this website constitutes financial, legal or taxation advice, nor a recommendation or endorsement of any investment or tax strategy. Before making any investment decision based on tax considerations, you must obtain independent advice from a registered tax agent, qualified accountant or legal practitioner who can assess your specific situation.',
    ],
  },
  {
    number: 7,
    heading: 'Investment and financial product disclaimer',
    type: 'paragraphs',
    paragraphs: [
      'PPM does not hold an Australian Financial Services Licence (AFSL). PPM does not provide personal financial product advice within the meaning of the Corporations Act 2001 (Cth). PPM does not arrange, recommend or issue interests in any managed investment scheme.',
      'References to property as an "investment" on this website are made in the ordinary commercial sense of the word and do not constitute, and should not be read as constituting, advice on the suitability of property as a financial product for any individual circumstance.',
    ],
  },
  {
    number: 8,
    heading: 'Track record qualification',
    type: 'paragraphs',
    paragraphs: [
      "References on this website to \"$1.5 billion delivered\", \"1,000+ settlements\", \"13 years\" of experience, and similar aggregate figures relate to the combined professional careers of PPM's founding principals (Joan Alcock and Ned Gerrard), including work performed under prior corporate brands and developer engagements that pre-date the 2026 launch of the PPM B2C brand.",
      'These figures are not represented as transactions completed under the PPM-branded B2C agency model alone.',
    ],
  },
  {
    number: 9,
    heading: 'Past projects disclaimer',
    type: 'paragraphs',
    paragraphs: [
      "Past projects referenced on this website (including but not limited to Hawthorn Park, Yarra 1, The Barkly and Elk) are referenced as examples of the professional involvement of PPM's principals during prior B2B developer engagements.",
      'Reference to these projects does not imply any current commercial relationship between PPM and the developer, sales agency or other party connected to those projects, nor any representation about the current state, value or performance of those properties.',
    ],
  },
  {
    number: 10,
    heading: 'Property projections and forecasts',
    type: 'mixed',
    blocks: [
      {
        kind: 'bullets',
        intro: 'Where this website refers to expected rental yields, capital growth, market trends, peak market timing, holding period outcomes or other forward-looking statements:',
        bullets: [
          'These are general market commentary and projections only.',
          'Past performance is not an indicator of future performance.',
          'Property is an inherently variable asset class; actual outcomes may differ materially from projections.',
          'Projections are based on assumptions that may not hold in future market conditions.',
        ],
      },
    ],
  },
  {
    number: 11,
    heading: 'Anti-Money Laundering and Counter-Terrorism Financing',
    type: 'paragraphs',
    paragraphs: [
      'From 1 July 2026, PPM is a reporting entity under the Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (Cth). PPM is required to verify customer identity, may be required to collect source-of-funds information, and may be unable to proceed with a transaction where AML/CTF customer due diligence obligations cannot be met.',
      'PPM may be required to report certain transactions and suspicious matters to the Australian Transaction Reports and Analysis Centre (AUSTRAC) without notice to the customer.',
    ],
  },
  {
    number: 12,
    heading: 'Foreign investment (FIRB)',
    type: 'paragraphs',
    paragraphs: [
      'Foreign persons (as defined in the Foreign Acquisitions and Takeovers Act 1975 (Cth)) generally require approval from the Foreign Investment Review Board (FIRB) before acquiring an interest in Australian residential real estate. Application fees, conditions and processing times apply, and FIRB approval is typically a condition precedent to settlement.',
      "It is the buyer's responsibility to determine whether FIRB approval is required for any contemplated acquisition and to obtain that approval where required. PPM does not provide FIRB advice and is not responsible for verifying a buyer's FIRB status or for the consequences of any failure to obtain required approvals. Foreign buyers should obtain independent legal advice from a practitioner experienced in FIRB matters before signing any contract of sale.",
    ],
  },
  {
    number: 13,
    heading: 'Privacy',
    type: 'paragraphs',
    paragraphs: [
      'PPM collects, holds, uses and discloses personal information in accordance with the PPM Privacy Policy, published at www.ppmproperty.com.au/privacy-policy.',
    ],
  },
  {
    number: 14,
    heading: 'Third-party content and links',
    type: 'paragraphs',
    paragraphs: [
      'Where this website contains links to external websites or third-party content, PPM does not endorse, control or warrant the accuracy of that external content. Users access external content at their own risk and should review the privacy policies and terms of use of any external site they visit.',
    ],
  },
  {
    number: 15,
    heading: 'Copyright and intellectual property',
    type: 'paragraphs',
    paragraphs: [
      'All content on this website (including text, graphics, photographs, the PPM logo, design elements and the underlying code) is the copyright of Property Project Marketing Pty Ltd or its licensors. Content may not be reproduced, redistributed, republished or used for any commercial purpose without the prior written consent of PPM.',
    ],
  },
  {
    number: 16,
    heading: 'Indicative pricing and currency',
    type: 'paragraphs',
    paragraphs: [
      'All prices, estimates and financial figures displayed on this website or in linked property listings are expressed in Australian dollars (AUD) unless expressly stated otherwise.',
      'Such figures are indicative only and subject to change without notice. Final price, terms and conditions are governed by the relevant contract of sale.',
    ],
  },
  {
    number: 17,
    heading: 'Australian Consumer Law',
    type: 'paragraphs',
    paragraphs: [
      "Nothing in this disclaimer is intended to exclude, restrict or modify any rights or remedies that cannot be excluded, restricted or modified under the Australian Consumer Law or other applicable consumer protection legislation. Where rights are non-excludable, PPM's liability for failure to comply is limited to the maximum extent permitted by law.",
    ],
  },
  {
    number: 18,
    heading: 'Reservation of rights',
    type: 'paragraphs',
    paragraphs: [
      "PPM reserves the right to update, amend, suspend or withdraw any part of this website (including this disclaimer) at any time without notice. PPM reserves the right to decline to provide services to any prospective client at PPM's sole discretion, subject to applicable law.",
    ],
  },
  {
    number: 19,
    heading: 'Governing law',
    type: 'paragraphs',
    paragraphs: [
      "This website and this disclaimer are governed by the laws of Victoria, Australia. Any dispute arising in connection with this website or PPM's services will be resolved by the courts of Victoria.",
    ],
  },
  {
    number: 20,
    heading: 'Contact',
    type: 'contact',
    paragraphs: [
      'Questions about this disclaimer or the operation of the PPM website should be directed to:',
    ],
    details: [
      'Property Project Marketing Pty Ltd  ·  Level 7, 570 St Kilda Road, Melbourne, Victoria 3004',
      'Email: admin@onlinepropertyservices.com.au',
      'ABN 99 162 429 558  ·  Estate Agents Licence No. 074846L',
    ],
  },
]
