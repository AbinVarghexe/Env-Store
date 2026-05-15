import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function generateSecret(userEmail) {
  const secret = speakeasy.generateSecret({
    name: `${process.env.APP_NAME || "DevVault"} (${userEmail})`,
    issuer: process.env.APP_NAME || "DevVault",
    length: 32,
  });
  const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);
  return { secret: secret.base32, otpauthUrl: secret.otpauth_url, qrCodeDataUrl };
}

export function verifyToken(secret, token) {
  return speakeasy.totp.verify({ secret, encoding: "base32", token, window: 1 });
}
