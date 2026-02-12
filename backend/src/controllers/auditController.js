const AuditLog = require('../models/AuditLog');

const listAuditLogs = async (req, res, next) => {
  try {
    const { projectId, action, page = 1, limit = 50 } = req.query;

    const filter = {};

    if (projectId) {
      filter['metadata.projectId'] = projectId;
    }

    if (action) {
      filter.action = action;
    }

    filter.userId = req.user._id;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'name email'),
      AuditLog.countDocuments(filter),
    ]);

    return res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listAuditLogs };
