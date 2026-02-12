const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const env = require('../config/env');

/**
 * Generate a new TOTP secret for a user.
 * Returns { secret, otpauthUrl, qrCodeDataUrl }.
 */
async function generateSecret(userEmail) {
  const secret = speakeasy.generateSecret({
    name: `${env.APP_NAME} (${userEmail})`,
    issuer: env.APP_NAME,
    length: 32,
  });

  const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url,
    qrCodeDataUrl,
  };
}

/**
 * Verify a TOTP token against a secret.
 */
function verifyToken(secret, token) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1,
  });
}

module.exports = { generateSecret, verifyToken };
