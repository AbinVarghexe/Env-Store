const GlobalSecret = require("../models/GlobalSecret");
const { encrypt, decrypt } = require("../services/encryption");
const { createAuditLog } = require("../middleware/auditLogger");

const listGlobalSecrets = async (req, res, next) => {
  try {
    const secrets = await GlobalSecret.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json({ secrets });
  } catch (error) {
    return next(error);
  }
};

const createGlobalSecret = async (req, res, next) => {
  try {
    const { key, value, service } = req.body;

    const { encryptedValue, iv, authTag } = encrypt(value);

    const secret = await GlobalSecret.findOneAndUpdate(
      { userId: req.user._id, key },
      {
        encryptedValue,
        iv,
        authTag,
        service: service || null,
      },
      { upsert: true, new: true },
    );

    await createAuditLog({
      userId: req.user._id,
      action: "global_secret.create",
      resourceType: "global_secret",
      resourceId: secret._id,
      metadata: { key, service },
      ip: req.ip,
    });

    return res.status(201).json({ secret });
  } catch (error) {
    return next(error);
  }
};

const deleteGlobalSecret = async (req, res, next) => {
  try {
    const secret = await GlobalSecret.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!secret) {
      return res.status(404).json({ error: "Global secret not found" });
    }

    await createAuditLog({
      userId: req.user._id,
      action: "global_secret.delete",
      resourceType: "global_secret",
      resourceId: secret._id,
      metadata: { key: secret.key },
      ip: req.ip,
    });

    return res.json({ message: "Global secret deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

const revealGlobalSecret = async (req, res, next) => {
  try {
    const secret = await GlobalSecret.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!secret) {
      return res.status(404).json({ error: "Global secret not found" });
    }

    const decryptedValue = decrypt({
      encryptedValue: secret.encryptedValue,
      iv: secret.iv,
      authTag: secret.authTag,
    });

    await createAuditLog({
      userId: req.user._id,
      action: "global_secret.reveal",
      resourceType: "global_secret",
      resourceId: secret._id,
      metadata: { key: secret.key },
      ip: req.ip,
    });

    return res.json({
      key: secret.key,
      value: decryptedValue,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listGlobalSecrets,
  createGlobalSecret,
  deleteGlobalSecret,
  revealGlobalSecret,
};
