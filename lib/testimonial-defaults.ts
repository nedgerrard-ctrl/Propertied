export const testimonialDefaults = {
  cine1Quote:
    "PPM made the process feel organised and transparent from the beginning. Their guidance gave me confidence when purchasing off-the-plan for the first time.",
  cine1Client: "Daniel K. — Investor",
  cine2Quote:
    "As an overseas buyer, I needed a team I could trust. Communication was prompt, professional, and easy to follow throughout the journey.",
  cine2Client: "Sophia L. — Overseas Buyer",
  cine3Quote:
    "What stood out most was the end-to-end approach. It felt like I had a team supporting the whole property journey rather than just a sale.",
  cine3Client: "James W. — Client",

  grid1Quote:
    "The team understood my goals clearly and matched me with options that suited my budget and long-term investment strategy.",
  grid1Client: "Michael T. — Property Investor",
  grid1Rating: 4,
  grid2Quote:
    "I appreciated how clearly everything was explained. The process felt premium but still very practical and straightforward.",
  grid2Client: "Emma R. — Buyer",
  grid2Rating: 5,
  grid3Quote:
    "Professional presentation, timely follow-up, and a strong understanding of what investors actually need.",
  grid3Client: "Olivia C. — Local Investor",
  grid3Rating: 4,
  grid4Quote:
    "Professional presentation, timely follow-up, and a strong understanding of what investors actually need.",
  grid4Client: "Bryan C. — Local Investor",
  grid4Rating: 4,
  grid5Quote:
    "Professional presentation, timely follow-up, and a strong understanding of what investors actually need.",
  grid5Client: "Wallace C. — Local Investor",
  grid5Rating: 4,

  ctaHeading: "Ready to work with the PPM team?",
};

export type TestimonialContentData = typeof testimonialDefaults;

/** Merge DB doc with defaults, ignoring empty/null DB values so defaults always win for unset fields.
 *  For rating fields (numbers), only filter null/undefined — not 0. */
export function mergeTestimonialContent(doc: Record<string, unknown> | null): TestimonialContentData {
  if (!doc) return testimonialDefaults;
  const knownKeys = new Set(Object.keys(testimonialDefaults));
  const clean = Object.fromEntries(
    Object.entries(doc).filter(([key, v]) => {
      if (!knownKeys.has(key)) return false;
      if (key.endsWith("Rating")) return v !== null && v !== undefined;
      return v !== "" && v !== null && v !== undefined;
    })
  );
  return { ...testimonialDefaults, ...clean } as TestimonialContentData;
}
