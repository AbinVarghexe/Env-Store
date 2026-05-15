import mongoose from "mongoose";

const globalSecretSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    key: { type: String, required: true, trim: true },
    encryptedValue: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    service: { type: String, lowercase: true, trim: true },
  },
  { timestamps: true }
);

globalSecretSchema.index({ userId: 1, key: 1 }, { unique: true });

export default mongoose.models.GlobalSecret || mongoose.model("GlobalSecret", globalSecretSchema);
