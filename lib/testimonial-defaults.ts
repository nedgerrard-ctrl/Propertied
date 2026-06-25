export const testimonialDefaults = {
  // ── Featured / cinematic slots ─────────────────────────────────────────────
  // NOTE: Ashwin Lemaye's testimonial (cine1) uses his full name — confirm
  // written consent is on file before the site goes live.
  cine1Quote:
    "Eleven years ago I bought my investment property in Brunswick off-the-plan from Joan. For all that time my property was diligently managed. When I decided to sell, I did not look further than her. Joan developed the sales strategy, styled the apartment and launched the campaign in May. On the first day of inspection 25 groups came through the door, I received five offers and the property sold in three days for a profit I did not expect. I have no hesitation in recommending Joan to anyone who wants their asset preserved and resold at the right time.",
  cine1Client: "— Ashwin Lemaye, Sales & Management",

  cine2Quote:
    "We live overseas. Joan has managed our property investment for many years. Recently, she also managed the sale of our property and achieved a significantly better outcome than we anticipated. Joan always acted in our best interests.",
  cine2Client: "— Li Chin and Joo Hymn Tan, Sales & Management",

  cine3Quote:
    "Joan has personally managed my property for many years after I bought it through her agency. I recently instructed her to sell it for me, which she did in six weeks, helping me realise a significant profit.",
  cine3Client: "— Audrey Kuan, Sales",

  // ── Grid slots ─────────────────────────────────────────────────────────────
  grid1Quote:
    "Joan has managed our property for many years. After our property was accidentally flooded, Joan handled the situation with exceptional professionalism and persistence. She managed the claims process thoroughly and advocated strongly on our behalf, ultimately securing a payout far higher than expected. What could have been a very stressful experience was made much easier thanks to her dedication, clear communication, and commitment to achieving the best possible outcome on our behalf.",
  grid1Client: "— Hope Cao, Property Management",
  grid1Rating: 5,

  grid2Quote:
    "I had the pleasure of having Joan manage and represent myself and my property for many years — for both sales and rental. The service has been exceptional: with excellent clear communication and follow up to requests. It is clear that Joan is highly knowledgeable and has a thorough understanding of the rental and sales market. Her expertise and experience has been very much appreciated and valued. I felt very supported throughout. I would highly recommend Joan and PPM to anyone requiring property representation.",
  grid2Client: "— Samantha Ashford, Sales & Management",
  grid2Rating: 5,

  grid3Quote:
    "I would like to express my gratitude to Joan and the team for managing our property in Brunswick for over eight years and for making the selling process simple and trouble free. Joan's years in the property market give her extensive knowledge. She has always been very professional and helpful with any questions we needed answered, and responds to emails and messages in a timely manner — nothing was ever too much trouble. I highly recommend Joan for all your property needs. You will not be disappointed.",
  grid3Client: "— Ivana Bosco, Sales & Management",
  grid3Rating: 5,

  grid4Quote:
    "I am happy it's sold. Thank you so much for your tenacity and professionalism.",
  grid4Client: "— Danny Sernio, Sales",
  grid4Rating: 5,

  grid5Quote:
    "We will always be grateful for having an agent like you. You have been so supportive and communicative — and that is all a renter can hope for. We were blessed to have you as our first rental agent in Australia.",
  grid5Client: "— Diksha Sharma, Property Management",
  grid5Rating: 5,

  grid6Quote:
    "Thank you for your continued support and excellent management.",
  grid6Client: "— Jonas D., Property Owner",
  grid6Rating: 5,

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
