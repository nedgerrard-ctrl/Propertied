import mongoose, { Schema, models, model } from "mongoose";

export type UserRole = "admin" | "client";
export type ClientType = "buyer" | "investor" | "developer" | "";
export type AccountStatus =
  | "active"
  | "pending-existing-client"
  | "approved-existing-client";

export interface AssignedDocument {
  originalName: string;
  storedName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
}

export interface IUser {
  name?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  clientType?: ClientType;
  accountStatus?: AccountStatus;
  phone?: string;
  phoneCountryCode?: string;
  companyName?: string;
  adminNotes?: string;
  assignedDocuments?: AssignedDocument[];
  resetPasswordTokenHash?: string | null;
  resetPasswordExpiresAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const assignedDocumentSchema = new Schema(
  {
    originalName: { type: String, required: true, trim: true, maxlength: 200 },
    storedName: { type: String, required: true, trim: true, maxlength: 255 },
    fileType: { type: String, required: true, trim: true, maxlength: 100 },
    fileSize: { type: Number, required: true, min: 0 },
    fileUrl: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "client"],
      default: "client",
    },
    clientType: {
      type: String,
      enum: ["buyer", "investor", "developer", ""],
      default: "",
    },
    companyName: {
      type: String,
      trim: true,
      default: "",
      maxlength: 120,
    },
    accountStatus: {
      type: String,
      enum: ["active", "pending-existing-client", "approved-existing-client"],
      default: "active",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    phoneCountryCode: {
      type: String,
      trim: true,
      default: "",
    },
    adminNotes: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },
    assignedDocuments: {
      type: [assignedDocumentSchema],
      default: [],
    },
    resetPasswordTokenHash: {
      type: String,
      default: null,
    },
    resetPasswordExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model<IUser>("User", userSchema);

export default User;