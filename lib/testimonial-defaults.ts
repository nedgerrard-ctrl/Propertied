export const testimonialDefaults = {
  cine1Quote:
    "Testimonial to be added prior to launch.",
  cine1Client: "— Client name",
  cine2Quote:
    "Testimonial to be added prior to launch.",
  cine2Client: "— Client name",
  cine3Quote:
    "Testimonial to be added prior to launch.",
  cine3Client: "— Client name",

  grid1Quote:
    "Testimonial to be added prior to launch.",
  grid1Client: "— Client name",
  grid1Rating: 5,
  grid2Quote:
    "Testimonial to be added prior to launch.",
  grid2Client: "— Client name",
  grid2Rating: 5,
  grid3Quote:
    "Testimonial to be added prior to launch.",
  grid3Client: "— Client name",
  grid3Rating: 5,
  grid4Quote:
    "Testimonial to be added prior to launch.",
  grid4Client: "— Client name",
  grid4Rating: 5,
  grid5Quote:
    "Testimonial to be added prior to launch.",
  grid5Client: "— Client name",
  grid5Rating: 5,

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
