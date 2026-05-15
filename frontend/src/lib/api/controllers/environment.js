import Environment from "../../models/Environment";
import Secret from "../../models/Secret";
import { createAuditLog } from "../../middleware/auditLogger";

export async function listEnvironments(projectId) {
  const environments = await Environment.find({ projectId }).sort({ name: 1 });
  return Response.json({ environments });
}

export async function createEnvironment(projectId, userId, body, ip) {
  const { name } = body;
  const existing = await Environment.findOne({ projectId, name });
  if (existing) return Response.json({ error: "Environment already exists" }, { status: 409 });

  const environment = await Environment.create({ projectId, name });
  await createAuditLog({ userId, action: "environment.create", resourceType: "environment", resourceId: environment._id, metadata: { projectId, name }, ip });
  return Response.json({ environment }, { status: 201 });
}

export async function deleteEnvironment(projectId, envId, userId, ip) {
  const environment = await Environment.findOne({ _id: envId, projectId });
  if (!environment) return Response.json({ error: "Environment not found" }, { status: 404 });

  await Secret.deleteMany({ environmentId: environment._id });
  await Environment.findByIdAndDelete(environment._id);
  await createAuditLog({ userId, action: "environment.delete", resourceType: "environment", resourceId: envId, metadata: { name: environment.name }, ip });
  return Response.json({ message: "Environment deleted successfully" });
}
