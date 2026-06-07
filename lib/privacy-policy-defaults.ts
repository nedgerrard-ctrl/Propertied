export const privacyPolicyDefaults = {
  // ── Hero ──────────────────────────────────────────────────────────────────
  heroHeadingMain:   "Privacy",
  heroHeadingAccent: "Policy.",
  heroSubtext:
    "How PPM collects, uses, and protects your personal information in accordance with the Privacy Act 1988 (Cth).",

  // ── Sections ──────────────────────────────────────────────────────────────
  section1Heading: "Information We Collect",
  section1Body:
    "PPM (Property Project Marketing Pty Ltd) collects personal information that you provide when enquiring about properties, registering for an account, or contacting us directly. This may include your name, email address, phone number, location, and information about your property goals and financial circumstances.",

  section2Heading: "How We Use Your Information",
  section2Body:
    "We use your personal information to respond to enquiries, provide property guidance, send relevant market updates, and administer your account. We may also use your information to comply with legal obligations and improve our services. We do not use your information for purposes unrelated to the services you have engaged us for.",

  section3Heading: "Disclosure of Information",
  section3Body:
    "We may share your information with trusted third parties — including developers, legal and conveyancing professionals, and technology service providers — where necessary to fulfil our services. We do not sell your personal information. All third parties are required to handle your information in accordance with applicable privacy law.",

  section4Heading: "Data Storage & Security",
  section4Body:
    "Your personal information is stored securely using industry-standard practices. We take reasonable steps to protect your information from misuse, loss, and unauthorised access. However, no transmission over the internet is entirely secure, and we cannot guarantee absolute security of information sent to us electronically.",

  section5Heading: "Cookies & Analytics",
  section5Body:
    "Our website may use cookies and similar tracking technologies to improve your experience and collect usage data. You may disable cookies in your browser settings, but this may affect the functionality of certain parts of our website.",

  section6Heading: "Access, Correction & Complaints",
  section6Body:
    "You have the right to request access to, or correction of, your personal information held by us. If you believe we have breached your privacy, you may lodge a complaint with us directly or with the Office of the Australian Information Commissioner (OAIC) at www.oaic.gov.au.",

  section7Heading: "Contact Us",
  section7Body:
    "For privacy-related enquiries or to exercise your rights, please contact us via the Contact page on our website or by writing to Property Project Marketing Pty Ltd. This policy was last updated in 2025 and may be revised periodically.",
};

export type PrivacyPolicyContentData = typeof privacyPolicyDefaults;

export function mergePrivacyPolicyContent(
  doc: Record<string, unknown> | null
): PrivacyPolicyContentData {
  if (!doc) return privacyPolicyDefaults;
  const knownKeys = new Set(Object.keys(privacyPolicyDefaults));
  const clean = Object.fromEntries(
    Object.entries(doc).filter(
      ([k, v]) => knownKeys.has(k) && v !== "" && v !== null && v !== undefined
    )
  );
  return { ...privacyPolicyDefaults, ...clean } as PrivacyPolicyContentData;
}
