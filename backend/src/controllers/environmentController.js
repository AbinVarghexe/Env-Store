const Environment = require('../models/Environment');
const Secret = require('../models/Secret');
const { createAuditLog } = require('../middleware/auditLogger');

const listEnvironments = async (req, res, next) => {
  try {
    const environments = await Environment.find({
      projectId: req.params.projectId,
    }).sort({ name: 1 });

    return res.json({ environments });
  } catch (error) {
    return next(error);
  }
};

const createEnvironment = async (req, res, next) => {
  try {
    const { name } = req.body;

    const existing = await Environment.findOne({
      projectId: req.params.projectId,
      name,
    });

    if (existing) {
      return res.status(409).json({ error: 'Environment already exists' });
    }

    const environment = await Environment.create({
      projectId: req.params.projectId,
      name,
    });

    await createAuditLog({
      userId: req.user._id,
      action: 'environment.create',
      resourceType: 'environment',
      resourceId: environment._id,
      metadata: { projectId: req.params.projectId, name },
      ip: req.ip,
    });

    return res.status(201).json({ environment });
  } catch (error) {
    return next(error);
  }
};

const deleteEnvironment = async (req, res, next) => {
  try {
    const environment = await Environment.findOne({
      _id: req.params.id,
      projectId: req.params.projectId,
    });

    if (!environment) {
      return res.status(404).json({ error: 'Environment not found' });
    }

    await Secret.deleteMany({ environmentId: environment._id });
    await Environment.findByIdAndDelete(environment._id);

    await createAuditLog({
      userId: req.user._id,
      action: 'environment.delete',
      resourceType: 'environment',
      resourceId: environment._id,
      metadata: { name: environment.name },
      ip: req.ip,
    });

    return res.json({ message: 'Environment deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listEnvironments,
  createEnvironment,
  deleteEnvironment,
};
