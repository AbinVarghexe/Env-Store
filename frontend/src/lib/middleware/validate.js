import Joi from "joi";

export const schemas = {
  register: Joi.object({ email: Joi.string().email().required(), password: Joi.string().min(8).max(128).required(), name: Joi.string().min(2).max(100).required() }),
  login: Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() }),
  twoFactorVerify: Joi.object({ token: Joi.string().length(6).required() }),
  createProject: Joi.object({ name: Joi.string().min(1).max(100).required(), description: Joi.string().max(500).allow("").optional() }),
  createEnvironment: Joi.object({ name: Joi.string().min(1).max(50).required() }),
  createSecret: Joi.object({ key: Joi.string().min(1).max(200).required(), value: Joi.string().min(1).required() }),
  updateSecret: Joi.object({ value: Joi.string().min(1).required() }),
  inviteMember: Joi.object({ email: Joi.string().email().required(), role: Joi.string().valid("admin", "developer", "viewer").required() }),
  createApiToken: Joi.object({ name: Joi.string().min(1).max(100).required(), projectId: Joi.string().required(), expiresInDays: Joi.number().min(1).max(365).default(30) }),
};

export function validateBody(schema, body) {
  const { error, value } = schema.validate(body, { abortEarly: false, stripUnknown: true });
  if (error) return { error: "Validation Error", details: error.details.map((d) => d.message), status: 400 };
  return { value };
}
