import GlobalSecret from "../../models/GlobalSecret";
import { encrypt, decrypt } from "../../services/encryption";
import { createAuditLog } from "../../middleware/auditLogger";

export async function listGlobalSecrets(userId) {
  const secrets = await GlobalSecret.find({ userId }).sort({ createdAt: -1 });
  return Response.json({ secrets });
}

export async function createGlobalSecret(userId, body, ip) {
  const { key, value, service } = body;
  const { encryptedValue, iv, authTag } = encrypt(value);

  const secret = await GlobalSecret.findOneAndUpdate(
    { userId, key },
    { encryptedValue, iv, authTag, service: service || null },
    { upsert: true, new: true },
  );

  await createAuditLog({ userId, action: "global_secret.create", resourceType: "global_secret", resourceId: secret._id, metadata: { key, service }, ip });
  return Response.json({ secret }, { status: 201 });
}

export async function deleteGlobalSecret(userId, secretId, ip) {
  const secret = await GlobalSecret.findOneAndDelete({ _id: secretId, userId });
  if (!secret) return Response.json({ error: "Global secret not found" }, { status: 404 });

  await createAuditLog({ userId, action: "global_secret.delete", resourceType: "global_secret", resourceId: secretId, metadata: { key: secret.key }, ip });
  return Response.json({ message: "Global secret deleted successfully" });
}

export async function revealGlobalSecret(userId, secretId, ip) {
  const secret = await GlobalSecret.findOne({ _id: secretId, userId });
  if (!secret) return Response.json({ error: "Global secret not found" }, { status: 404 });

  const value = decrypt({ encryptedValue: secret.encryptedValue, iv: secret.iv, authTag: secret.authTag });

  await createAuditLog({ userId, action: "global_secret.reveal", resourceType: "global_secret", resourceId: secretId, metadata: { key: secret.key }, ip });
  return Response.json({ key: secret.key, value });
}
