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

  investorsHeading: "For investors — the end-to-end model",
  investorsBody:    "PPM's broader model extends well beyond introducing a buyer to a project. We have built it around the complete investment journey that involves the following steps:",
  investorsBody2:   "As properties from our portfolio are sold, opportunities arise for new investors to access our $100M capped management portfolio. We use our market intelligence that is months ahead of published property data to select the right property, manage your asset and then sell it at the peak of the market cycle — at preferential rates for PPM clients.",
  investorsStepsLabel: "FIVE STEPS FOR INVESTORS",
  investorsBullet1: "We source — Only well scrutinised Melbourne projects.",
  investorsBullet2: "You buy — The developer pays our fee. You pay nothing.",
  investorsBullet3: "We manage — Only at senior level. Never a junior property manager handling your account.",
  investorsBullet4: "We sell again — At a discounted commission for returning clients.",
  investorsBullet5: "We replace — Your capital moves straight into the next property we diligently vet for you.",

  ownerHeading: "For owner-occupiers",
  ownerSubheading: "Turn your vision into reality.",
  ownerBody:    "We vet the developer, negotiate the contract, and guide you from deposit to settlement — at ZERO cost to you. When you are ready to sell, we apply developer-level marketing to your home sale.",
  ownerStepsLabel: "THREE STEPS FOR OWNER-OCCUPIERS",
  ownerBullet1: "We source — We find the right new home, vet the developer, the build quality and location.",
  ownerBullet2: "You buy — Guided from contract to settlement, at zero cost. The developer pays our fee.",
  ownerBullet3: "We sell your existing home — Our proven marketing strategies are applied to your sale and we support you all the way to settlement.",
  ownerBullet4: "Zero cost to buyers — the vendor pays our fee in full.",
  ownerBullet5: "One relationship — from deposit through to settlement and beyond.",

  ctaHeading: "Start your property search with PPM.",
  ctaBody:    "Every PPM engagement — whether for an investor building a portfolio or an owner-occupier searching for the right home — begins with a structured client brief. Tell us your location preferences, configuration, budget, timeline and objectives. We match your brief against the Melbourne market in real time and bring you only the opportunities worth your attention. There is no catalogue to scroll through and no shortlist padded to look impressive. Submit your enquiry by clicking on the link below and we will promptly be in touch.",
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
