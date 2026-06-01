import { Schema, models, model } from "mongoose";

interface IVerificationCode {
  email: string;
  codeHash: string;
  expiresAt: Date;
}

const verificationCodeSchema = new Schema<IVerificationCode>({
  email: { type: String, required: true, trim: true, lowercase: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
verificationCodeSchema.index({ email: 1 });

const VerificationCode =
  models.VerificationCode || model<IVerificationCode>("VerificationCode", verificationCodeSchema);

export default VerificationCode;
