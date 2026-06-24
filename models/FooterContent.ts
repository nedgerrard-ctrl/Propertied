import { Schema, model, models } from "mongoose";

const FooterContentSchema = new Schema(
  {
    // Brand column
    brandTagline:  { type: String, default: "" },
    brandAddress:  { type: String, default: "" },
    brandLicence:  { type: String, default: "" },
    brandLanguages:{ type: String, default: "" },

    // Services links
    service1Label: { type: String, default: "" },
    service1Href:  { type: String, default: "" },
    service2Label: { type: String, default: "" },
    service2Href:  { type: String, default: "" },
    service3Label: { type: String, default: "" },
    service3Href:  { type: String, default: "" },
    service4Label: { type: String, default: "" },
    service4Href:  { type: String, default: "" },

    // Company links
    company1Label: { type: String, default: "" },
    company1Href:  { type: String, default: "" },
    company2Label: { type: String, default: "" },
    company2Href:  { type: String, default: "" },
    company3Label: { type: String, default: "" },
    company3Href:  { type: String, default: "" },
    company4Label: { type: String, default: "" },
    company4Href:  { type: String, default: "" },
    company5Label: { type: String, default: "" },
    company5Href:  { type: String, default: "" },

    // Contact
    contactSalesEmail:      { type: String, default: "" },
    contactManagementEmail: { type: String, default: "" },
    contactGeneralEmail:    { type: String, default: "" },
    contactPhone1:          { type: String, default: "" },
    contactPhone2:          { type: String, default: "" },

    // Social media
    youtubeUrl:   { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    facebookUrl:  { type: String, default: "" },

    // Compliance bar
    complianceText: { type: String, default: "" },
    copyrightText:  { type: String, default: "" },

    // Status
    published: { type: Boolean, default: true },
    archived:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

const FooterContent =
  models.FooterContent || model("FooterContent", FooterContentSchema);

export default FooterContent;
