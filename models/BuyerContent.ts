import { Schema, model, models } from "mongoose";

const BuyerContentSchema = new Schema(
  {
    section:          { type: String, enum: ["investors", "owner-occupiers"], unique: true, sparse: true },
    heroLine1:        { type: String, default: "" },
    heroAccent:       { type: String, default: "" },
    heroLine3:        { type: String, default: "" },
    heroSubtext:      { type: String, default: "" },

    stat2Value:       { type: String, default: "" },
    stat2Label:       { type: String, default: "" },
    stat3Value:       { type: String, default: "" },
    stat3Label:       { type: String, default: "" },

    tailoredHeading:  { type: String, default: "" },

    investorsHeading:    { type: String, default: "" },
    investorsBody:       { type: String, default: "" },
    investorsBody2:      { type: String, default: "" },
    investorsStepsLabel: { type: String, default: "" },
    investorsBullet1:    { type: String, default: "" },
    investorsBullet2:    { type: String, default: "" },
    investorsBullet3:    { type: String, default: "" },
    investorsBullet4:    { type: String, default: "" },
    investorsBullet5:    { type: String, default: "" },

    ownerHeading:     { type: String, default: "" },
    ownerBody:        { type: String, default: "" },
    ownerStepsLabel:  { type: String, default: "" },
    ownerBullet1:     { type: String, default: "" },
    ownerBullet2:     { type: String, default: "" },
    ownerBullet3:     { type: String, default: "" },
    ownerBullet4:     { type: String, default: "" },
    ownerBullet5:     { type: String, default: "" },

    ctaHeading:       { type: String, default: "" },
    ctaBody:          { type: String, default: "" },
  },
  { timestamps: true }
);

// Always recompile so schema changes (like adding `section`) are picked up without a full server restart
delete (models as Record<string, unknown>)["BuyerContent"];
export default model("BuyerContent", BuyerContentSchema);
