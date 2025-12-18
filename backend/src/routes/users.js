const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { requireSuperAdmin } = require('../middleware/roleCheck');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

router.use(authenticate);
router.use(requireSuperAdmin);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;