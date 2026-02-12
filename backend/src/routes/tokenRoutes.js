const express = require('express');
const router = express.Router();
const { listTokens, createToken, revokeToken } = require('../controllers/tokenController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.use(authenticate);

router.get('/', listTokens);
router.post('/', validate(schemas.createApiToken), createToken);
router.delete('/:id', revokeToken);

module.exports = router;
