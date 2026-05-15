import Project from "../models/Project";

export async function checkProjectAccess(user, projectId, allowedRoles) {
  if (!projectId) return { error: "Project ID is required", status: 400 };

  const project = await Project.findById(projectId);
  if (!project) return { error: "Project not found", status: 404 };

  const isOwner = project.ownerId.toString() === user._id.toString();

  if (isOwner && allowedRoles.includes("owner")) {
    return { project, userRole: "owner" };
  }

  const member = project.members.find((m) => m.userId.toString() === user._id.toString());
  if (!member && !isOwner) return { error: "Not a member of this project", status: 403 };

  const userRole = isOwner ? "owner" : member.role;
  if (!allowedRoles.includes(userRole)) return { error: "Insufficient permissions", status: 403 };

  return { project, userRole };
}
