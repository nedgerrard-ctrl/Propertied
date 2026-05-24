export const insightsDefaults = {
  heroHeadingMain:   "The 2026 Federal Budget has changed the investment landscape",
  heroHeadingAccent: "— in favour of off-the-plan.",
  heroSubtext:
    "The May 2026 Federal Budget introduced the most significant shift in property taxation in decades, creating a two-track system that explicitly favours new builds over established residential real estate.",

  // Section 1
  section1Heading: "Negative gearing is being quarantined for established property.",
  section1Body:
    "From 1 July 2027, investors in established properties purchased after 12 May 2026 will no longer be able to offset rental losses against their salary or other income. That offset will only be available against rental income or future capital gains from that specific property.",

  // Section 2
  section2Heading: "Off-the-plan and new builds are exempt.",
  section2Body:
    "Investors in new builds — including off-the-plan apartments and townhouses — retain the ability to offset net rental losses against their total taxable income, including salary. This is a significant and immediate tax advantage that established property investors will no longer have access to after 1 July 2027.",

  // Section 3
  section3Heading: "CGT flexibility for new builds.",
  section3Body:
    "Investors in eligible new builds can choose between the existing 50% CGT discount or the new indexation model at the time of disposal — selecting whichever produces the lower tax liability. Established property investors will not have this choice for gains accrued after 1 July 2027.",

  // Section 4
  section4Heading: "The window is now.",
  section4Body1:
    "Properties under contract before 7:30pm on 12 May 2026 are grandfathered. For properties purchased between now and 30 June 2027, negative gearing is still available for established homes — but the clock is running. After 1 July 2027, the quarantining rules apply to established stock but not to new builds.",
  section4Body2:
    "These changes aim to direct capital into new housing supply. Off-the-plan property is now one of the few remaining ways to aggressively reduce personal taxable income through property investment in Australia.",

  // Disclaimer
  disclaimer:
    "This is general information about legislative changes only. PPM does not provide financial, legal or taxation advice. We strongly recommend seeking independent advice from a qualified accountant or tax adviser before making any investment decision based on these provisions.",

  // Links
  link1Label: "Read the official Budget tax reform page",
  link1Url:   "#",
  link2Label: "See off-the-plan in detail",
  link2Url:   "#",
};

export type InsightsContentData = typeof insightsDefaults;

export function mergeInsightsContent(doc: Record<string, unknown> | null): InsightsContentData {
  if (!doc) return insightsDefaults;
  const knownKeys = new Set(Object.keys(insightsDefaults));
  const clean = Object.fromEntries(
    Object.entries(doc).filter(([k, v]) => knownKeys.has(k) && v !== "" && v !== null && v !== undefined)
  );
  return { ...insightsDefaults, ...clean } as InsightsContentData;
}
