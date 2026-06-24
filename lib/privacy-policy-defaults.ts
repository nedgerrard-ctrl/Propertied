export const privacyPolicyDefaults = {
  // ── Hero ──────────────────────────────────────────────────────────────────
  heroHeadingMain:   "Privacy",
  heroHeadingAccent: "Policy.",
  heroSubtext:
    "How PPM collects, uses, and protects your personal information in accordance with the Privacy Act 1988 (Cth).",

  // ── Legacy section fields (kept for DB compatibility) ─────────────────────
  section1Heading: "",
  section1Body:    "",
  section2Heading: "",
  section2Body:    "",
  section3Heading: "",
  section3Body:    "",
  section4Heading: "",
  section4Body:    "",
  section5Heading: "",
  section5Body:    "",
  section6Heading: "",
  section6Body:    "",
  section7Heading: "",
  section7Body:    "",

  // ── Per-element overrides for the 19-section body ─────────────────────────
  sectionOverrides: {} as Record<string, string>,
};

export type PrivacyPolicyContentData = typeof privacyPolicyDefaults;

export function mergePrivacyPolicyContent(
  doc: Record<string, unknown> | null
): PrivacyPolicyContentData {
  if (!doc) return privacyPolicyDefaults;
  const knownKeys = new Set(Object.keys(privacyPolicyDefaults));
  const clean = Object.fromEntries(
    Object.entries(doc).filter(
      ([k, v]) => knownKeys.has(k) && k !== "sectionOverrides" && v !== "" && v !== null && v !== undefined
    )
  );
  const sectionOverrides =
    doc.sectionOverrides && typeof doc.sectionOverrides === "object"
      ? (doc.sectionOverrides as Record<string, string>)
      : {};
  return { ...privacyPolicyDefaults, ...clean, sectionOverrides } as PrivacyPolicyContentData;
}
