const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { requireSuperAdmin } = require('../middleware/roleCheck');
const {
  getRoles,
  createRole,
  assignRole
} = require('../controllers/roleController');

router.use(authenticate);
router.use(requireSuperAdmin);

router.get('/', getRoles);
router.post('/', createRole);
router.post('/assign', assignRole);

module.exports = router;