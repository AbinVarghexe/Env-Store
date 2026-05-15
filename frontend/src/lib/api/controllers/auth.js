import bcrypt from "bcryptjs";
import User from "../../models/User";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../services/tokenService";
import { generateSecret, verifyToken } from "../../services/twoFactor";
import { createAuditLog } from "../../middleware/auditLogger";

export async function register(body, ip) {
  const { email, password, name } = body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return Response.json({ error: "Email already registered" }, { status: 409 });

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = await User.create({ email, passwordHash, name });

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });
  user.refreshToken = refreshToken;
  await user.save();

  await createAuditLog({ userId: user._id, action: "auth.register", resourceType: "user", resourceId: user._id, ip });
  return Response.json({ user, accessToken, refreshToken }, { status: 201 });
}

export async function login(body, ip) {
  const { email, password } = body;

  const user = await User.findOne({ email }).select("+passwordHash +twoFactorSecret +twoFactorEnabled");
  if (!user) {
    await createAuditLog({ userId: null, action: "auth.login.failed", metadata: { email, reason: "user_not_found" }, ip });
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    await createAuditLog({ userId: user._id, action: "auth.login.failed", resourceType: "user", resourceId: user._id, metadata: { reason: "invalid_password" }, ip });
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (user.twoFactorEnabled) {
    const tempToken = generateAccessToken({ userId: user._id, twoFactorPending: true });
    return Response.json({ requiresTwoFactor: true, tempToken });
  }

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });
  user.refreshToken = refreshToken;
  await user.save();

  await createAuditLog({ userId: user._id, action: "auth.login", resourceType: "user", resourceId: user._id, ip });
  return Response.json({ user, accessToken, refreshToken });
}

export async function loginTwoFactor(userId, body, ip) {
  const { token: totpCode } = body;
  const user = await User.findById(userId).select("+twoFactorSecret");
  if (!user || !user.twoFactorEnabled) return Response.json({ error: "2FA is not enabled" }, { status: 400 });

  const isValid = verifyToken(user.twoFactorSecret, totpCode);
  if (!isValid) return Response.json({ error: "Invalid 2FA code" }, { status: 401 });

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });
  user.refreshToken = refreshToken;
  await user.save();

  return Response.json({ user, accessToken, refreshToken });
}

export async function refreshAccessToken(body) {
  const { refreshToken } = body;
  if (!refreshToken) return Response.json({ error: "Refresh token required" }, { status: 400 });

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) return Response.json({ error: "Invalid refresh token" }, { status: 401 });

    const newAccessToken = generateAccessToken({ userId: user._id });
    const newRefreshToken = generateRefreshToken({ userId: user._id });
    user.refreshToken = newRefreshToken;
    await user.save();

    return Response.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch {
    return Response.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}

export async function getMe(userId) {
  const user = await User.findById(userId);
  return Response.json({ user });
}

export async function setupTwoFactor(userId) {
  const user = await User.findById(userId);
  if (user.twoFactorEnabled) return Response.json({ error: "2FA is already enabled" }, { status: 400 });

  const { secret, qrCodeDataUrl } = await generateSecret(user.email);
  user.twoFactorSecret = secret;
  await user.save();

  return Response.json({ secret, qrCodeDataUrl });
}

export async function verifyAndEnableTwoFactor(userId, body, ip) {
  const { token: totpCode } = body;
  const user = await User.findById(userId).select("+twoFactorSecret");
  if (!user.twoFactorSecret) return Response.json({ error: "Set up 2FA first" }, { status: 400 });

  const isValid = verifyToken(user.twoFactorSecret, totpCode);
  if (!isValid) return Response.json({ error: "Invalid verification code" }, { status: 400 });

  user.twoFactorEnabled = true;
  await user.save();

  await createAuditLog({ userId, action: "auth.2fa.enable", resourceType: "user", resourceId: userId, ip });
  return Response.json({ message: "2FA enabled successfully" });
}

export async function disableTwoFactor(userId, body, ip) {
  const { token: totpCode } = body;
  const user = await User.findById(userId).select("+twoFactorSecret");
  if (!user.twoFactorEnabled) return Response.json({ error: "2FA is not enabled" }, { status: 400 });

  const isValid = verifyToken(user.twoFactorSecret, totpCode);
  if (!isValid) return Response.json({ error: "Invalid verification code" }, { status: 400 });

  user.twoFactorEnabled = false;
  user.twoFactorSecret = null;
  await user.save();

  await createAuditLog({ userId, action: "auth.2fa.disable", resourceType: "user", resourceId: userId, ip });
  return Response.json({ message: "2FA disabled successfully" });
}

export async function searchUsers(query, userId) {
  if (!query || query.length < 2) return Response.json({ users: [] });
  const users = await User.find({
    $or: [{ email: { $regex: query, $options: "i" } }, { name: { $regex: query, $options: "i" } }],
    _id: { $ne: userId },
  }).select("name email").limit(5);
  return Response.json({ users });
}
