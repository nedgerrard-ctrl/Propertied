export const developerDefaults = {
  heroHeadingMain: "Advisory. Management. Marketing. Sales.",
  heroHeadingAccent: "",
  heroSubtext:
    "PPM covers the full development lifecycle — from concept feasibility and pricing strategy through to targeted sales execution and full project rescue. As a selective third-party agent, we bring a qualified buyer network built across thirteen years.",

  networkHeadingMain: "Full lifecycle developer services —",
  networkHeadingAccent: "built on thirteen years of insider knowledge.",
  networkP1:
    "PPM's services cover the full development lifecycle. At concept stage we provide feasibility input, finish selection guidance, pricing strategy and marketing positioning — the decisions that determine the outcome at completion. For projects already in the market, we deliver targeted sales execution and, where required, full project rescue and restructuring. PPM has turned around developments that other agencies could not move, applying business consulting discipline to the diagnosis and proven sales capability to the execution. We engage selectively — not every project suits our model, and our model is not suited to every developer. What it does suit is a developer who wants a reliable partner invested in the outcome.",
  networkP2:
    "As a selective third-party agent, PPM also provides developers with direct access to our established database of qualified local and overseas investors who are actively seeking Melbourne off-the-plan property. This network has been built across thirteen years of active market participation. Because we have moved to a B2C model and hold no direct financial tie to any single developer, our recommendation of a project carries genuine weight with buyers — something an in-house sales team cannot replicate.",
  networkP3:
    "PPM's transition to a B2C model has not closed the door on developer relationships — it has simply changed their nature. We now engage as a trusted independent partner on the projects we believe in, and when we bring our network to a development, our recommendation carries genuine weight with buyers.",
  networkBullet1: "Feasibility input & pricing strategy at concept",
  networkBullet2: "Targeted sales execution for in-market projects",
  networkBullet3: "Full project rescue and restructure capability",
  networkBullet4: "Access to a qualified buyer database of local and overseas investors",

  partnerHeading: "Independent representation that carries genuine weight.",
  benefit1Title: "Not tied to any single developer",
  benefit1Desc:
    "As a selective third-party agent, PPM provides developers with direct access to our established database of qualified local and overseas investors who are actively seeking Melbourne off-the-plan property.",
  benefit2Title: "Thirteen years of market participation",
  benefit2Desc:
    "Our buyer network has been built across thirteen years of active market participation. We take on the projects we believe in — and when we bring our network to a development, our clients trust the recommendation.",
  benefit3Title: "A trusted independent partner",
  benefit3Desc:
    "PPM's transition to a B2C model has not closed the door on developer relationships. We now engage selectively as a trusted independent partner — which creates a more credible and more effective position for both parties.",

  processHeading: "A selective and structured partnership",
  process1Title: "Concept stage assessment",
  process1Desc:
    "Feasibility input, finish selection guidance, pricing strategy and marketing positioning — the decisions that determine the outcome at completion.",
  process2Title: "Sales execution & project rescue",
  process2Desc:
    "For projects in market, targeted sales execution and, where required, full project rescue and restructure using management consulting discipline.",
  process3Title: "Qualified buyer network access",
  process3Desc:
    "Direct access to our established database of qualified local and overseas investors actively seeking Melbourne off-the-plan property.",

  endToEndHeading: "Beyond the initial sale.",
  endToEndP1:
    "PPM's broader model extends beyond simply introducing a buyer to a project. We are built around a wider investment journey that continues through portfolio management and eventual resale.",
  endToEndP2:
    "That matters to developers because it reflects deeper investor relationships — clients who stay in the portfolio, who return for reinvestment, and who trust PPM's recommendation next time.",
  lifecycle1: "Concept feasibility & pricing strategy",
  lifecycle2: "Project marketing & sales execution",
  lifecycle3: "Buyer management & long-term relationships",
  lifecycle4: "Resale & reinvestment into future projects",

  ctaHeading: "Discuss your development\nin confidence.",
  ctaSubtext:
    "To discuss your project in confidence, contact us at admin@ppmproperty.com.au or register your interest below.",
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
