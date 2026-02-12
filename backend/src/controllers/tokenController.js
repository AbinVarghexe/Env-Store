const ApiToken = require('../models/ApiToken');
const { generateApiToken } = require('../services/tokenService');
const { createAuditLog } = require('../middleware/auditLogger');

const listTokens = async (req, res, next) => {
  try {
    const tokens = await ApiToken.find({ userId: req.user._id })
      .select('-tokenHash')
      .sort({ createdAt: -1 });

    return res.json({ tokens });
  } catch (error) {
    return next(error);
  }
};

const createToken = async (req, res, next) => {
  try {
    const { name, projectId, expiresInDays } = req.body;

    const { rawToken, tokenHash } = generateApiToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (expiresInDays || 30));

    const apiToken = await ApiToken.create({
      userId: req.user._id,
      projectId,
      name,
      tokenHash,
      expiresAt,
    });

    await createAuditLog({
      userId: req.user._id,
      action: 'token.create',
      resourceType: 'token',
      resourceId: apiToken._id,
      metadata: { name },
      ip: req.ip,
    });

    return res.status(201).json({
      token: rawToken,
      id: apiToken._id,
      name: apiToken.name,
      expiresAt: apiToken.expiresAt,
      message: 'Save this token — it will not be shown again.',
    });
  } catch (error) {
    return next(error);
  }
};

const revokeToken = async (req, res, next) => {
  try {
    const token = await ApiToken.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }

    await createAuditLog({
      userId: req.user._id,
      action: 'token.revoke',
      resourceType: 'token',
      resourceId: token._id,
      metadata: { name: token.name },
      ip: req.ip,
    });

    return res.json({ message: 'Token revoked successfully' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listTokens, createToken, revokeToken };
