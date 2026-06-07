export const footerDefaults = {
  // Brand column
  brandTagline:   "PPM · Property Project Marketing",
  brandAddress:   "Property Project Marketing Pty Ltd\nT/A Online Property Services\nLevel 7, 570 St Kilda Road\nMelbourne, Victoria 3004",
  brandLicence:   "ABN 99 162 429 558\nEstate Agents Licence No. 074846L",
  brandLanguages: "Languages: English · 中文 · 한국어",

  // Services links
  service1Label: "Off-the-Plan Sales",
  service1Href:  "/buyers/investors",
  service2Label: "Property Management",
  service2Href:  "/buyers/investors",
  service3Label: "Resale",
  service3Href:  "/buyers/investors",
  service4Label: "Developer Services",
  service4Href:  "/developer",

  // Company links
  company1Label: "About PPM",
  company1Href:  "/about",
  company2Label: "Our People",
  company2Href:  "/our-people",
  company3Label: "Insights",
  company3Href:  "/insights",
  company4Label: "Past Projects",
  company4Href:  "/past-projects",
  company5Label: "Contact",
  company5Href:  "/contact",

  // Contact
  contactSalesEmail:      "sales@onlinepropertyservices.com.au",
  contactManagementEmail: "rental@onlinepropertyservices.com.au",
  contactGeneralEmail:    "admin@onlinepropertyservices.com.au",
  contactPhone1:          "0418 520 714",
  contactPhone2:          "0409 522 394",

  // Social media (empty by default — hidden when not set)
  youtubeUrl:   "",
  instagramUrl: "",
  facebookUrl:  "",

  // Compliance bar
  complianceText:
    "PPM is a licensed real estate agency. Licence No. 074846L · ABN 99 162 429 558. PPM does not provide financial, legal or taxation advice. Tax information on this site relates to proposed 2026-27 Budget changes and is general information only. Seek independent professional advice before making any investment decision.",
  copyrightText: "© 2026 Property Project Marketing Pty Ltd",
};

export type FooterContentData = typeof footerDefaults;

export function mergeFooterContent(
  doc: Record<string, unknown> | null
): FooterContentData {
  if (!doc) return { ...footerDefaults };

  return Object.fromEntries(
    (Object.keys(footerDefaults) as (keyof typeof footerDefaults)[]).map((key) => {
      const dbVal = doc[key];
      const defaultVal = footerDefaults[key];
      // URL fields: accept empty string (allows clearing a social link)
      if (key.endsWith("Url")) {
        return [key, typeof dbVal === "string" ? dbVal : defaultVal];
      }
      // Text fields: fall back to default when empty
      return [
        key,
        typeof dbVal === "string" && dbVal.trim() ? dbVal : defaultVal,
      ];
    })
  ) as FooterContentData;
}
