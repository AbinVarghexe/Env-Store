const Joi = require('joi');

/**
 * Request validation middleware factory.
 * @param {Joi.ObjectSchema} schema - Joi schema to validate req.body against.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      return res.status(400).json({ error: 'Validation Error', details });
    }

    req.body = value;
    return next();
  };
};

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    name: Joi.string().min(2).max(100).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  twoFactorVerify: Joi.object({
    token: Joi.string().length(6).required(),
  }),
  createProject: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(500).allow('').optional(),
  }),
  createEnvironment: Joi.object({
    name: Joi.string().min(1).max(50).required(),
  }),
  createSecret: Joi.object({
    key: Joi.string().min(1).max(200).required(),
    value: Joi.string().min(1).required(),
  }),
  updateSecret: Joi.object({
    value: Joi.string().min(1).required(),
  }),
  inviteMember: Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'developer', 'viewer').required(),
  }),
  createApiToken: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    projectId: Joi.string().required(),
    expiresInDays: Joi.number().min(1).max(365).default(30),
  }),
};

module.exports = { validate, schemas };
