import AuditLog from "../models/AuditLog";

export async function createAuditLog({ userId, action, resourceType, resourceId, metadata, ip }) {
  try {
    await AuditLog.create({ userId, action, resourceType: resourceType || null, resourceId: resourceId || null, metadata: metadata || {}, ip: ip || null });
  } catch (error) {
    console.error("Audit log creation failed:", error.message);
  }
}
