import { verifyAccessToken, hashApiToken } from "../services/tokenService";
import User from "../models/User";
import ApiToken from "../models/ApiToken";

export async function authenticate(request) {
  const authHeader = request.headers.get("authorization");
  const apiKey = request.headers.get("x-api-key");

  if (apiKey) {
    const tokenHash = hashApiToken(apiKey);
    const apiToken = await ApiToken.findOne({ tokenHash, expiresAt: { $gt: new Date() } });
    if (!apiToken) return { error: "Invalid or expired API key", status: 401 };

    const user = await User.findById(apiToken.userId);
    if (!user) return { error: "User not found", status: 401 };

    apiToken.lastUsed = new Date();
    await apiToken.save();

    return { user, authMethod: "apikey", apiToken };
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Access token required", status: 401 };
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId);
    if (!user) return { error: "User not found", status: 401 };
    return { user, authMethod: "jwt", twoFactorPending: decoded.twoFactorPending };
  } catch (error) {
    if (error.name === "TokenExpiredError") return { error: "Token expired", status: 401 };
    return { error: "Invalid token", status: 401 };
  }
}
