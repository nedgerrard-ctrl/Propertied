export const landingDefaults = {
  heroTagline: "Property Project Marketing",
  heroLine1: "Management Consultants.",
  heroAccent: "Licensed Real Estate Agents.",
  heroLine3: "Off-the-Plan Specialists.",
  heroSubtext:
    "PPM is not a standard real estate agency. We are professional management consultants who hold a real estate licence — a combination that is unlikely to exist elsewhere in the Melbourne residential property market. Our model is built on depth, not volume: thirteen years of interactive project experience at the highest level and a deliberate decision to specialise rather than to diversify. The result is a quality of inside knowledge buyers simply cannot access anywhere else.",

  stat1Value: "$1.5B",
  stat1Unit: "",
  stat1Label: "Delivered Projects",
  stat2Value: "1,000+",
  stat2Unit: "",
  stat2Label: "Settled Sales",
  stat3Value: "$100M",
  stat3Unit: "",
  stat3Label: "Managed Portfolio",

  // Who We Are section
  whoWeAreHeading:
    "Management Consultants. Licensed Real Estate Agents. Off-the-Plan Specialists.",
  whoWeAreBody:
    "PPM is not a standard real estate agency. We are professional management consultants who hold a real estate licence — a combination that is unlikely to exist elsewhere in the Melbourne residential property market. Our model is built on depth, not volume: thirteen years of interactive project experience at the highest level and a deliberate decision to specialise rather than to diversify. The result is a quality of inside knowledge buyers simply cannot access anywhere else.",

  ethosHeading:
    "We sell new homes. We manage them. We resell them.",
  ethosBody:
    "Our services are built around two distinct journeys. The first is for investors who want to grow wealth through property without the stress of poor stock selection, junior property managers, or buying the wrong asset at the wrong time. The second is for owner-occupiers who want to find the right home at the right price and sell their current one at a premium with someone who has a proven track record.",

  ctaHeading: "Start your property journey with PPM.",

  // What We Do additional paragraphs
  whatWeDoBody2:
    "Both journeys start on the same path: having the property independently selected, buying off-the-plan and then sold at the appropriate time.",
  whatWeDoBody3:
    "Buying off-the-plan is a better stepping stone into the property market than established property — and from 1 July 2027, a tax-advantaged one.",

  // Our Transition
  transitionHeading: "From closed industry to open market",
  transitionP1:
    "After 13 years of working under our clients' brands, PPM has now partnered with Monash University to establish its own brand.",
  transitionP2:
    "This business re-launch enables the company to operate independently of any developer influence. There is no requirement to push any specific project, no volume quota to fill, and no third-party sales network to manage. Our only obligation is to the client in front of us.",
  transitionP3:
    "For the first time, our insider knowledge, real-time market intelligence and proven track record work directly and exclusively for buyers who are either investors or owner-occupiers.",
  transitionP4:
    "We also maintain our developer relationships as selective third-party agents and provide access to our established buyer database of qualified local and overseas investors.",

  // 2026 Federal Budget
  budgetHeading:
    "From 1 July 2027, new builds retain tax treatments that established housing loses.",
  budgetBullet1:
    "Negative gearing. Preserved for new builds. Restricted for established homes.",
  budgetBullet2:
    "50% CGT discount only available to new build investors. Other investors are much worse off.",
  budgetBody:
    "New builds — primarily off-the-plan apartments and townhouses — are the qualifying asset class. The after-tax position of new builds and established housing will diverge materially from that date.",
  budgetDisclaimer:
    "Current as at May 2026. Announced measures, not yet legislated. PPM does not provide financial, legal or taxation advice.",

  // Why Choose PPM
  whyHeading: "Six things no other Melbourne agency can offer.",
  why1: "Insider knowledge — Years of working on every aspect of a project, not just on parts of it.",
  why2: "Real-time intelligence — we see the market before published data does.",
  why3: "Genuine independence — no quotas, no agenda, unbiased buyer recommendations.",
  why4: "One relationship — buy, manage, sell, repeat.",
  why5: "Zero buyer fees — the vendor pays us.",
  why6: "We steward not just manage — your asset is looked after at the highest level.",

  // Why Choose PPM — stewardship addendum
  whyStewardBody:
    "Property management is a licensed trust account business with statutory consequences that most agencies quietly delegate to junior staff. At PPM, that responsibility stays at the highest level — always.",

  // Services grid
  svc1Label: "Buyers",
  svc1Sub:   "Investors & owner-occupiers",
  svc1Desc:  "Access curated off-the-plan properties across Melbourne — guided from enquiry through to settlement, at zero cost to you.",
  svc2Label: "About",
  svc2Sub:   "Our story & history",
  svc2Desc:  "13 years inside Melbourne's development industry, now working directly for buyers.",
  svc3Label: "Developers",
  svc3Sub:   "Advisory, sales & project rescue",
  svc3Desc:  "Full lifecycle developer services — from concept feasibility through to targeted sales execution and project rescue.",
  svc4Label: "Testimonials",
  svc4Sub:   "What our clients say",
  svc4Desc:  "Hear from buyers, investors, and developers who have worked with PPM.",
  svc5Label: "Insights",
  svc5Sub:   "Market intelligence",
  svc5Desc:  "The 2026 Federal Budget has changed the investment landscape — in favour of off-the-plan.",
  svc6Label: "Contact",
  svc6Sub:   "Get in touch",
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
