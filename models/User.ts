import { Schema, models, model } from "mongoose";

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
export type UserType = "buyer_investor" | "developer" | "existing_client";
export type LocationType = "local" | "overseas";

export interface IAssignedDocument {
  originalName: string;
  storedName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedByClient?: boolean;
  docType?: string;
  docStatus?: string;
  uploadedAt?: Date;
}

export interface IUser {
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  clientType?: ClientType;
  accountStatus?: AccountStatus;
  phoneCountryCode?: string;
  userType?: UserType;
  phone?: string;
  location?: {
    type: LocationType;
    city?: string;
  };
  pendingApproval?: boolean;
  companyName?: string;
  abn?: string;
  adminNotes?: string;
  assignedDocuments?: IAssignedDocument[];
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
    uploadedByClient: { type: Boolean, default: false },
    docType: { type: String, trim: true, maxlength: 50, default: "Legal" },
    docStatus: { type: String, trim: true, maxlength: 50, default: "Pending" },
    uploadedAt: { type: Date, default: Date.now },
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
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
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
    userType: {
      type: String,
      enum: ["buyer_investor", "developer", "existing_client"],
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    location: {
      type: {
        type: String,
        enum: ["local", "overseas"],
      },
      city: {
        type: String,
        trim: true,
      },
    },
    pendingApproval: {
      type: Boolean,
      default: false,
    },
    abn: {
      type: String,
      trim: true,
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
