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
        { id: "t1", label: "Residential Rental Application Form",                         fileUrl: "", fileName: "" },
        { id: "t2", label: "Consent to Electronic Communication",                         fileUrl: "", fileName: "" },
        { id: "t3", label: "Notice of Intention to Vacate",                               fileUrl: "", fileName: "" },
        { id: "t4", label: "Victorian Renters Guide 2025 (Consumer Affairs Victoria)",    fileUrl: "", fileName: "" },
      ],
    },
    {
      id:      "owners",
      heading: "For Owners / Investors",
      items: [
        { id: "o1", label: "Owners Instruction Form",                                     fileUrl: "", fileName: "" },
        { id: "o2", label: "Sales Authority",                                             fileUrl: "", fileName: "" },
        { id: "o3", label: "Management Authority",                                        fileUrl: "", fileName: "" },
        { id: "o4", label: "Mandatory Disclosure Checklist",                              fileUrl: "", fileName: "" },
        { id: "o5", label: "Notice to Terminate Property Management Agreement",           fileUrl: "", fileName: "" },
        { id: "o6", label: "Transfer of Property Management (ADL Form)",                  fileUrl: "", fileName: "" },
      ],
    },
    {
      id:      "partners",
      heading: "Partner Resources",
      items: [
        { id: "p1", label: "Property Compliance Victoria — Minimum Standards brochure",   fileUrl: "", fileName: "" },
        { id: "p2", label: "Detector Inspector — Safer Home compliance plans",            fileUrl: "", fileName: "" },
        { id: "p3", label: "Terri Scheer — Landlord Insurance brochure",                  fileUrl: "", fileName: "" },
      ],
    },
  ],
  footerNote:  "To request a form not listed above, contact",
  footerEmail: "admin@onlinepropertyservices.com.au",
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
