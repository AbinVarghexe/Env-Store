import ApiToken from "../../models/ApiToken";
import { generateApiToken } from "../../services/tokenService";
import { createAuditLog } from "../../middleware/auditLogger";

export async function listTokens(userId) {
  const tokens = await ApiToken.find({ userId }).select("-tokenHash").sort({ createdAt: -1 });
  return Response.json({ tokens });
}

export async function createToken(userId, body, ip) {
  const { name, projectId, expiresInDays } = body;
  const { rawToken, tokenHash } = generateApiToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (expiresInDays || 30));

  const apiToken = await ApiToken.create({ userId, projectId, name, tokenHash, expiresAt });

  await createAuditLog({ userId, action: "token.create", resourceType: "token", resourceId: apiToken._id, metadata: { name }, ip });
  return Response.json({ token: rawToken, id: apiToken._id, name: apiToken.name, expiresAt: apiToken.expiresAt, message: "Save this token \u2014 it will not be shown again." }, { status: 201 });
}

export async function revokeToken(userId, tokenId, ip) {
  const token = await ApiToken.findOneAndDelete({ _id: tokenId, userId });
  if (!token) return Response.json({ error: "Token not found" }, { status: 404 });

  await createAuditLog({ userId, action: "token.revoke", resourceType: "token", resourceId: tokenId, metadata: { name: token.name }, ip });
  return Response.json({ message: "Token revoked successfully" });
}
