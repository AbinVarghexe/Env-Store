const express = require("express");
const router = express.Router();
const {
  register,
  login,
  loginTwoFactor,
  refreshAccessToken,
  setupTwoFactor,
  verifyAndEnableTwoFactor,
  disableTwoFactor,
  getMe,
  searchUsers,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validate");
const { loginLimiter } = require("../middleware/rateLimiter");

router.post("/register", validate(schemas.register), register);
router.post("/login", loginLimiter, validate(schemas.login), login);
router.post(
  "/login/2fa",
  authenticate,
  validate(schemas.twoFactorVerify),
  loginTwoFactor,
);
router.post("/refresh", refreshAccessToken);

router.get("/me", authenticate, getMe);
router.post("/2fa/setup", authenticate, setupTwoFactor);
router.post(
  "/2fa/verify",
  authenticate,
  validate(schemas.twoFactorVerify),
  verifyAndEnableTwoFactor,
);
router.post(
  "/2fa/disable",
  authenticate,
  validate(schemas.twoFactorVerify),
  disableTwoFactor,
);

module.exports = router;
