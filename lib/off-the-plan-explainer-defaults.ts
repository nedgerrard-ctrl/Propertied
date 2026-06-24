export const offThePlanExplainerDefaults = {
  // ── Hero ──────────────────────────────────────────────────────────────────
  heroHeadingMain:   "What is",
  heroHeadingAccent: "off-the-plan?",
  heroSubtext:
    "Everything you need to know before you sign — from stamp duty savings to the 2026 Federal Budget tax reforms that now favour new builds.",

  // ── Intro section ─────────────────────────────────────────────────────────
  introPara1:
    "Buying off-the-plan means purchasing a property before it has been built — or while it is still under construction. You enter into a contract today, pay a deposit, and settle when the building is complete. That gap between contract and settlement is typically twelve to thirty-six months.",
  introPara2:
    "For many buyers this sounds unfamiliar or uncertain. In practice, when guided by the right expertise, it is a structurally superior way to enter the property market — with financial, legal and lifestyle advantages that an established property simply cannot offer.",
  introPara3:
    "PPM has specialised in off-the-plan apartments and townhouses for thirteen years. We know which developments are worth buying, which developers consistently deliver, and how to protect your interests at every stage of the process.",

  // ── Advantages heading ────────────────────────────────────────────────────
  advantagesHeading: "The six advantages of buying off-the-plan",

  // Advantage 1
  adv1Heading: "Stamp Duty Savings",
  adv1Body:
    "In Victoria, stamp duty is calculated on the contract price at signing — not the completed value. As construction progresses your duty obligation stays fixed at the lower figure. For many buyers this represents a saving of tens of thousands of dollars.",

  // Advantage 2
  adv2Heading: "Low Deposit Entry",
  adv2Body:
    "Off-the-plan contracts require only a 5–10% deposit at signing, with the balance at settlement — often 12 to 36 months away. You secure today's price while your capital continues working during construction.",

  // Advantage 3
  adv3Heading: "Configuration Choices",
  adv3Body:
    "Subject to construction stage, buyers can often influence the configuration of their property — adjusting layouts and internal flow. Impossible in the established market.",

  // Advantage 4
  adv4Heading: "Your Own Finishes",
  adv4Body:
    "Select from a curated range of internal finishes — flooring, cabinetry, tiling, and colour palettes. Your property reflects your taste before you have ever set foot in it.",

  // Advantage 5
  adv5Heading: "Appliance Upgrades",
  adv5Body:
    "Premium kitchen, laundry, and living-appliance upgrades are available at additional cost, matching the building standard and your personal expectations.",

  // Advantage 6 — Tax (multi-part)
  adv6Heading: "Tax Advantages for New Builds (2026 Federal Budget)",
  adv6Body:
    "From 1 July 2027, two reforms apply to new builds differently than to established residential property:",
  adv6Bullet1:
    "Negative gearing — preserved for new builds. Losses remain deductible against all income, including wages.",
  adv6Bullet2:
    "Capital Gains Tax — new build investors may elect to retain the 50% discount. Other investors face an inflation-based discount plus a minimum 30% rate.",
  adv6QualifyingAssets:
    "New builds — primarily off-the-plan apartments and townhouses — are the qualifying asset class. Existing arrangements remain in place for property held before 12 May 2026.",

  // ── Practical Effect section ───────────────────────────────────────────────
  practicalEffectHeading: "Practical Effect",
  practicalEffect1:
    "New build investors retain the ability to offset rental losses against any income, including salary.",
  practicalEffect2:
    "Established housing investors deduct losses only against rental income or property capital gains, with carry-forward.",
  practicalEffect3:
    "New build investors may elect to retain the existing 50% CGT discount on disposal.",
  practicalEffect4:
    "Other investors take the inflation-based discount plus a minimum 30% tax on gains.",
  practicalEffect5:
    "For investors at high marginal rates, the difference compounds over the life of the investment.",
  ownerOccupiersNote:
    "For owner-occupiers, the measures do not directly apply. Supply-side dynamics may shift as developer pipelines adjust to investor demand.",

  // ── Disclaimer ────────────────────────────────────────────────────────────
  disclaimer:
    "Current as at May 2026. Announced policy, pending legislation. PPM does not provide financial, legal or taxation advice. Outcomes depend on individual circumstances. Seek independent professional advice before relying on these arrangements.",

  // ── Links ─────────────────────────────────────────────────────────────────
  link1Label: "Read the full Insights briefing",
  link1Url:   "/insights",
  link2Label: "Official Budget tax reform page",
  link2Url:   "#",
};

export type OffThePlanExplainerContentData = typeof offThePlanExplainerDefaults;

export function mergeOffThePlanExplainerContent(
  doc: Record<string, unknown> | null
): OffThePlanExplainerContentData {
  if (!doc) return offThePlanExplainerDefaults;
  const knownKeys = new Set(Object.keys(offThePlanExplainerDefaults));
  const clean = Object.fromEntries(
    Object.entries(doc).filter(
      ([k, v]) => knownKeys.has(k) && v !== "" && v !== null && v !== undefined
    )
  );
  return { ...offThePlanExplainerDefaults, ...clean } as OffThePlanExplainerContentData;
}
