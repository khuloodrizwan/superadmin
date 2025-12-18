const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { requireSuperAdmin } = require('../middleware/roleCheck');
const {
  getAuditLogs,
  getAuditLogById
} = require('../controllers/auditLogController');

router.use(authenticate);
router.use(requireSuperAdmin);

router.get('/', getAuditLogs);
router.get('/:id', getAuditLogById);

module.exports = router;