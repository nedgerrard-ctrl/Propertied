export const buyerDefaults = {
  heroLine1:   "Find your next",
  heroAccent:  "Melbourne",
  heroLine3:   "property.",
  heroSubtext: "Whether you are building an investment portfolio or searching for your first home, PPM sources, guides, and supports you through every step of the buying process — at zero cost to you. The developer pays our fee.",

  stat2Value: "$1.5B",
  stat2Label: "In Delivered Projects",
  stat3Value: "1,000+",
  stat3Label: "Settled Sales",

  tailoredHeading: "Tailored for every buyer",

  investorsHeading: "For Investors",
  investorsBody:    "PPM's broader model extends beyond simply introducing a buyer to a project. We are built around a wider investment journey that continues through portfolio management and eventual resale.",
  investorsBody2:   "Access our $100M capped management portfolio and our market intelligence that is months ahead of published property data. We select the right property, manage your asset, and sell it at the peak of the market cycle — at preferential rates for PPM clients.",
  investorsStepsLabel: "FIVE STEPS FOR INVESTORS",
  investorsBullet1: "We source — Only the best Melbourne projects. The rest, you never see.",
  investorsBullet2: "You buy — The developer pays our fee. You pay nothing.",
  investorsBullet3: "We steward — Principal-level attention, always. Never a junior property manager.",
  investorsBullet4: "We sell again — At a discounted commission for returning clients.",
  investorsBullet5: "We replace — Your capital moves straight into the next vetted property.",

  ownerHeading: "For Owner-Occupiers",
  ownerBody:    "Turn your vision into reality. We vet the developer, negotiate the contract, and guide you from deposit to settlement — at ZERO cost to you. When you are ready to sell, we apply developer-level marketing to your home sale.",
  ownerStepsLabel: "THREE STEPS FOR OWNER-OCCUPIERS",
  ownerBullet1: "We source — We find the right new home, vetted on developer, build quality and location.",
  ownerBullet2: "You buy — Guided from contract to settlement, at zero cost. The developer pays our fee.",
  ownerBullet3: "We sell your existing home — Developer-grade marketing applied to your sale, with transition support.",
  ownerBullet4: "Zero cost to buyers — the vendor pays our fee in full.",
  ownerBullet5: "One relationship — from deposit through to settlement and beyond.",

  ctaHeading: "Start your property search with PPM.",
  ctaBody:    "Register your interest and one of our principals will be in touch to discuss your goals, budget, and the opportunities currently available.",
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
