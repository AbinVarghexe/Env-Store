const express = require('express');
const router = express.Router();
const { listAuditLogs } = require('../controllers/auditController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', listAuditLogs);

module.exports = router;
