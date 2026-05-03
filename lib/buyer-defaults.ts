export const buyerDefaults = {
  heroLine1:   "Find your next",
  heroAccent:  "Melbourne",
  heroLine3:   "property.",
  heroSubtext: "Whether you are building an investment portfolio or searching for your first home, we source, guide, and support you through every step of the buying process.",

  stat2Value: "$1.5B+",
  stat2Label: "In Project Sales",
  stat3Value: "2013",
  stat3Label: "Established",

  tailoredHeading: "Tailored for every buyer",

  investorsHeading: "For Investors",
  investorsBody:    "PPM provides access to off-the-plan and established investment opportunities across Melbourne, selected for yield potential, capital growth fundamentals, and developer quality. Our end-to-end model means we source your property, manage it, and advise on the right time to resell.",
  investorsBullet1: "Access to exclusive off-the-plan developments",
  investorsBullet2: "Independent advice — not tied to any single developer",
  investorsBullet3: "FIRB guidance for overseas buyers",
  investorsBullet4: "Portfolio management via Online Property Services",
  investorsBullet5: "Resale timing and reinvestment strategy advice",

  ownerHeading: "For Owner-Occupiers",
  ownerBody:    "Buying your own home is one of the most significant decisions you will make. PPM gives you access to quality developments before they reach the broader market, with independent guidance throughout — from shortlisting and contract review through to settlement. We work for you, not the developer.",
  ownerBullet1: "New builds and off-the-plan apartments and townhouses",
  ownerBullet2: "Lock in today's price — settle on completion",
  ownerBullet3: "New build warranty on all fixtures and fittings",
  ownerBullet4: "Modern energy ratings and high-spec inclusions",
  ownerBullet5: "Guided support from enquiry through to settlement",

  ctaHeading: "Start your property search with PPM.",
  ctaBody:    "Register your interest and one of our advisers will be in touch to discuss your goals, budget, and the opportunities currently available.",
};

export type BuyerContentData = typeof buyerDefaults;

export function mergeBuyerContent(doc: Record<string, unknown> | null): BuyerContentData {
  if (!doc) return buyerDefaults;
  const knownKeys = new Set(Object.keys(buyerDefaults));
  const clean = Object.fromEntries(
    Object.entries(doc).filter(([k, v]) => knownKeys.has(k) && v !== "" && v !== null && v !== undefined)
  );
  return { ...buyerDefaults, ...clean } as BuyerContentData;
}
