const AuditLog = require('../models/AuditLog');

/**
 * Create an audit log entry.
 * @param {Object} data
 * @param {string} data.userId - User performing the action.
 * @param {string} data.action - Action name.
 * @param {string} [data.resourceType] - Type of resource.
 * @param {string} [data.resourceId] - ID of resource.
 * @param {Object} [data.metadata] - Additional metadata.
 * @param {string} [data.ip] - IP address.
 */
async function createAuditLog({ userId, action, resourceType, resourceId, metadata, ip }) {
  try {
    await AuditLog.create({
      userId,
      action,
      resourceType: resourceType || null,
      resourceId: resourceId || null,
      metadata: metadata || {},
      ip: ip || null,
    });
  } catch (error) {
    console.error('Audit log creation failed:', error.message);
  }
}

/**
 * Express middleware that auto-logs after response.
 * Usage: auditMiddleware('secret.create', 'secret')
 */
const auditMiddleware = (action, resourceType) => {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        createAuditLog({
          userId: req.user._id,
          action,
          resourceType,
          resourceId: body?._id || body?.data?._id || req.params.id,
          metadata: { method: req.method, path: req.originalUrl },
          ip: req.ip,
        });
      }
      return originalJson(body);
    };

    next();
  };
};

module.exports = { createAuditLog, auditMiddleware };
