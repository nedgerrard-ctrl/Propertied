export const aboutDefaults = {
  heroHeadingMain:
    "The trusted name behind Melbourne’s most significant",
  heroHeadingAccent: "residential developments.",

  pullQuote: "For over a decade, we were the silent engine.",
  storyP1:
    "Property Project Marketing Pty Ltd (PPM) was founded in April 2013 and for over a decade operated invisibly behind Melbourne’s major residential developers — delivering more than $1.5 billion in off-the-plan property sales with zero public presence.",
  storyP2: "We are now changing that.",
  storyP3:
    "After years of working exclusively under developers’ names, we are bringing that same expertise directly to buyers, investors, and developers who want a trusted, end-to-end partner for the full investment lifecycle.",
  storyP4:
    "Our approach goes far beyond a transaction. We source, sell, manage, and resell — a closed-loop service that keeps working for you long after settlement.",

  stat1Value: "$1.5B+",
  stat1Label: "In Delivered Sales",
  stat2Value: "$50M+",
  stat2Label: "Assets Under Management",
  stat3Value: "10+",
  stat3Label: "Years of Industry Experience",

  step1Title: "Source",
  step1Desc:
    "We identify and curate the finest off-the-plan developments across Melbourne — from boutique townhouses to high-rise apartments.",
  step2Title: "Buy",
  step2Desc:
    "We match you to the right property, organise display suite visits, and guide you through purchase. Our fee is paid by the developer — not by you.",
  step3Title: "Manage",
  step3Desc:
    "Through our sister division Online Property Services, we steward your residential asset as a premium portfolio — maximising returns, not just collecting rent.",
  step4Title: "Maximise",
  step4Desc:
    "We actively protect and grow the value of your investment, keeping you informed and consistently ahead of the market.",
  step5Title: "Resell",
  step5Desc:
    "When the time is right, we leverage deep market knowledge to appraise and resell your property — achieving the best possible outcome.",
  step6Title: "Reinvest",
  step6Desc:
    "We identify your next opportunity, keeping your capital working and your portfolio growing for the long term.",

  member1Name: "Ned Gerrard",
  member1Role: "Co-Founder & Director",
  member1Image: "/images/Ned Gerrard_ai_placeholder.png",
  member1Bio:
    "With a background in management consulting, accounting, and marketing, Ned brings strategic discipline to every engagement — from developer feasibility to long-term client strategy. He built PPM into Melbourne’s silent engine for over a decade before bringing the brand to market.",
  member2Name: "Joan Alcock",
  member2Role: "Director & Officer in Effective Control",
  member2Image: "/images/Joan Alcock_ai_placeholder.png",
  member2Bio:
    "Ranked nationally in the Top 2% of sales professionals, Joan holds the agency licence and leads all client relationships. Multi-award winning, her approach is direct, experienced, and entirely client-first.",

  devHeading: "The team behind Melbourne’s most successful launches.",
  devP1:
    "For over a decade, PPM was the silent force behind some of Melbourne’s most significant residential projects — managing campaigns from launch strategy to final settlement, with no public credit taken.",
  devP2:
    "We now offer that same capability directly. An independent agency with a qualified buyer network spanning local owner-occupiers, local investors, and overseas investors across Asia-Pacific — with transparent reporting from day one.",
  service1: "Project Marketing & Sales Management",
  service2: "Independent Sales Agency & Qualified Buyer Network",
  service3: "Feasibility & Pricing Strategy Advisory",
  service4: "Campaign Reporting & Settlement Support",

  overseasHeadingMain: "Your gateway to Melbourne property,",
  overseasHeadingAccent: "from anywhere",
  overseasP1:
    "The majority of PPM's clients are based overseas — predominantly across the Asia-Pacific region. We understand the unique complexities of investing in Australian residential property from abroad: foreign investment approvals, remote due diligence, and ongoing asset management at a distance.",
  overseasP2:
    "From first enquiry through to settled contract and long-term portfolio management, you deal with one trusted team — no handoffs, no information gaps.",
  overseasStat1Value: "$50M+",
  overseasStat1Label: "Assets Under Management",
  overseasStat2Value: "10+ Years",
  overseasStat2Label: "Serving Overseas Clients",
  overseasStat3Value: "Asia-Pacific",
  overseasStat3Label: "Primary Client Base",

  trackHeading:
    "$1.5 billion delivered across Southbank · Docklands · Richmond and beyond.",
  project1Location: "Southbank, Melbourne",
  project1Type: "High-Rise Apartments",
  project1Status: "Sold Out",
  project2Location: "Richmond, Melbourne",
  project2Type: "Boutique Townhouses",
  project2Status: "Sold Out",
  project3Location: "Docklands, Melbourne",
  project3Type: "Mixed-Use Residential",
  project3Status: "Sold Out",
};

export type AboutContentData = typeof aboutDefaults;

/** Merge DB doc with defaults, ignoring empty/null DB values so defaults always win for unset fields. */
export function mergeAboutContent(doc: Record<string, unknown> | null): AboutContentData {
  if (!doc) return aboutDefaults;
  const clean = Object.fromEntries(
    Object.entries(doc).filter(([, v]) => v !== "" && v !== null && v !== undefined)
  );
  return { ...aboutDefaults, ...clean } as AboutContentData;
}
