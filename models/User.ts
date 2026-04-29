import { Schema, models, model } from "mongoose";

export type UserRole = "admin" | "client";
export type UserType = "buyer_investor" | "developer" | "existing_client";
export type LocationType = "local" | "overseas";

export interface IUser {
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  userType?: UserType;
  phone?: string;
  location?: {
    type: LocationType;
    city?: string;
  };
  pendingApproval?: boolean;
  companyName?: string;
  abn?: string;
  resetPasswordTokenHash?: string | null;
  resetPasswordExpiresAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

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
    companyName: {
      type: String,
      trim: true,
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
