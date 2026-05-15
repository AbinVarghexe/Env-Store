import Project from "../../models/Project";
import Secret from "../../models/Secret";
import ApiToken from "../../models/ApiToken";
import AuditLog from "../../models/AuditLog";

export async function getDashboardStats(userId) {
  const projects = await Project.find({ $or: [{ ownerId: userId }, { "members.userId": userId }] }).select("_id members");
  const projectIds = projects.map((p) => p._id);

  const totalSecrets = await Secret.countDocuments({ projectId: { $in: projectIds } });
  const activeApiKeys = await ApiToken.countDocuments({ projectId: { $in: projectIds }, expiresAt: { $gt: new Date() } });

  const allMembers = projects.flatMap((p) => p.members.map((m) => m.userId.toString()));
  const teamMembers = new Set(allMembers).size;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const usageData = await AuditLog.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo }, action: { $in: ["secret.read", "secret.reveal", "secret.create", "secret.update", "token.create"] }, userId } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, requests: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const usageHistory = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const found = usageData.find((u) => u._id === dayStr);
    usageHistory.push({ name: dayName, date: dayStr, requests: found ? found.requests : 0 });
  }

  return Response.json({ totalSecrets, activeApiKeys, teamMembers, usageHistory });
}
