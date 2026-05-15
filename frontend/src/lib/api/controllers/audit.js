import AuditLog from "../../models/AuditLog";

export async function listAuditLogs(userId, query) {
  const { projectId, action, page = "1", limit = "50" } = query;
  const filter = { userId };
  if (projectId) filter["metadata.projectId"] = projectId;
  if (action) filter.action = action;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [logs, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).populate("userId", "name email"),
    AuditLog.countDocuments(filter),
  ]);

  return Response.json({ logs, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
}
