const { getRedisClient } = require('../config/redis');

/**
 * Redis-backed rate limiter middleware factory.
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds.
 * @param {number} options.maxRequests - Max requests per window.
 * @param {string} options.keyPrefix - Redis key prefix.
 * @param {string} [options.message] - Error message when rate limited.
 */
const rateLimiter = ({
  windowMs = 60000,
  maxRequests = 100,
  keyPrefix = 'rl',
  message = 'Too many requests, please try again later.',
}) => {
  return async (req, res, next) => {
    try {
      const redis = getRedisClient();
      const identifier = req.user ? req.user._id.toString() : req.ip;
      const key = `${keyPrefix}:${identifier}`;

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.pexpire(key, windowMs);
      }

      const ttl = await redis.pttl(key);

      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': Math.max(0, maxRequests - current),
        'X-RateLimit-Reset': Math.ceil((Date.now() + ttl) / 1000),
      });

      if (current > maxRequests) {
        return res.status(429).json({
          error: message,
          retryAfter: Math.ceil(ttl / 1000),
        });
      }

      return next();
    } catch (error) {
      console.error('Rate limiter error:', error.message);
      return next();
    }
  };
};

const loginLimiter = rateLimiter({
  windowMs: 60000,
  maxRequests: 5,
  keyPrefix: 'rl:login',
  message: 'Too many login attempts. Please try again in a minute.',
});

const apiLimiter = rateLimiter({
  windowMs: 60000,
  maxRequests: 100,
  keyPrefix: 'rl:api',
});

const generalLimiter = rateLimiter({
  windowMs: 60000,
  maxRequests: 200,
  keyPrefix: 'rl:general',
});

module.exports = { rateLimiter, loginLimiter, apiLimiter, generalLimiter };
