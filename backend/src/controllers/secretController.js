const Secret = require("../models/Secret");
const { encrypt, decrypt } = require("../services/encryption");
const { createAuditLog } = require("../middleware/auditLogger");

const listSecrets = async (req, res, next) => {
  try {
    const secrets = await Secret.find({
      projectId: req.params.projectId,
      environmentId: req.params.envId,
    })
      .select("-encryptedValue -iv -authTag")
      .sort({ key: 1 });

    return res.json({ secrets });
  } catch (error) {
    return next(error);
  }
};

const createSecret = async (req, res, next) => {
  try {
    const { key, value } = req.body;

    const existing = await Secret.findOne({
      projectId: req.params.projectId,
      environmentId: req.params.envId,
      key,
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: `Secret with key "${key}" already exists` });
    }

    const { encryptedValue, iv, authTag } = encrypt(value);

    const secret = await Secret.create({
      projectId: req.params.projectId,
      environmentId: req.params.envId,
      key,
      encryptedValue,
      iv,
      authTag,
      version: 1,
      createdBy: req.user._id,
    });

    await createAuditLog({
      userId: req.user._id,
      action: "secret.create",
      resourceType: "secret",
      resourceId: secret._id,
      metadata: {
        key,
        projectId: req.params.projectId,
        environmentId: req.params.envId,
      },
      ip: req.ip,
    });

    return res.status(201).json({
      secret: {
        _id: secret._id,
        key: secret.key,
        version: secret.version,
        createdBy: secret.createdBy,
        createdAt: secret.createdAt,
        updatedAt: secret.updatedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const updateSecret = async (req, res, next) => {
  try {
    const { value } = req.body;

    const secret = await Secret.findOne({
      _id: req.params.id,
      projectId: req.params.projectId,
      environmentId: req.params.envId,
    });

    if (!secret) {
      return res.status(404).json({ error: "Secret not found" });
    }

    const { encryptedValue, iv, authTag } = encrypt(value);

    secret.encryptedValue = encryptedValue;
    secret.iv = iv;
    secret.authTag = authTag;
    secret.version += 1;
    await secret.save();

    await createAuditLog({
      userId: req.user._id,
      action: "secret.update",
      resourceType: "secret",
      resourceId: secret._id,
      metadata: { key: secret.key, newVersion: secret.version },
      ip: req.ip,
    });

    return res.json({
      secret: {
        _id: secret._id,
        key: secret.key,
        version: secret.version,
        updatedAt: secret.updatedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const deleteSecret = async (req, res, next) => {
  try {
    const secret = await Secret.findOneAndDelete({
      _id: req.params.id,
      projectId: req.params.projectId,
      environmentId: req.params.envId,
    });

    if (!secret) {
      return res.status(404).json({ error: "Secret not found" });
    }

    await createAuditLog({
      userId: req.user._id,
      action: "secret.delete",
      resourceType: "secret",
      resourceId: secret._id,
      metadata: { key: secret.key },
      ip: req.ip,
    });

    return res.json({ message: "Secret deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

const revealSecret = async (req, res, next) => {
  try {
    const secret = await Secret.findOne({
      _id: req.params.id,
      projectId: req.params.projectId,
      environmentId: req.params.envId,
    });

    if (!secret) {
      return res.status(404).json({ error: "Secret not found" });
    }

    const decryptedValue = decrypt({
      encryptedValue: secret.encryptedValue,
      iv: secret.iv,
      authTag: secret.authTag,
    });

    await createAuditLog({
      userId: req.user._id,
      action: "secret.reveal",
      resourceType: "secret",
      resourceId: secret._id,
      metadata: { key: secret.key },
      ip: req.ip,
    });

    return res.json({
      key: secret.key,
      value: decryptedValue,
      version: secret.version,
    });
  } catch (error) {
    return next(error);
  }
};

const downloadSecrets = async (req, res, next) => {
  try {
    const secrets = await Secret.find({
      projectId: req.params.projectId,
      environmentId: req.params.envId,
    }).sort({ key: 1 });

    if (secrets.length === 0) {
      return res
        .status(404)
        .json({ error: "No secrets found for this environment" });
    }

    const envContent = secrets
      .map((secret) => {
        const decryptedValue = decrypt({
          encryptedValue: secret.encryptedValue,
          iv: secret.iv,
          authTag: secret.authTag,
        });
        return `${secret.key}=${decryptedValue}`;
      })
      .join("\n");

    await createAuditLog({
      userId: req.user._id,
      action: "secret.download_env",
      resourceType: "environment",
      resourceId: req.params.envId,
      metadata: { projectId: req.params.projectId, count: secrets.length },
      ip: req.ip,
    });

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename=.env`);
    return res.send(envContent);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listSecrets,
  createSecret,
  updateSecret,
  deleteSecret,
  revealSecret,
  downloadSecrets,
};
