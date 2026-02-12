const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  listSecrets,
  createSecret,
  updateSecret,
  deleteSecret,
  revealSecret,
} = require('../controllers/secretController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { validate, schemas } = require('../middleware/validate');

router.use(authenticate);

router.get('/', requireRole('owner', 'admin', 'developer', 'viewer'), listSecrets);
router.post('/', requireRole('owner', 'admin', 'developer'), validate(schemas.createSecret), createSecret);
router.put('/:id', requireRole('owner', 'admin', 'developer'), validate(schemas.updateSecret), updateSecret);
router.delete('/:id', requireRole('owner', 'admin'), deleteSecret);
router.get('/:id/reveal', requireRole('owner', 'admin', 'developer'), revealSecret);

module.exports = router;
