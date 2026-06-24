export type BlogPageContentData = {
  heroHeadingMain:   string;
  heroHeadingAccent: string;
  heroSubtext:       string;
};

export const blogPageDefaults: BlogPageContentData = {
  heroHeadingMain:   "Blog &",
  heroHeadingAccent: "Insights.",
  heroSubtext:
    "Property investment insights, buyer guides, and market commentary from the PPM team.",
};

export function mergeBlogPageContent(
  doc: Record<string, unknown> | null
): BlogPageContentData {
  return {
    heroHeadingMain:   (doc?.heroHeadingMain   as string) || blogPageDefaults.heroHeadingMain,
    heroHeadingAccent: (doc?.heroHeadingAccent as string) || blogPageDefaults.heroHeadingAccent,
    heroSubtext:       (doc?.heroSubtext       as string) || blogPageDefaults.heroSubtext,
  };
}
