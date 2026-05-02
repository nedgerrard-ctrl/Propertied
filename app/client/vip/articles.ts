export type Article = {
  slug: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  imageCss: string;
  content: { heading?: string; body: string }[];
};

export const ARTICLES: Article[] = [
  {
    slug: "off-the-plan-melbourne",
    category: "Buyer Guide",
    date: "March 2026",
    title: "Understanding Off-the-Plan Property in Melbourne",
    excerpt:
      "Buying off-the-plan can unlock significant advantages for both owner-occupiers and investors — but only when you know what to look for. Here is what every buyer should understand before signing.",
    imageCss: "linear-gradient(140deg, #8b7355 0%, #4a3728 60%, #2e1f14 100%)",
    content: [
      {
        body: "Purchasing a property off-the-plan — before it has been built — is one of the more nuanced decisions a buyer can make in the Melbourne market. Done well, it can mean securing today's price on a property that will appreciate through construction. Done without due diligence, it can expose buyers to delays, sunset clauses, and valuation shortfalls at settlement.",
      },
      {
        heading: "What 'Off-the-Plan' Actually Means",
        body: "When you buy off-the-plan, you are signing a contract of sale for a property that does not yet exist in its finished form. You pay a deposit — typically 10% — and then wait for the development to complete, which can be anywhere from 12 months to several years depending on the project scale.",
      },
      {
        heading: "Key Advantages for Melbourne Buyers",
        body: "Melbourne's stamp duty concessions for off-the-plan purchases can be substantial. Eligible owner-occupiers may receive a reduction calculated on the land value alone rather than the full contract price, saving tens of thousands of dollars. Investors benefit from a newly built asset with a full depreciation schedule, which can meaningfully reduce taxable income in the early years of ownership.",
      },
      {
        heading: "What to Scrutinise in the Contract",
        body: "Sunset clauses are the most important risk to understand. These clauses allow either party to rescind the contract if the project is not completed by a specified date. Developers have historically used sunset clauses to exit contracts when property values have risen significantly, only to re-sell at a higher price. Always have a specialist conveyancer review the sunset clause and any related provisions before signing.",
      },
      {
        heading: "Working With PPM",
        body: "PPM's role is to represent buyers, not developers. When we present an off-the-plan opportunity to our clients, it has already passed our internal due diligence process — including developer track record, finance structure, council approvals, and independent valuation. Our clients sign contracts knowing the full picture, not just the marketing brochure.",
      },
    ],
  },
  {
    slug: "overseas-investors-australia",
    category: "Investor Insights",
    date: "February 2026",
    title: "How Overseas Investors Can Navigate the Australian Property Market",
    excerpt:
      "Foreign buyers face a distinct set of rules in Australia — from FIRB approval to additional stamp duty surcharges. This guide covers what international investors need to know before committing capital.",
    imageCss: "linear-gradient(140deg, #2c3e6b 0%, #1a2540 60%, #0d1520 100%)",
    content: [
      {
        body: "Australia remains one of the most sought-after real estate markets for overseas investors, and Melbourne in particular continues to attract significant foreign capital. However, the regulatory environment for foreign buyers is meaningfully different to domestic purchasers, and mistakes in this area can be costly.",
      },
      {
        heading: "FIRB Approval",
        body: "The Foreign Investment Review Board (FIRB) must approve most residential property purchases by foreign persons. The application fee is calculated on the purchase price and can run into thousands of dollars. Approval is generally granted for new dwellings and vacant land intended for development, but is typically not available for established dwellings for investment purposes. Processing times vary — factor at least four to six weeks into your timeline.",
      },
      {
        heading: "Additional Duty Surcharges",
        body: "Victoria imposes a Foreign Purchaser Additional Duty (FPAD) of 8% on the dutiable value of the property. This is in addition to standard stamp duty and applies to all foreign persons, whether individuals, companies, or trusts with foreign beneficiaries. On a $1,000,000 property, this surcharge alone represents $80,000 — a number that must be factored into yield calculations from the outset.",
      },
      {
        heading: "Land Tax and Absentee Owner Surcharge",
        body: "Victoria also levies an Absentee Owner Surcharge on land tax for foreign persons who do not ordinarily reside in Australia. The surcharge is 4% of the taxable value of landholdings above the threshold, adding to the holding costs of an investment property over time.",
      },
      {
        heading: "Financing Considerations",
        body: "Australian lenders apply stricter LVR limits to foreign income applicants, and some lenders will not lend to non-residents at all. Buyers using offshore financing should be aware of currency risk between contract exchange and settlement. PPM works closely with mortgage brokers experienced in foreign buyer finance to ensure our clients have a clear path to funding before they commit.",
      },
      {
        heading: "How PPM Supports Overseas Investors",
        body: "Our overseas clients benefit from end-to-end coordination — from FIRB lodgement through to settlement — without needing to be physically present in Australia. We work with a trusted network of conveyancers, tax advisers, and property managers who are experienced in supporting foreign investment structures.",
      },
    ],
  },
  {
    slug: "ppm-end-to-end-model",
    category: "About PPM",
    date: "January 2026",
    title: "The PPM End-to-End Model Explained",
    excerpt:
      "PPM was built around a single premise: that buyers deserve the same level of strategic support that developers receive. Our model covers every stage from property selection to post-settlement management.",
    imageCss: "linear-gradient(140deg, #4a6741 0%, #2d4229 60%, #1a271a 100%)",
    content: [
      {
        body: "Most property transactions are shaped by the interests of the seller and their agent. PPM was founded to change that dynamic — to build a firm that sits exclusively on the buyer's side of the table, from the first enquiry to long after the keys are handed over.",
      },
      {
        heading: "Stage One: Discovery and Strategy",
        body: "Every client relationship begins with a strategy session. We spend time understanding not just what a client wants to buy, but why — whether that is building a portfolio for retirement income, securing a home in a specific catchment zone, or diversifying offshore holdings into Australian real estate. The brief we build in this session shapes every recommendation that follows.",
      },
      {
        heading: "Stage Two: Property Identification",
        body: "PPM maintains relationships with developers and selling agents across Melbourne and key interstate markets. Many of the opportunities we present to clients are off-market or pre-market — meaning they are not available through public listing portals. Our network is built through years of transaction volume, and it represents one of the most tangible advantages our clients have over buyers who search independently.",
      },
      {
        heading: "Stage Three: Due Diligence",
        body: "Before any property is presented to a client, it goes through our internal assessment process. This covers location fundamentals, comparable sales, developer or vendor history, building inspection results, strata records (where applicable), and an independent valuation check. We will not recommend a property we would not buy ourselves.",
      },
      {
        heading: "Stage Four: Negotiation and Contract",
        body: "PPM negotiates on behalf of the buyer. Our goal is always the best possible price and terms — not a fast commission. For off-the-plan purchases, we review contract terms with specialist conveyancers before our client signs anything. For private sales, we use comparable evidence and market conditions to build a negotiation position.",
      },
      {
        heading: "Stage Five: Settlement and Beyond",
        body: "Our involvement does not end at settlement. For investment clients, we can introduce property managers, depreciation quantity surveyors, and tax advisers who are aligned with our clients' outcomes. For owner-occupiers, we remain a resource for future decisions — whether that is renovating, refinancing, or eventually selling.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
