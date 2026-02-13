const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../services/tokenService");
const { generateSecret, verifyToken } = require("../services/twoFactor");
const { createAuditLog } = require("../middleware/auditLogger");

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ email, passwordHash, name });

    const accessToken = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    await createAuditLog({
      userId: user._id,
      action: "auth.register",
      resourceType: "user",
      resourceId: user._id,
      ip: req.ip,
    });

    return res.status(201).json({
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select(
      "+passwordHash +twoFactorSecret +twoFactorEnabled",
    );
    if (!user) {
      await createAuditLog({
        userId: null,
        action: "auth.login.failed",
        metadata: { email, reason: "user_not_found" },
        ip: req.ip,
      });
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await createAuditLog({
        userId: user._id,
        action: "auth.login.failed",
        resourceType: "user",
        resourceId: user._id,
        metadata: { reason: "invalid_password" },
        ip: req.ip,
      });
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.twoFactorEnabled) {
      const tempToken = generateAccessToken({
        userId: user._id,
        twoFactorPending: true,
      });
      return res.json({
        requiresTwoFactor: true,
        tempToken,
      });
    }

    const accessToken = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    await createAuditLog({
      userId: user._id,
      action: "auth.login",
      resourceType: "user",
      resourceId: user._id,
      ip: req.ip,
    });

    return res.json({
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return next(error);
  }
};

const loginTwoFactor = async (req, res, next) => {
  try {
    const { token: totpCode } = req.body;
    const user = await User.findById(req.user._id).select("+twoFactorSecret");

    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ error: "2FA is not enabled" });
    }

    const isValid = verifyToken(user.twoFactorSecret, totpCode);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid 2FA code" });
    }

    const accessToken = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    return res.json({
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return next(error);
  }
};

const refreshAccessToken = async (req, res, _next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken({ userId: user._id });
    const newRefreshToken = generateRefreshToken({ userId: user._id });

    user.refreshToken = newRefreshToken;
    await user.save();

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (_error) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
};

const setupTwoFactor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.twoFactorEnabled) {
      return res.status(400).json({ error: "2FA is already enabled" });
    }

    const { secret, qrCodeDataUrl } = await generateSecret(user.email);

    user.twoFactorSecret = secret;
    await user.save();

    return res.json({
      secret,
      qrCodeDataUrl,
    });
  } catch (error) {
    return next(error);
  }
};

const verifyAndEnableTwoFactor = async (req, res, next) => {
  try {
    const { token: totpCode } = req.body;
    const user = await User.findById(req.user._id).select("+twoFactorSecret");

    if (!user.twoFactorSecret) {
      return res.status(400).json({ error: "Set up 2FA first" });
    }

    const isValid = verifyToken(user.twoFactorSecret, totpCode);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    user.twoFactorEnabled = true;
    await user.save();

    await createAuditLog({
      userId: user._id,
      action: "auth.2fa.enable",
      resourceType: "user",
      resourceId: user._id,
      ip: req.ip,
    });

    return res.json({ message: "2FA enabled successfully" });
  } catch (error) {
    return next(error);
  }
};

const disableTwoFactor = async (req, res, next) => {
  try {
    const { token: totpCode } = req.body;
    const user = await User.findById(req.user._id).select("+twoFactorSecret");

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ error: "2FA is not enabled" });
    }

    const isValid = verifyToken(user.twoFactorSecret, totpCode);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    await user.save();

    await createAuditLog({
      userId: user._id,
      action: "auth.2fa.disable",
      resourceType: "user",
      resourceId: user._id,
      ip: req.ip,
    });

    return res.json({ message: "2FA disabled successfully" });
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query || query.length < 2) {
      return res.json({ users: [] });
    }

    const users = await User.find({
      $or: [
        { email: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
      _id: { $ne: req.user._id }, // Exclude self
    })
      .select("name email")
      .limit(5);

    return res.json({ users });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  loginTwoFactor,
  refreshAccessToken,
  setupTwoFactor,
  verifyAndEnableTwoFactor,
  disableTwoFactor,
  getMe,
  searchUsers,
};
