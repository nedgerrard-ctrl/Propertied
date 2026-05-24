export const fullDisclaimerDefaults = {
  // ── Hero ──────────────────────────────────────────────────────────────────
  heroHeadingMain:   "Full",
  heroHeadingAccent: "Disclaimer.",
  heroSubtext:
    "Legal and regulatory disclosures for all services, content, and information provided by PPM.",

  // ── Body paragraphs ───────────────────────────────────────────────────────
  para1:
    "PPM is the public-facing brand of Property Project Marketing Pty Ltd, a licensed real estate agency. Management services provided by Online Property Services. Acquisition services are vendor-compensated; no fees are charged to buyers for property selection or guidance.",

  para2:
    "Stamp duty concessions on off-the-plan purchases are subject to individual circumstances, property type, and applicable Victorian legislation at the time of contract.",

  para3:
    "Information relating to negative gearing, capital gains tax treatment and other tax provisions referenced on this website relates to proposed legislative changes announced in the 2026-27 Federal Budget. These changes have not yet fully passed into law, are subject to amendment, and their application will vary significantly depending on individual circumstances, existing tax position, property type and transaction timing. Nothing on this website constitutes financial, legal or taxation advice, nor a recommendation or endorsement of any investment or tax strategy. Before making any investment decision, you must seek independent advice from a registered tax agent, qualified accountant or legal practitioner who can assess your specific situation.",

  para4:
    "Preferential resale commission rates apply to clients who have previously transacted through PPM. Terms available on request.",

  // ── Licence line ─────────────────────────────────────────────────────────
  licenceLine: "Licence No. 074846L · ABN 99 162 429 558.",
};

export type FullDisclaimerContentData = typeof fullDisclaimerDefaults;

export function mergeFullDisclaimerContent(
  doc: Record<string, unknown> | null
): FullDisclaimerContentData {
  if (!doc) return fullDisclaimerDefaults;
  const knownKeys = new Set(Object.keys(fullDisclaimerDefaults));
  const clean = Object.fromEntries(
    Object.entries(doc).filter(
      ([k, v]) => knownKeys.has(k) && v !== "" && v !== null && v !== undefined
    )
  );
  return { ...fullDisclaimerDefaults, ...clean } as FullDisclaimerContentData;
}
