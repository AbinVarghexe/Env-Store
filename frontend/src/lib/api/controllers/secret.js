import Secret from "../../models/Secret";
import { encrypt, decrypt } from "../../services/encryption";
import { createAuditLog } from "../../middleware/auditLogger";

export async function listSecrets(projectId, envId) {
  const secrets = await Secret.find({ projectId, environmentId: envId }).select("-encryptedValue -iv -authTag").sort({ key: 1 });
  return Response.json({ secrets });
}

export async function createSecret(projectId, envId, userId, body, ip) {
  const { key, value } = body;
  const existing = await Secret.findOne({ projectId, environmentId: envId, key });
  if (existing) return Response.json({ error: `Secret with key "${key}" already exists` }, { status: 409 });

  const { encryptedValue, iv, authTag } = encrypt(value);
  const secret = await Secret.create({ projectId, environmentId: envId, key, encryptedValue, iv, authTag, version: 1, createdBy: userId });

  await createAuditLog({ userId, action: "secret.create", resourceType: "secret", resourceId: secret._id, metadata: { key, projectId, environmentId: envId }, ip });
  return Response.json({
    secret: { _id: secret._id, key: secret.key, version: secret.version, createdBy: secret.createdBy, createdAt: secret.createdAt, updatedAt: secret.updatedAt },
  }, { status: 201 });
}

export async function updateSecret(projectId, envId, secretId, userId, body, ip) {
  const { value } = body;
  const secret = await Secret.findOne({ _id: secretId, projectId, environmentId: envId });
  if (!secret) return Response.json({ error: "Secret not found" }, { status: 404 });

  const { encryptedValue, iv, authTag } = encrypt(value);
  secret.encryptedValue = encryptedValue;
  secret.iv = iv;
  secret.authTag = authTag;
  secret.version += 1;
  await secret.save();

  await createAuditLog({ userId, action: "secret.update", resourceType: "secret", resourceId: secretId, metadata: { key: secret.key, newVersion: secret.version }, ip });
  return Response.json({ secret: { _id: secret._id, key: secret.key, version: secret.version, updatedAt: secret.updatedAt } });
}

export async function deleteSecret(projectId, envId, secretId, userId, ip) {
  const secret = await Secret.findOneAndDelete({ _id: secretId, projectId, environmentId: envId });
  if (!secret) return Response.json({ error: "Secret not found" }, { status: 404 });

  await createAuditLog({ userId, action: "secret.delete", resourceType: "secret", resourceId: secretId, metadata: { key: secret.key }, ip });
  return Response.json({ message: "Secret deleted successfully" });
}

export async function revealSecret(projectId, envId, secretId, userId, ip) {
  const secret = await Secret.findOne({ _id: secretId, projectId, environmentId: envId });
  if (!secret) return Response.json({ error: "Secret not found" }, { status: 404 });

  const value = decrypt({ encryptedValue: secret.encryptedValue, iv: secret.iv, authTag: secret.authTag });
  await createAuditLog({ userId, action: "secret.reveal", resourceType: "secret", resourceId: secretId, metadata: { key: secret.key }, ip });
  return Response.json({ key: secret.key, value, version: secret.version });
}

export async function downloadSecrets(projectId, envId, userId, ip) {
  const secrets = await Secret.find({ projectId, environmentId: envId }).sort({ key: 1 });
  if (secrets.length === 0) return Response.json({ error: "No secrets found for this environment" }, { status: 404 });

  const envContent = secrets.map((s) => `${s.key}=${decrypt({ encryptedValue: s.encryptedValue, iv: s.iv, authTag: s.authTag })}`).join("\n");

  await createAuditLog({ userId, action: "secret.download_env", resourceType: "environment", resourceId: envId, metadata: { projectId, count: secrets.length }, ip });
  return new Response(envContent, { headers: { "Content-Type": "text/plain", "Content-Disposition": 'attachment; filename=".env"' } });
}
