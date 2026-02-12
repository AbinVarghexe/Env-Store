const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  listEnvironments,
  createEnvironment,
  deleteEnvironment,
} = require('../controllers/environmentController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { validate, schemas } = require('../middleware/validate');

router.use(authenticate);

router.get('/', requireRole('owner', 'admin', 'developer', 'viewer'), listEnvironments);
router.post('/', requireRole('owner', 'admin'), validate(schemas.createEnvironment), createEnvironment);
router.delete('/:id', requireRole('owner', 'admin'), deleteEnvironment);

module.exports = router;
