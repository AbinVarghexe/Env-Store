import Project from "../../models/Project";
import Environment from "../../models/Environment";
import Secret from "../../models/Secret";
import User from "../../models/User";
import { createAuditLog } from "../../middleware/auditLogger";

const PLAN_LIMITS = { free: 3, pro: 20, team: Infinity };

export async function listProjects(userId) {
  const projects = await Project.find({
    $or: [{ ownerId: userId }, { "members.userId": userId }],
  }).sort({ createdAt: -1 });
  return Response.json({ projects });
}

export async function createProject(userId, userPlan, body, ip) {
  const { name, description } = body;
  const userProjects = await Project.countDocuments({ ownerId: userId });
  const limit = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;
  if (userProjects >= limit) return Response.json({ error: `Project limit reached (${limit}). Upgrade your plan.` }, { status: 403 });

  const project = await Project.create({ name, description: description || "", ownerId: userId, members: [{ userId, role: "owner" }] });
  await Environment.insertMany(["development", "staging", "production"].map((envName) => ({ projectId: project._id, name: envName })));
  await createAuditLog({ userId, action: "project.create", resourceType: "project", resourceId: project._id, ip });
  return Response.json({ project }, { status: 201 });
}

export async function getProject(projectId, userId) {
  const project = await Project.findById(projectId).populate("members.userId", "name email");
  if (!project) return Response.json({ error: "Project not found" }, { status: 404 });

  const isMember = project.ownerId.toString() === userId.toString() || project.members.some((m) => m.userId._id.toString() === userId.toString());
  if (!isMember) return Response.json({ error: "Access denied" }, { status: 403 });

  const environments = await Environment.find({ projectId: project._id });
  const secretCount = await Secret.countDocuments({ projectId: project._id });
  return Response.json({ project, environments, secretCount });
}

export async function deleteProject(projectId, userId, ip) {
  const project = await Project.findById(projectId);
  if (!project) return Response.json({ error: "Project not found" }, { status: 404 });
  if (project.ownerId.toString() !== userId.toString()) return Response.json({ error: "Only the owner can delete this project" }, { status: 403 });

  await Secret.deleteMany({ projectId: project._id });
  await Environment.deleteMany({ projectId: project._id });
  await Project.findByIdAndDelete(project._id);
  await createAuditLog({ userId, action: "project.delete", resourceType: "project", resourceId: project._id, metadata: { projectName: project.name }, ip });
  return Response.json({ message: "Project deleted successfully" });
}

export async function inviteMember(projectId, currentUserId, body, ip) {
  const { email, role } = body;
  const project = await Project.findById(projectId);
  if (!project) return Response.json({ error: "Project not found" }, { status: 404 });

  const user = await User.findOne({ email });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const isAlreadyMember = project.members.some((m) => m.userId.toString() === user._id.toString());
  if (isAlreadyMember) return Response.json({ error: "User is already a member" }, { status: 409 });

  project.members.push({ userId: user._id, role });
  await project.save();

  await createAuditLog({ userId: currentUserId, action: "project.member.add", resourceType: "project", resourceId: project._id, metadata: { addedUserId: user._id, email, role }, ip });
  return Response.json({ message: "Member invited successfully", project });
}

export async function removeMember(projectId, targetUserId, currentUserId, ip) {
  const project = await Project.findById(projectId);
  if (!project) return Response.json({ error: "Project not found" }, { status: 404 });

  const memberIndex = project.members.findIndex((m) => m.userId.toString() === targetUserId);
  if (memberIndex === -1) return Response.json({ error: "Member not found" }, { status: 404 });
  if (project.members[memberIndex].role === "owner") return Response.json({ error: "Cannot remove the owner" }, { status: 400 });

  project.members.splice(memberIndex, 1);
  await project.save();

  await createAuditLog({ userId: currentUserId, action: "project.member.remove", resourceType: "project", resourceId: project._id, metadata: { removedUserId: targetUserId }, ip });
  return Response.json({ message: "Member removed successfully" });
}
