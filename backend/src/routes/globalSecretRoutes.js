const express = require("express");
const router = express.Router();
const {
  listGlobalSecrets,
  createGlobalSecret,
  deleteGlobalSecret,
  revealGlobalSecret,
} = require("../controllers/globalSecretController");
const { authenticate } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validate");

router.use(authenticate);

router.get("/", listGlobalSecrets);
router.post("/", validate(schemas.createSecret), createGlobalSecret);
router.delete("/:id", deleteGlobalSecret);
router.get("/:id/reveal", revealGlobalSecret);

module.exports = router;
