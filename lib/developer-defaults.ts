export const developerDefaults = {
  heroHeadingMain: "Sell your development through Melbourne's",
  heroHeadingAccent: "most trusted channel.",
  heroSubtext:
    "PPM works with developers as an independent third-party partner — connecting quality off-the-plan projects with qualified buyers and investors across local and overseas markets.",

  networkHeadingMain: "More than a project marketer —",
  networkHeadingAccent: "a full ecosystem partner.",
  networkP1:
    "PPM sits at the centre of a connected network: developers, qualified local and overseas buyers, portfolio management, and eventual resale. Every project we represent benefits from the full depth of that ecosystem.",
  networkP2:
    "Our model means deeper investor relationships, stronger market understanding, and a service connected to the full life cycle of property ownership.",
  networkBullet1: "Independent channel partner, not tied to one developer",
  networkBullet2: "Commission-based representation for suitable developments",
  networkBullet3: "Local & overseas qualified buyer network",
  networkBullet4: "Experience across sourcing, selling, managing & resale",

  partnerHeading: "Built on experience, trust, and long-term investor relationships",
  benefit1Title: "Independent third-party representation",
  benefit1Desc:
    "PPM is not tied to any single project or developer. We act as an independent channel partner — aligning the right developments with the right buyers.",
  benefit2Title: "End-to-end investor journey",
  benefit2Desc:
    "Our model extends beyond the initial sale. We support buyers through acquisition, ongoing portfolio management, and eventual resale.",
  benefit3Title: "Experienced off-the-plan specialists",
  benefit3Desc:
    "Rooted in off-the-plan apartments and townhouses, PPM brings practical depth in project marketing, buyer qualification, and sales progression.",

  processHeading: "A straightforward partnership approach",
  process1Title: "Project alignment",
  process1Desc:
    "We assess the development, target buyer profile, and market positioning before committing to representation.",
  process2Title: "Project representation",
  process2Desc:
    "PPM markets your development to qualified buyers and investors on a commission basis, maintaining a premium presentation throughout.",
  process3Title: "Buyer matching & progression",
  process3Desc:
    "We guide interested buyers through project discussions, display suite visits, and through to sale progression.",

  endToEndHeading: "Beyond a single transaction.",
  endToEndP1:
    "PPM's broader model extends beyond simply introducing a buyer to a project. We are built around a wider investment journey that continues through portfolio management and eventual resale.",
  endToEndP2:
    "That matters to developers because it reflects deeper investor relationships, stronger market understanding, and a service connected to the full life cycle of property ownership.",
  lifecycle1: "Source the right opportunity",
  lifecycle2: "Support the buyer journey",
  lifecycle3: "Manage long-term investor relationships",
  lifecycle4: "Assist with future resale & reinvestment",

  ctaHeading: "Ready to discuss\nyour development?",
  ctaSubtext:
    "Contact our team to explore how PPM can support your project through commission-based representation and premium market positioning.",
};

export type DeveloperContentData = typeof developerDefaults;

/** Merge DB doc with defaults, ignoring empty/null DB values so defaults always win for unset fields. */
export function mergeDeveloperContent(doc: Record<string, unknown> | null): DeveloperContentData {
  if (!doc) return developerDefaults;
  const knownKeys = new Set(Object.keys(developerDefaults));
  const clean = Object.fromEntries(
    Object.entries(doc).filter(([k, v]) => knownKeys.has(k) && v !== "" && v !== null && v !== undefined)
  );
  return { ...developerDefaults, ...clean } as DeveloperContentData;
}
