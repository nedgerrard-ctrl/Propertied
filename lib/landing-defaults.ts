export const landingDefaults = {
  heroTagline: "Property Project Marketing",
  heroLine1: "Off-the-Plan &",
  heroAccent: "Property Portfolio Management",
  heroLine3: "Specialists",
  heroSubtext:
    "PPM is not your typical real estate agency. We are business and management consultants with a real estate licence — a distinct combination rarely found in the Melbourne market. We've been helping clients secure high-growth off-the-plan properties since 2013.",
  heroSubtext2:
    "We find the right property for you at no cost, manage it as a high-growth asset (not just a rental) and resell at the optimal time. As an investor, you can either take or reinvest your profit. As an owner-occupier, you can upgrade to a better lifestyle. We can help you with either journey.",
  heroCta:
    "Ready to take the next step? Click the button below — or simply scroll to learn more.",

  stat1Value: "$1.5B",
  stat1Unit: "",
  stat1Label: "Delivered Projects",
  stat2Value: "1,500+",
  stat2Unit: "",
  stat2Label: "Settled Sales",
  stat3Value: "$100M",
  stat3Unit: "",
  stat3Label: "Managed Portfolio (capped*)",

  // Who We Are section
  whoWeAreHeading:
    "Business consultants. Licensed real estate agents. Off-the-plan specialists.",
  whoWeAreBody:
    "PPM is neither a standard real estate agency nor a mere extension of a developer's marketing arm. We are professional business and management consultants who hold a full real estate licence. Our model is intentionally built on depth, not volume.",
  whoWeAreBody2:
    "While most firms operate as developers' outsourced sales arms, we were the actual embedded in-house team. We bring genuine hands-on experience driving major projects to success from the inside.",
  whoWeAreBody3:
    "The result is an unparalleled depth of market insight that buyers simply cannot access anywhere else.",

  ethosHeading:
    "We Find. You Buy. We Manage & Resell — You Take Your Profit or Upgrade.",
  ethosBody:
    "Our services are built around two distinct journeys.",

  // What We Do cards
  investorCardTitle: "A complete, stress-free wealth-building journey",
  investorCardP1: "We provide a complete stress-free wealth building journey for those who want to grow their Australian property portfolio with confidence.",
  investorCardP2: "Our process eliminates the common risks of poor property selection, inexperienced junior managers, or buying or selling at the wrong time.",
  investorCardP3: "Because our property management portfolio is deliberately capped at $100 million, each client can rely on having an expert look after their asset.",
  ownerCardTitle: "The right home, at the right price",
  ownerCardP1: "We help you find the right home at the right price — and, when you are ready to sell, your property is sold at a premium by experts with a proven track record.",
  ownerCardP2: "This allows you to leverage the built-up equity to repeat the cycle — upsizing into an even better property that further enhances your lifestyle.",

  ctaHeading: "Start your property journey with PPM.",

  // What We Do additional paragraphs
  whatWeDoBody2:
    "Both journeys share the same foundation: the expert selection of high potential off-the-plan properties, a smooth and well-supported purchase process and a strategic resale at the optimal time in the property cycle.",
  whatWeDoBody3:
    "Buying off-the-plan is a better stepping stone into the property market than established property — and from 1 July 2027, a tax-advantaged one.",

  // Our Transition
  transitionHeading: "From industry insider to direct-to-market.",
  transitionP1:
    "After 13 years of successfully working under our clients' brands, PPM has partnered with Monash University to establish its own independent brand.",
  transitionP2:
    "This re-launch allows us to operate free of any vendor influence. There are no volume quotas to meet, no specific projects we must push and no third-party sales networks to manage. Our only obligation is to the client in front of us.",
  transitionP3:
    "For the first time, our insider knowledge, real-time market intelligence and proven track record work directly for buyers who are either investors or owner-occupiers.",
  transitionP4:
    "At the same time, we continue to maintain strong developer relationships as selective third-party agents and provide access to our established buyer database of qualified local and overseas investors.",
  transitionCta:
    "For more detail, click on the group below that is relevant to your position in the market:",

  // 2026 Federal Budget
  budgetHeading:
    "From 1 July 2027, new builds retain tax treatments that established housing loses.",
  budgetBullet1:
    "Negative gearing. Preserved for new builds. Restricted for established homes.",
  budgetBullet2:
    "50% CGT discount. Only available to new build investors. Other investors are much worse off.",
  budgetBody:
    "New builds — primarily off-the-plan apartments and townhouses — are the qualifying asset class. The after-tax position of new builds and established housing will diverge materially from that date.",
  budgetDisclaimer:
    "Current as at May 2026. Announced measures, not yet legislated. PPM does not provide financial, legal or taxation advice.",

  // Why Choose PPM
  whyHeading: "Six things no other Melbourne agency can offer.",
  why1: "Insider knowledge — We are experienced in every aspect of a development, not just some parts of it.",
  why2: "Real-time intelligence — Being at the coalface, our market knowledge is months ahead of published data.",
  why3: "Independent property advice — We are not constrained by anyone else's agenda.",
  why4: "One seamless relationship — We acquire, manage, divest and reinvest your capital gains.",
  why5: "Zero buyer fees — The development vendor pays us.",
  why6: "We manage your asset — Your property is looked after by experts not juniors.",

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
