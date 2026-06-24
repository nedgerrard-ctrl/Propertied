export const fullDisclaimerDefaults = {
  // ── Hero ──────────────────────────────────────────────────────────────────
  heroHeadingMain:   "Full",
  heroHeadingAccent: "Disclaimer.",
  heroSubtext:
    "Legal and regulatory disclosures for all services, content, and information provided by PPM. Effective 1 July 2026.",

  // ── Legacy body fields (kept for DB compatibility) ────────────────────────
  para1:       "",
  para2:       "",
  para3:       "",
  para4:       "",
  licenceLine: "",

  // ── Per-element overrides for the 20-section body ─────────────────────────
  sectionOverrides: {} as Record<string, string>,
};

export type FullDisclaimerContentData = typeof fullDisclaimerDefaults;

export function mergeFullDisclaimerContent(
  doc: Record<string, unknown> | null
): FullDisclaimerContentData {
  if (!doc) return fullDisclaimerDefaults;
  const knownKeys = new Set(Object.keys(fullDisclaimerDefaults));
  const clean = Object.fromEntries(
    Object.entries(doc).filter(
      ([k, v]) => knownKeys.has(k) && k !== "sectionOverrides" && v !== "" && v !== null && v !== undefined
    )
  );
  const sectionOverrides =
    doc.sectionOverrides && typeof doc.sectionOverrides === "object"
      ? (doc.sectionOverrides as Record<string, string>)
      : {};
  return { ...fullDisclaimerDefaults, ...clean, sectionOverrides } as FullDisclaimerContentData;
}
