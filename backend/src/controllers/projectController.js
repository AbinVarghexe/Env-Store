const Project = require('../models/Project');
const Environment = require('../models/Environment');
const Secret = require('../models/Secret');
const User = require('../models/User');
const { createAuditLog } = require('../middleware/auditLogger');

const PLAN_LIMITS = {
  free: 3,
  pro: 20,
  team: Infinity,
};

const listProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [
        { ownerId: req.user._id },
        { 'members.userId': req.user._id },
      ],
    }).sort({ createdAt: -1 });

    return res.json({ projects });
  } catch (error) {
    return next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const userProjects = await Project.countDocuments({ ownerId: req.user._id });
    const limit = PLAN_LIMITS[req.user.plan] || PLAN_LIMITS.free;

    if (userProjects >= limit) {
      return res.status(403).json({
        error: `Project limit reached (${limit}). Upgrade your plan.`,
      });
    }

    const project = await Project.create({
      name,
      description: description || '',
      ownerId: req.user._id,
      members: [{ userId: req.user._id, role: 'owner' }],
    });

    const defaultEnvs = ['development', 'staging', 'production'];
    await Environment.insertMany(
      defaultEnvs.map((envName) => ({
        projectId: project._id,
        name: envName,
      }))
    );

    await createAuditLog({
      userId: req.user._id,
      action: 'project.create',
      resourceType: 'project',
      resourceId: project._id,
      ip: req.ip,
    });

    return res.status(201).json({ project });
  } catch (error) {
    return next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'members.userId',
      'name email'
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isMember =
      project.ownerId.toString() === req.user._id.toString() ||
      project.members.some(
        (m) => m.userId._id.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const environments = await Environment.find({ projectId: project._id });
    const secretCount = await Secret.countDocuments({ projectId: project._id });

    return res.json({
      project,
      environments,
      secretCount,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the owner can delete this project' });
    }

    await Secret.deleteMany({ projectId: project._id });
    await Environment.deleteMany({ projectId: project._id });
    await Project.findByIdAndDelete(project._id);

    await createAuditLog({
      userId: req.user._id,
      action: 'project.delete',
      resourceType: 'project',
      resourceId: project._id,
      metadata: { projectName: project.name },
      ip: req.ip,
    });

    return res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

const inviteMember = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isAlreadyMember = project.members.some(
      (m) => m.userId.toString() === user._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(409).json({ error: 'User is already a member' });
    }

    project.members.push({ userId: user._id, role });
    await project.save();

    await createAuditLog({
      userId: req.user._id,
      action: 'project.member.add',
      resourceType: 'project',
      resourceId: project._id,
      metadata: { addedUserId: user._id, email, role },
      ip: req.ip,
    });

    return res.json({ message: 'Member invited successfully', project });
  } catch (error) {
    return next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const memberIndex = project.members.findIndex(
      (m) => m.userId.toString() === req.params.userId
    );

    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (project.members[memberIndex].role === 'owner') {
      return res.status(400).json({ error: 'Cannot remove the owner' });
    }

    project.members.splice(memberIndex, 1);
    await project.save();

    await createAuditLog({
      userId: req.user._id,
      action: 'project.member.remove',
      resourceType: 'project',
      resourceId: project._id,
      metadata: { removedUserId: req.params.userId },
      ip: req.ip,
    });

    return res.json({ message: 'Member removed successfully' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listProjects,
  createProject,
  getProject,
  deleteProject,
  inviteMember,
  removeMember,
};
