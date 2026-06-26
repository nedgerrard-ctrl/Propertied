export type ResourceItem = {
  id:       string;
  label:    string;
  fileUrl:  string;
  fileName: string;
};

export type ResourceSection = {
  id:      string;
  heading: string;
  items:   ResourceItem[];
};

export type ResourcesContentData = {
  heroHeadingMain:   string;
  heroHeadingAccent: string;
  heroSubtext:       string;
  sections:          ResourceSection[];
  footerNote:        string;
  footerEmail:       string;
};

export const resourcesDefaults: ResourcesContentData = {
  heroHeadingMain:   "Download",
  heroHeadingAccent: "Resources.",
  heroSubtext:
    "Forms and documents for tenants, owners, investors, and partner organisations.",
  sections: [
    {
      id:      "tenants",
      heading: "For Tenants",
      items: [
        { id: "t1", label: "Residential Rental Application Form",                         fileUrl: "/assets/forms/residential-rental-application.pdf",        fileName: "residential-rental-application.pdf" },
        { id: "t2", label: "Consent to Electronic Communication",                         fileUrl: "/assets/forms/consent-to-electronic-communication.pdf",    fileName: "consent-to-electronic-communication.pdf" },
        { id: "t3", label: "Notice of Intention to Vacate",                               fileUrl: "/assets/forms/notice-of-intention-to-vacate.pdf",          fileName: "notice-of-intention-to-vacate.pdf" },
        { id: "t4", label: "Victorian Renters Guide 2025 (Consumer Affairs Victoria)",    fileUrl: "/assets/forms/renters-guide-2025.pdf",                     fileName: "renters-guide-2025.pdf" },
      ],
    },
    {
      id:      "owners",
      heading: "For Owners / Investors",
      items: [
        { id: "o1", label: "Owners Instruction Form",                                     fileUrl: "/assets/forms/owners-instruction-form.pdf",               fileName: "owners-instruction-form.pdf" },
        { id: "o2", label: "Sales Authority",                                             fileUrl: "",                                                         fileName: "" },
        { id: "o4", label: "Mandatory Disclosure Checklist",                              fileUrl: "/assets/forms/mandatory-disclosure-checklist.pdf",         fileName: "mandatory-disclosure-checklist.pdf" },
        { id: "o5", label: "Transfer of Property Management (ADL Form)",                  fileUrl: "/assets/forms/transfer-of-property-management.pdf",        fileName: "transfer-of-property-management.pdf" },
      ],
    },
    {
      id:      "partners",
      heading: "Partner Resources",
      items: [
        { id: "p1", label: "Property Compliance Victoria — Minimum Standards brochure",    fileUrl: "/assets/forms/minimum-standards-consumer-affairs-vic.pdf", fileName: "minimum-standards-consumer-affairs-vic.pdf" },
        { id: "p2", label: "Detector Inspector — Safer Home compliance plans",             fileUrl: "/assets/forms/detector-inspector-comply-now-pay-later.pdf", fileName: "detector-inspector-comply-now-pay-later.pdf" },
        { id: "p3", label: "Terri Scheer — Landlord Insurance brochure",                  fileUrl: "/assets/forms/terri-scheer-landlord-insurance-brochure.pdf", fileName: "terri-scheer-landlord-insurance-brochure.pdf" },
      ],
    },
  ],
  footerNote:  "To request a form not listed above, contact",
  footerEmail: "admin@ppmproperty.com.au",
};

export function mergeResourcesContent(
  doc: Record<string, unknown> | null
): ResourcesContentData {
  return {
    heroHeadingMain:   (doc?.heroHeadingMain   as string) || resourcesDefaults.heroHeadingMain,
    heroHeadingAccent: (doc?.heroHeadingAccent as string) || resourcesDefaults.heroHeadingAccent,
    heroSubtext:       (doc?.heroSubtext       as string) || resourcesDefaults.heroSubtext,
    sections:
      Array.isArray(doc?.sections) && (doc.sections as unknown[]).length > 0
        ? (doc.sections as ResourceSection[])
        : resourcesDefaults.sections,
    footerNote:  (doc?.footerNote  as string) || resourcesDefaults.footerNote,
    footerEmail: (doc?.footerEmail as string) || resourcesDefaults.footerEmail,
  };
}
