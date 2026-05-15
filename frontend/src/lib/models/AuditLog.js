import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: {
      type: String, required: true,
      enum: [
        "secret.create", "secret.read", "secret.update", "secret.delete", "secret.reveal",
        "secret.download_env",
        "project.create", "project.delete", "project.member.add", "project.member.remove",
        "environment.create", "environment.delete",
        "auth.login", "auth.login.failed", "auth.register", "auth.2fa.enable", "auth.2fa.disable",
        "token.create", "token.revoke",
        "global_secret.create", "global_secret.delete", "global_secret.reveal",
      ],
    },
    resourceType: { type: String, enum: ["secret", "project", "environment", "user", "token", "global_secret"], default: null },
    resourceId: { type: mongoose.Schema.Types.ObjectId, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    ip: { type: String, default: null },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ userId: 1, action: 1 });

export default mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
