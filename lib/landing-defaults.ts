export const landingDefaults = {
  heroTagline: "Property Project Marketing",
  heroLine1: "Melbourne's",
  heroAccent: "end-to-end",
  heroLine3: "property partner.",
  heroSubtext:
    "We source, market, and manage residential property — connecting developers with qualified local and overseas buyers at every stage of the property lifecycle.",

  stat1Value: "10+",
  stat1Unit: "Years",
  stat1Label: "Industry Experience",
  stat2Value: "$1.5B+",
  stat2Unit: "",
  stat2Label: "Projects Delivered",
  stat3Value: "End-to-end",
  stat3Unit: "",
  stat3Label: "Source · Buy · Manage · Resell",

  ethosHeading:
    "We believe property investment should be simple, transparent, and built for the long term.",
  ethosBody:
    "PPM manages the full property lifecycle on behalf of investors — from sourcing new developments and matching them with qualified buyers, to ongoing portfolio management and resale through our sister company, Online Property Services.",

  ctaHeading: "Start your property journey with PPM.",

  // Services grid
  svc1Label: "For Buyers",
  svc1Sub:   "Off-plan & established",
  svc1Desc:  "Access curated off-the-plan and established properties across Melbourne — guided from enquiry through to settlement.",
  svc2Label: "About Us",
  svc2Sub:   "Our story & team",
  svc2Desc:  "A decade of delivering end-to-end property services across Melbourne.",
  svc3Label: "For Developers",
  svc3Sub:   "Partnership enquiries",
  svc3Desc:  "We connect your project with qualified local and overseas buyers through our established network.",
  svc4Label: "Testimonials",
  svc4Sub:   "Client perspectives",
  svc4Desc:  "Hear from buyers, investors, and developers who have worked with PPM.",
  svc5Label: "Blog & Insights",
  svc5Sub:   "Market perspectives",
  svc5Desc:  "Analysis and perspectives on the Melbourne property market.",
  svc6Label: "Contact",
  svc6Sub:   "Start a conversation",
};

export type LandingContentData = typeof landingDefaults;

/** Merge DB doc with defaults, ignoring empty/null DB values so defaults always win for unset fields. */
export function mergeLandingContent(doc: Record<string, unknown> | null): LandingContentData {
  if (!doc) return landingDefaults;
  const knownKeys = new Set(Object.keys(landingDefaults));
  const clean = Object.fromEntries(
    Object.entries(doc).filter(([k, v]) => knownKeys.has(k) && v !== "" && v !== null && v !== undefined)
  );
  return { ...landingDefaults, ...clean } as LandingContentData;
}
