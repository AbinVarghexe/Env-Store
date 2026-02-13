const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/statsController");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

router.get("/", getDashboardStats);

module.exports = router;
