const express = require('express');
const router = express.Router();
const {
  listProjects,
  createProject,
  getProject,
  deleteProject,
  inviteMember,
  removeMember,
} = require('../controllers/projectController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { validate, schemas } = require('../middleware/validate');

router.use(authenticate);

router.get('/', listProjects);
router.post('/', validate(schemas.createProject), createProject);
router.get('/:id', getProject);
router.delete('/:id', requireRole('owner'), deleteProject);
router.post('/:id/members', requireRole('owner', 'admin'), validate(schemas.inviteMember), inviteMember);
router.delete('/:id/members/:userId', requireRole('owner', 'admin'), removeMember);

module.exports = router;
