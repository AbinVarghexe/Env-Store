const Project = require("../models/Project");

/**
 * Role-Based Access Control middleware.
 * Checks user's role in the project context.
 * Must be used after authenticate middleware.
 *
 * @param  {...string} allowedRoles - Roles that are allowed to access the route.
 */
const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const projectId = req.params.projectId || req.params.id;

      if (!projectId) {
        return res.status(400).json({ error: "Project ID is required" });
      }

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const isOwner = project.ownerId.toString() === req.user._id.toString();

      if (isOwner && allowedRoles.includes("owner")) {
        req.project = project;
        req.userRole = "owner";
        return next();
      }

      const member = project.members.find(
        (m) => m.userId.toString() === req.user._id.toString(),
      );

      if (!member && !isOwner) {
        return res.status(403).json({ error: "Not a member of this project" });
      }

      const userRole = isOwner ? "owner" : member.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      req.project = project;
      req.userRole = userRole;
      return next();
    } catch (_error) {
      return res.status(500).json({ error: "Authorization check failed" });
    }
  };
};

module.exports = { requireRole };
