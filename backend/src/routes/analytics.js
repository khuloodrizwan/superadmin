const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { requireSuperAdmin } = require('../middleware/roleCheck');
const { getAnalytics } = require('../controllers/analyticsController');

router.use(authenticate);
router.use(requireSuperAdmin);

router.get('/', getAnalytics);

module.exports = router;