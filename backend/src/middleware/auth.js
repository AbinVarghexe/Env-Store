const { verifyAccessToken, hashApiToken } = require('../services/tokenService');
const User = require('../models/User');
const ApiToken = require('../models/ApiToken');

/**
 * Authentication middleware.
 * Supports JWT (Authorization: Bearer <token>) and API Key (X-API-Key: <token>).
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const apiKey = req.headers['x-api-key'];

    if (apiKey) {
      const tokenHash = hashApiToken(apiKey);
      const apiToken = await ApiToken.findOne({
        tokenHash,
        expiresAt: { $gt: new Date() },
      });

      if (!apiToken) {
        return res.status(401).json({ error: 'Invalid or expired API key' });
      }

      const user = await User.findById(apiToken.userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      apiToken.lastUsed = new Date();
      await apiToken.save();

      req.user = user;
      req.authMethod = 'apikey';
      req.apiToken = apiToken;
      return next();
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.authMethod = 'jwt';
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

module.exports = { authenticate };
